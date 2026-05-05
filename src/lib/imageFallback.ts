import type { SyntheticEvent } from "react";
import defaultBuildingImage from "@/assets/buildings/suzhou-garden.jpg";

export const fallbackBuildingImage = defaultBuildingImage;

export const handleBuildingImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = fallbackBuildingImage;
};
