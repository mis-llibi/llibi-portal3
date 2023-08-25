import ClientLayout from '@/components/Layouts/Self-service/ClientLayout'
import Head from 'next/head'

/* import BreadCrumb from '@/components/BreadCrumb'
import BreadList from '@/components/BreadCrumbList' */

import ApplicationLogo from '@/components/ApplicationLogo'

import { useRouter } from 'next/router'
import Consultation from '@/pages/self-service/client/loa/Consultation'
import Laboratory from '@/pages/self-service/client/loa/Laboratory'

import Clock from 'react-live-clock'

const Request = () => {
  const router = useRouter()
  //console.log(router.query)
  return (
    <ClientLayout>
      <Head>
        <title>LLIBI PORTAL - REQUEST</title>
      </Head>

      <div className="flex h-full min-h-screen py-4">
        <div className="w-11/12 md:w-10/12 lg:w-8/12 m-auto sm:px-6 lg:px-8">
          {/* Main form white background */}
          <div className="p-2 md:p-6 bg-gray-50 border border-gray-300 shadow-2xl rounded-2xl bg-opacity-90">
            {/* Main Header, title and logo */}
            <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
              <ApplicationLogo width={200} />
              <div className="my-auto w-full">
                <div className="w-full text-center md:text-right">
                  <p>
                    Member{' '}
                    <span className="text-blue-900">Client Care Portal</span>
                  </p>
                  <p className="text-sm text-shadow-lg text-gray-700">
                    <Clock
                      format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                      ticking={true}
                      timezone={'Asia/Manila'}
                    />
                  </p>
                </div>
              </div>
            </div>
            <hr className="my-2 border-b-4 shadow border-blue-900 rounded-lg"></hr>

            {/* Bread Crumb */}
            {/* <BreadCrumb
                            breadActive={1}
                            breadCrumb={BreadList?.clientForm}
                        /> */}

            {/* REQUEST FOR LOA CONSULTATION FORM */}
            {router?.query?.req === '1' &&
              router?.query?.loatype === 'consultation' && (
                <Consultation
                  refno={router?.query?.refno}
                  loatype={router?.query?.loatype}
                />
              )}

            {/* REQUEST FOR LOA LABORATORY FORM */}
            {router?.query?.req === '1' &&
              router?.query?.loatype === 'laboratory' && (
                <Laboratory
                  refno={router?.query?.refno}
                  loatype={router?.query?.loatype}
                />
              )}
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}

export default Request
