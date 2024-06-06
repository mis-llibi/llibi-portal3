import { create } from 'zustand'

export const useActiveMemberSelectedRowStore = create(set => ({
  selectedRow: null,
  setSelectedRow: row => set(state => ({ selectedRow: row })),
}))
