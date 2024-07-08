import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Label from '@/components/Label'
import moment from 'moment'

import { TextField } from '@radix-ui/themes'
import Datepicker from 'react-tailwindcss-datepicker'

import { useForm } from 'react-hook-form'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { usePendingMemberSelectedRowStore } from '@/store/usePendingMemberSelectedRowStore'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const FORM_SCHEMA = z.object({
  last_name: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
  email: z.string(),
})

export default function ApproveEditInformation({
  showModal,
  mutate,
  setShowModal,
}) {
  const {
    selectedRowState,
    setSelectedRowState,
  } = usePendingMemberSelectedRowStore()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({ mode: 'onChange', resolver: zodResolver(FORM_SCHEMA) })

  const [value, setValue] = useState({
    startDate: moment(selectedRowState?.correction?.birth_date).format(
      'Y-MM-DD',
    ),
    endDate: moment(selectedRowState?.correction?.birth_date).format('Y-MM-DD'),
  })

  const handleValueChange = newValue => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  const submitForm = async data => {
    try {
      const response = await axios.patch(
        `/api/admin/approve-edit-information/${selectedRowState.id}`,
        { ...data, birth_date: value.startDate },
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

  // console.log(selectedRowState)

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={showModal}>
        <DialogTitle>
          <span className="font-[poppins] font-bold uppercase">
            Approve Edit Information
          </span>
        </DialogTitle>
        {/* <DialogContent> */}
        <div className="font-[poppins] w-full px-3">
          <form>
            <div className="font-[poppins]">
              <div className="mb-3">
                <label htmlFor="" className="font-bold text-sm">
                  Last Name
                </label>
                <input
                  className="border border-gray-400 p-1 focus:outline-none rounded-md w-full"
                  readOnly
                  size="2"
                  defaultValue={selectedRowState?.last_name}
                  {...register('last_name')}
                />
                <p className="text-xs text-red-600">
                  {errors?.last_name?.message}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="font-bold text-sm">
                  First Name
                </label>
                <input
                  className="border border-gray-400 p-1 focus:outline-none rounded-md w-full"
                  readOnly
                  size="2"
                  defaultValue={selectedRowState?.first_name}
                  {...register('first_name')}
                />
                <p className="text-xs text-red-600">
                  {errors?.first_name?.message}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="font-bold text-sm">
                  Middle Name <span className="text-xs">(optional)</span>
                </label>
                <input
                  className="border border-gray-400 p-1 focus:outline-none rounded-md w-full"
                  readOnly
                  size="2"
                  defaultValue={selectedRowState?.middle_name}
                  {...register('middle_name')}
                />
                <p className="text-xs text-red-600">
                  {errors?.middle_name?.message}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="font-bold text-sm">
                  Birth Date
                </label>
                <Datepicker
                  useRange={false}
                  readOnly
                  inputClassName="w-full rounded-md border border-gray-400 text-xs text-fav-black"
                  value={value}
                  onChange={handleValueChange}
                  asSingle
                  // showShortcuts={true}
                  // showFooter={true}
                  disabled
                  popoverDirection="down"
                />
                <p className="text-xs text-red-600">
                  {!value.startDate && 'Birth Date is required'}
                </p>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="font-bold text-sm">
                  Email
                </label>
                <input
                  className="border border-gray-400 p-1 focus:outline-none rounded-md w-full"
                  readOnly
                  size="2"
                  defaultValue={selectedRowState?.contact_correction?.email}
                  {...register('email')}
                />
                <p className="text-xs text-red-600">{errors?.email?.message}</p>
              </div>
            </div>
          </form>
        </div>
        {/* </DialogContent> */}
        <DialogActions className="font-[poppins]">
          <div className="font-[poppins] flex gap-1">
            <button
              onClick={handleSubmit(data => submitForm(data))}
              disabled={isSubmitting}
              className="border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md">
              {isSubmitting ? 'Loading...' : 'Submit'}
            </button>
            <button
              onClick={handleClose}
              className="border px-3 py-2 text-xs uppercase font-semibold text-gray-600 rounded-md">
              Cancel
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}
