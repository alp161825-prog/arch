import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoPoint } from "@/components/site/ChinaGeoMapV2";
import { provinceCodeToName } from "@/data/provinceAtlas";

type Props = {
  className?: string;
  points?: Array<GeoPoint & { regionId?: string }>;
  activePointId?: string;
  onPointSelect?: (pointId: string) => void;
  onProvinceSelect?: (province: { id: string; name: string }) => void;
  clickableProvinceIds?: string[];
  accent?: string;
  visibleTopics?: string[];
};

type ProjectionMeta = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  scale: number;
  offsetX: number;
  offsetY: number;
};

type GeoFeature = {
  code: string;
  name: string;
  center?: [number, number];
  polygons: number[][][][];
  bounds: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
};

type ProvinceHotspot = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  radius?: number;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 720;
const MAP_PADDING = 22;
const GEOJSON_PATH = "/maps/china-provinces.geojson";
const MIN_ZOOM = 1;
const MAX_ZOOM = 4.5;
const ZOOM_STEP = 0.12;
const DRAG_CLICK_THRESHOLD_PX = 5;

const TOPIC_MARKER_COLORS: Record<string, string> = {
  residential: "#8f5b33",
  government: "#7a4b31",
  palace: "#aa7a1f",
  bridge: "#557a6b",
};

const FALLBACK_HOTSPOTS: ProvinceHotspot[] = [
  { id: "110000", name: "北京市", longitude: 116.4, latitude: 39.9, radius: 18 },
  { id: "120000", name: "天津市", longitude: 117.2, latitude: 39.1, radius: 14 },
  { id: "130000", name: "河北省", longitude: 114.5, latitude: 38.0, radius: 26 },
  { id: "140000", name: "山西省", longitude: 112.5, latitude: 37.9, radius: 22 },
  { id: "150000", name: "内蒙古", longitude: 111.7, latitude: 43.4, radius: 32 },
  { id: "210000", name: "辽宁省", longitude: 123.4, latitude: 41.8, radius: 20 },
  { id: "220000", name: "吉林省", longitude: 126.5, latitude: 43.9, radius: 20 },
  { id: "230000", name: "黑龙江", longitude: 127.9, latitude: 47.1, radius: 24 },
  { id: "310000", name: "上海市", longitude: 121.5, latitude: 31.2, radius: 13 },
  { id: "320000", name: "江苏省", longitude: 119.0, latitude: 32.9, radius: 20 },
  { id: "330000", name: "浙江省", longitude: 120.2, latitude: 29.2, radius: 18 },
  { id: "340000", name: "安徽省", longitude: 117.2, latitude: 31.8, radius: 20 },
  { id: "350000", name: "福建省", longitude: 118.3, latitude: 26.1, radius: 18 },
  { id: "360000", name: "江西省", longitude: 115.8, latitude: 27.4, radius: 20 },
  { id: "370000", name: "山东省", longitude: 118.0, latitude: 36.4, radius: 22 },
  { id: "410000", name: "河南省", longitude: 113.6, latitude: 34.7, radius: 22 },
  { id: "420000", name: "湖北省", longitude: 112.3, latitude: 30.9, radius: 22 },
  { id: "430000", name: "湖南省", longitude: 112.9, latitude: 27.7, radius: 22 },
  { id: "440000", name: "广东省", longitude: 113.3, latitude: 23.2, radius: 24 },
  { id: "450000", name: "广西", longitude: 108.3, latitude: 23.8, radius: 22 },
  { id: "460000", name: "海南省", longitude: 109.8, latitude: 19.2, radius: 16 },
  { id: "500000", name: "重庆市", longitude: 107.8, latitude: 30.1, radius: 16 },
  { id: "510000", name: "四川省", longitude: 103.8, latitude: 30.6, radius: 28 },
  { id: "520000", name: "贵州省", longitude: 106.7, latitude: 26.8, radius: 20 },
  { id: "530000", name: "云南省", longitude: 101.5, latitude: 25.0, radius: 24 },
  { id: "540000", name: "西藏", longitude: 88.8, latitude: 31.6, radius: 34 },
  { id: "610000", name: "陕西省", longitude: 108.9, latitude: 34.3, radius: 22 },
  { id: "620000", name: "甘肃省", longitude: 103.8, latitude: 36.1, radius: 26 },
  { id: "630000", name: "青海省", longitude: 96.4, latitude: 35.7, radius: 28 },
  { id: "640000", name: "宁夏", longitude: 106.1, latitude: 37.3, radius: 15 },
  { id: "650000", name: "新疆", longitude: 85.6, latitude: 41.7, radius: 34 },
  { id: "710000", name: "台湾省", longitude: 121.0, latitude: 23.7, radius: 16 },
  { id: "810000", name: "香港", longitude: 114.2, latitude: 22.3, radius: 10 },
  { id: "820000", name: "澳门", longitude: 113.5, latitude: 22.2, radius: 10 },
];

const DEFAULT_BOUNDS = {
  minLon: 73,
  maxLon: 136,
  minLat: 18,
  maxLat: 54,
};

const mercatorRaw = (longitude: number, latitude: number) => {
  const lngRad = (longitude * Math.PI) / 180;
  const clampedLat = Math.max(-85, Math.min(85, latitude));
  const latRad = (clampedLat * Math.PI) / 180;
  return {
    x: lngRad,
    y: Math.log(Math.tan(Math.PI / 4 + latRad / 2)),
  };
};

const projectLinear = (longitude: number, latitude: number) => {
  const innerWidth = VIEWBOX_WIDTH - MAP_PADDING * 2;
  const innerHeight = VIEWBOX_HEIGHT - MAP_PADDING * 2;
  const lonSpan = DEFAULT_BOUNDS.maxLon - DEFAULT_BOUNDS.minLon || 1;
  const latSpan = DEFAULT_BOUNDS.maxLat - DEFAULT_BOUNDS.minLat || 1;
  return {
    x: MAP_PADDING + ((longitude - DEFAULT_BOUNDS.minLon) / lonSpan) * innerWidth,
    y: MAP_PADDING + (1 - (latitude - DEFAULT_BOUNDS.minLat) / latSpan) * innerHeight,
  };
};

const projectMercator = (longitude: number, latitude: number, meta: ProjectionMeta) => {
  const raw = mercatorRaw(longitude, latitude);
  return {
    x: (raw.x - meta.minX) * meta.scale + meta.offsetX,
    y: (meta.maxY - raw.y) * meta.scale + meta.offsetY,
  };
};

const toPathD = (polygons: number[][][][], meta: ProjectionMeta | null) => {
  const parts: string[] = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      if (!ring.length) continue;
      const commands = ring
        .map((point, index) => {
          const [lon, lat] = point;
          const projected = meta ? projectMercator(lon, lat, meta) : projectLinear(lon, lat);
          return `${index === 0 ? "M" : "L"}${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
        })
        .join(" ");
      parts.push(`${commands} Z`);
    }
  }
  return parts.join(" ");
};

const LABEL_VISIBLE_ZOOM = 1.18;
const POINT_OVERLAP_DISTANCE = 9;
const MICRO_OFFSET_RADIUS = 6;

const toViewBoxPoint = (element: HTMLElement, clientX: number, clientY: number) => {
  const rect = element.getBoundingClientRect();
  const x = ((clientX - rect.left) / Math.max(1, rect.width)) * VIEWBOX_WIDTH;
  const y = ((clientY - rect.top) / Math.max(1, rect.height)) * VIEWBOX_HEIGHT;
  return { x, y };
};

const clampOffset = (nextOffset: { x: number; y: number }, nextZoom: number) => {
  const scaledWidth = VIEWBOX_WIDTH * nextZoom;
  const scaledHeight = VIEWBOX_HEIGHT * nextZoom;

  let x = nextOffset.x;
  let y = nextOffset.y;

  if (scaledWidth <= VIEWBOX_WIDTH) {
    x = (VIEWBOX_WIDTH - scaledWidth) / 2;
  } else {
    const minX = VIEWBOX_WIDTH - scaledWidth;
    const maxX = 0;
    x = Math.max(minX, Math.min(maxX, x));
  }

  if (scaledHeight <= VIEWBOX_HEIGHT) {
    y = (VIEWBOX_HEIGHT - scaledHeight) / 2;
  } else {
    const minY = VIEWBOX_HEIGHT - scaledHeight;
    const maxY = 0;
    y = Math.max(minY, Math.min(maxY, y));
  }

  return { x, y };
};

const getRingProjectedPoints = (ring: number[][], meta: ProjectionMeta | null) =>
  ring
    .map(([lon, lat]) => (meta ? projectMercator(lon, lat, meta) : projectLinear(lon, lat)))
    .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));

const getRingAreaCentroid = (points: Array<{ x: number; y: number }>) => {
  if (points.length < 3) return null;
  let area2 = 0;
  let cxAcc = 0;
  let cyAcc = 0;
  for (let i = 0; i < points.length; i += 1) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const cross = p1.x * p2.y - p2.x * p1.y;
    area2 += cross;
    cxAcc += (p1.x + p2.x) * cross;
    cyAcc += (p1.y + p2.y) * cross;
  }
  if (Math.abs(area2) < 1e-9) return null;
  return {
    area: area2 / 2,
    x: cxAcc / (3 * area2),
    y: cyAcc / (3 * area2),
  };
};

const getPointWeight = (point: GeoPoint) => {
  if (typeof point.value === "number") return point.value;
  return 60;
};

const ChinaGeoMapV8 = ({
  className,
  points = [],
  activePointId,
  onPointSelect,
  onProvinceSelect,
  clickableProvinceIds,
  accent = "#aa7a1f",
  visibleTopics,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const wheelRafRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);
  const pendingDragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntilRef = useRef(0);

  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadGeoJson = async () => {
      try {
        const response = await fetch(GEOJSON_PATH);
        if (!response.ok) return;
        const geojson = await response.json();

        const rawFeatures = Array.isArray(geojson?.features) ? geojson.features : [];
        const provinceFeatures: GeoFeature[] = [];

        for (const feature of rawFeatures) {
          const props = feature?.properties ?? {};
          const level = props?.level;
          const adcode = props?.adcode;
          const code = typeof adcode === "number" ? String(adcode) : typeof adcode === "string" ? adcode : "";
          if (level !== "province") continue;
          if (!/^\d{6}$/.test(code)) continue;

          const geometry = feature?.geometry;
          if (!geometry) continue;

          let polygons: number[][][][] = [];
          if (geometry.type === "MultiPolygon" && Array.isArray(geometry.coordinates)) {
            polygons = geometry.coordinates;
          } else if (geometry.type === "Polygon" && Array.isArray(geometry.coordinates)) {
            polygons = [geometry.coordinates];
          }
          if (!polygons.length) continue;

          const centerRaw = Array.isArray(props?.center) && props.center.length >= 2 ? props.center : undefined;
          const center =
            centerRaw && Number.isFinite(centerRaw[0]) && Number.isFinite(centerRaw[1])
              ? [Number(centerRaw[0]), Number(centerRaw[1])] as [number, number]
              : undefined;

          let minLon = Infinity;
          let maxLon = -Infinity;
          let minLat = Infinity;
          let maxLat = -Infinity;
          for (const polygon of polygons) {
            for (const ring of polygon) {
              for (const [lon, lat] of ring) {
                if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
                minLon = Math.min(minLon, lon);
                maxLon = Math.max(maxLon, lon);
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
              }
            }
          }

          provinceFeatures.push({
            code,
            name: String(props?.name ?? code),
            center,
            polygons,
            bounds: {
              minLon: Number.isFinite(minLon) ? minLon : DEFAULT_BOUNDS.minLon,
              maxLon: Number.isFinite(maxLon) ? maxLon : DEFAULT_BOUNDS.maxLon,
              minLat: Number.isFinite(minLat) ? minLat : DEFAULT_BOUNDS.minLat,
              maxLat: Number.isFinite(maxLat) ? maxLat : DEFAULT_BOUNDS.maxLat,
            },
          });
        }

        if (cancelled) return;

        if (provinceFeatures.length) {
          setGeoFeatures(provinceFeatures);
        }
      } catch {
        // fall back to existing raster/hotspot behavior
      }
    };

    void loadGeoJson();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const pointer = toViewBoxPoint(element, event.clientX, event.clientY);

      if (wheelRafRef.current !== null) {
        cancelAnimationFrame(wheelRafRef.current);
      }
      wheelRafRef.current = requestAnimationFrame(() => {
        setZoom(currentZoom => {
          const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
          const nextZoom = Number(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + delta)).toFixed(2));

          setOffset(currentOffset => {
            if (nextZoom === MIN_ZOOM) return { x: 0, y: 0 };
            const mapX = (pointer.x - currentOffset.x) / currentZoom;
            const mapY = (pointer.y - currentOffset.y) / currentZoom;
            const nextOffset = {
              x: pointer.x - mapX * nextZoom,
              y: pointer.y - mapY * nextZoom,
            };
            return clampOffset(nextOffset, nextZoom);
          });

          return nextZoom;
        });
        wheelRafRef.current = null;
      });
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelRafRef.current !== null) {
        cancelAnimationFrame(wheelRafRef.current);
        wheelRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerUp = () => {
      if (dragStateRef.current?.moved) {
        suppressClickUntilRef.current = Date.now() + 120;
      }
      dragStateRef.current = null;
      setDragging(false);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current || zoom <= 1) return;
      event.preventDefault();
      const nextX = dragStateRef.current.offsetX + (event.clientX - dragStateRef.current.x);
      const nextY = dragStateRef.current.offsetY + (event.clientY - dragStateRef.current.y);

      const movedDistance = Math.hypot(event.clientX - dragStateRef.current.x, event.clientY - dragStateRef.current.y);
      if (movedDistance >= DRAG_CLICK_THRESHOLD_PX) {
        dragStateRef.current.moved = true;
      }

      pendingDragOffsetRef.current = clampOffset({ x: nextX, y: nextY }, zoom);
      if (dragRafRef.current !== null) return;
      dragRafRef.current = requestAnimationFrame(() => {
        if (pendingDragOffsetRef.current) setOffset(pendingDragOffsetRef.current);
        pendingDragOffsetRef.current = null;
        dragRafRef.current = null;
      });
    };

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove, { passive: false });

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      if (dragRafRef.current !== null) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
      pendingDragOffsetRef.current = null;
    };
  }, [zoom]);

  const visiblePoints = useMemo(
    () => points.filter(point => !visibleTopics?.length || !point.topic || visibleTopics.includes(point.topic)),
    [points, visibleTopics]
  );

  const projectionMeta = useMemo<ProjectionMeta | null>(() => {
    if (!geoFeatures.length) return null;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const feature of geoFeatures) {
      for (const polygon of feature.polygons) {
        for (const ring of polygon) {
          for (const coord of ring) {
            const [lon, lat] = coord;
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
            const raw = mercatorRaw(lon, lat);
            if (raw.x < minX) minX = raw.x;
            if (raw.x > maxX) maxX = raw.x;
            if (raw.y < minY) minY = raw.y;
            if (raw.y > maxY) maxY = raw.y;
          }
        }
      }
    }

    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
      return null;
    }

    const innerWidth = VIEWBOX_WIDTH - MAP_PADDING * 2;
    const innerHeight = VIEWBOX_HEIGHT - MAP_PADDING * 2;
    const dataWidth = Math.max(1e-9, maxX - minX);
    const dataHeight = Math.max(1e-9, maxY - minY);
    const scale = Math.min(innerWidth / dataWidth, innerHeight / dataHeight);
    const offsetX = MAP_PADDING + (innerWidth - dataWidth * scale) / 2;
    const offsetY = MAP_PADDING + (innerHeight - dataHeight * scale) / 2;

    return { minX, maxX, minY, maxY, scale, offsetX, offsetY };
  }, [geoFeatures]);

  const projectedPoints = useMemo(
    () =>
      visiblePoints.map(point => ({
        ...point,
        ...(projectionMeta ? projectMercator(point.longitude, point.latitude, projectionMeta) : projectLinear(point.longitude, point.latitude)),
      })),
    [visiblePoints, projectionMeta]
  );

  const displayPoints = useMemo(() => {
    const sorted = [...projectedPoints].sort((a, b) => getPointWeight(b) - getPointWeight(a) || a.id.localeCompare(b.id));
    const groups: Array<{ points: typeof sorted; cx: number; cy: number }> = [];

    for (const point of sorted) {
      let matchedGroup: (typeof groups)[number] | null = null;
      for (const group of groups) {
        if (Math.hypot(point.x - group.cx, point.y - group.cy) <= POINT_OVERLAP_DISTANCE) {
          matchedGroup = group;
          break;
        }
      }

      if (!matchedGroup) {
        groups.push({ points: [point], cx: point.x, cy: point.y });
        continue;
      }

      matchedGroup.points.push(point);
      const count = matchedGroup.points.length;
      matchedGroup.cx = (matchedGroup.cx * (count - 1) + point.x) / count;
      matchedGroup.cy = (matchedGroup.cy * (count - 1) + point.y) / count;
    }

    const result: Array<(typeof sorted)[number] & { displayX: number; displayY: number; groupSize: number }> = [];

    for (const group of groups) {
      const count = group.points.length;
      if (count === 1) {
        const only = group.points[0];
        result.push({ ...only, displayX: only.x, displayY: only.y, groupSize: 1 });
        continue;
      }

      const arranged = [...group.points].sort((a, b) => a.id.localeCompare(b.id));
      for (let index = 0; index < arranged.length; index += 1) {
        const point = arranged[index];
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
        const radius = MICRO_OFFSET_RADIUS + Math.min(2, Math.floor((count - 2) / 2));

        result.push({
          ...point,
          displayX: point.x + Math.cos(angle) * radius,
          displayY: point.y + Math.sin(angle) * radius,
          groupSize: count,
        });
      }
    }

    return result;
  }, [projectedPoints]);

  const interactiveProvinceIds = useMemo(
    () => new Set(clickableProvinceIds ?? geoFeatures.map(item => item.code)),
    [clickableProvinceIds, geoFeatures]
  );

  const provincePaths = useMemo(
    () =>
      geoFeatures.map(feature => ({
        ...feature,
        pathD: toPathD(feature.polygons, projectionMeta),
      })),
    [geoFeatures, projectionMeta]
  );

  const fallbackHotspots = useMemo(
    () =>
      FALLBACK_HOTSPOTS.map(item => ({
        ...item,
        ...(projectionMeta ? projectMercator(item.longitude, item.latitude, projectionMeta) : projectLinear(item.longitude, item.latitude)),
      })),
    [projectionMeta]
  );

  const provinceLabels = useMemo(
    () =>
      geoFeatures.map(feature => {
        const fullName = provinceCodeToName[feature.code] ?? feature.name;
        let labelX = 0;
        let labelY = 0;
        let maxAbsArea = 0;

        for (const polygon of feature.polygons) {
          const outerRing = polygon[0];
          if (!outerRing?.length) continue;
          const projectedRing = getRingProjectedPoints(outerRing, projectionMeta);
          const centroid = getRingAreaCentroid(projectedRing);
          if (!centroid) continue;
          const absArea = Math.abs(centroid.area);
          if (absArea > maxAbsArea) {
            maxAbsArea = absArea;
            labelX = centroid.x;
            labelY = centroid.y;
          }
        }

        if (maxAbsArea < 1e-9) {
          const centerLon = feature.center?.[0] ?? (feature.bounds.minLon + feature.bounds.maxLon) / 2;
          const centerLat = feature.center?.[1] ?? (feature.bounds.minLat + feature.bounds.maxLat) / 2;
          const projected = projectionMeta
            ? projectMercator(centerLon, centerLat, projectionMeta)
            : projectLinear(centerLon, centerLat);
          labelX = projected.x;
          labelY = projected.y;
        }
        return {
          code: feature.code,
          label: fullName,
          x: labelX,
          y: labelY,
        };
      }),
    [geoFeatures, projectionMeta]
  );

  const hoveredPoint = displayPoints.find(point => point.id === hoveredPointId);

  const hoveredProvinceFeature = provincePaths.find(item => item.code === hoveredProvinceId);
  const hoveredProvinceName = hoveredProvinceId ? provinceCodeToName[hoveredProvinceId] ?? hoveredProvinceFeature?.name : undefined;
  const shouldSuppressClick = () => dragging || Date.now() < suppressClickUntilRef.current;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[22px] overscroll-contain ${className ?? ""}`}
      style={{ touchAction: "none", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
      onPointerDown={event => {
        if (zoom <= 1) return;
        dragStateRef.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y, moved: false };
        setDragging(true);
      }}
      onDoubleClick={() => {
        dragStateRef.current = null;
        setDragging(false);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }}
      onMouseLeave={() => {
        setHoveredProvinceId(null);
        setHoveredPointId(null);
      }}
    >
      <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="h-full w-full">
        <rect x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="rgba(255,252,246,0.96)" />

        <g transform={`translate(${offset.x} ${offset.y})`} style={{ transition: "none" }}>
        <g transform={`scale(${zoom})`}>
          {provincePaths.length > 0
            ? provincePaths.map(feature => {
                const isClickable = interactiveProvinceIds.has(feature.code) && Boolean(onProvinceSelect);
                const isHovered = hoveredProvinceId === feature.code;

                return (
                  <path
                    key={feature.code}
                    d={feature.pathD}
                    fill={isHovered ? "rgba(170,122,31,0.36)" : "rgba(255,229,204,0.9)"}
                    fillRule="evenodd"
                    stroke={isHovered ? accent : "rgba(125,92,62,0.45)"}
                    strokeWidth={isHovered ? 2.2 : 1.2}
                    style={{
                      cursor: isClickable ? "pointer" : "default",
                      pointerEvents: isClickable ? "auto" : "none",
                      transition: "fill 140ms ease, stroke 140ms ease, stroke-width 140ms ease",
                    }}
                    onMouseEnter={() => setHoveredProvinceId(feature.code)}
                    onMouseLeave={() => setHoveredProvinceId(current => (current === feature.code ? null : current))}
                    onClick={
                      isClickable
                        ? () => {
                            if (shouldSuppressClick()) return;
                            onProvinceSelect?.({ id: feature.code, name: provinceCodeToName[feature.code] ?? feature.name });
                          }
                        : undefined
                    }
                  />
                );
              })
            : fallbackHotspots.map(shape => {
                const isClickable = interactiveProvinceIds.has(shape.id) && Boolean(onProvinceSelect);
                const isHovered = hoveredProvinceId === shape.id;

                return (
                  <circle
                    key={shape.id}
                    cx={shape.x}
                    cy={shape.y}
                    r={shape.radius ?? 18}
                    fill={isHovered ? "rgba(170,122,31,0.12)" : "rgba(0,0,0,0)"}
                    stroke={isHovered ? "rgba(170,122,31,0.36)" : "rgba(0,0,0,0)"}
                    strokeWidth={isHovered ? 1.2 : 0}
                    style={{ cursor: isClickable ? "pointer" : "default", pointerEvents: isClickable ? "auto" : "none" }}
                    onMouseEnter={() => setHoveredProvinceId(shape.id)}
                    onClick={
                      isClickable
                        ? () => {
                            if (shouldSuppressClick()) return;
                            onProvinceSelect?.({ id: shape.id, name: shape.name });
                          }
                        : undefined
                    }
                  />
                );
              })}

          {provincePaths.length > 0 && zoom >= LABEL_VISIBLE_ZOOM
            ? provinceLabels.map(item => (
                <text
                  key={`label-${item.code}`}
                  x={item.x}
                  y={item.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="rgba(32,32,32,0.94)"
                  fontSize="10"
                  fontWeight="600"
                  stroke="rgba(255,255,255,0.96)"
                  strokeWidth="2.2"
                  paintOrder="stroke fill"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {item.label}
                </text>
              ))
            : null}

          {displayPoints.map(point => {
            const selected = point.id === activePointId;
            const hovered = point.id === hoveredPointId;
            const markerColor = TOPIC_MARKER_COLORS[point.topic ?? ""] ?? accent;
            const r = selected ? 8 : hovered ? 7 : 5;

            return (
              <g
                key={point.id}
                style={{ cursor: onPointSelect ? "pointer" : "default", pointerEvents: onPointSelect ? "auto" : "none" }}
                onClick={
                  onPointSelect
                    ? () => {
                        if (shouldSuppressClick()) return;
                        onPointSelect(point.id);
                      }
                    : undefined
                }
                onMouseEnter={() => setHoveredPointId(point.id)}
                onMouseLeave={() => setHoveredPointId(current => (current === point.id ? null : current))}
              >
                <circle cx={point.displayX} cy={point.displayY} r={11} fill="rgba(0,0,0,0.001)" />
                <circle cx={point.displayX} cy={point.displayY} r={r + 12} fill={markerColor} opacity={selected ? 0.18 : 0.08}>
                  {selected ? (
                    <>
                      <animate attributeName="r" values={`${r + 5};${r + 18};${r + 5}`} dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.32;0.05;0.32" dur="2.2s" repeatCount="indefinite" />
                    </>
                  ) : null}
                </circle>
                <circle cx={point.displayX} cy={point.displayY} r={r + 3} fill="#ffffff" opacity="0.95" />
                <circle cx={point.displayX} cy={point.displayY} r={r} fill={markerColor} stroke="#fffdfa" strokeWidth="2.5" />

              </g>
            );
          })}
        </g>
        </g>

      </svg>

      {hoveredProvinceName ? (
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/70 bg-[rgba(255,255,255,0.88)] px-3 py-2 text-xs text-[#55687d] shadow-sm backdrop-blur">
          {hoveredProvinceName}
        </div>
      ) : null}

      {hoveredPoint ? (
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/70 bg-[rgba(255,255,255,0.88)] px-3 py-2 text-xs text-[#55687d] shadow-sm backdrop-blur">
          {hoveredPoint.label}
        </div>
      ) : null}

    </div>
  );
};

export default ChinaGeoMapV8;


