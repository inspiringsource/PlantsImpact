import { useMemo, useState } from "react";
import { allTags, speciesList } from "../lib/species";
import type { AssetCategory, Species } from "../types";

const categoryOptions: Array<AssetCategory | "all"> = [
  "all",
  "tree",
  "plant",
  "flower",
];

function displayNumber(value?: number): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
    value,
  );
}

export default function SpeciesLibrary() {
  const [category, setCategory] = useState<AssetCategory | "all">("all");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(
    speciesList[0] ?? null,
  );

  const filtered = useMemo(() => {
    return speciesList.filter((species) => {
      const categoryMatch = category === "all" || species.category === category;
      const tagMatch = activeTag === "all" || species.tags.includes(activeTag);
      return categoryMatch && tagMatch;
    });
  }, [category, activeTag]);

  return (
    <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
      <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Browse species</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              className={`rounded-md px-3 py-2 text-sm ${
                category === option
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className={`rounded-full px-3 py-1 text-xs ${activeTag === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            all tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1 text-xs ${
                activeTag === tag
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {filtered.map((species) => (
            <li key={species.id}>
              <button
                type="button"
                onClick={() => setSelectedSpecies(species)}
                className={`w-full rounded-md border p-3 text-left ${
                  selectedSpecies?.id === species.id
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="font-medium text-slate-900">{species.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {species.category}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {selectedSpecies ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedSpecies.name}
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              {selectedSpecies.description}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              All coefficients are estimates for demo only.
            </p>

            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">CO2 kg/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(selectedSpecies.coefficients.co2_kg_per_year)}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">Cooling °C/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(
                    selectedSpecies.coefficients.cooling_c_per_year,
                  )}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">PM2.5 g/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(selectedSpecies.coefficients.pm25_g_per_year)}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">Stormwater L/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(
                    selectedSpecies.coefficients.stormwater_l_per_year,
                  )}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">Pollinator score/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(
                    selectedSpecies.coefficients.pollinator_score_per_year,
                  )}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <dt className="text-slate-500">Sleep score/year</dt>
                <dd className="font-medium text-slate-900">
                  {displayNumber(
                    selectedSpecies.coefficients.sleep_score_per_year,
                  )}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Pick a species to see details.
          </p>
        )}
      </section>
    </div>
  );
}
