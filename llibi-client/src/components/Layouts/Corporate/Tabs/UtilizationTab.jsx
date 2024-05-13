import { useUtulizationStore } from '@/store/useUtulizationStore'
import React from 'react'

export default function UtilizationTab({
  search,
  handleSearch,
  // handleSelectUtilizationAll,
  handleSelectUtilization,
  // selectedUtil,
}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

  const selectedUtil = useUtulizationStore(state => state.selectedUtil)

  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="rounded-md w-full"
          placeholder="Search"
          onChange={handleSearch}
        />
      </div>
      <div className="h-96 overflow-y-scroll">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {search?.map((util, i) => {
            return (
              <div key={util.id} className="border border-gray-300 rounded-md">
                <label className="cursor-pointer" htmlFor={`row-${util.id}`}>
                  <input
                    id={`row-${util.id}`}
                    checked={selectedUtil.some(row => row.id === util.id)}
                    onChange={e => handleSelectUtilization(e, util)}
                    type="checkbox"
                    className="hidden peer"
                  />
                  <div className="peer-checked:bg-blue-600 peer-checked:text-white p-3 rounded-md h-full relative">
                    <div className="font-thin text-xs min-h-12 flex gap-3">
                      <span className="uppercase w-20">Claim No.:</span>
                      <span className="text-right flex-1">
                        {util.claimnumb}
                      </span>
                    </div>
                    <div className="font-thin text-xs min-h-12 flex gap-3">
                      <span className="uppercase w-20">Claim Date:</span>
                      <span className="text-right flex-1">
                        {util.claimdate}
                      </span>
                    </div>
                    <div className="font-thin text-xs min-h-12 flex gap-3">
                      <span className="uppercase w-20">Claim Type:</span>
                      <span className="text-right flex-1">
                        {util.claimtype}
                      </span>
                    </div>
                    <div className="font-thin text-xs min-h-12 flex gap-3">
                      <span className="uppercase w-20">Diagnosis:</span>
                      <span className="text-right flex-1">{util.diagname}</span>
                    </div>
                    <div className="font-thin text-xs mb-5 min-h-12 flex gap-3">
                      <span className="uppercase w-20">Relation:</span>
                      <span className="text-right flex-1">
                        {util.relation === 'EMPLOYEE' ? 'E' : 'D'}
                      </span>
                    </div>
                    <span
                      className={`block font-bold text-xs absolute right-0 bottom-0 p-3`}>
                      {formatter.format(util.eligible)}
                    </span>
                  </div>
                </label>
              </div>
            )
          })}
        </div>

        {/* <table className="w-full text-xs">
          <thead>
            <tr className="uppercase bg-blue-600 text-white">
              <th className="py-3"></th>
              <th className="py-3">Claim #</th>
              <th className="py-3">Claim Date</th>
              <th className="py-3">Claim Type</th>
              <th className="py-3">Relation</th>
              <th className="py-3">Diagnosis</th>
              <th className="py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {search?.map((util, i) => {
              return (
                <tr key={util.id} className="even:bg-gray-100">
                  <td className="px-3 py-3 text-center">
                    <input
                      checked={selectedUtil.some(row => row.id === util.id)}
                      onChange={e => handleSelectUtilization(e, util)}
                      type="checkbox"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">{util.claimnumb}</td>
                  <td className="px-3 py-3 text-center">{util.claimdate}</td>
                  <td className="px-3 py-3 text-center">{util.claimtype}</td>
                  <td className="px-3 py-3 text-center">
                    {util.relation === 'EMPLOYEE' ? 'E' : 'D'}
                  </td>
                  <td>{util.diagname}</td>
                  <td className="px-3 py-3 text-right">
                    {formatter.format(util.eligible)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table> */}
      </div>
    </>
  )
}
