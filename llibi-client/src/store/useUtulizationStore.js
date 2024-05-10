import { create } from 'zustand'

export const useUtulizationStore = create(set => ({
  selectedUtil: [],
  setSelectedUtil: selectedUtil =>
    set(state => ({ selectedUtil: selectedUtil })),
}))
