import React from 'react'
import LaboratoryCard from './mobile/LaboratoryCard'
import { useRouter } from 'next/router'

export default function LaboratoryTab({
  search,
  handleSearch,
  // handleSelectUtilizationAll,
  handleSelectLaboratory,
  selectedLab,
}) {
  const router = useRouter()
  const { hospital_class } = router?.query
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
        <table className="w-full text-xs">
          <thead>
            <tr className="uppercase bg-blue-600 text-white">
              {/* <th>Code</th> */}
              <th className="py-3">Procedure</th>
              <th className="py-3">Cost</th>
              <th>
                {/* <input
                // onChange={e => handleSelectUtilizationAll(e)}
                type="checkbox"
              /> */}
              </th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {search?.map((lab, i) => {
              return (
                <tr key={lab.id} className="even:bg-gray-300">
                  {/* <td>{lab.code}</td> */}
                  <td className="px-3 py-3 text-center">
                    <input
                      checked={selectedLab.some(row => row.id === lab.id)}
                      onChange={e =>
                        handleSelectLaboratory(e.target.checked, lab)
                      }
                      type="checkbox"
                    />
                  </td>
                  <td className="px-3 py-3">{lab.laboratory}</td>
                  <td className="px-3 py-3 text-right">
                    {hospital_class == 1
                      ? formatter.format(lab.cost)
                      : formatter.format(lab.cost2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="grid grid-cols-2 gap-3 md:hidden">
        {search?.map((lab, i) => {
          return (
            <LaboratoryCard
              key={lab.id}
              lab={lab}
              handleSelectLaboratory={handleSelectLaboratory}
            />
          )
        })}
      </div> */}
    </>
  )
}
