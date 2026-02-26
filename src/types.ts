export type AssetCategory = 'tree' | 'plant' | 'flower';

export interface SpeciesCoefficients {
	co2_kg_per_year: number;
	cooling_c_per_year?: number;
	pm25_g_per_year?: number;
	stormwater_l_per_year?: number;
	pollinator_score_per_year?: number;
	sleep_score_per_year?: number;
}

export interface Species {
	id: string;
	name: string;
	category: AssetCategory;
	description: string;
	tags: string[];
	coefficients: SpeciesCoefficients;
}

export interface UserAsset {
	id: string;
	speciesId: string;
	category: AssetCategory;
	nickname: string;
	quantity: number;
	addedAt: string;
	notes?: string;
}

export interface ComputedTotals {
	totalCo2Kg: number;
	totalCoolingC: number;
	totalPM25g: number;
	totalStormwaterL: number;
	totalPollinatorScore: number;
	totalSleepScore: number;
}
