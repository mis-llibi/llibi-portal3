import React from 'react'

import { FaEye, FaFileContract, FaInfo } from 'react-icons/fa'

import {
  MODAL_AVAILABLE,
  useModalUtilAndLabStore,
} from '@/store/useModalUtilAndLabStore'

export default function HeaderTabButton({ state }) {
  const { setShowModal } = useModalUtilAndLabStore()
  const handleShowModal = modalToShow => {
    setShowModal(modalToShow)
  }

  const handleViewPolicy = () => {
    const policyPath = `${
      process.env.llibiDigitalOceanSpaces
    }/pre-approved-loa/policy/${
      state?.employee?.companies?.code
    }/${encodeURIComponent(state?.employee?.companies?.name)}-2024-2025.pdf`

    window.open(policyPath)
  }

  return (
    <div className="w-full flex justify-end items-center gap-1">
      <button
        onClick={() => handleShowModal(MODAL_AVAILABLE.viewSelected)}
        className="border h-8  px-2 rounded-md bg-blue-600"
        title="View selected util & lab">
        <FaEye size={16} className=" text-white" />
        <span className="sr-only">View Selected Util & Lab</span>
      </button>
      <button
        onClick={() => handleShowModal(MODAL_AVAILABLE.viewSpecialInstruction)}
        className="border h-8 px-2 rounded-md bg-blue-400"
        title="Special instruction">
        <FaInfo size={16} className="text-white" />
        <span className="sr-only">Special Instruction</span>
      </button>
      <button
        onClick={handleViewPolicy}
        className="border h-8 px-2 rounded-md bg-green-600"
        title="View policy">
        <FaFileContract size={16} className="text-white" />
        <span className="sr-only">View Policy</span>
      </button>
    </div>
  )
}
