const CO2_KG_PER_KM = 0.2;

function compact(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export function pollinatorSupportLevel(score: number): "Low" | "Medium" | "High" {
  if (score < 2) return "Low";
  if (score <= 5) return "Medium";
  return "High";
}

export function equivalentForCo2(co2Kg: number): string {
  const km = co2Kg / CO2_KG_PER_KM;
  return `≈ driving ${compact(km)} km less by car`;
}

export function equivalentForPm25(pm25g: number): string {
  return `≈ ${compact(pm25g)} g of fine particulates avoided`;
}

export function equivalentForCooling(): string {
  return "Small but measurable local cooling effect";
}

export function equivalentForBiodiversity(score: number): string {
  return `Pollinator support: ${pollinatorSupportLevel(score)}`;
}

export function equivalentForSleep(): string {
  return "Proxy score only: better air quality and lower indoor CO₂ may support better sleep for some people";
}

export const EQUIVALENT_CONSTANTS = {
  CO2_KG_PER_KM,
};
