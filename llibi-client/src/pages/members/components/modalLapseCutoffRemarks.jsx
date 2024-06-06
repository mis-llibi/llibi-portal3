import React, { useState } from 'react'

import Label from '@/components/Label'

export default function ModalLapseCutoffRemarks({
  data,
  create,
  setLoading,
  setShow,
  reset,
}) {
  const [lapseRemarks, setLapseRemarks] = useState()

  const submit = async => {
    setLoading(true)

    const payload = { ...data, lapseRemarks: lapseRemarks }
    // console.log(payload)
    create({ ...payload, setLoading, setShow, reset })
  }

  return (
    <div className="px-3">
      <div className="mb-3 font-bold text-gray-700">
        Effective date of the enrollee would be based on standard cut-off from
        the confirmation date. Shown below is the definition of standard
        cut-off:
      </div>
      <div className="mb-3 text-gray-700">
        <span className="font-bold">(1)</span> Confirmation received and
        approved between 1st and 15th day of the month, effectivity of coverage
        shall be the 1st day of the following month;
      </div>
      <div className="mb-3 text-gray-700">
        <span className="font-bold">(2)</span> Confirmation received and
        approved between 16th and 30th/31st day of the month, effectivity of
        coverage shall be the 16th of the following month.
      </div>
      <div>
        <Label htmlFor="reasonForLateEnollment">
          Reason for late enrollment
        </Label>
        <textarea
          id="reasonForLateEnollment"
          onChange={e => setLapseRemarks(e.target.value)}
          className={
            'mt-1 w-full rounded-md bg-gray-50 text-gray-900 border-gray-300 focus:outline-blue-500'
          }></textarea>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 border focus:border-blue-900 inline-flex items-center px-4 py-2 border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring ring-white disabled:opacity-25 transition ease-in-out duration-150"
        onClick={submit}>
        Proceed
      </button>
    </div>
  )
}
