import React from 'react'

import { basePath } from '@/../next.config'

const hierarchy = ({ civilStatus }) => {
  if (civilStatus == 'SINGLE') {
    return (
      <>
        <div>
          <p>
            Dependents you may enroll in this healthcare program are determined
            by your <b>civil status</b>
          </p>
          {/* <p>
                        a. You must also enroll your dependents based on the
                        hierarchy below
                    </p> */}
          <p>
            Your dependents must also meet the age eligibility criteria below
          </p>
        </div>
        <div className="flex mt-2">
          {/* image logo */}
          <div className="px-4 flex place-items-center">
            <img src={`${basePath}/self-enrollment/single.png`} width={40} />
          </div>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">Civil Status</td>
                <td className="pl-2">Single</td>
              </tr>
              <tr>
                <td className="font-bold">Eligible Dependents</td>
                <td className="pl-2">
                  Parents, Siblings, Domestic Partner / Same Gender Partner
                </td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>Parents (not more than 65 years old)</p>
                  <p>Siblings (15 days old to 23 years old)</p>
                  <p>
                    Domestic Partner / Same Gender Partner (not more than 65
                    years old)
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  } else if (civilStatus == 'SINGLE WITH DOMESTIC PARTNER') {
    return (
      <>
        <div>
          <p>
            Dependents you may enroll in this healthcare program are determined
            by your <b>civil status</b>
          </p>
          <p>
            Your dependents must also meet the age eligibility criteria below
          </p>
        </div>
        <div className="flex mt-2">
          {/* image logo */}
          <div className="px-4 flex place-items-center">
            <img src={`${basePath}/self-enrollment/single.png`} width={40} />
          </div>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">Civil Status</td>
                <td className="pl-2">
                  Single With Domestic Partner / Same Gender Partner
                </td>
              </tr>
              <tr>
                <td className="font-bold">Eligible Dependents</td>
                <td className="pl-2">Domestic Partner / Same Gender Partner</td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>
                    Domestic Partner / Same Gender Partner (not more than 65
                    years old)
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  } else if (civilStatus == 'SINGLE PARENT') {
    return (
      <>
        <div>
          <p>
            Dependents you may enroll in this healthcare program are determined
            by your <b>civil status</b>
          </p>
          <p>
            Your dependents must also meet the age eligibility criteria below
          </p>
        </div>
        <div className="flex mt-2">
          {/* image logo */}
          <div className="px-4 flex place-items-center">
            <img
              src={`${basePath}/self-enrollment/single_parent.png`}
              width={40}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">Civil Status</td>
                <td className="pl-2">Single Parent / Solo Parent</td>
              </tr>
              <tr>
                <td className="font-bold">Eligible Dependents</td>
                <td className="pl-2">
                  Children, Parents, Siblings, Domestic Partner / Same Gender
                  Partner
                </td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>Children (15 days to 23 years old)</p>
                  <p>Parents (not more than 65 years old)</p>
                  <p>Siblings (15 days old to 23 years old)</p>
                  <p>
                    Domestic Partner / Same Gender Partner (not more than 65
                    years old)
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  } else if (civilStatus == 'MARRIED') {
    return (
      <>
        <div>
          <p>
            Dependents you may enroll in this healthcare program are determined
            by your <b>civil status</b>
          </p>
          {/* <p>
                        a. You must also enroll your dependents based on the
                        hierarchy below
                    </p> */}
          <p>
            Your dependents must also meet the age eligibility criteria below
          </p>
        </div>
        <div className="flex mt-2">
          {/* image logo */}
          <div className="px-4 flex place-items-center">
            <img src={`${basePath}/self-enrollment/married.png`} width={40} />
          </div>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">Civil Status</td>
                <td className="pl-2">Married</td>
              </tr>
              <tr>
                <td className="font-bold">Eligible Dependents</td>
                <td className="pl-2">
                  {/* Spouse then children, from eldest to
                                    youngest */}
                  Spouse and Children
                </td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>Spouse (not more than 65 years old)</p>
                  <p>Children (15 days to 23 years old)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  } else {
    return <p className="font-bold text-red-400">No Civil Status Selected</p>
  }
}

export default hierarchy
