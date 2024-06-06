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

const DOCUMENT_LISTS = [
  { title: 'Birth certificate' },
  { title: 'Marriage certificate' },
  { title: 'CENOMAR' },
  { title: 'Certificate of cohabitation (6 months)' },
  { title: 'Death Certificate' },
  { title: 'Legal Separation/ Annulment/ Divorce documents' },
  { title: 'Certificate of other health insurance coverage ' },
  { title: 'Work Visa/ Certificate of work employment abroad  ' },
  { title: 'Others' },
]

export default function PendingDocuments({
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

  const watchFields = watch()

  const submitForm = async data => {
    console.log(data)
    return
    try {
      const response = await axios.patch(
        `/api/admin/pending-documents/${row.id}`,
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
      <Dialog fullWidth maxWidth="md" open={showModal}>
        <DialogTitle>
          <span className="font-[poppins] font-bold uppercase">
            Pending Documents
          </span>
        </DialogTitle>
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogContent>
            <Box className="font-[poppins]">
              <div className="mb-3">
                <Label>Document Requirement</Label>
                {/* <input
                  type="date"
                  defaultValue={moment().format('Y-MM-DD')}
                  className="w-full rounded-md"
                  {...register('approved_deleted_member_at', {
                    required: 'Deletion Date is required.',
                  })}
                /> */}
                <select
                  name="pending_documents"
                  id="pending_documents"
                  className="w-full rounded-md"
                  {...register('pending_document', {
                    required: 'Document is required please select',
                  })}>
                  {DOCUMENT_LISTS.map(item => (
                    <option key={item.title} value={item.title.toUpperCase()}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <span className="text-red-600 text-xs">
                  {errors?.pending_document?.message}
                </span>
              </div>
              {watchFields.pending_document === 'OTHERS' && (
                <div className="mb-3">
                  <Label>Remarks</Label>
                  <textarea
                    type="text"
                    className="w-full rounded-md"
                    rows={3}
                    {...register('remarks', {
                      required:
                        watchFields.pending_document === 'OTHERS'
                          ? 'Remarks is required.'
                          : false,
                    })}
                  />
                  <span className="text-red-600 text-xs">
                    {errors?.remarks?.message}
                  </span>
                </div>
              )}
            </Box>
          </DialogContent>
          <DialogActions className="font-[poppins]">
            <button
              className={
                'border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md'
              }
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Submit'}
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
