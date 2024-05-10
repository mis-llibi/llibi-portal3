import { create } from 'zustand'

export const useLaboratoryStore = create(set => ({
  selectedLab: [],
  setSelectedLab: selectedLab => set(state => ({ selectedLab: selectedLab })),
}))
