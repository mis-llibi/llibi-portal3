import React from 'react'
import moment from 'moment'

import Label from '@/components/Label'

import { BiTrashAlt } from 'react-icons/bi'

export default function DeleteMemberRemarks({ row }) {
  const dateNow = moment().format('Y-MM-DD')
  return (
    <div className="font-[poppins] px-3">
      <div className="mb-3">
        <Label htmlFor="effectivity_date" className="text-sm">
          Effectivity Date
        </Label>
        <input
          type="date"
          name="effectivity_date"
          id="effectivity_date"
          className="w-full rounded-md"
          defaultValue={dateNow}
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
          defaultValue={row.member_id}></textarea>
      </div>
      <div>
        <button className="bg-red-500 hover:bg-red-600 px-3 py-2 text-white rounded-md text-sm flex gap-1 items-center justify-center font-bold uppercase">
          <BiTrashAlt size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}
