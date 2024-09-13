import React, { useState, useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'

import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import useAge from './components/UseAge'

import options from '@/hooks/self-enrollment/BroadpathOptions'

import Modal from '@/components/Modal'

import ModalControl from '@/components/ModalControl'

import ChangeAddress from './components/ChangeAddress'

const SubmittedPage = () => {
  const router = useRouter()

  const { client } = ManageClientInfo({
    id: router.query.id,
    company: 'DEEL',
  })

  const { handleSubmit } = useForm()

  const [address, setAddress] = useState('N/A')

  const [dependent, setDependent] = useState()

  useEffect(() => {
    if (client?.principal.length > 0) {
      if (
        client?.principal[0]?.status == 1 ||
        client?.principal[0]?.status == 4
      ) {
        window.location.pathname = `/self-enrollment/deel/`
      } else if (client?.principal[0]?.status == 2) {
        window.location.pathname = `/self-enrollment/deel/dependents/`
      }

      const newAdd = client?.principal[0]?.contact
      setAddress(
        `${newAdd?.street}, ${newAdd?.barangay}, ${newAdd?.city}, ${newAdd?.province}, ${newAdd?.zip_code}`,
      )

      let num,
        count = 0

      setDependent(
        client?.dependent.length > 0 ? (
          client?.dependent.map((item, i) => {
            if (options.ageEval(useAge(item?.birth_date), item?.relation)) {
              count++
            }

            switch (count) {
              case 1:
                num = '1st'
                break
              case 2:
                num = '2nd'
                break
              case 3:
                num = '3rd'
                break
              default:
                num = count + 1 + 'th'
                break
            }

            return (
              <tr key={i} className={`${item?.status === 3 && 'bg-red-100'}`}>
                <td className="border pl-2">
                  {item?.last_name.toUpperCase()},{' '}
                  {item?.first_name.toUpperCase()}
                </td>
                <td className="border pl-2">{item?.birth_date}</td>
                <td className="border pl-2">{useAge(item?.birth_date)}</td>
                <td className="border pl-2">{item?.relation}</td>
                <td
                  className={`border pl-2 text-xs ${
                    item?.status !== 3 && 'hidden'
                  }`}>
                  Dependent excluded in the renewal due to overage. No premium
                  computation.
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td className="bg-red-200 font-bold" colSpan={5}>
              No dependents found
            </td>
          </tr>
        ),
      )
    }
  }, [client?.principal])

  const { show, body, setBody, toggle } = ModalControl()

  const onView = () => {
    setBody({
      title: <b className="text-blue-900">Update my card delivery address</b>,
      content: <ChangeAddress props={client?.principal[0]?.contact} />,
      modalOuterContainer: 'w-full md:w-6/12 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  return (
    <>
      <GuestLayout title="Deel Self-Enrollment Portal">
        <div className="pb-2 lg:pb-0 lg:pr-2">
          {/* header */}
          <div className="flex gap-2">
            <div>
              {/* client logo */}
              <img
                src={`${basePath}/self-enrollment/deel/logo.jpg`}
                width={100}
              />
            </div>
            <div className="flex-grow flex place-items-center">
              <h1 className="text-xl font-bold text-gray-800">
                <span className="text-blue-500">Dependent</span> Renewal Portal
              </h1>
            </div>
          </div>

          {/* employee information */}
          <div className="mt-3 p-4 rounded-md bg-gray-100">
            <div className="mb-2 text-gray-900 font-bold mb-2 lg:flex gap-2">
              {/* header employee name */}
              <div className="flex gap-2">
                <div className="flex place-items-center">
                  <h1>Employee Information</h1>
                </div>
                <div className="ml-3 flex place-items-center">
                  <p className="text-sm md:text-lg text-green-900 capitalize">
                    {client
                      ? client?.principal[0]?.first_name +
                        ' ' +
                        client?.principal[0]?.last_name
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {/* gender and relation select */}
              <div className="-mt-2 ml-6">
                <div className="mt-4 md:grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Gender</p>
                    <p className="ml-2 font-bold">
                      {client?.principal[0]?.gender || 'N/A'}
                    </p>
                  </div>
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Civil Status</p>
                    <p className="ml-2 font-bold">
                      {client?.principal[0]?.civil_status || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* grid personal data */}
            <div className="grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Date of Birth</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.birth_date || 'N/A'}
                </p>
              </div>
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Age</p>
                <p className="ml-2 font-bold">
                  {useAge(client?.principal[0]?.birth_date) || 'N/A'}
                </p>
              </div>
              <div className="pr-2 flex md:flex-none lg:flex">
                <p>Member ID</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.member_id || 'N/A'}
                </p>
              </div>
              {/*  <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Room & Board</p>
                <p className="ml-2 font-bold text-red-400">
                  {client?.principal[0]?.room_and_board?.toLocaleString(
                    'en-US',
                  ) || 'N/A'}
                </p>
              </div>
              <div className="pr-2 flex md:flex-none lg:flex">
                <p>MBL</p>
                <p className="ml-2 font-bold text-red-400">
                  ₱{' '}
                  {client?.principal[0]?.mbl?.toLocaleString('en-US') || 'N/A'}
                </p>
              </div> */}
            </div>
          </div>

          {/* thank you summary */}
          <div className="mt-3 p-2">
            {client?.principal[0]?.form_locked == 2 &&
              `You have successfully updated your civil status and/or dependent/s’
            enrollment and information. Submission is final and no longer
            allowed to make any changes.`}
            {client?.principal[0]?.form_locked == 3 &&
              `You have successfully rolled over enrollment of your existing
            dependents. Submission is final and you can no longer allowed to
            make any changes.`}
            <br />
            <br /> Below is the summary of your dependents:
          </div>

          {/* dep info */}
          <div className="mt-1 p-1">
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border text-left pl-2 bg-gray-300">Name</th>
                  <th className="border text-left pl-2 bg-gray-300">
                    Birth Date
                  </th>
                  <th className="border text-left pl-2 bg-gray-300">Age</th>
                  <th className="border text-left pl-2 bg-gray-300">
                    Relation
                  </th>
                  <th className="border text-left pl-2 bg-gray-300"></th>
                </tr>
              </thead>
              <tbody>{dependent}</tbody>
            </table>
          </div>

          {/* Premium note */}
          {/* <div className="mt-3 p-2 text-red-500">
            Premium refund is not allowed if membership is terminated / deleted
            mid policy year.{' '}
          </div> */}

          {/* Address */}
          <div className="mt-3 p-2">
            Your registered home address for card delivery is <u>{address}</u>.
          </div>

          {/* change address */}
          <div className="mt-3 p-1">
            <Button
              onClick={handleSubmit(onView)}
              className="p-3 bg-orange-400 hover:bg-orange-700 focus:bg-orange-900 active:bg-orange-500 ring-orange-200">
              Update my card delivery address
            </Button>
          </div>

          <div className="mt-3 p-2 hidden">
            If there are changes in the dependent enrollment, you may make
            changes until June 6, 2024. Enrollment will officially close on June
            7, 2024 and will no longer accept any changes.
          </div>

          <Modal className={'hidden'} show={show} body={body} toggle={toggle} />
        </div>
      </GuestLayout>
    </>
  )
}

export default SubmittedPage
