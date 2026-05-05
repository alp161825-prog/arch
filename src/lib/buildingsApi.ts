export type BuildingRecord = {
  id: string;
  label: string;
  longitude: number;
  latitude: number;
  regionId: string;
  dynasty: string;
  topic: string;
  heat: number;
  provinceCode: string;
  location: string;
  summary: string;
  image: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type BuildingQuery = {
  topic?: string;
  provinceCode?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

const buildQueryString = (query: BuildingQuery) => {
  const params = new URLSearchParams();
  if (query.topic) params.set("topic", query.topic);
  if (query.provinceCode) params.set("provinceCode", query.provinceCode);
  if (query.q) params.set("q", query.q);
  if (typeof query.limit === "number") params.set("limit", String(query.limit));
  if (typeof query.offset === "number") params.set("offset", String(query.offset));
  const str = params.toString();
  return str ? `?${str}` : "";
};

export const fetchBuildings = async (query: BuildingQuery = {}): Promise<BuildingRecord[]> => {
  const response = await fetch(`/api/buildings${buildQueryString(query)}`);
  if (!response.ok) {
    throw new Error(`Failed to load buildings: ${response.status}`);
  }
  const payload = await response.json();
  return Array.isArray(payload.items) ? payload.items : [];
};

export const createBuildingRecord = async (
  input: Omit<BuildingRecord, "createdAt" | "updatedAt">,
): Promise<BuildingRecord> => {
  const response = await fetch("/api/buildings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Failed to create building: ${response.status}`);
  }
  const payload = await response.json();
  return payload.item as BuildingRecord;
};

export const updateBuildingRecord = async (
  id: string,
  input: Partial<Omit<BuildingRecord, "id" | "createdAt" | "updatedAt">>,
): Promise<BuildingRecord> => {
  const response = await fetch(`/api/buildings/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Failed to update building: ${response.status}`);
  }
  const payload = await response.json();
  return payload.item as BuildingRecord;
};

export const deleteBuildingRecord = async (id: string): Promise<void> => {
  const response = await fetch(`/api/buildings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete building: ${response.status}`);
  }
};
