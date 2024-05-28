import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'

import { MoonLoader } from 'react-spinners'

import ClientErrorLogsHooks from '@/hooks/self-service/client-error-logs'
import ErrorLogsRow from '@/components/client-error-logs/table/ErrorLogsRow'
import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import ClientPortalErrorLogsLayout from '@/components/Layouts/Self-service/ClientPortalErrorLogsLayout'

import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'

export default function ClientPortalErrorLogsHomePage() {
  const { user } = useAuth({
    middleware: 'auth',
  })

  const router = useRouter()

  const isMonitoring = useMemo(
    () => router.pathname.split('/').includes('monitoring'),
    [router.pathname],
  )

  const [filter, setFilter] = useState('')
  const { data, isValidating, error, mutate } = ClientErrorLogsHooks({
    search: '',
    filter: filter,
  })

  const handleFilter = e => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    if (user && user?.email === 'manilacae@llibi.com') {
      router.push('/complaint/error-logs/monitoring')
      return
    }
  }, [user?.email])

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <MoonLoader color="#1d4ed8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Something went wrong.
      </div>
    )
  }

  return (
    <>
      <ProviderLayout>
        <Head>
          <title>CLIENT PORTAL ERROR LOGS</title>
        </Head>

        <ClientPortalErrorLogsLayout>
          <div className="flex h-[75vh] flex-col items-center justify-center  rounded">
            <div className="self-start mb-3 w-full">
              <div className="flex gap-3 justify-between">
                <div>
                  <label className="mr-3 text-fav-black block">Filter:</label>
                  <select
                    className="rounded-md border border-gray-300 text-xs"
                    value={filter}
                    onChange={handleFilter}>
                    <option value="">All</option>
                    <option value="3">Pending with CAE</option>
                    <option value="2">Pending with MIS</option>
                  </select>
                </div>

                <div className="flex gap-1 items-center">
                  <span className="bg-green-300 px-3 py-2 text-white text-xs rounded-md uppercase w-[5em] text-center">
                    Done
                  </span>
                  <span className="bg-orange-300 px-3 py-2 text-white text-xs rounded-md uppercase w-[5em] text-center">
                    MIS
                  </span>
                  <span className="bg-red-300 px-3 py-2 text-white text-xs rounded-md uppercase w-[5em] text-center">
                    CAE
                  </span>
                </div>
              </div>
            </div>
            <div className="font-[poppins] w-full overflow-scroll h-[80vh] mx-auto">
              <table className="text-xs">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-3 py-2 w-60 whitespace-nowrap">
                      MEMBER DETAILS
                    </th>
                    <th className="px-3 py-2 w-60 whitespace-nowrap">
                      BIRTHDATE
                    </th>
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
                    <th className="px-3 py-2 w-60 whitespace-nowrap">
                      {!isMonitoring && 'ACTION'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map(row => (
                    <ErrorLogsRow key={row.id} row={row} mutate={mutate} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ClientPortalErrorLogsLayout>
      </ProviderLayout>
    </>
  )
}
