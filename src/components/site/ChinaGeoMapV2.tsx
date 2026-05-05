import { useEffect, useMemo, useState } from "react";

type GeoPoint = {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
  value?: number;
  topic?: string;
  regionId?: string;
};

type GeoRegion = {
  id: string;
  label: string;
  provinces: string[];
};

type GeoCircleOverlay = {
  id: string;
  label?: string;
  longitude: number;
  latitude: number;
  radius?: number;
  color?: string;
  opacity?: number;
};

type GeoLineOverlay = {
  id: string;
  label?: string;
  coordinates: Array<[number, number]>;
  color?: string;
  width?: number;
  dashed?: boolean;
};

type GeoNodeOverlay = {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
  color?: string;
};

type GeoPolygons = number[][][][];
type ProjectionMeta = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  scale: number;
  offsetX: number;
  offsetY: number;
};

type Props = {
  className?: string;
  points?: GeoPoint[];
  activePointId?: string;
  onPointSelect?: (pointId: string) => void;
  activeRegionId?: string;
  onRegionSelect?: (regionId: string) => void;
  regions?: GeoRegion[];
  accent?: string;
  topicColors?: Partial<Record<string, string>>;
  activeTopic?: string;
  regionOverlays?: GeoCircleOverlay[];
  densityOverlays?: GeoCircleOverlay[];
  hydrologyLines?: GeoLineOverlay[];
  transportLines?: GeoLineOverlay[];
  capitalNodes?: GeoNodeOverlay[];
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 720;
const PADDING = 36;
const REGIONS_GEOJSON_PATH = "/maps/china-regions-new.geojson";
const DEFAULT_LON = 104;
const DEFAULT_LAT = 35;

const mercatorRaw = (longitude: number, latitude: number) => {
  const lngRad = (longitude * Math.PI) / 180;
  const clampedLat = Math.max(-85, Math.min(85, latitude));
  const latRad = (clampedLat * Math.PI) / 180;
  return {
    x: lngRad,
    y: Math.log(Math.tan(Math.PI / 4 + latRad / 2)),
  };
};

const ChinaGeoMapV2 = ({
  className,
  points = [],
  activePointId,
  onPointSelect,
  activeRegionId,
  accent = "#aa7a1f",
  topicColors,
  activeTopic,
  regionOverlays = [],
  densityOverlays = [],
  hydrologyLines = [],
  transportLines = [],
  capitalNodes = [],
}: Props) => {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mapPolygons, setMapPolygons] = useState<GeoPolygons>([]);

  useEffect(() => {
    let cancelled = false;

    const loadGeojson = async () => {
      try {
        const response = await fetch(REGIONS_GEOJSON_PATH);
        if (!response.ok) return;
        const geojson = await response.json();
        const features = Array.isArray(geojson?.features) ? geojson.features : [];
        const polygons: GeoPolygons = [];

        for (const feature of features) {
          const geometry = feature?.geometry;
          if (!geometry) continue;

          if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
            polygons.push(...geometry.coordinates);
          } else if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
            polygons.push(geometry.coordinates);
          }
        }

        if (!cancelled) setMapPolygons(polygons);
      } catch {
        // keep point-only fallback
      }
    };

    void loadGeojson();
    return () => {
      cancelled = true;
    };
  }, []);

  const projectionMeta = useMemo<ProjectionMeta | null>(() => {
    const coords: Array<[number, number]> = [];

    for (const polygon of mapPolygons) {
      for (const ring of polygon) {
        for (const point of ring) {
          const lon = Number(point?.[0]);
          const lat = Number(point?.[1]);
          if (Number.isFinite(lon) && Number.isFinite(lat)) {
            coords.push([lon, lat]);
          }
        }
      }
    }

    if (!coords.length) {
      for (const point of points) {
        if (Number.isFinite(point.longitude) && Number.isFinite(point.latitude)) {
          coords.push([point.longitude, point.latitude]);
        }
      }
    }

    if (!coords.length) {
      coords.push([DEFAULT_LON, DEFAULT_LAT]);
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const [lon, lat] of coords) {
      const raw = mercatorRaw(lon, lat);
      if (raw.x < minX) minX = raw.x;
      if (raw.x > maxX) maxX = raw.x;
      if (raw.y < minY) minY = raw.y;
      if (raw.y > maxY) maxY = raw.y;
    }

    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
      return null;
    }

    const innerWidth = VIEWBOX_WIDTH - PADDING * 2;
    const innerHeight = VIEWBOX_HEIGHT - PADDING * 2;
    const dataWidth = Math.max(1e-9, maxX - minX);
    const dataHeight = Math.max(1e-9, maxY - minY);
    const scale = Math.min(innerWidth / dataWidth, innerHeight / dataHeight);
    const offsetX = PADDING + (innerWidth - dataWidth * scale) / 2;
    const offsetY = PADDING + (innerHeight - dataHeight * scale) / 2;

    return { minX, maxX, minY, maxY, scale, offsetX, offsetY };
  }, [mapPolygons, points]);

  const project = (longitude: number, latitude: number) => {
    if (!projectionMeta) {
      return { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };
    }
    const raw = mercatorRaw(longitude, latitude);
    return {
      x: (raw.x - projectionMeta.minX) * projectionMeta.scale + projectionMeta.offsetX,
      y: (projectionMeta.maxY - raw.y) * projectionMeta.scale + projectionMeta.offsetY,
    };
  };

  const projectedPoints = useMemo(
    () =>
      points.map(point => ({
        ...point,
        ...project(point.longitude, point.latitude),
      })),
    [points, projectionMeta]
  );

  const pathData = useMemo(() => {
    return mapPolygons
      .map((polygon) =>
        polygon
          .map((ring) => {
            if (!Array.isArray(ring) || ring.length === 0) return "";
            const commands = ring
              .map((point, idx) => {
                const lon = Number(point?.[0]);
                const lat = Number(point?.[1]);
                if (!Number.isFinite(lon) || !Number.isFinite(lat)) return "";
                const p = project(lon, lat);
                return `${idx === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
              })
              .filter(Boolean)
              .join(" ");
            return commands ? `${commands} Z` : "";
          })
          .filter(Boolean)
          .join(" ")
      )
      .filter(Boolean);
  }, [mapPolygons, projectionMeta]);

  useEffect(() => {
    const activePoint = projectedPoints.find(point => point.id === activePointId);
    if (!activePoint) return;

    const nextZoom = 1.24;
    setZoom(nextZoom);
    setOffset({
      x: VIEWBOX_WIDTH / 2 - activePoint.x * nextZoom,
      y: VIEWBOX_HEIGHT / 2 - activePoint.y * nextZoom,
    });
  }, [activePointId, projectedPoints]);

  const visiblePoints = projectedPoints.filter(
    point => !activeRegionId || point.regionId === activeRegionId
  );
  const hoveredPoint = projectedPoints.find(point => point.id === hoveredPointId) ?? projectedPoints.find(point => point.id === activePointId);

  const projectedRegionOverlays = useMemo(
    () =>
      regionOverlays.map(item => ({
        ...item,
        ...project(item.longitude, item.latitude),
      })),
    [regionOverlays, projectionMeta]
  );

  const projectedDensityOverlays = useMemo(
    () =>
      densityOverlays.map(item => ({
        ...item,
        ...project(item.longitude, item.latitude),
      })),
    [densityOverlays, projectionMeta]
  );

  const projectedHydrologyLines = useMemo(
    () =>
      hydrologyLines
        .map(line => {
          if (!line.coordinates.length) return null;
          const path = line.coordinates
            .map((coord, index) => {
              const p = project(coord[0], coord[1]);
              return `${index === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
            })
            .join(" ");
          return {
            ...line,
            path,
          };
        })
        .filter(Boolean) as Array<GeoLineOverlay & { path: string }>,
    [hydrologyLines, projectionMeta]
  );

  const projectedTransportLines = useMemo(
    () =>
      transportLines
        .map(line => {
          if (!line.coordinates.length) return null;
          const path = line.coordinates
            .map((coord, index) => {
              const p = project(coord[0], coord[1]);
              return `${index === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
            })
            .join(" ");
          return {
            ...line,
            path,
          };
        })
        .filter(Boolean) as Array<GeoLineOverlay & { path: string }>,
    [transportLines, projectionMeta]
  );

  const projectedCapitalNodes = useMemo(
    () =>
      capitalNodes.map(node => ({
        ...node,
        ...project(node.longitude, node.latitude),
      })),
    [capitalNodes, projectionMeta]
  );

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setZoom(current => Math.min(2.2, Number((current + 0.18).toFixed(2))))}
          className="rounded-full border border-white/60 bg-[rgba(255,248,238,0.92)] px-3 py-2 text-xs font-medium text-[#5f5043] shadow-sm"
        >
          放大
        </button>
        <button
          type="button"
          onClick={() => setZoom(current => Math.max(1, Number((current - 0.18).toFixed(2))))}
          className="rounded-full border border-white/60 bg-[rgba(255,248,238,0.92)] px-3 py-2 text-xs font-medium text-[#5f5043] shadow-sm"
        >
          缩小
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setOffset({ x: 0, y: 0 });
          }}
          className="rounded-full border border-white/60 bg-[rgba(255,248,238,0.92)] px-3 py-2 text-xs font-medium text-[#5f5043] shadow-sm"
        >
          复位
        </button>
      </div>

      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full">
        <rect x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="rgba(255,248,238,0.92)" />

        <g transform={`translate(${offset.x} ${offset.y}) scale(${zoom})`} style={{ transition: "transform 280ms ease" }}>
          {pathData.map((d, index) => (
            <path
              key={`bg-${index}`}
              d={d}
              fill="rgba(255,232,209,0.86)"
              stroke="rgba(125,92,62,0.46)"
              strokeWidth={1.1}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {projectedRegionOverlays.map(item => (
            <g key={`region-overlay-${item.id}`} style={{ pointerEvents: "none" }}>
              <circle
                cx={item.x}
                cy={item.y}
                r={item.radius ?? 58}
                fill={item.color ?? "rgba(186,132,74,0.12)"}
                stroke={item.color ?? "rgba(173,117,67,0.46)"}
                strokeWidth={1.6}
                opacity={item.opacity ?? 0.52}
              />
              {item.label ? (
                <text x={item.x} y={item.y - (item.radius ?? 58) - 6} textAnchor="middle" fontSize="12" fill="#7a5e45" opacity="0.86">
                  {item.label}
                </text>
              ) : null}
            </g>
          ))}

          {projectedDensityOverlays.map(item => (
            <g key={`density-overlay-${item.id}`} style={{ pointerEvents: "none" }}>
              <circle
                cx={item.x}
                cy={item.y}
                r={item.radius ?? 42}
                fill={item.color ?? "rgba(217,144,74,0.18)"}
                stroke={item.color ?? "rgba(182,109,52,0.56)"}
                strokeWidth={1.8}
                opacity={item.opacity ?? 0.72}
              />
            </g>
          ))}

          {projectedHydrologyLines.map(line => (
            <path
              key={`hydrology-${line.id}`}
              d={line.path}
              fill="none"
              stroke={line.color ?? "rgba(93,136,172,0.72)"}
              strokeWidth={line.width ?? 2.2}
              strokeDasharray={line.dashed ? "6 6" : undefined}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {projectedTransportLines.map(line => (
            <path
              key={`transport-${line.id}`}
              d={line.path}
              fill="none"
              stroke={line.color ?? "rgba(168,112,60,0.74)"}
              strokeWidth={line.width ?? 2.2}
              strokeDasharray={line.dashed ? "5 5" : undefined}
              style={{ pointerEvents: "none" }}
            />
          ))}

          {projectedCapitalNodes.map(node => (
            <g key={`capital-${node.id}`} style={{ pointerEvents: "none" }}>
              <circle cx={node.x} cy={node.y} r={7.5} fill={node.color ?? "#8f512b"} stroke="#fff7ec" strokeWidth={2.4} />
              <circle cx={node.x} cy={node.y} r={14} fill={node.color ?? "#8f512b"} opacity={0.12} />
            </g>
          ))}

          {visiblePoints.map(point => {
            const selected = point.id === activePointId;
            const hovered = point.id === hoveredPointId;
            const topicColor = (point.topic ? topicColors?.[point.topic] : undefined) ?? accent;
            const topicHighlighted = !!activeTopic && point.topic === activeTopic;
            const radius = selected ? 11 : topicHighlighted ? 9 : hovered ? 8 : 6.6;

            return (
              <g
                key={point.id}
                className={onPointSelect ? "cursor-pointer" : undefined}
                onClick={onPointSelect ? () => onPointSelect(point.id) : undefined}
                onMouseEnter={() => setHoveredPointId(point.id)}
                onMouseLeave={() => setHoveredPointId(current => (current === point.id ? null : current))}
              >
                <circle cx={point.x} cy={point.y} r={radius + (topicHighlighted ? 12 : 8)} fill={topicColor} opacity={selected ? 0.2 : topicHighlighted ? 0.14 : 0.07} />
                <circle cx={point.x} cy={point.y} r={radius} fill={topicColor} stroke="#fff8ee" strokeWidth={topicHighlighted ? "3.4" : "2.6"} />
                {(selected || hovered) && (
                  <>
                    <line x1={point.x} y1={point.y} x2={point.x + 24} y2={point.y - 24} stroke={topicColor} strokeWidth="2" opacity="0.72" />
                    <rect x={point.x + 26} y={point.y - 40} width="122" height="28" rx="14" fill="#fff8ee" opacity="0.96" />
                    <text x={point.x + 38} y={point.y - 22} fontSize="18" fill="#5f5043" fontWeight="600">
                      {point.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {hoveredPoint ? (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl border border-white/60 bg-[rgba(255,248,238,0.94)] px-4 py-3 text-sm text-[#5f5043] shadow-lg backdrop-blur">
          <p className="font-semibold">{hoveredPoint.label}</p>
          <p className="mt-1 text-xs opacity-75">
            坐标 {hoveredPoint.longitude.toFixed(2)}, {hoveredPoint.latitude.toFixed(2)}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export type { GeoPoint, GeoRegion, GeoCircleOverlay, GeoLineOverlay, GeoNodeOverlay };
export default ChinaGeoMapV2;
