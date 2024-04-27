import { create } from 'zustand'

export const useErrorLogsStore = create(set => ({
  errorLogs: null,
  setErrorLogs: errorData => set(state => ({ errorLogs: errorData })),
}))
