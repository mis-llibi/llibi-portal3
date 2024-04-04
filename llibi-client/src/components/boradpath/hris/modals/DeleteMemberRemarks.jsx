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
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async data => {
    setIsLoading(true)
    const formData = { ...data, id: row.id }

    try {
      const response = await axios.patch(
        `/api/members-enrollment/delete-members/${row.id}`,
        data,
      )
      setIsLoading(false)
      setShow(false)
      mutate()
    } catch (error) {
      console.error('Something went wrong.')
      setIsLoading(false)
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
          <Label htmlFor="remarks" className="text-sm">
            Remarks
          </Label>
          <textarea
            name="remarks"
            id="remarks"
            rows="2"
            className="w-full rounded-md"
            {...register('deleted_remarks')}></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white rounded-md text-sm flex gap-1 items-center justify-center font-bold uppercase">
            {isLoading ? <BiLoader size={14} /> : <BiTrashAlt size={14} />}
            <span>Delete</span>
          </button>
        </div>
      </form>
    </div>
  )
}
