import { create } from 'zustand'

export const useModalNotifyCaeStore = create(set => ({
  Mshow: false,
  Mbody: null,
  setModalToggle: () => set(state => ({ Mshow: !state.Mshow, Mbody: null })),
  setModalState: params => {
    console.log(params)
    set(state => ({
      Mshow: params.Mbody,
      Mbody: params.Mshow,
    }))
  },
}))
