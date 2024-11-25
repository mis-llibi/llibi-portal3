import React, { useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'

import { useRouter } from 'next/router'

import useAge from './components/UseAge'

import Modal from '@/components/Modal'

import ModalControl from '@/components/ModalControl'

const OptoutPage = () => {
  const router = useRouter()

  const { client } = ManageClientInfo({
    id: router.query.id,
    company: 'DEEL',
  })

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
    }
  }, [client?.principal])

  const { show, body, setBody, toggle } = ModalControl()

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
          <div className="p-4 text-center text-xl border rounded-b-md text-red-900 font-bold">
            We have noted your instructions to opt out. You and your dependents
            will not be enrolled in the Deel healthcare program.
          </div>

          <Modal className={'hidden'} show={show} body={body} toggle={toggle} />
        </div>
      </GuestLayout>
    </>
  )
}

export default OptoutPage
