import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      targetGoal: 25,
      currentProgress: 0,
      setTargetGoal: (goal) => set({ targetGoal: parseInt(goal, 10) || 25, currentProgress: 0 }), // Hedef değişince ilerlemeyi sıfırla
      incrementProgress: () => set((state) => ({ currentProgress: state.currentProgress + 1 })),
      resetProgress: () => set({ currentProgress: 0 }),
    }),
    {
      name: 'linguist-app-settings', // localStorage için benzersiz isim
    }
  )
);

export default useSettingsStore;
