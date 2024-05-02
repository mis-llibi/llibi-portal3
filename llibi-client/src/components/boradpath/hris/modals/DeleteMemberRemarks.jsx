import React, { useState } from 'react'
import moment from 'moment'

import Label from '@/components/Label'

import { BiLoader, BiTrashAlt } from 'react-icons/bi'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'

export default function DeleteMemberRemarks({ row, mutate, setShow }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async data => {
    const formData = new FormData()

    formData.append('id', row.id)
    formData.append('pending_deleted_at', data.pending_deleted_at)
    formData.append('death_document', data.death_document[0])

    try {
      const response = await axios.post(
        `/api/members-enrollment/delete-members`,
        formData,
      )
      setShow(false)
      mutate()
    } catch (error) {
      console.error('Something went wrong.')
    }
  }

  const dateNow = moment().format('Y-MM-DD')

  return (
    <div className="font-[poppins] px-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Label htmlFor="pending_deleted_at" className="text-sm">
            Deletion Date
          </Label>
          <input
            type="date"
            name="pending_deleted_at"
            id="pending_deleted_at"
            className="w-full rounded-md"
            defaultValue={dateNow}
            {...register('pending_deleted_at')}
          />
        </div>
        <div className="mb-3">
          <Label className="flex gap-3 items-center">Death Documents</Label>
          <input
            type="file"
            className="file:bg-blue-600 file:border-none file:rounded-md text-xs file:text-white file:px-3 file:py-1 w-full"
            accept="image/*, application/pdf"
            {...register('death_document', {
              required: 'Death documents is required.',
              validate: {
                validPdf: value => {
                  const allowedTypes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                  ]
                  if (allowedTypes.includes(value[0]?.type)) {
                    return true
                  }
                  return 'Only PDF files, JPG and PNG images are allowed'
                },
              },
            })}
          />
          <p className="text-fav-red-light text-xs">
            {errors?.death_document?.message}
          </p>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="bg-fav-red-light hover:bg-fav-red-dark px-3 py-2 text-white rounded-md text-sm flex gap-1 items-center justify-center font-bold uppercase">
            {isSubmitting ? <BiLoader size={14} /> : <BiTrashAlt size={14} />}
            <span>Delete</span>
          </button>
        </div>
      </form>
    </div>
  )
}
