import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { MecchiNode } from './nodes'
import { createWithEqualityFn } from 'zustand/traditional'
import { ToastContainer, toast } from 'react-toastify';

interface MecchiViewStore {
  paletteVisible: boolean;
  togglePalette: () => void;
  showPalette: () => void;
  hidePalette: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

export const useMecchiViewStore = createWithEqualityFn<MecchiViewStore>((set, get) => ({
  paletteVisible: true,
  togglePalette: () => set({ paletteVisible: !get().paletteVisible }),
  showPalette: () => set({ paletteVisible: true }),
  hidePalette: () => set({ paletteVisible: false }),

  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message)
}), Object.is)