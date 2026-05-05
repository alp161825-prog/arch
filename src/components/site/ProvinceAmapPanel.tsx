import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import { MapPin } from "lucide-react";
import type { AtlasHeritagePoint } from "@/data/atlasHeritagePoints";
import type { TopicKey } from "@/data/siteContentV2";

type Props = {
  provinceCode: string;
  provinceName: string;
  provincePoints: AtlasHeritagePoint[];
  selectedPointId?: string;
  onPointSelect?: (pointId: string) => void;
};

type MapInstance = {
  destroy?: () => void;
  add?: (overlay: unknown) => void;
  addControl?: (control: unknown) => void;
  setFitView?: (overlays?: unknown[], immediately?: boolean, avoid?: number[], maxZoom?: number) => void;
  setZoomAndCenter?: (zoom: number, center: [number, number], immediately?: boolean, duration?: number) => void;
  panTo?: (position: [number, number], duration?: number) => void;
};

type TopicPalette = Record<TopicKey, { color: string; label: string }>;

type MarkerRecord = {
  pointId: string;
  marker: {
    setOptions?: (options: Record<string, unknown>) => void;
  };
  halo?: {
    setOptions?: (options: Record<string, unknown>) => void;
  };
  infoWindow?: {
    open?: (map: unknown, position: [number, number]) => void;
    close?: () => void;
  };
  position: [number, number];
};

const topicPalette: TopicPalette = {
  residential: { color: "#8f5b33", label: "民居" },
  government: { color: "#7a4b31", label: "官署" },
  palace: { color: "#aa7a1f", label: "皇宫" },
  bridge: { color: "#557a6b", label: "桥梁" },
};

declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode?: string;
    };
  }
}

const ProvinceAmapPanel = ({ provinceCode, provinceName, provincePoints, selectedPointId, onPointSelect }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapInstance | null>(null);
  const markerRecordsRef = useRef<MarkerRecord[]>([]);
  const selectionSourceRef = useRef<"map" | "list" | "external">("external");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "missing-key">("idle");
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const selectedPoint = provincePoints.find(point => point.id === selectedPointId) ?? provincePoints[0];

  useEffect(() => {
    const key = import.meta.env.VITE_AMAP_KEY;
    const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_JS_CODE;

    if (!key || !securityJsCode) {
      setStatus("missing-key");
      return;
    }

    let disposed = false;

    const init = async () => {
      setStatus("loading");
      window._AMapSecurityConfig = { securityJsCode };

      let AMap: Awaited<ReturnType<typeof AMapLoader.load>>;
      try {
        AMap = await AMapLoader.load({
          key,
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar"],
        });
      } catch {
        if (!disposed) setStatus("error");
        return;
      }

      if (disposed || !mapRef.current) return;

      const overlays: unknown[] = [];
      const records: MarkerRecord[] = [];
      let map: InstanceType<typeof AMap.Map>;

      try {
        map = new AMap.Map(mapRef.current, {
          viewMode: "2D",
          zoom: 6.2,
          mapStyle: "amap://styles/whitesmoke",
          resizeEnable: true,
          zoomEnable: true,
          dragEnable: true,
          scrollWheel: true,
          jogEnable: false,
          pitchEnable: false,
        });
      } catch {
        if (!disposed) setStatus("error");
        return;
      }

      mapInstanceRef.current = map;
      setStatus("ready");

      try {
        const provinceLayer = new AMap.DistrictLayer.Province({
          zIndex: 12,
          adcode: [provinceCode],
          depth: 2,
          styles: {
            fill: "#f6edd9",
            "province-stroke": "#8d6a3e",
            "city-stroke": "#b99a71",
            "county-stroke": "#d8c5a5",
          },
        });
        map.add?.(provinceLayer);
        overlays.push(provinceLayer);
      } catch {
        // Keep the basemap visible even if administrative overlay fails.
      }

      try {
        const scale = new AMap.Scale({ position: "LB" });
        const toolbar = new AMap.ToolBar({
          position: { top: "18px", right: "18px" },
          liteStyle: true,
        });
        map.addControl?.(scale);
        map.addControl?.(toolbar);
      } catch {
        // Basemap is still useful even if controls fail.
      }

      try {
        provincePoints.forEach(point => {
          const palette = topicPalette[point.topic];
          const position: [number, number] = [point.longitude, point.latitude];
          const marker = new AMap.CircleMarker({
            center: position,
            radius: 8,
            strokeColor: "#fffdf9",
            strokeWeight: 2,
            strokeOpacity: 1,
            fillColor: palette.color,
            fillOpacity: 0.96,
            bubble: true,
            zIndex: 20,
          });
          const halo = new AMap.CircleMarker({
            center: position,
            radius: 13,
            strokeOpacity: 0,
            fillColor: palette.color,
            fillOpacity: 0.08,
            bubble: true,
            zIndex: 15,
          });

          const infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -18),
            autoMove: false,
            isCustom: false,
            content: `
              <div style="padding:8px 10px;min-width:180px;color:#4f4034;line-height:1.65;">
                <div style="font-size:14px;font-weight:700;">${point.label}</div>
                <div style="margin-top:4px;font-size:12px;color:#7a6b5c;">${palette.label} / ${point.dynasty}</div>
                <div style="margin-top:4px;font-size:12px;color:#7a6b5c;">${point.location}</div>
              </div>
            `,
          });

          marker.on("mouseover", () => {
            setHoveredPointId(point.id);
            infoWindow.open(map, position);
          });
          marker.on("mouseout", () => {
            setHoveredPointId(current => (current === point.id ? null : current));
            infoWindow.close?.();
          });
          marker.on("click", () => {
            selectionSourceRef.current = "map";
            onPointSelect?.(point.id);
            infoWindow.open(map, position);
          });

          map.add?.(halo);
          map.add?.(marker);
          overlays.push(halo, marker);
          records.push({ pointId: point.id, marker, halo, infoWindow, position });
        });

        markerRecordsRef.current = records;

        if (overlays.length) {
          map.setFitView?.(overlays, false, [56, 56, 56, 56], 9);
        }
      } catch {
        // Point overlays are optional; keep map ready if they fail.
      }
    };

    void init();

    return () => {
      disposed = true;
      markerRecordsRef.current = [];
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
    };
  }, [onPointSelect, provinceCode, provincePoints]);

  useEffect(() => {
    markerRecordsRef.current.forEach(record => {
      const point = provincePoints.find(item => item.id === record.pointId);
      if (!point) return;
      const palette = topicPalette[point.topic];
      const selected = record.pointId === selectedPoint?.id;
      const hovered = record.pointId === hoveredPointId;

      record.marker.setOptions?.({
        radius: selected ? 10 : hovered ? 9 : 8,
        fillOpacity: selected ? 1 : hovered ? 0.98 : 0.94,
        zIndex: selected ? 30 : hovered ? 26 : 20,
      });
      record.halo?.setOptions?.({
        radius: selected ? 20 : hovered ? 18 : 13,
        fillOpacity: selected ? 0.26 : hovered ? 0.16 : 0.08,
        zIndex: selected ? 25 : hovered ? 22 : 15,
        fillColor: palette.color,
      });
      if (!selected && !hovered) {
        record.infoWindow?.close?.();
      }
    });
  }, [hoveredPointId, provincePoints, selectedPoint, selectedPointId]);

  useEffect(() => {
    const selectedRecord = markerRecordsRef.current.find(record => record.pointId === selectedPoint?.id);
    if (!selectedRecord) return;
    if (selectionSourceRef.current !== "map") {
      mapInstanceRef.current?.setZoomAndCenter?.(8.2, selectedRecord.position, true, 280);
    }
    selectionSourceRef.current = "external";
    selectedRecord.infoWindow?.open?.(mapInstanceRef.current, selectedRecord.position);
  }, [selectedPoint]);

  return (
    <article className="rounded-[32px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_20px_42px_rgba(120,83,49,0.08)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.22em] text-[hsl(28,28%,48%)]">AMAP VIEW</p>
          <h2 className="mt-2 text-2xl font-serif-cn font-bold">{provinceName}局部交互地图</h2>
          <p className="mt-2 text-sm leading-7 text-foreground/70">
            鼠标悬停查看临时提示，点击点位后保留高亮并同步切换右侧说明牌。
          </p>
        </div>
        <div className="rounded-full border border-[rgba(129,90,53,0.12)] bg-[rgba(255,250,242,0.88)] px-3 py-2 text-xs text-foreground/70">
          本省建筑点位 {provincePoints.length}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[24px] border border-[rgba(129,90,53,0.12)] bg-[linear-gradient(180deg,#eef3f7,#dbe6ef)]">
        <div ref={mapRef} className="h-[380px] w-full" />
      </div>

      {status === "missing-key" ? (
        <div className="mt-4 rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,250,242,0.9)] px-4 py-4 text-sm leading-7 text-foreground/76">
          当前没有检测到高德地图配置。请在项目根目录新增 `.env.local`，填入 `VITE_AMAP_KEY` 和
          `VITE_AMAP_SECURITY_JS_CODE` 后重启 `npm run dev`。
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="mt-4 rounded-[20px] border border-[rgba(129,90,53,0.12)] bg-[rgba(255,250,242,0.9)] px-4 py-4 text-sm text-foreground/72">
          正在加载高德底图与省级边界…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-4 rounded-[20px] border border-[rgba(180,92,76,0.24)] bg-[rgba(255,245,242,0.92)] px-4 py-4 text-sm leading-7 text-[hsl(14,40%,34%)]">
          高德地图未能完成加载。请检查 key、securityJsCode、域名白名单以及当前网络环境。
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {provincePoints.slice(0, 9).map(point => {
          const palette = topicPalette[point.topic];
          const selected = selectedPoint?.id === point.id;
          return (
            <button
              key={point.id}
              onClick={() => {
                selectionSourceRef.current = "list";
                onPointSelect?.(point.id);
              }}
              className={`flex items-start gap-3 rounded-[18px] border px-3 py-3 text-left transition-all ${
                selected
                  ? "border-[rgba(129,90,53,0.24)] bg-[rgba(255,248,238,0.98)] shadow-[0_12px_24px_rgba(120,83,49,0.1)]"
                  : "border-[rgba(129,90,53,0.12)] bg-[rgba(255,252,246,0.92)] hover:border-[rgba(129,90,53,0.24)]"
              }`}
            >
              <span className="mt-1 inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: palette.color }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{point.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {palette.label} / {point.dynasty}
                </p>
              </div>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(28,32%,46%)]" />
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default ProvinceAmapPanel;


