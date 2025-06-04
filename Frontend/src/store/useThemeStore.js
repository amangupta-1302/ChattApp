import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("app-theme") || 'black', // Default theme
    setTheme: (newTheme) => {
        localStorage.setItem("app-theme", newTheme);
        set({ theme: newTheme });
    }
}))