import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export default function ApproveChangeMemberPlan({
  row,
  showModal,
  setShowModal,
  mutate,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const submitForm = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/approve-change-plan/${row.id}`,
        { plan: row.change_plan_pending?.plan },
      )
      // console.log(response.data)
      mutate()
      handleClose()
      Swal.fire('Success', response?.data?.message, 'success')
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error')
    }
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={showModal}>
        <DialogTitle>
          <span className="font-[poppins] font-bold uppercase">
            Change Plan
          </span>
        </DialogTitle>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogContent>
            <Box className="font-[poppins] text-center">
              {/* <h1>{row?.plan}</h1> */}
              <p className="text-lg">
                {row.plan} ➜ {row.change_plan_pending?.plan}
              </p>
            </Box>
          </DialogContent>
          <DialogActions className="font-[poppins]">
            <button
              disabled={isSubmitting}
              type="submit"
              className="border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md">
              {isSubmitting ? 'Loading...' : 'Approved'}
            </button>
            <button
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
