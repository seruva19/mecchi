import { createWithEqualityFn } from 'zustand/traditional'
import toast, { Toaster } from 'react-hot-toast';

interface MecchiViewStore {
  paletteVisible: boolean;
  togglePalette: () => void;
  showPalette: () => void;
  hidePalette: () => void;
  saveWorkspace: () => void;
  loadWorkspace: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

export const useMecchiViewStore = createWithEqualityFn<MecchiViewStore>((set, get) => ({
  paletteVisible: true,
  togglePalette: () => set({ paletteVisible: !get().paletteVisible }),
  showPalette: () => set({ paletteVisible: true }),
  hidePalette: () => set({ paletteVisible: false }),

  saveWorkspace: () => {

  },
  loadWorkspace: () => {

  },
  success: (message: string) => toast.success(message, {
    duration: 4000,
    position: 'bottom-center',
    style: { fontSize: 12 },
  }),
  error: (message: string) => toast.error(message, {
    duration: 4000,
    position: 'bottom-center',
    style: { fontSize: 12 },
  })
}), Object.is)