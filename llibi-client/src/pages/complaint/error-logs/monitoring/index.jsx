import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import { MoonLoader } from 'react-spinners'

import ClientErrorLogsHooks from '@/hooks/self-service/client-error-logs'
import ErrorLogsRow from '@/components/client-error-logs/table/ErrorLogsRow'
import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import ClientPortalErrorLogsLayout from '@/components/Layouts/Self-service/ClientPortalErrorLogsLayout'

import { useAuth } from '@/hooks/auth'
export default function MonitoringHomePage() {
  const { user } = useAuth({
    middleware: 'auth',
  })

  const { data, isValidating, error, mutate } = ClientErrorLogsHooks({
    search: '',
    filter: 3,
  })

  if (isValidating) {
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
                    <th className="px-3 py-2 w-60 whitespace-nowrap">ACTION</th>
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
