import type { ComputedTotals, Species, UserAsset } from '../types';

export function computeTotals(
	assets: UserAsset[],
	speciesById: Record<string, Species>,
	horizonYears: number
): ComputedTotals {
	return assets.reduce<ComputedTotals>(
		(acc, asset) => {
			const species = speciesById[asset.speciesId];
			if (!species) return acc;

			const qty = Math.max(0, asset.quantity);
			const years = Math.max(0, horizonYears);
			const factor = qty * years;
			const c = species.coefficients;

			acc.totalCo2Kg += c.co2_kg_per_year * factor;
			acc.totalCoolingC += (c.cooling_c_per_year ?? 0) * factor;
			acc.totalPM25g += (c.pm25_g_per_year ?? 0) * factor;
			acc.totalStormwaterL += (c.stormwater_l_per_year ?? 0) * factor;
			acc.totalPollinatorScore += (c.pollinator_score_per_year ?? 0) * factor;
			acc.totalSleepScore += (c.sleep_score_per_year ?? 0) * factor;

			return acc;
		},
		{
			totalCo2Kg: 0,
			totalCoolingC: 0,
			totalPM25g: 0,
			totalStormwaterL: 0,
			totalPollinatorScore: 0,
			totalSleepScore: 0,
		}
	);
}
