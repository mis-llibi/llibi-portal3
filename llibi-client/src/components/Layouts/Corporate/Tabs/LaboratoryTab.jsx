import React from 'react'
import LaboratoryCard from './mobile/LaboratoryCard'
import { useRouter } from 'next/router'

import { useLaboratoryStore } from '@/store/useLaboratoryStore'

export default function LaboratoryTab({
  search,
  handleSearch,
  // handleSelectUtilizationAll,
  handleSelectLaboratory,
  // selectedLab,
}) {
  const router = useRouter()
  const { hospital_class } = router?.query
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

  const selectedLab = useLaboratoryStore(state => state.selectedLab)

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
          {search?.map((lab, i) => {
            return (
              <div key={lab.id} className="border border-gray-300 rounded-md">
                <label className="cursor-pointer" htmlFor={`row-${lab.id}`}>
                  <input
                    id={`row-${lab.id}`}
                    checked={selectedLab.some(row => row.id === lab.id)}
                    onChange={e =>
                      handleSelectLaboratory(e.target.checked, lab)
                    }
                    type="checkbox"
                    className="hidden peer"
                  />
                  <div className="peer-checked:bg-gray-200 peer-checked:text-fav-black p-3 rounded-md h-full relative">
                    <span className="block font-bold text-xs mb-5 min-h-12">
                      {lab.laboratory}
                    </span>
                    <span
                      className={`block font-bold text-fav-subtitle text-xs absolute right-0 bottom-0 p-3`}>
                      {hospital_class == 1
                        ? formatter.format(lab.cost)
                        : formatter.format(lab.cost2)}
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
              <th className="py-3">Procedure</th>
              <th className="py-3">Cost</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {search?.map((lab, i) => {
              return (
                <tr key={lab.id} className="even:bg-gray-300">
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
        </table> */}
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
