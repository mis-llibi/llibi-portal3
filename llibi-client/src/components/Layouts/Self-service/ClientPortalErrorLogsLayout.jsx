import React from 'react'

import { useAuth } from '@/hooks/auth'
import { DropdownButton } from '@/components/DropdownLink'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'

export default function ClientPortalErrorLogsLayout({ children }) {
  const { user, logout } = useAuth({
    middleware: 'auth',
  })
  return (
    <div className="py-10 font-[poppins]">
      <div className="w-11/12 mx-auto bg-white p-5 rounded-md">
        <div className="flex-none md:flex gap-5 font-bold text-xl text-fav-subtitle mb-5">
          <ApplicationLogo width={200} />
          <div className="my-auto w-full">
            <div className="w-full text-center md:text-right">
              <p className="uppercase">
                <span className="text-blue-900">
                  Client Care Portal Error Logs
                </span>
              </p>
              <div className="flex justify-end">
                <Dropdown
                  align="right"
                  width="48"
                  trigger={
                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                      <div className="capitalize">
                        {user?.last_name + ', ' + user?.first_name}
                      </div>

                      <div className="ml-1">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                  }>
                  {/* Authentication */}
                  <DropdownButton onClick={logout}>Logout</DropdownButton>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
