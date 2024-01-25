import AppLayout from '@/components/Layouts/Self-enrollment/AppLayout'
import Head from 'next/head'

import { useState } from 'react'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useAuth } from '@/hooks/self-enrollment/auth'
import { useForm } from 'react-hook-form'

import BroadpathContainer from './admin/broadpath/index'
import LlibiContainer from './admin/llibi/index'
import DeelContainer from './admin/deel/index'
import EigthByEigthContainer from './admin/8x8/index'
import HomePreqin from './admin/preqin'

import LifeInsuranceContainer from './life-insurance/index'

import Loader from '@/components/Loader'

const Home = () => {
  const { user } = useAuth({ middleware: 'auth' })

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const [loading, setLoading] = useState(false)

  const { register, watch } = useForm()

  const props = {
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
          Self-Enrollment Portal{' '}
          <span className="text-pink-900">
            {user?.role && user?.company_id}
          </span>
        </h2>
      }>
      <Head>
        <title>LLIBI SELF-ENROLLMENT MANAGEMENT</title>
      </Head>

      {user?.role == 1 && user?.company_id == 'BROADPATH' && (
        <BroadpathContainer register={register} watch={watch} props={props} />
      )}

      {user?.role == 1 && user?.company_id == 'LLIBI' && (
        <LlibiContainer register={register} watch={watch} props={props} />
      )}

      {user?.role == 1 && user?.company_id == 'DEEL' && (
        <DeelContainer register={register} watch={watch} props={props} />
      )}

      {user?.role == 1 && user?.company_id == '8X8' && (
        <EigthByEigthContainer
          register={register}
          watch={watch}
          props={props}
        />
      )}

      {/* LIFE INSURANCE */}
      {user?.role == 3 && (
        <LifeInsuranceContainer
          register={register}
          watch={watch}
          props={props}
        />
      )}

      {user?.role == 1 && user?.company_id == 'PREQIN' && (
        <HomePreqin register={register} watch={watch} props={props} />
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

export default Home
