import { create } from 'zustand';


export type AppState = {
	isLoading: boolean;
	errorMessage: string | null;
	setLoading: (value: boolean) => void;
	setError: (message: string | null) => void;
	reset: () => void;
};


export const useAppStore = create<AppState>((set) => ({
	isLoading: false,
	errorMessage: null,
	setLoading: (value) => set({ isLoading: value }),
	setError: (message) => set({ errorMessage: message }),
	reset: () => set({ isLoading: false, errorMessage: null })
}));


