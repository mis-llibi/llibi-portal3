import React from 'react'

export default function LaboratoryTab({
  search,
  handleSearch,
  // handleSelectUtilizationAll,
  handleSelectLaboratory,
  selectedLab,
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
              {/* <th>Code</th> */}
              <th>Procedure</th>
              <th>Cost</th>
              <th>
                {/* <input
                // onChange={e => handleSelectUtilizationAll(e)}
                type="checkbox"
              /> */}
              </th>
            </tr>
          </thead>
          <tbody>
            {search?.map((lab, i) => {
              return (
                <tr key={lab.id} className="even:bg-gray-100">
                  {/* <td>{lab.code}</td> */}
                  <td className='py-3'>{lab.laboratory}</td>
                  <td className="py-3 text-right">{formatter.format(lab.cost)}</td>
                  <td className="py-3 text-center">
                    <input
                      checked={selectedLab.some(row => row.id === lab.id)}
                      onChange={e => handleSelectLaboratory(e, lab)}
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
