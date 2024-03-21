import React, { useEffect, useState } from 'react'
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

export default function ApproveDeleteMember({
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
  } = useForm({ mode: 'onChange' })

  const submitForm = async data => {
    try {
      const response = await axios.patch(
        `/api/admin/approve-deletion/${row.id}`,
        data,
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
            Approve Delete Member
          </span>
        </DialogTitle>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogContent>
            <Box noValidate component="form" className="font-[poppins]">
              <div className="mb-3">
                <Label>Remarks</Label>
                <textarea
                  type="text"
                  className="w-full rounded-md"
                  rows={3}
                  {...register('remarks', { required: 'Remarks is required.' })}
                />
                <span className="text-red-600 text-xs">
                  {errors?.remarks?.message}
                </span>
              </div>
            </Box>
          </DialogContent>
          <DialogActions className="font-[poppins]">
            <button
              className={
                'border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md'
              }
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Approved'}
            </button>
            <button
              type="button"
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
