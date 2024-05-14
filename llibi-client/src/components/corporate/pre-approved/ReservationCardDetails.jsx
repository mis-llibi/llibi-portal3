import React from 'react'

import {
  CiBank,
  CiUser,
  CiCircleList,
  CiBadgeDollar,
  CiSaveDown1,
} from 'react-icons/ci'

export default function ReservationCardDetails({
  state,
  remainingLimit,
  mbl,
  saveLogs,
}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

  return (
    <>
      <div className="flex flex-col gap-3 mb-3">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 rounded-md flex-wrap">
          <div className="flex-1 bg-gradient-to-tl from-blue-600 via-cyan-600 to-teal-600 p-3 rounded-md">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">MBL</h4>
              </div>
              <div>
                <CiBadgeDollar className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-xs">
                {formatter.format(mbl)}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-tl from-blue-600 via-cyan-600 to-teal-600 p-3 rounded-md">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Reservation</h4>
              </div>
              <div>
                <CiBadgeDollar className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-xs">
                {formatter.format(state.employee?.reserving_amount)}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-tl from-blue-600 via-cyan-600 to-teal-600 p-3 rounded-md">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Utilization</h4>
              </div>
              <div>
                <CiBadgeDollar className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-xs">
                {formatter.format(state.utilization)}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-tl from-blue-600 via-cyan-600 to-teal-600 p-3 rounded-md">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">
                  Laboratory Cost
                </h4>
              </div>
              <div>
                <CiBadgeDollar className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-xs">
                {formatter.format(state.laboratory)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 rounded-md flex-wrap"></div>
      </div>

      <div className="flex gap-3 rounded-md flex-wrap">
        <div className="flex-1 bg-gradient-to-tl from-green-600 via-green-800 to-green-900 p-3 rounded-md">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-white text-xs">Remaining Limit</h4>
            </div>
            <div>
              <CiBadgeDollar className="text-white text-3xl" />
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-xs">
              {formatter.format(remainingLimit || 0)}
            </span>
          </div>
        </div>
        <div className="flex-1 p-3 flex items-center">
          <button
            onClick={saveLogs}
            className="bg-blue-900 hover:bg-blue-800 text-white w-40 p-3 rounded-md hover:shadow-md uppercase font-bold text-xs">
            <div className="flex justify-center gap-3 items-center">
              Save Log
              <CiSaveDown1 className="text-2xl" />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
