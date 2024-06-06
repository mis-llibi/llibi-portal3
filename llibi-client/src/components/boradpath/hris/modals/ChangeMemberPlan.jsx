import React, { useState } from 'react'
import moment from 'moment'

import Label from '@/components/Label'

import { BiLoader, BiPencil, BiSave, BiTrashAlt } from 'react-icons/bi'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import { useActiveMemberSelectedRowStore } from '@/store/useActiveMemberSelectedRowStore'

export default function ChangeMemberPlan({ mutate, setShow }) {
  const selectedRow = useActiveMemberSelectedRowStore(
    state => state.selectedRow,
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async data => {
    try {
      const response = await axios.patch(
        `/api/members-enrollment/change-plan/${selectedRow?.id}`,
        data,
      )
      setShow(false)
      mutate()
    } catch (error) {
      console.error('Something went wrong.')
    }
  }

  return (
    <div className="font-[poppins] px-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Label htmlFor="change_plan_at" className="text-sm">
            Effectivity Date
          </Label>
          <input
            type="date"
            name="change_plan_at"
            id="change_plan_at"
            className="w-full rounded-md"
            defaultValue={moment().format('Y-MM-DD')}
            {...register('change_plan_at')}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="plan" className="text-sm">
            Plan
          </Label>
          <select
            name="plan"
            id="plan"
            className="w-full rounded-md"
            {...register('plan')}
            defaultValue={selectedRow?.plan}>
            <option value="">Select Plan</option>
            {selectedRow?.plan === 'SUPERVISOR' && (
              <option value="RANK AND FILE">Rank and file</option>
            )}
            {selectedRow?.plan === 'RANK AND FILE' && (
              <option value="SUPERVISOR">Supervisor</option>
            )}

            {!selectedRow?.plan && (
              <>
                <option value="RANK AND FILE">Rank and file</option>
                <option value="SUPERVISOR">Supervisor</option>
              </>
            )}
          </select>
        </div>
        <div className="mb-3">
          <Label htmlFor="remarks" className="text-sm">
            Reason
          </Label>
          <textarea
            id="remarks"
            className="w-full rounded-md"
            {...register('remarks', {
              required: 'Reason is required.',
            })}
          />
          <p className="text-red-600 text-xs">{errors?.remarks?.message}</p>
        </div>
        <div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white rounded-md text-xs flex gap-1 items-center justify-center font-bold uppercase">
            {isSubmitting ? 'Loading...' : 'Submit'}
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  )
}
