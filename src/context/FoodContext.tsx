import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FoodItem } from '@/types';
import { loadItems, saveItems } from '@/services/storage';
import {
  cancelExpirationNotification,
  scheduleExpirationNotification,
  syncExpirationNotifications,
} from '@/services/notifications';
import { ImpactStats, loadStats, recordItemAdded, recordItemRemoved } from '@/services/stats';
import { getStatus } from '@/utils/dates';

interface Ctx {
  items: FoodItem[];
  addItem: (item: FoodItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, patch: Partial<FoodItem>) => Promise<void>;
  loading: boolean;
  stats: ImpactStats;
}

const FoodContext = createContext<Ctx | null>(null);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ImpactStats>({ totalAdded: 0, consumed: 0, wasted: 0 });

  useEffect(() => {
    loadItems().then((list) => {
      setItems(list);
      setLoading(false);
      syncExpirationNotifications(list);
    });
    loadStats().then(setStats);
  }, []);

  const persist = useCallback(async (next: FoodItem[]) => {
    setItems(next);
    await saveItems(next);
  }, []);

  const addItem = useCallback(
    async (item: FoodItem) => {
      await persist([item, ...items]);
      await scheduleExpirationNotification(item);
      setStats(await recordItemAdded());
    },
    [items, persist],
  );
  const removeItem = useCallback(
    async (id: string) => {
      const removed = items.find((i) => i.id === id);
      await persist(items.filter((i) => i.id !== id));
      await cancelExpirationNotification(id);
      if (removed) {
        const wasted = getStatus(removed.expirationDate) === 'expired';
        setStats(await recordItemRemoved(wasted));
      }
    },
    [items, persist],
  );
  const updateItem = useCallback(
    async (id: string, patch: Partial<FoodItem>) => {
      const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
      await persist(next);
      const updated = next.find((i) => i.id === id);
      if (updated) await scheduleExpirationNotification(updated);
    },
    [items, persist],
  );

  return (
    <FoodContext.Provider value={{ items, addItem, removeItem, updateItem, loading, stats }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error('useFood must be used within FoodProvider');
  return ctx;
};
