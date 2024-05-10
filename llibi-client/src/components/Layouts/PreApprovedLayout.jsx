import React, { useState } from 'react'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ApplicationLogo from '../ApplicationLogo'
import Dropdown from '../Dropdown'

const PreApprovedLayout = ({ header, children }) => {
  const router = useRouter()

  const { user, logout } = useAuth({ middleware: 'auth' })

  const [open, setOpen] = useState(false)

  //console.log(user)
  return (
    <div className="min-h-screen bg-gray-100 font-[poppins]">
      <nav className="bg-white border-b border-gray-100">
        {/* Primary Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard">
                  <a>
                    <ApplicationLogo
                      width={200}
                      className="block h-10 w-auto fill-current text-gray-600"
                    />
                  </a>
                </Link>
              </div>
            </div>

            {/* Settings Dropdown */}
            <div className="hidden sm:flex sm:items-center sm:ml-6">
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
                <DropdownButton
                  onClick={() =>
                    logout('/upload/csv/pre-approved/laboratory/login')
                  }>
                  Logout
                </DropdownButton>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Responsive Navigation Menu */}
        {open && (
          <div className="block sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <ResponsiveNavLink
                href="/dashboard"
                active={router.pathname === '/dashboard'}>
                Dashboard
              </ResponsiveNavLink>

              <ResponsiveNavLink
                href="/members"
                active={router.pathname === '/members'}>
                Members
              </ResponsiveNavLink>
            </div>

            {/* Responsive Settings Options */}
            <div className="pt-4 pb-1 border-t border-gray-300">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-10 w-10 fill-current text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <div className="ml-3">
                  <div className="font-medium text-base text-gray-800 capitalize">
                    {user?.last_name + ', ' + user?.first_name}
                  </div>
                  <div className="font-medium text-sm text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {/* Authentication */}
                <ResponsiveNavButton onClick={logout}>
                  Logout
                </ResponsiveNavButton>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Heading */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {header}
        </div>
      </header>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  )
}

export default PreApprovedLayout
