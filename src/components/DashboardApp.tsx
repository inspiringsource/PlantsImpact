import { useMemo, useState } from "react";
import AddPlantSheet from "./AddPlantSheet";
import AddPlantMethodSheet from "./AddPlantMethodSheet";
import AssetsList from "./AssetsList";
import FakeCameraSheet from "./FakeCameraSheet";
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

const impactHorizons = [1, 2, 5, 10] as const;

function formatValue(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export default function DashboardApp() {
  const [assets, setAssets] = useState<UserAsset[]>(() => loadAssets());
  const [horizon, setHorizon] = useState<number>(2);
  const [isMethodSheetOpen, setIsMethodSheetOpen] = useState(false);
  const [isAddPlantSheetOpen, setIsAddPlantSheetOpen] = useState(false);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [prefilledSpeciesId, setPrefilledSpeciesId] = useState<string>();
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isLongTermImpactOpen, setIsLongTermImpactOpen] = useState(false);

  const totals = useMemo(
    () => computeTotals(assets, speciesById, horizon),
    [assets, horizon],
  );

  const longTermImpact = useMemo(
    () =>
      impactHorizons.map((year) => ({
        year,
        totals: computeTotals(assets, speciesById, year),
      })),
    [assets],
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

  const totalPlants = assets.reduce((sum, asset) => sum + asset.quantity, 0);

  function handleAdded(nextAssets: UserAsset[]) {
    const wasFirstPlant = assets.length === 0;
    setAssets(nextAssets);
    setMotivationMessage(
      wasFirstPlant
        ? "You added your first plant. Small actions, long-term effect."
        : "Nice! Your green impact is growing.",
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-lime-50 to-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Requirements Engineering MVP flow
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">
          Add a plant, see your estimated impact, stay motivated.
        </h2>
        <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-4">
          {["Add plant", "Your plants", "Long-term impact", "Motivation"].map(
            (step, index) => (
              <div
                key={step}
                className="rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-emerald-100"
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ),
          )}
        </div>
      </section>

      {motivationMessage ? (
        <section
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-sm"
          aria-live="polite"
        >
          {motivationMessage}
        </section>
      ) : null}

      <ImpactSummary totals={totals} horizon={horizon} />

      <HorizonSelector horizon={horizon} onChange={setHorizon} />

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Estimated impact
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Prototype values for the selected {horizon}-year horizon.
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            {totalPlants} {totalPlants === 1 ? "plant" : "plants"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-emerald-100">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Long-term impact
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Estimated long-term impact based on prototype values.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLongTermImpactOpen((open) => !open)}
            className="shrink-0 rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
            aria-expanded={isLongTermImpactOpen}
          >
            {isLongTermImpactOpen ? "Hide details" : "Show details"}
          </button>
        </div>

        {isLongTermImpactOpen ? (
          <div className="grid gap-3 sm:grid-cols-4">
            {longTermImpact.map(({ year, totals: yearTotals }) => (
              <article
                key={year}
                className={`rounded-2xl border p-3 ${
                  horizon === year
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">
                  {year} {year === 1 ? "year" : "years"}
                </p>
                <dl className="mt-3 space-y-2 text-xs text-slate-600">
                  <div>
                    <dt>CO₂ contribution</dt>
                    <dd className="font-semibold text-slate-950">
                      {formatValue(yearTotals.totalCo2Kg)} kg
                    </dd>
                  </div>
                  <div>
                    <dt>Air quality</dt>
                    <dd className="font-semibold text-slate-950">
                      {formatValue(yearTotals.totalPM25g)} g PM2.5
                    </dd>
                  </div>
                  <div>
                    <dt>Biodiversity</dt>
                    <dd className="font-semibold text-slate-950">
                      {formatValue(yearTotals.totalPollinatorScore)} score
                    </dd>
                  </div>
                  <div>
                    <dt>Well-being</dt>
                    <dd className="font-semibold text-slate-950">
                      {formatValue(yearTotals.totalSleepScore)} score
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Your plants
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Your personal plant list is stored locally on this device.
            </p>
          </div>
        </div>
        <AssetsList assets={assets} onChange={setAssets} />
      </section>

      <section className="grid gap-3 pb-24 sm:grid-cols-2">
        <a
          href="/friends"
          className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-950">Friends</p>
          <p className="mt-1 text-sm text-slate-600">
            Keep social motivation visible in the MVP prototype.
          </p>
        </a>
        <a
          href="/leaderboard"
          className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-slate-950">Leaderboard</p>
          <p className="mt-1 text-sm text-slate-600">
            Optional comparison for students who like progress rankings.
          </p>
        </a>
      </section>

      <button
        type="button"
        onClick={() => setIsMethodSheetOpen(true)}
        className="fixed bottom-5 left-1/2 z-30 min-h-14 -translate-x-1/2 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Add plant"
      >
        + Add plant
      </button>

      <AddPlantMethodSheet
        open={isMethodSheetOpen}
        onClose={() => setIsMethodSheetOpen(false)}
        onSelectManual={() => {
          setPrefilledSpeciesId(undefined);
          setIsMethodSheetOpen(false);
          setIsAddPlantSheetOpen(true);
        }}
        onSelectCamera={() => {
          setIsMethodSheetOpen(false);
          setIsCameraSheetOpen(true);
        }}
      />

      <FakeCameraSheet
        open={isCameraSheetOpen}
        onClose={() => setIsCameraSheetOpen(false)}
        onSimulateScan={(speciesId) => {
          setPrefilledSpeciesId(speciesId);
          setIsCameraSheetOpen(false);
          setIsAddPlantSheetOpen(true);
        }}
      />

      <AddPlantSheet
        open={isAddPlantSheetOpen}
        onClose={() => {
          setIsAddPlantSheetOpen(false);
          setPrefilledSpeciesId(undefined);
        }}
        onAdded={handleAdded}
        initialSpeciesId={prefilledSpeciesId}
      />
    </div>
  );
}
