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
            <tr className="uppercase">
              <th>Claim #</th>
              <th>Claim Date</th>
              <th>Claim Type</th>
              <th>Diagnosis</th>
              <th>Amount</th>
              <th>
                {/* <input
                onChange={e => handleSelectUtilizationAll(e)}
                type="checkbox"
              /> */}
              </th>
            </tr>
          </thead>
          <tbody>
            {search?.map((util, i) => {
              return (
                <tr key={util.id}>
                  <td className="text-center">{util.claimnumb}</td>
                  <td className="text-center">{util.claimdate}</td>
                  <td className="text-center">{util.claimtype}</td>
                  <td>{util.diagname}</td>
                  <td className="text-right">
                    {formatter.format(util.eligible)}
                  </td>
                  <td className="text-center">
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
