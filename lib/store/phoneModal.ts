import { create } from 'zustand'

interface PhoneModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const usePhoneModal = create<PhoneModalState>()((set) => ({
  isOpen: false,

  openModal: () => {
    set({ isOpen: true })
  },

  closeModal: () => {
    set({ isOpen: false })
  },
}))
