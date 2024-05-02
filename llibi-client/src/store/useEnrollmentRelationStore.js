import { create } from 'zustand'

export const useEnrollmentRelationStore = create(set => ({
  enrollmentRelation: null,
  setEnrollmentRelation: relation =>
    set(state => ({ enrollmentRelation: relation })),
}))
