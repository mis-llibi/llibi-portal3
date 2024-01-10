import React from 'react'

import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

export default function DisplaySelectedUtilization({ utilization }) {
  return (
    <>
      <div className="mt-5 flex-1">
        <h4 className="uppercase font-semibold text-sm text-gray-900">
          Selected Laboratory
        </h4>
        <div className="flex flex-wrap gap-3">
          {utilization?.map(item => (
            <Chip className='flex-grow bg-blue-gray-50' key={item.id} label={`${item.diagname}`} variant="outlined" />
          ))}
        </div>
      </div>
    </>
  )
}
