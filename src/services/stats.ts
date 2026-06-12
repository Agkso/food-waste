import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@food_waste_app:stats';

export interface ImpactStats {
  totalAdded: number;
  consumed: number;
  wasted: number;
}

const DEFAULT_STATS: ImpactStats = { totalAdded: 0, consumed: 0, wasted: 0 };

export async function loadStats(): Promise<ImpactStats> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

async function saveStats(stats: ImpactStats): Promise<ImpactStats> {
  await AsyncStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export async function recordItemAdded(): Promise<ImpactStats> {
  const stats = await loadStats();
  return saveStats({ ...stats, totalAdded: stats.totalAdded + 1 });
}

export async function recordItemRemoved(wasWasted: boolean): Promise<ImpactStats> {
  const stats = await loadStats();
  return saveStats({
    ...stats,
    consumed: stats.consumed + (wasWasted ? 0 : 1),
    wasted: stats.wasted + (wasWasted ? 1 : 0),
  });
}
