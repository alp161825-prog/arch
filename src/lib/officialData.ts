import { officialDataSources, type OfficialDataSource } from "@/data/officialDataSources";

export type OfficialSourceStatus = OfficialDataSource & {
  configured: boolean;
  mode: "catalog" | "proxy-ready";
  updatedAt: string;
};

export const fetchOfficialSourceStatus = async (): Promise<OfficialSourceStatus[]> => {
  try {
    const response = await fetch("/api/official/sources");
    if (!response.ok) {
      throw new Error(`Failed to load official sources: ${response.status}`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload.sources)) {
      throw new Error("Invalid official source payload");
    }

    return payload.sources as OfficialSourceStatus[];
  } catch {
    const now = new Date().toISOString();
    return officialDataSources.map(source => ({
      ...source,
      configured: false,
      mode: "catalog",
      updatedAt: now,
    }));
  }
};
