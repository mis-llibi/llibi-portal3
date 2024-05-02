import { create } from 'zustand'

export const useActionButtonDropdownStore = create(set => ({
  anchorEl: null,
  setAnchorEl: el => set(state => ({ anchorEl: el })),
}))
