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
              <h1 className="font-bold text-xl text-indigo-800">
                FOR ENROLLMENT
              </h1>
              <hr className="mb-2"></hr>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-gray-600">
                  <div>
                    <MdPendingActions className="absolute text-4xl text-gray-50" />
                    <h1 className="text-8xl font-bold text-gray-100 drop-shadow-lg">
                      {enrollees?.pending || 0}
                    </h1>
                    <p className="text-white font-semibold">
                      Pending For Submission
                    </p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-red-500">
                  <div>
                    <MdOutlineDeleteForever className="absolute text-4xl text-gray-50" />
                    <h1 className="text-8xl font-bold text-red-100 drop-shadow-lg">
                      {enrollees?.for_deletion || 0}
                    </h1>
                    <p className="text-white font-semibold">Deleted Enrollee</p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-green-600">
                  <div>
                    <MdOutlineFlightTakeoff className="absolute text-4xl text-gray-50" />
                    <h1 className="text-8xl font-bold text-green-100 drop-shadow-lg">
                      {enrollees?.for_enrollment || 0}
                    </h1>
                    <p className="text-white font-semibold">
                      Submitted Members
                    </p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-red-900">
                  <div>
                    <MdOutlineRemoveDone className="absolute text-4xl text-gray-50" />
                    <h1 className="text-8xl font-bold text-red-100 drop-shadow-lg">
                      {enrollees?.denied || 0}
                    </h1>
                    <p className="text-white font-semibold">
                      Enrollment Denied
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="font-bold text-xl text-purple-500">ENROLLED</h1>
              <hr className="mb-2"></hr>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-gray-100">
                  <div>
                    <MdOutlineDoneAll className="absolute text-4xl" />
                    <h1 className="text-8xl font-bold text-pink-600 drop-shadow-lg">
                      {enrollees?.enrolled || 0}
                    </h1>
                    <p>Enrolled Members</p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-gray-100">
                  <div>
                    <MdPeopleAlt className="absolute text-4xl" />
                    <h1 className="text-8xl font-bold text-blue-700 drop-shadow-lg">
                      {enrollees?.for_correction || 0}
                    </h1>
                    <p>Member For Correction</p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-gray-100">
                  <div>
                    <MdPersonOff className="absolute text-4xl" />
                    <h1 className="text-8xl font-bold text-orange-800 drop-shadow-lg">
                      {enrollees?.for_cancellation || 0}
                    </h1>
                    <p>Member For Cancellation</p>
                  </div>
                </div>

                <div className="text-center shadow-md shadow-outline rounded-md p-2 bg-gray-100">
                  <div>
                    <MdPersonRemoveAlt1 className="absolute text-4xl" />
                    <h1 className="text-8xl font-bold text-red-500 drop-shadow-lg">
                      {enrollees?.cancelled || 0}
                    </h1>
                    <p>Members Cancelled</p>
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
