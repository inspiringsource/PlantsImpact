import { useEffect, useRef, useState } from "react";
import { speciesById } from "../lib/species";

interface FakeCameraSheetProps {
  open: boolean;
  onClose: () => void;
  onSimulateScan: (speciesId: string) => void;
}

const detectedSpeciesId = "plant-peace-lily";

export default function FakeCameraSheet({
  open,
  onClose,
  onSimulateScan,
}: FakeCameraSheetProps) {
  const [isScanning, setIsScanning] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const detectedSpecies = speciesById[detectedSpeciesId];

  useEffect(() => {
    if (open) return;
    setIsScanning(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!open) return null;

  function handleSimulateScan() {
    setIsScanning(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsScanning(false);
      timeoutRef.current = null;
      onSimulateScan(detectedSpeciesId);
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-white">
      <section
        className="flex h-full flex-col px-4 pb-6 pt-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            className="min-h-10 rounded-full bg-white/10 px-4 text-sm text-white"
            onClick={onClose}
          >
            Close
          </button>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
            Demo camera
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.22),_transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.2),rgba(2,6,23,0.95))]">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]" />
          <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-300">
            <span>Plant detector</span>
            <span>Indoor mode</span>
          </div>

          <div className="absolute inset-x-6 top-24 rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-white">Align the plant in the frame</p>
            <p className="mt-1 text-sm text-slate-300">
              This MVP uses a simulated scan and suggests a likely match.
            </p>
          </div>

          <div className="absolute inset-x-8 top-1/2 h-72 -translate-y-1/2 rounded-[2rem] border-2 border-emerald-300/90 shadow-[0_0_0_999px_rgba(2,6,23,0.28)]">
            <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-300/80 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
            <div
              className={`absolute left-4 right-4 h-14 rounded-full bg-emerald-300/15 blur-xl transition-all duration-700 ${
                isScanning ? "top-[60%]" : "top-[20%]"
              }`}
            />
            <div className="absolute left-5 top-5 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-emerald-300" />
            <div className="absolute right-5 top-5 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-emerald-300" />
            <div className="absolute bottom-5 left-5 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-emerald-300" />
            <div className="absolute bottom-5 right-5 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-emerald-300" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Suggested after scan
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {detectedSpecies?.name ?? "Peace Lily"}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Helper text: use the button below to simulate detection and continue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="mt-4 min-h-12 rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-slate-950 disabled:opacity-70"
        >
          {isScanning ? "Scanning..." : "Simulate scan"}
        </button>
      </section>
    </div>
  );
}
