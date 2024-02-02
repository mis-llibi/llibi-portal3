import { create } from 'zustand'

export const useClientRequestStore = create(set => ({
  isDependent: false,
  setIsDependent: params => set(state => ({ isDependent: params.isDependent })),
}))
