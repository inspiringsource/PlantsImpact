import type { ReactNode } from "react";

interface AddPlantMethodSheetProps {
  open: boolean;
  onClose: () => void;
  onSelectManual: () => void;
  onSelectCamera: () => void;
}

function MethodCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        {icon}
      </span>
      <span className="block">
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="mt-1 block text-sm text-slate-600">{description}</span>
      </span>
    </button>
  );
}

export default function AddPlantMethodSheet({
  open,
  onClose,
  onSelectManual,
  onSelectCamera,
}: AddPlantMethodSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close add plant method panel"
        className="absolute inset-0 bg-slate-900/45"
        onClick={onClose}
      />

      <section
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-300" />
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add plant</h2>
            <p className="mt-1 text-sm text-slate-600">
              Choose how you want to create a new entry.
            </p>
          </div>
          <button
            type="button"
            className="min-h-10 rounded-lg px-3 text-sm text-slate-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          <MethodCard
            title="Add manually"
            description="Search the demo species library and add the plant yourself."
            onClick={onSelectManual}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
          />
          <MethodCard
            title="Use camera"
            description="Open a fake scan screen and continue with a suggested species."
            onClick={onSelectCamera}
            icon={
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            }
          />
        </div>
      </section>
    </div>
  );
}
