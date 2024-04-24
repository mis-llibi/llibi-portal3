import AppLayout from '@/components/Layouts/Members/AppLayout'
import Head from 'next/head'

import { useManageEnrollee } from '@/hooks/members/ManageEnrollee'

import {
  MdPendingActions,
  MdOutlineDeleteForever,
  MdOutlineFlightTakeoff,
  MdOutlineRemoveDone,
  MdOutlineDoneAll,
  MdPersonOff,
  MdPeopleAlt,
  MdPersonRemoveAlt1,
} from 'react-icons/md'

const Dashboard = () => {
  const { enrollees } = useManageEnrollee({})

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      }>
      <Head>
        <title>LLIBI DASHBOARD</title>
      </Head>

      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h1 className="font-bold text-xl text-gray-800 mb-6">
                FOR ENROLLMENT
              </h1>
              {/* <hr className="mb-2"></hr> */}

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                <div className="group text-center border rounded-md p-2">
                  <div>
                    <MdPendingActions className="absolute text-3xl text-blue-600 group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-blue-600 drop-shadow-lg group-hover:scale-105 transition-transform">
                      {/* {enrollees?.pending || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Pending For Submission
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdOutlineDeleteForever className="absolute text-3xl text-red-600 group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-red-600 drop-shadow-lg group-hover:scale-105 transition-transform">
                      {/* {enrollees?.for_deletion || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Deleted Enrollee
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdOutlineFlightTakeoff className="absolute text-3xl text-green-600  group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-green-600 drop-shadow-lg  group-hover:scale-105 transition-transform">
                      {/* {enrollees?.for_enrollment || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Submitted Members
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdOutlineRemoveDone className="absolute text-3xl text-red-600  group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-red-600 drop-shadow-lg  group-hover:scale-105 transition-transform">
                      {/* {enrollees?.denied || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Enrollment Denied
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="font-bold text-xl text-gray-800 mb-6">ENROLLED</h1>
              {/* <hr className="mb-2"></hr> */}

              <div className="grid grid-cols-4 gap-4">
                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdOutlineDoneAll className="absolute text-3xl text-green-600 group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-green-600 drop-shadow-lg group-hover:scale-105 transition-transform">
                      {/* {enrollees?.enrolled || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Enrolled Members
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdPeopleAlt className="absolute text-3xl text-blue-600  group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-blue-600 drop-shadow-lg  group-hover:scale-105 transition-transform">
                      {/* {enrollees?.for_correction || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Member For Correction
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdPersonOff className="absolute text-3xl text-pink-600 group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-pink-600 drop-shadow-lg group-hover:scale-105 transition-transform">
                      {/* {enrollees?.for_cancellation || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Member For Cancellation
                    </p>
                  </div>
                </div>

                <div className="group text-center border shadow-outline rounded-md p-2">
                  <div>
                    <MdPersonRemoveAlt1 className="absolute text-3xl text-red-600 group-hover:scale-125 transition-transform" />
                    <h1 className="text-8xl font-bold text-red-600 drop-shadow-lg group-hover:scale-105 transition-transform">
                      {/* {enrollees?.cancelled || 0} */}0
                    </h1>
                    <p className="text-gray-800 font-semibold uppercase text-sm">
                      Members Cancelled
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard
