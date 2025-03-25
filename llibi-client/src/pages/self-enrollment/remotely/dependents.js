import React, { useState, useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'
import Select from '@/components/Self-enrollment/SelectPrincipal'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import { useForm, useFieldArray } from 'react-hook-form'

import PremiumComputation from './components/PremiumComputation'
import Hierarchy from './components/Hierarchy'
import ArrayField from './components/ArrayField'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'
import options from '@/hooks/self-enrollment/RemotelyOptions'

import { useRouter } from 'next/router'

import Swal from 'sweetalert2'

import useAge from './components/UseAge'

const Dependents = () => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { client, submitDependent, submitWithoutDependent } = ManageClientInfo({
    id: router.query.id,
    company: 'REMOTELY',
  })

  const depsForm = {
    mId: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    civil_status: '',
    relation: '',
    birth_date: '',
    attachment: '',
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    resetField,
    trigger,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      deps: [depsForm],
    },
  })

  useEffect(() => {
    if (client?.dependent.length > 0) reset({ deps: client?.dependent })
  }, [client?.dependent])

  const [bill, setBill] = useState(0)
  const [page, setPage] = useState(false)

  useEffect(() => {
    setValue('id', client?.principal[0]?.id)
    setValue('memberId', client?.principal[0]?.member_id)
    setValue('gender', client?.principal[0]?.gender)
    setValue('civilStatus', client?.principal[0]?.civil_status)
    setValue('hireDate', client?.principal[0]?.hire_date)
    setValue('coverageDate', client?.principal[0]?.coverage_date)

    switch (client?.principal[0]?.mbl) {
      case 200000:
        setBill(19807.2)
        break
      case 150000:
        setBill(19398.4)
        break
    }
    if (client?.principal[0]?.form_locked == 2) {
      window.location.pathname = `/self-enrollment/remotely/form-locked-submitted`
    } else {
      if (client?.principal.length > 0)
        if (client?.principal[0]?.status == 1) {
          window.location.pathname = `/self-enrollment/remotely/`
        } else if (client?.principal[0]?.status == 4) {
          window.location.pathname = `/self-enrollment/remotely/rollover/`
        } else {
          setPage(true)
        }
    }
  }, [client?.principal])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deps',
  })

  const props = {
    client,
    register,
    fields,
    watch,
    append,
    remove,
    reset,
    resetField,
    setValue,
    isDirty,
    errors,
    loading,
    setLoading,
    civilStatus: watch('civilStatus'),
  }

  const onSubmitDependent = data => {
    let tr = ''
    data?.deps.map(item => {
      return (tr += `
        <tr>
          <td style="background-color:#fafafa;text-align:left;">${
            item?.last_name.toUpperCase() +
            ', ' +
            item?.first_name.toUpperCase()
          }</td>
          <td style="background-color:#fafafa;text-align:left;">${
            item?.birth_date
          }</td>
          <td style="background-color:#fafafa;text-align:left;">${
            item?.relation
          }</td>
        </tr>`)
    })

    let html =
        '<div style="padding:4px;color:#E74C3C;background-color:#eeeeee;">You have no included dependent/s</div>',
      btn = 'Yes, submit without dependent'

    if (data?.deps.length > 0) {
      btn = 'Yes, submit with dependent/s'
      html = `
        <table style="background-color:#333;width:100%;">
          <thead>
            <tr>
              <th style="color:#fafafa;text-align:left;">Name</th>
              <th style="color:#fafafa;text-align:left;">Birth Date</th>
              <th style="color:#fafafa;text-align:left;">Relationship</th>
            </tr>
          </thead>
            <tbody>
              ${tr}
            </tbody>
        </table>`
    }

    Swal.fire({
      title: 'Submitting Enrollment',
      html: html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: btn,
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        submitDependent({ ...data, setLoading })
      }
    })
  }

  /* const onSubmitWithoutDependent = data => {
    Swal.fire({
      title: 'Are you sure?',
      text:
        'Thank you for your submission. Once you click Submit, you will not be able to make any further changes and your enrollment will be processed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit without dependents',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        submitWithoutDependent({ ...data, setLoading })
        reset({
          deps: [depsForm],
        })
      }
    })
  } */

  const onSave = data => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Saving your transaction only and will not submit.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save only',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        submitWithoutDependent({ ...data, setLoading })
        /* reset({
          deps: [depsForm],
        }) */
      }
    })
  }

  const handleSave = async () => {
    onSave(getValues()) // Proceed to save after optional validation check
  }

  const handleSubmission = async () => {
    const result = await trigger() // Ensure validation is triggered
    if (result) {
      handleSubmit(onSubmitDependent)() // Proceed to submit after validation
    }
  }

  //privacy notice
  useEffect(() => {
    if (page)
      Swal.fire({
        title: '<strong><u>PRIVACY NOTICE</u></strong>',
        icon: 'info',
        html:
          '<div style="text-align:left;font-size:16px;">LLIBI collects your personal data (i.e. email address, mobile number) for the purpose of allowing you to enroll your dependents using our enrollment portal. For more information on our privacy policy, you may visit <a target="_blank" href="https://www.llibi.com/data-privacy" style="color:blue;">www.llibi.com/data-privacy</a> or email us at <a href="mailto:privacy@llibi.com" style="color:blue;">privacy@llibi.com</a>.</div>',
      })
  }, [page])

  return (
    <>
      <GuestLayout title="Remote Philippines Inc. Dependent Self-Enrollment Portal">
        {/* premium computation widget */}
        <PremiumComputation fields={fields} bill={bill} />

        {/* personal details */}
        <form encType="multipart/form-data">
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('memberId')} />
          <input type="hidden" {...register('hireDate')} />
          <input type="hidden" {...register('coverageDate')} />

          {/* header */}
          <div className="flex gap-2">
            <div>
              {/* client logo */}
              <img
                src={`${basePath}/self-enrollment/remotely/logo.jpeg`}
                width={50}
              />
            </div>
            <div className="flex place-items-center">
              <h1 className="text-sm md:text-xl font-bold text-gray-800">
                <span className="text-blue-500">Dependent</span> Self-Enrollment
                Portal
              </h1>
            </div>
          </div>

          {/* employee information */}
          <div className="mt-3 p-4 rounded-md bg-gray-100">
            <div className="mb-2 text-gray-900 font-bold mb-2 lg:flex gap-2">
              {/* header employee name */}
              <div className="flex gap-2">
                <div className="flex place-items-center">
                  <h1>Employee Information</h1>
                </div>
                <div className="ml-3 flex place-items-center">
                  <p className="text-sm md:text-lg text-green-900 capitalize">
                    {client
                      ? client?.principal[0]?.first_name +
                        ' ' +
                        client?.principal[0]?.last_name
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {/* gender and relation select */}
              <div className="-mt-2 ml-6">
                <div className="mt-4 md:grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Gender</p>
                    <Select
                      register={register('gender')}
                      options={[...options?.gender()]}
                    />
                  </div>
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Civil Status</p>
                    <Select
                      register={register('civilStatus')}
                      options={[...options?.civilStatus()]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* grid personal data */}
            <div className="grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Date of Birth</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.birth_date || 'N/A'}
                </p>
              </div>
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Age</p>
                <p className="ml-2 font-bold">
                  {useAge(client?.principal[0]?.birth_date) || 'N/A'}
                </p>
              </div>
              <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Hire Date</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.hire_date || 'N/A'}
                </p>
              </div>
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Member ID</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.member_id || 'N/A'}
                </p>
              </div>
              <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Room & Board</p>
                <p className="ml-2 font-bold text-red-400">
                  {client?.principal[0]?.room_and_board?.toLocaleString(
                    'en-US',
                  ) || 'N/A'}
                </p>
              </div>
              <div className="pr-2 flex md:flex-none lg:flex">
                <p>MBL</p>
                <p className="ml-2 font-bold text-red-400">
                  ₱{' '}
                  {client?.principal[0]?.mbl?.toLocaleString('en-US') || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* eligible dependents */}
          <div className="flex place-items-center justify-center my-4">
            <div className="w-50 text-xs md:text-sm">
              <Hierarchy civilStatus={watch('civilStatus')} />
            </div>
          </div>

          {/* information text fields */}
          <div className="border border-y-2 p-2 mb-2">
            <h1 className="font-bold border-b-2 border-dotted">
              Dependent Information
            </h1>

            <div className="py-2" encType="multipart/form-data">
              <ArrayField props={props} />
            </div>
          </div>
        </form>

        {/* set of buttons for submission */}
        <div className="float-right">
          {/* submit with dependent button */}
          <Button
            //removed for renewal 2024-05-10 / disabled={!client?.principal[0] || fields.length == 0}
            className={
              'normal-case bg-purple-400 hover:bg-purple-700 focus:bg-purple-900 active:bg-purple-500 ring-purple-200 p-2 mb-2 md:mt-0 md:mr-2'
            }
            onClick={handleSubmission}>
            Submit my dependent/s information
          </Button>
          {/* submit without dependent button */}
          {/* 
          <Button
            disabled={!client?.principal[0]}
            className={
              'normal-case bg-orange-400 hover:bg-orange-700 focus:bg-orange-900 active:bg-orange-500 ring-orange-200 p-2'
            }
            onClick={() =>
              onSubmitWithoutDependent({
                id: watch('id'),
                memberId: watch('memberId'),
                civilStatus: watch('civilStatus'),
                gender: watch('gender'),
              })
            }>
            Submit without dependents
          </Button> 
          */}
          <Button
            disabled={!client?.principal[0]}
            className={
              'normal-case bg-green-400 hover:bg-green-700 focus:bg-green-900 active:bg-green-500 ring-green-200 p-2'
            }
            onClick={handleSave}>
            Save and submit later
          </Button>
        </div>

        <Loader loading={loading} />
      </GuestLayout>
    </>
  )
}

export default Dependents
