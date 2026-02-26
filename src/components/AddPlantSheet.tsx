import { useMemo, useState } from "react";
import { speciesList } from "../lib/species";
import { addAsset } from "../lib/storage";
import type { AssetCategory, UserAsset } from "../types";

interface AddPlantSheetProps {
  open: boolean;
  onClose: () => void;
  onAdded: (assets: UserAsset[]) => void;
}

const categories: Array<AssetCategory | "all"> = [
  "all",
  "tree",
  "plant",
  "flower",
];

export default function AddPlantSheet({
  open,
  onClose,
  onAdded,
}: AddPlantSheetProps) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AssetCategory | "all">("all");
  const [speciesId, setSpeciesId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [nickname, setNickname] = useState("");
  const [notes, setNotes] = useState("");

  const filteredSpecies = useMemo(() => {
    const query = search.toLowerCase();
    return speciesList.filter((species) => {
      const categoryMatch = category === "all" || species.category === category;
      const queryMatch =
        species.name.toLowerCase().includes(query) ||
        species.tags.some((tag) => tag.toLowerCase().includes(query));
      return categoryMatch && queryMatch;
    });
  }, [search, category]);

  const selectedSpecies = speciesList.find(
    (species) => species.id === speciesId,
  );

  function resetForm() {
    setStep(1);
    setSearch("");
    setCategory("all");
    setSpeciesId("");
    setQuantity(1);
    setNickname("");
    setNotes("");
  }

  function closeSheet() {
    resetForm();
    onClose();
  }

  function saveAsset() {
    if (!selectedSpecies) return;

    const nextAssets = addAsset({
      speciesId: selectedSpecies.id,
      category: selectedSpecies.category,
      quantity: Math.max(1, quantity),
      nickname,
      notes: notes || undefined,
    });

    onAdded(nextAssets);
    closeSheet();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close add plant panel"
        className="absolute inset-0 bg-slate-900/45"
        onClick={closeSheet}
      />

      <section
        className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-300" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add plant</h2>
          <button
            type="button"
            className="min-h-10 rounded-lg px-3 text-sm text-slate-600"
            onClick={closeSheet}
          >
            Close
          </button>
        </div>

        <p className="mb-4 text-xs uppercase tracking-wide text-slate-500">
          Step {step} of 3
        </p>

        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">
                Find from library
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-300 px-3"
                placeholder="Search by species or tag"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`min-h-10 rounded-lg px-3 text-sm capitalize ${
                    category === item
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto">
              {filteredSpecies.map((species) => (
                <button
                  key={species.id}
                  type="button"
                  className={`w-full rounded-xl border p-3 text-left ${
                    speciesId === species.id
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                  onClick={() => setSpeciesId(species.id)}
                >
                  <p className="font-medium text-slate-900">{species.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {species.category}
                  </p>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="min-h-11 w-full rounded-xl bg-emerald-600 text-sm font-medium text-white disabled:opacity-50"
              disabled={!speciesId}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
              Selected:{" "}
              <span className="font-medium">{selectedSpecies?.name}</span>
            </p>
            <div>
              <p className="mb-1 text-sm text-slate-600">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="min-h-12 min-w-12 rounded-xl bg-slate-200 text-xl"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  −
                </button>
                <div className="min-w-12 text-center text-2xl font-semibold text-slate-900">
                  {quantity}
                </div>
                <button
                  type="button"
                  className="min-h-12 min-w-12 rounded-xl bg-slate-200 text-xl"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="min-h-11 rounded-xl bg-slate-200 text-sm"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl bg-emerald-600 text-sm font-medium text-white"
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <details className="rounded-xl border border-slate-200 p-3">
              <summary className="cursor-pointer text-sm font-medium text-slate-700">
                Advanced (optional)
              </summary>
              <div className="mt-3 space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Nickname</span>
                  <input
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Notes</span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
              </div>
            </details>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="min-h-11 rounded-xl bg-slate-200 text-sm"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl bg-emerald-600 text-sm font-medium text-white"
                onClick={saveAsset}
              >
                Save plant
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
