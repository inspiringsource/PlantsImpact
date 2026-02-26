import type { ComputedTotals } from "../types";

interface ImpactSummaryProps {
  totals: ComputedTotals;
  horizon: number;
}

function formatValue(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export default function ImpactSummary({ totals, horizon }: ImpactSummaryProps) {
  const progress = Math.min(100, (horizon / 20) * 100);
  const ringStyle = {
    background: `conic-gradient(rgb(16 185 129) ${progress}%, rgb(226 232 240) ${progress}% 100%)`,
  };
  const treeScale = 0.85 + (horizon / 20) * 0.45;

  return (
    <section className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm">
      <p className="text-xs uppercase tracking-wide text-emerald-300">
        Your impact
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-300">
            Estimated over {horizon} years
          </p>
          <p className="mt-1 text-3xl font-semibold">
            {formatValue(totals.totalCo2Kg)} kg
          </p>
          <p className="text-sm text-slate-300">CO₂ captured</p>
        </div>

        <div
          className="relative h-20 w-20 shrink-0 rounded-full p-1"
          style={ringStyle}
        >
          <div
            className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-2xl transition-transform duration-300"
            style={{ transform: `scale(${treeScale})` }}
          >
            🌳
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-white/10 px-3 py-2">
          <p className="text-slate-300">Stormwater</p>
          <p className="font-semibold text-white">
            {formatValue(totals.totalStormwaterL)} L
          </p>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-2">
          <p className="text-slate-300">Biodiversity</p>
          <p className="font-semibold text-white">
            {formatValue(totals.totalPollinatorScore)}
          </p>
        </div>
      </div>
    </section>
  );
}
