import { useEffect, useState } from "react";
import type { AtlasHeritagePoint } from "@/data/atlasHeritagePoints";
import type { TopicKey } from "@/data/siteContentV2";
import { fetchBuildings, type BuildingRecord } from "@/lib/buildingsApi";

type Options = {
  topic?: TopicKey;
  provinceCode?: string;
};

type AtlasDataSource = "database" | "database-unavailable";

const normalizeTopic = (topic: string): TopicKey => {
  if (topic === "residential" || topic === "government" || topic === "palace" || topic === "bridge") {
    return topic;
  }
  return "residential";
};

const toAtlasPoint = (item: BuildingRecord): AtlasHeritagePoint => ({
  id: item.id,
  label: item.label,
  longitude: Number(item.longitude),
  latitude: Number(item.latitude),
  regionId: item.regionId,
  dynasty: item.dynasty,
  topic: normalizeTopic(item.topic),
  heat: Number(item.heat ?? 0),
  provinceCode: item.provinceCode,
  location: item.location,
  summary: item.summary,
  image: item.image || "",
});

export const useAtlasPoints = (options: Options = {}) => {
  const [dbPoints, setDbPoints] = useState<AtlasHeritagePoint[]>([]);
  const [source, setSource] = useState<AtlasDataSource>("database-unavailable");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let disposed = false;
    setLoading(true);

    const load = async () => {
      try {
        const items = await fetchBuildings({
          topic: options.topic,
          provinceCode: options.provinceCode,
          limit: 2000,
        });
        if (disposed) return;
        setDbPoints(items.map(toAtlasPoint));
        setSource("database");
      } catch {
        if (disposed) return;
        setDbPoints([]);
        setSource("database-unavailable");
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    void load();
    return () => {
      disposed = true;
    };
  }, [options.provinceCode, options.topic]);

  return {
    points: dbPoints,
    source,
    loading,
  };
};
