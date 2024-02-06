import React from 'react'

export default function UtilizationTab({
  search,
  handleSearch,
  handleSelectUtilizationAll,
  handleSelectUtilization,
  selectedUtil,
}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

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
      <div className="h-96 overflow-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="uppercase bg-blue-50">
              <th className='py-3'>Claim #</th>
              <th className='py-3'>Claim Date</th>
              <th className='py-3'>Claim Type</th>
              <th className='py-3'>Relation</th>
              <th className='py-3'>Diagnosis</th>
              <th className='py-3'>Amount</th>
              <th>
                {/* <input
                onChange={e => handleSelectUtilizationAll(e)}
                type="checkbox"
              /> */}
              </th>
            </tr>
          </thead>
          <tbody className='text-xs'>
            {search?.map((util, i) => {
              return (
                <tr key={util.id} className="even:bg-gray-100">
                  <td className="py-3 text-center">{util.claimnumb}</td>
                  <td className="py-3 text-center">{util.claimdate}</td>
                  <td className="py-3 text-center">{util.claimtype}</td>
                  <td className="py-3 text-center">
                    {util.relation === 'EMPLOYEE' ? 'E' : 'D'}
                  </td>
                  <td>{util.diagname}</td>
                  <td className="py-3 text-right">
                    {formatter.format(util.eligible)}
                  </td>
                  <td className="py-3 text-center">
                    <input
                      checked={selectedUtil.some(row => row.id === util.id)}
                      onChange={e => handleSelectUtilization(e, util)}
                      type="checkbox"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
