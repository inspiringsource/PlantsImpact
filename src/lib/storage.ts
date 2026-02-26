import type { UserAsset } from '../types';

const STORAGE_KEY = 'plantsimpact_v1_assets';
const LEGACY_STORAGE_KEY = 'treelens_v1_assets';
const STORAGE_VERSION = 1;

interface StoragePayloadV1 {
	version: number;
	assets: UserAsset[];
}

function canUseStorage(): boolean {
	return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeAssets(input: unknown): UserAsset[] {
	if (!Array.isArray(input)) return [];

	return input
		.filter((item): item is UserAsset => {
			if (!item || typeof item !== 'object') return false;
			const asset = item as Partial<UserAsset>;
			return Boolean(asset.id && asset.speciesId && asset.category && asset.addedAt);
		})
		.map((asset) => ({
			id: asset.id,
			speciesId: asset.speciesId,
			category: asset.category,
			nickname: asset.nickname ?? '',
			quantity: Math.max(1, Number(asset.quantity ?? 1)),
			addedAt: asset.addedAt,
			notes: asset.notes,
		}));
}

export function loadAssets(): UserAsset[] {
	if (!canUseStorage()) return [];

	const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw) as StoragePayloadV1 | UserAsset[];

		if (Array.isArray(parsed)) {
			const migratedAssets = normalizeAssets(parsed);
			saveAssets(migratedAssets);
			return migratedAssets;
		}

		if (parsed.version === STORAGE_VERSION && parsed.assets) {
			return normalizeAssets(parsed.assets);
		}

		return [];
	} catch {
		return [];
	}
}

export function saveAssets(assets: UserAsset[]): void {
	if (!canUseStorage()) return;

	const payload: StoragePayloadV1 = {
		version: STORAGE_VERSION,
		assets,
	};

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function addAsset(asset: Omit<UserAsset, 'id' | 'addedAt'>): UserAsset[] {
	const newAsset: UserAsset = {
		...asset,
		id: crypto.randomUUID(),
		addedAt: new Date().toISOString(),
	};

	const current = loadAssets();
	const next = [newAsset, ...current];
	saveAssets(next);
	return next;
}

export function updateAsset(id: string, patch: Partial<UserAsset>): UserAsset[] {
	const next = loadAssets().map((asset) => (asset.id === id ? { ...asset, ...patch, id: asset.id } : asset));
	saveAssets(next);
	return next;
}

export function removeAsset(id: string): UserAsset[] {
	const next = loadAssets().filter((asset) => asset.id !== id);
	saveAssets(next);
	return next;
}
