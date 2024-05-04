import axios from '@/lib/axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import ClientErrorLogsHooks from '@/hooks/self-service/client-error-logs'
import { MoonLoader } from 'react-spinners'
import ActionButton from '@/components/client-error-logs/ActionButton'
import ErrorLogsRow from '@/components/client-error-logs/table/ErrorLogsRow'
import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'

import { useModalNotifyCaeStore } from '@/store/useModalNotifyCaeStore'

export default function ClientPortalErrorLogsHomePage() {
  // const { show, setShow, body, setBody, toggle } = ModalControl()
  // const { Mshow, Mbody, setModalToggle } = useModalNotifyCaeStore()
  // const [data, setData] = useState([])

  // const getErrorLogs = async () => {
  //   try {
  //     const response = await axios.get('/api/error-logs')
  //     // console.log(response.data)
  //     setData(response.data)
  //   } catch (error) {
  //     alert('Something went wrong.')
  //   }
  // }

  // useEffect(() => {
  //   getErrorLogs()
  // }, [])

  const { data, error, mutate } = ClientErrorLogsHooks()

  if (!data || data?.length <= 0)
    return (
      <div className="h-screen flex items-center justify-center">
        <MoonLoader color="#1d4ed8" />
      </div>
    )

  if (error)
    return (
      <div className="h-screen flex items-center justify-center">
        Something went wrong.
      </div>
    )

  return (
    <>
      <div className="w-11/12 mx-auto">
        <h1 className="font-bold text-xl text-fav-black uppercase h-14 flex items-center">
          CLIENT PORTAL ERROR LOGS
        </h1>
      </div>

      <div className="flex h-[90vh] flex-col items-center justify-center">
        <div className="font-[poppins] w-11/12 overflow-scroll h-[80vh] mx-auto">
          <table className="text-xs">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  MEMBER DETAILS
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">BIRTHDATE</th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  IS DEPENDENT
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  DEPENDENT DETAILS
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  DEPENDENT BIRTHDATE
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">REPORT</th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  CALL ALLOWED
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  DATE CREATED
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(row => (
                <ErrorLogsRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <Modal show={Mshow} body={Mbody} toggle={setModalToggle} /> */}
    </>
  )
}
