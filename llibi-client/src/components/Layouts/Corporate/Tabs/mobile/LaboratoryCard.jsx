import React, { useState } from 'react'

export default function LaboratoryCard({ lab, handleSelectLaboratory }) {
  const [isChecked, setIsChecked] = useState(false)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

  const handleToggle = (e, lab) => {
    setIsChecked(!isChecked)

    if (!isChecked) {
      handleSelectLaboratory(true, lab)
    } else {
      handleSelectLaboratory(false, lab)
    }
  }

  return (
    <div
      onClick={e => handleToggle(e, lab)}
      key={lab.id}
      className={` shadow p-3 rounded-md w-full text-xs space-y-3 cursor-pointer ${
        isChecked ? 'bg-green-100' : 'bg-white'
      }`}>
      <div aria-disabled="true">
        <span className="text-gray-700 font-bold">
          {formatter.format(lab.cost)}
        </span>
      </div>
      <div>
        <span className="">{lab.laboratory}</span>
      </div>
    </div>
  )
}
