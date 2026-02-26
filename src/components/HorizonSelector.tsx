const horizons = [2, 5, 10, 20] as const;

interface HorizonSelectorProps {
  horizon: number;
  onChange: (value: number) => void;
}

export default function HorizonSelector({
  horizon,
  onChange,
}: HorizonSelectorProps) {
  return (
    <section className="sticky top-2 z-20 rounded-2xl bg-white/95 p-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
      <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        Projection horizon
      </p>
      <div className="grid grid-cols-4 gap-2">
        {horizons.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => onChange(year)}
            className={`min-h-11 rounded-xl px-2 text-sm font-medium transition ${
              horizon === year
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            aria-label={`Set horizon to ${year} years`}
          >
            {year}y
          </button>
        ))}
      </div>
    </section>
  );
}
