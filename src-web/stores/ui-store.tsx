import { createWithEqualityFn } from 'zustand/traditional'
import toast, { Toaster } from 'react-hot-toast';

interface MecchiUIStore {
  paletteVisible: boolean;
  togglePalette: () => void;
  showPalette: (show: boolean) => void;

  savedFlowsVisible: boolean;
  toggleSavedFlows: () => void;
  showSavedFlows: (show: boolean) => void;

  success: (message: string) => void;
  error: (message: string) => void;
}

export const useMecchiUIStore = createWithEqualityFn<MecchiUIStore>((set, get) => ({
  paletteVisible: true,
  togglePalette: () => set({ paletteVisible: !get().paletteVisible }),
  showPalette: show => set({ paletteVisible: show }),

  savedFlowsVisible: false,
  toggleSavedFlows: () => set({ savedFlowsVisible: !get().savedFlowsVisible }),
  showSavedFlows: show => set({ savedFlowsVisible: show }),

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