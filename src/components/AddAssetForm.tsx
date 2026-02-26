import { useMemo, useState } from "react";
import { addAsset } from "../lib/storage";
import { speciesList } from "../lib/species";
import type { AssetCategory } from "../types";

const categories: AssetCategory[] = ["tree", "plant", "flower"];

export default function AddAssetForm() {
  const [category, setCategory] = useState<AssetCategory>("tree");
  const [search, setSearch] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [nickname, setNickname] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return speciesList.filter(
      (species) =>
        species.category === category &&
        (species.name.toLowerCase().includes(query) ||
          species.tags.some((tag) => tag.toLowerCase().includes(query))),
    );
  }, [category, search]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!speciesId) return;

    addAsset({
      speciesId,
      category,
      nickname,
      quantity: Math.max(1, quantity),
      notes: notes || undefined,
    });

    window.location.href = "/";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <div>
        <p className="mb-2 text-sm text-slate-600">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCategory(item);
                setSpeciesId("");
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                category === item
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-700">Search species</span>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Type name or tag"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-700">Species</span>
        <select
          value={speciesId}
          onChange={(event) => setSpeciesId(event.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Select a species</option>
          {filtered.map((species) => (
            <option key={species.id} value={species.id}>
              {species.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">Nickname (optional)</span>
          <input
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-700">Quantity</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value || 1)))
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-700">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <button
        type="submit"
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Add asset
      </button>
    </form>
  );
}
