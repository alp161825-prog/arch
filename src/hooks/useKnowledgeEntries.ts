import { useMemo } from "react";
import {
  buildKnowledgeDynasties,
  buildKnowledgeEntries,
  buildKnowledgeProvinces,
  knowledgeTopics,
  type KnowledgeEntry,
} from "@/data/knowledgeBaseV2";
import { useAtlasPoints } from "@/hooks/useAtlasPoints";

export const useKnowledgeEntries = () => {
  const { points, source, loading } = useAtlasPoints();

  const entries = useMemo<KnowledgeEntry[]>(() => buildKnowledgeEntries(points), [points]);
  const dynasties = useMemo(() => buildKnowledgeDynasties(entries), [entries]);
  const provinces = useMemo(() => buildKnowledgeProvinces(entries), [entries]);

  return {
    entries,
    dynasties,
    provinces,
    topics: knowledgeTopics,
    source,
    loading,
  };
};

