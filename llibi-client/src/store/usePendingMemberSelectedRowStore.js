import { create } from 'zustand'

export const usePendingMemberSelectedRowStore = create(set => ({
  selectedRowState: null,
  setSelectedRowState: row => set(state => ({ selectedRowState: row })),
}))
