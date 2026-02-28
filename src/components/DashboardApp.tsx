import { useMemo, useState } from "react";
import AddPlantSheet from "./AddPlantSheet";
import AssetsList from "./AssetsList";
import HorizonSelector from "./HorizonSelector";
import ImpactSummary from "./ImpactSummary";
import MetricCard from "./MetricCard";
import { computeTotals } from "../lib/calc";
import {
  equivalentForBiodiversity,
  equivalentForCo2,
  equivalentForCooling,
  equivalentForPm25,
} from "../lib/equivalents";
import { speciesById } from "../lib/species";
import { loadAssets } from "../lib/storage";
import type { UserAsset } from "../types";

function formatValue(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export default function DashboardApp() {
  const [assets, setAssets] = useState<UserAsset[]>(() => loadAssets());
  const [horizon, setHorizon] = useState<number>(2);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const totals = useMemo(
    () => computeTotals(assets, speciesById, horizon),
    [assets, horizon],
  );

  const cards = [
    {
      icon: "🌱",
      label: "CO₂",
      value: formatValue(totals.totalCo2Kg),
      unit: "kg",
      equivalent: equivalentForCo2(totals.totalCo2Kg),
    },
    {
      icon: "🌀",
      label: "Cooling",
      value: formatValue(totals.totalCoolingC, 2),
      unit: "proxy",
      equivalent: equivalentForCooling(),
    },
    {
      icon: "💨",
      label: "Air (PM2.5)",
      value: formatValue(totals.totalPM25g),
      unit: "g",
      equivalent: equivalentForPm25(totals.totalPM25g),
    },
    {
      icon: "🦋",
      label: "Biodiversity",
      value: formatValue(totals.totalPollinatorScore),
      unit: "score",
      equivalent: equivalentForBiodiversity(totals.totalPollinatorScore),
    },
  ];

  return (
    <div className="space-y-4">
      <ImpactSummary totals={totals} horizon={horizon} />

      <HorizonSelector horizon={horizon} onChange={setHorizon} />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Your plants
        </h2>
        <AssetsList assets={assets} onChange={setAssets} />
      </section>

      <button
        type="button"
        onClick={() => setIsSheetOpen(true)}
        className="fixed bottom-5 right-4 z-30 min-h-14 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Add plant"
      >
        + Add plant
      </button>

      <AddPlantSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAdded={setAssets}
      />
    </div>
  );
}
