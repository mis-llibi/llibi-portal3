import { useState } from 'react'

import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa'

const PremiumComputation = ({ fields = [], bill = 0 }) => {
  const [toggle, setToggle] = useState(true)

  const computation = () => {
    let num, bil, com
    const computation = fields?.map((item, i) => {
      switch (i) {
        case 0:
          num = i + 1 + 'st'
          bil = '20%'
          com = bill * 1
          break
        case 1:
          num = i + 1 + 'nd'
          bil = '20%'
          com = bill * 1
          break
        case 2:
          num = i + 1 + 'rd'
          bil = '100%'
          com = bill * 1
          break
        default:
          num = i + 1 + 'th'
          bil = '100%'
          com = bill * 1
          break
      }

      return {
        num,
        bil,
        com,
      }
    })

    const annual = computation.reduce(function (s, a) {
      return s + a.com
    }, 0)

    const monthly = annual // / 12

    return { breakdown: computation, annual: annual, monthly: monthly }
  }

  const opt = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }

  return (
    <>
      {/* premium box */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-0 w-72 border border-gray-500 bg-gradient-to-b from-yellow-600 via-yellow-100 to-yellow-600 p-2 text-sm rounded-l-lg shadow-lg z-20 ${
          !toggle && 'hidden'
        } transition-all delay-150 duration-300 ease-out`}>
        <div className="font-bold border-b border-gray-600 pb-2">
          Your premium contribution is estimated as follows:
        </div>
        <div className="mt-2">
          <table className="w-full">
            <tbody>
              {/* <tr>
                <td>Annual:</td>
                <td className="font-bold">
                  ₱ {computation()?.annual?.toLocaleString('en', opt)}
                </td>
              </tr> */}
              <tr>
                <td>Monthly:</td>
                <td className="font-bold">
                  ₱ {computation()?.monthly?.toLocaleString('en', opt)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 bg-gray-50 p-2 overflow-auto max-h-48 shadow-sm">
          <p className="font-semibold">Breakdown (Monthly)</p>
          <table className="w-full text-xs">
            <tbody>
              {computation()?.breakdown?.map((row, i) => {
                return (
                  <tr key={i} className="border-b-2">
                    <td>
                      {row.num} Dependent:
                      {/* 
                        <br />
                        {row.bil} of ₱{' '}
                        {bill?.toLocaleString('en', opt)} 
                      */}
                    </td>
                    <td className="font-bold">
                      ₱ {row.com?.toLocaleString('en', opt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs font-semibold text-red-900">
          Premium refund is not allowed if membership is terminated / deleted
          mid policy year.
        </div>
        <div className="absolute top-1/2 -ml-9">
          <div
            className={`bg-red-400 p-2 rounded-l-lg cursor-pointer ${
              !toggle && 'hidden'
            }`}
            onClick={() => setToggle(false)}>
            <FaAngleDoubleRight />
          </div>
        </div>
      </div>
      <div className="fixed top-1/2 -translate-y-1/2 right-0">
        <div
          className={`bg-green-400 p-2 rounded-l-lg cursor-pointer ${
            toggle && 'hidden'
          }`}
          onClick={() => setToggle(true)}>
          <FaAngleDoubleLeft />
        </div>
      </div>
    </>
  )
}

export default PremiumComputation
