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

const DOCUMENT_LISTS = {
  bc: 'Birth certificate',
  mc: 'Marriage Certificate',
  ceno: 'CENOMAR',
  cocoha: 'Certificate of cohabitation (6 months)',
  dc: 'Death Certificate',
  divo: 'Legal Separation/ Annulment/ Divorce documents',
  coohic: 'Certificate of other health insurance coverage',
  cowea: 'Work Visa/ Certificate of work employment abroad ',
  oth: 'Others',
}

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const watchFields = watch()

  const submitForm = async data => {
    const payload = {}

    for (const [key, value] of Object.entries(DOCUMENT_LISTS)) {
      if (data[key]) {
        payload[key] = data[key]
      }

      if (data.oth) {
        payload['other_document'] = data.other_document
      }
    }

    payload['member_id'] = row.id

    try {
      const response = await axios.post(`/api/admin/pending-documents`, payload)
      // console.log(response.data)
      mutate()
      handleClose()
      Swal.fire('Success', 'Pending documents successfully sent', 'success')
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error')
    }
  }

  const handleClose = () => {
    setShowModal(false)
  }

  useEffect(() => {
    setValue('other_document', '')
  }, [watch('oth')])

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
              <table className="w-full text-xs md:text-base">
                <tbody>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.bc}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.bc}
                        {...register('bc')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.mc}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.mc}
                        {...register('mc')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.ceno}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.ceno}
                        {...register('ceno')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.cocoha}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.cocoha}
                        {...register('cocoha')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.coohic}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.coohic}
                        {...register('coohic')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.cowea}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.cowea}
                        {...register('cowea')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.dc}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.dc}
                        {...register('dc')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.divo}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.divo}
                        {...register('divo')}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 border border-gray-100 py-2">
                      {DOCUMENT_LISTS.oth}
                    </td>
                    <td className="border w-14 md:w-48 text-center">
                      <input
                        type="checkbox"
                        defaultValue={DOCUMENT_LISTS.oth}
                        {...register('oth')}
                      />
                    </td>
                  </tr>
                  {watch('oth') && (
                    <tr>
                      <td className="px-3 border border-gray-100 py-2">
                        Other Document
                      </td>
                      <td className="px-3 border border-gray-100 py-2">
                        <textarea
                          row={2}
                          className="border-gray-300 text-xs"
                          {...register('other_document')}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
