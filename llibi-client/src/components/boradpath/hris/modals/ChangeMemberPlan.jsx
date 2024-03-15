import React, { useState } from 'react'
import moment from 'moment'

import Label from '@/components/Label'

import { BiLoader, BiPencil, BiSave, BiTrashAlt } from 'react-icons/bi'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'

export default function ChangeMemberPlan({ row, mutate, setShow }) {
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
        `/api/members-enrollment/change-plan/${row.id}`,
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

  return (
    <div className="font-[poppins] px-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Label htmlFor="remarks" className="text-sm">
            Plan
          </Label>
          <select
            name="plan"
            id="plan"
            className="w-full rounded-md"
            {...register('plan')}
            defaultValue={row.plan}>
            <option value="">Select Plan</option>
            <option value="RANK AND FILE">Rank and file</option>
            <option value="SUPERVISOR">Supervisor</option>
          </select>
        </div>
        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white rounded-md text-sm flex gap-1 items-center justify-center font-bold uppercase">
            {isLoading ? <BiLoader size={14} /> : <BiSave size={14} />}
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  )
}
