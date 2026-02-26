import { useState } from "react";
import { speciesById } from "../lib/species";
import { removeAsset, updateAsset } from "../lib/storage";
import type { UserAsset } from "../types";

interface AssetsListProps {
  assets: UserAsset[];
  onChange: (assets: UserAsset[]) => void;
}

export default function AssetsList({ assets, onChange }: AssetsListProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftNickname, setDraftNickname] = useState("");
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [draftNotes, setDraftNotes] = useState("");

  function startEdit(asset: UserAsset) {
    setEditingId(asset.id);
    setDraftNickname(asset.nickname);
    setDraftQuantity(asset.quantity);
    setDraftNotes(asset.notes ?? "");
    setActiveMenuId(null);
  }

  function submitEdit(assetId: string) {
    onChange(
      updateAsset(assetId, {
        nickname: draftNickname,
        quantity: Math.max(1, draftQuantity),
        notes: draftNotes || undefined,
      }),
    );
    setEditingId(null);
  }

  if (assets.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
        No plants tracked yet. Tap “+ Add plant” to start your impact journey.
      </section>
    );
  }

  return (
    <section className="space-y-3 pb-24">
      {assets.map((asset) => {
        const species = speciesById[asset.speciesId];
        if (!species) return null;

        const name = asset.nickname || species.name;
        const isEditing = editingId === asset.id;

        return (
          <article
            key={asset.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {species.name} · Qty {asset.quantity}
                </p>
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="min-h-10 min-w-10 rounded-lg bg-slate-100 text-lg text-slate-700"
                  onClick={() =>
                    setActiveMenuId((prev) =>
                      prev === asset.id ? null : asset.id,
                    )
                  }
                  aria-label={`Open actions for ${name}`}
                >
                  ⋯
                </button>

                {activeMenuId === asset.id && (
                  <div className="absolute right-0 z-10 mt-1 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => startEdit(asset)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                      onClick={() => {
                        onChange(removeAsset(asset.id));
                        setActiveMenuId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Nickname</span>
                  <input
                    value={draftNickname}
                    onChange={(event) => setDraftNickname(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
                  />
                </label>

                <div>
                  <p className="mb-1 text-sm text-slate-600">Quantity</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="min-h-11 min-w-11 rounded-lg bg-slate-200 text-lg"
                      onClick={() =>
                        setDraftQuantity((prev) => Math.max(1, prev - 1))
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="min-w-12 text-center text-lg font-semibold text-slate-900">
                      {draftQuantity}
                    </div>
                    <button
                      type="button"
                      className="min-h-11 min-w-11 rounded-lg bg-slate-200 text-lg"
                      onClick={() => setDraftQuantity((prev) => prev + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Notes</span>
                  <input
                    value={draftNotes}
                    onChange={(event) => setDraftNotes(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white"
                    onClick={() => submitEdit(asset.id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-slate-200 px-4 text-sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
