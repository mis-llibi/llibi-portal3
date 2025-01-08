import React from 'react'

import { basePath } from '@/../next.config'

const Hierarchy = ({ civilStatus }) => {
  if (civilStatus == 'SINGLE') {
    return (
      <>
        <div>
          <p>
            Dependents you may enroll in this healthcare program are determined
            by your <b>civil status</b>
          </p>
          <p>
            a. You must also enroll your dependents based on the hierarchy below
            <br />
            b. Your dependents must also meet the{' '}
            <b>age eligibility criteria</b> below
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
                <td className="pl-2">Parents</td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>Parents (not more than 65 years old)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <p>
            Skipping of the hierarchy is only permitted for the reasons below.
            Please select the appropriate reason in the given fields. Otherwise,
            leave this field blank.
          </p>
          <br />
          <ul className="list-disc">
            <li>Death, or your dependent is deceased.</li>
            <li>
              Other Coverage, or your dependent is already covered by another
              HMO or Insurance Company.
            </li>
            <li>
              Working Abroad, or your dependent is employed outside of the
              Philippines.
            </li>
          </ul>
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
                <td className="pl-2">
                  <p>Domestic Partner / Same Gender Partner and Children</p>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>
                    Domestic Partner / Same Gender Partner (not more than 65
                    years old)
                  </p>
                  <p>Children (15 days to 23 years old)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <p className="font-bold mb-2 text-orange-600">
            Here are the eligibility guidelines/parameters around LGBT
            Partner/Common Law Spouse as dependents:{' '}
          </p>
          <ul className="list-disc">
            <li>Should be at least 18 years old. </li>
            <li>
              Both Partners should be single and not legally married nor be the
              domestic partner of anyone else.
            </li>
            <li>
              Both Partners should be currently cohabitating or living together
              as if married continuously for at least the last six (6) months
              and have a serious committed romantic relationship.
            </li>
            <li>Both partners should not be related biologically.</li>{' '}
            Additional Document Requirements to be submitted with the enrolment:
            <br />- a. Barangay Certification to evidence that both Partners
            have been living together for the last 6 months.
            <br />- b. Certificate of No Marriage (CENOMAR) from both Partners
          </ul>
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
            a. You must also enroll your dependents based on the hierarchy below
            <br />
            b. Your dependents must also meet the{' '}
            <b>age eligibility criteria</b> below
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
                  Children, {/* Domestic Partner, */} Parents
                </td>
              </tr>
              <tr>
                <td className="font-bold">Age Eligibility</td>
                <td className="pl-2">
                  <p>Children (15 days to 23 years old)</p>
                  <p>Parents (not more than 65 years old)</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <p>
            Skipping of the hierarchy is only permitted for the reasons below.
            Please select the appropriate reason in the given fields. Otherwise,
            leave this field blank.
          </p>
          <br />
          <ul className="list-disc">
            <li>Death, or your dependent is deceased.</li>
            <li>
              Other Coverage, or your dependent is already covered by another
              HMO or Insurance Company.
            </li>
            <li>
              Working Abroad, or your dependent is employed outside of the
              Philippines.
            </li>
          </ul>
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
          <p>
            a. You must also enroll your dependents based on the hierarchy below
            <br />
            b. Your dependents must also meet the{' '}
            <b>age eligibility criteria</b> below
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
        <div className="mt-2">
          <p>
            Skipping of the hierarchy is only permitted for the reasons below.
            Please select the appropriate reason in the given fields. Otherwise,
            leave this field blank.
          </p>
          <br />
          <ul className="list-disc">
            <li>Death, or your dependent is deceased.</li>
            <li>
              Other Coverage, or your dependent is already covered by another
              HMO or Insurance Company.
            </li>
            <li>
              Working Abroad, or your dependent is employed outside of the
              Philippines.
            </li>
          </ul>
        </div>
      </>
    )
  } else {
    return (
      <p className="font-bold text-red-400 text-center">
        No Civil Status Selected
      </p>
    )
  }
}

export default Hierarchy
