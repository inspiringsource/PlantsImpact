interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  equivalent: string;
}

export default function MetricCard({
  icon,
  label,
  value,
  unit,
  equivalent,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span aria-hidden="true" className="text-lg">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {value}{" "}
        <span className="text-base font-medium text-slate-500">{unit}</span>
      </p>
      <p className="mt-2 text-xs text-slate-500">{equivalent}</p>
    </article>
  );
}
