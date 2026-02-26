import rawSpecies from '../data/species.json';
import type { Species } from '../types';

export const speciesList = rawSpecies as Species[];

export const speciesById = speciesList.reduce<Record<string, Species>>((acc, species) => {
	acc[species.id] = species;
	return acc;
}, {});

export const allTags = Array.from(new Set(speciesList.flatMap((species) => species.tags))).sort();
