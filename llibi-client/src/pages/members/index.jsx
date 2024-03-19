import AppLayout from '@/components/Layouts/Members/AppLayout'
import Head from 'next/head'

import { useState, useEffect } from 'react'

import Select from '@/components/Select'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useAuth } from '@/hooks/members/auth'
import { useForm } from 'react-hook-form'

import PageEnrollmentClient from './components/pageEnrollmentClient'
import PageEnrollmentAdmin from './components/pageEnrollmentAdmin'

import Loader from '@/components/Loader'
import Label from '@/components/Label'

import { BiUpload, BiTime, BiTrashAlt, BiCheck } from 'react-icons/bi'
import RadioCardFilter from '@/components/boradpath/hris/RadioCardFilter'

const filterOptions = [
  {
    icon: <BiCheck size={24} />,
    label: 'Active Members',
    value: 4,
  },
  {
    icon: <BiTime size={24} />,
    label: 'Pending for Approval',
    value: 8,
  },
  {
    icon: <BiTrashAlt size={24} />,
    label: 'Deleted Members',
    value: 7,
  },
]

const Members = () => {
  const { user } = useAuth({ middleware: 'auth' })

  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
      //console.log('page loaded')
      setLoading(false)
      // do something else
    }

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad()
    } else {
      window.addEventListener('load', onPageLoad, false)
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad)
    }
  }, [])

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const [loading, setLoading] = useState(true)

  const { register, watch } = useForm()

  const checkUserRole = () => {
    // if (user && !user?.role) return 4
    return 4
  }

  const props = {
    selection: watch('selection') || checkUserRole(),
    user: user,
    loading: loading,
    setLoading: setLoading,
    setShow: setShow,
    setBody: setBody,
    toggle: toggle,
  }

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          HR Enrollment Portal{' '}
          <span className="text-pink-900">{user?.role && '(CAE)'}</span>
        </h2>
      }>
      <Head>
        <title>LLIBI HR-ENROLLMENT MANAGEMENT</title>
      </Head>

      {/* CLIENT ENROLLMENT PAGE */}
      {user && !user?.role && (
        <>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-2">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              {/* <Label>Filter: </Label> */}
              {/* <Select
                id="statusCheckerClient"
                className="block mt-1 w-full"
                options={[
                  {
                    label: 'Pending for Submission',
                    value: 1,
                  },
                  { label: 'Submitted Members', value: 2 },
                  { label: 'Pending for Deletion', value: 3 },
                  { label: 'Deleted Members', value: 3 },
                  { label: 'Pending for Correction', value: 5 },
                  { label: 'Approved Correction', value: 6 },
                  { label: 'Approved Members', value: 4 },
                  // { label: 'Enrolled Members', value: 4 },
                  // { label: 'Denied Enrollment', value: 6 },
                  // { label: 'Members for Correction', value: 7 },
                  // { label: 'Members for Cancellation', value: 8 },
                  // { label: 'Cancelled Membership', value: 9 },
                  // { label: 'Late Enrolled', value: 101 },
                ]}
                register={register('selection')}
              /> */}

              <ul className="grid w-full gap-3 md:grid-cols-4 font-[poppins]">
                {filterOptions.map((item, i) => (
                  <RadioCardFilter
                    key={item.value}
                    register={register}
                    item={item}
                  />
                ))}
              </ul>
            </div>
          </div>
          <PageEnrollmentClient props={props} />
        </>
      )}

      {/* ADMIN ENROLLMENT PAGE */}
      {user && user?.role && (
        <>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-2">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <ul className="grid w-full gap-3 md:grid-cols-4 font-[poppins]">
                {filterOptions.map((item, i) => (
                  <RadioCardFilter
                    key={item.value}
                    register={register}
                    item={item}
                  />
                ))}
              </ul>
            </div>
          </div>
          <PageEnrollmentAdmin props={props} />
        </>
      )}

      <Modal
        className={!loading && 'hidden'}
        show={show}
        body={body}
        toggle={toggle}
      />

      <Loader loading={loading} />
    </AppLayout>
  )
}

export default Members
