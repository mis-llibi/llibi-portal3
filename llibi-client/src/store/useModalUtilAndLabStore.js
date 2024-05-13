import { create } from 'zustand'

export const MODAL_AVAILABLE = {
  viewSelected: 'view-selected',
  viewPolicy: 'view-policy',
  viewSpecialInstruction: 'view-special-instruction',
}

export const useModalUtilAndLabStore = create(set => ({
  showModal: false,
  setShowModal: setShowModal => set(state => ({ showModal: setShowModal })),
}))
