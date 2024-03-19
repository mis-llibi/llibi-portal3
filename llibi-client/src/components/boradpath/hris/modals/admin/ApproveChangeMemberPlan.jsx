import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'

export default function ApproveChangeMemberPlan({
  row,
  showModal,
  setShowModal,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const submitForm = async data => {
    console.log(data)
  }

  const handleClose = () => {
    setShowModal(false)
  }
  
  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={showModal}>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle>
            <span className="font-[poppins] font-bold uppercase">
              Change Plan
            </span>
          </DialogTitle>
          <DialogContent>
            <Box
              noValidate
              component="form"
              className="font-[poppins] text-center">
              {/* <h1>{row?.plan}</h1> */}
              <p className="text-lg">RANK AND FILE ➜ SUPERVISOR</p>
            </Box>
          </DialogContent>
          <DialogActions className="font-[poppins]">
            <button
              className="border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md"
              onClick={handleClose}>
              Approved
            </button>
            <button
              type="submit"
              className="border px-3 py-2 text-xs uppercase font-semibold rounded-md"
              onClick={handleClose}>
              Close
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
