import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Label from '@/components/Label'
import moment from 'moment'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export default function ApprovePendingMember({
  row,
  showModal,
  setShowModal,
  mutate,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const submitForm = async data => {
    try {
      const response = await axios.patch(
        `/api/admin/approve-members/${row.id}`,
        data,
      )
      // console.log(response.data)
      mutate()
      handleClose()
      Swal.fire('Success', response?.data?.message, 'success')
    } catch (error) {
      Swal.fire('Error', error?.response?.data?.message, 'error')
      handleClose()
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
            Approve Member
          </span>
        </DialogTitle>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogContent>
            <Box className="font-[poppins]">
              <div className="mb-3">
                <Label>Certificate No.</Label>
                <input
                  type="text"
                  className="w-full rounded-md"
                  {...register('certificate_no', {
                    required: 'Certificate No. is required.',
                  })}
                />
                <span className="text-red-600 text-xs">
                  {errors?.certificate_no?.message}
                </span>
              </div>
              {/* <div className="mb-3">
                <Label>Date Issue</Label>
                <input
                  type="date"
                  className="w-full rounded-md"
                  defaultValue={moment().format('Y-MM-DD')}
                  {...register('certificate_issued_at', {
                    required: 'Date Issue is required.',
                  })}
                />
                <span className="text-red-600 text-xs">
                  {errors?.certificate_issued_at?.message}
                </span>
              </div> */}
            </Box>
          </DialogContent>
          <DialogActions className="font-[poppins]">
            <button
              className="border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md"
              type="submit">
              Approved
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
