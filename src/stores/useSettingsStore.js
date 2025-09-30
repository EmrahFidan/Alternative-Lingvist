import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '../constants';

const useSettingsStore = create(
  persist(
    (set, get) => ({
      targetGoal: APP_CONFIG.DEFAULT_TARGET_GOAL,
      currentProgress: 0,
      theme: 'default', // default, midnight, ocean, forest, purple
      language: 'en',
      soundEnabled: true,
      animationsEnabled: true,

      // Actions
      setTargetGoal: (goal) => {
        const validGoal = parseInt(goal, 10) || APP_CONFIG.DEFAULT_TARGET_GOAL;
        set({ targetGoal: validGoal, currentProgress: 0 });
      },

      incrementProgress: () => set((state) => ({
        currentProgress: state.currentProgress + 1
      })),

      resetProgress: () => set({ currentProgress: 0 }),

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),

      // Computed values
      getProgressPercentage: () => {
        const { currentProgress, targetGoal } = get();
        return targetGoal > 0 ? Math.round((currentProgress / targetGoal) * 100) : 0;
      },

      isGoalCompleted: () => {
        const { currentProgress, targetGoal } = get();
        return currentProgress >= targetGoal;
      }
    }),
    {
      name: APP_CONFIG.STORAGE_KEYS.SETTINGS,
    }
  )
);

export default useSettingsStore;
