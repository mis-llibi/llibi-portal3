import React from 'react'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Label from '@/components/Label'
import Input from '@/components/Input'
import InputMask from '@/components/InputMask'

import InputSelectMultiple from '@/components/InputSelectMultiple'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useClient } from '@/hooks/self-service/client'

import ProviderLookupForm from './ProviderLookupForm'

import Swal from 'sweetalert2'

import { SlHome } from 'react-icons/sl'

const RequestForLoaConsultation = ({ refno, loatype }) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm()

  //const [sysload, setSysload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState()
  const { getRequest, updateRequest } = useClient()

  useEffect(() => {
    setLoading(true)
    getRequest({ setLoading, setRequest, refno })
  }, [])

  const submitForm = data => {
    Swal.fire({
      title: 'Are you sure?',
      text:
        'Once you click Submit, you will not be able to make any further changes to your LOA request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm',
    }).then(result => {
      if (result.isConfirmed) {
        //Swal.fire('Submitted!', 'Your file has been deleted.', 'success')
        setLoading(true)
        updateRequest({ setRequest, setLoading, ...data })
      }
    })
  }

  const complaint = [
    { value: 0, label: 'Back Pain / Body Pain' },
    { value: 1, label: 'Chest Pain' },
    { value: 2, label: 'Cough' },
    { value: 3, label: 'Cold, Flu-like symtoms' },
    { value: 4, label: 'Headache' },
    { value: 5, label: 'Urinary Complaints' },
    { value: 6, label: 'Ear Pain' },
    { value: 7, label: 'Highblood pressure' },
    { value: 8, label: 'Nausea' },
    { value: 9, label: 'Diarrhea' },
    { value: 10, label: 'Sore Throat' },
    { value: 11, label: 'Eye Conditions' },
    { value: 12, label: 'Skin Conditions' },
    { value: 13, label: 'Menstral Pain' },
    { value: 14, label: 'Abdominal Pain' },
    { value: 15, label: 'Joint Pain' },
    { value: 16, label: 'Mass / Lump' },
    { value: 17, label: 'Pre and Post natal consultation' },
    { value: 18, label: 'Allergies' },
    { value: 19, label: 'Dizziness' },
    { value: 20, label: 'Fever' },
  ]

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const [selectedHospital, setSelectedHospital] = useState()
  const [selectedDoctor, setSelectedDoctor] = useState()
  const [sendLoaToProvider, setSendLoadToProvider] = useState(0)

  const findProvider = () => {
    setBody({
      title:
        'Find your preferred accredited provider (Hospital / Clinic / Doctor)',
      content: (
        <ProviderLookupForm
          setShow={setShow}
          setSelectedHospital={setSelectedHospital}
          setSelectedDoctor={setSelectedDoctor}
          setSendLoadToProvider={setSendLoadToProvider}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  useEffect(() => {
    if (selectedHospital)
      setValue(
        'provider',
        `${selectedHospital?.id}||${selectedHospital?.name}++${
          selectedHospital?.address
        }++${selectedHospital?.city}++${selectedHospital?.state}++${
          selectedHospital?.email1
        }--${selectedDoctor?.id || 0}||${selectedDoctor?.last || ''}, ${
          selectedDoctor?.first || ''
        }++${selectedDoctor?.specialization || ''}`,
      )
    setValue('providerEmail2', selectedHospital?.email2)
  }, [selectedHospital, selectedDoctor])

  useEffect(() => {
    setValue('sendLoaToProvider', sendLoaToProvider)
  }, [sendLoaToProvider])

  return (
    <>
      {/* Action Form */}
      <form onSubmit={handleSubmit(submitForm)}>
        <input type="hidden" {...register('refno')} value={refno} />
        <input type="hidden" {...register('loaType')} value={loatype} />
        <div className="relative">
          <p className="p-2 md:p-4 mb-4 bg-gray-100 shadow rounded-md">
            Hi{' '}
            <span className="font-semibold capitalize">
              {request?.firstName?.toLowerCase()}{' '}
              {request?.lastName?.toLowerCase()}
            </span>
            <span className={`${!request?.isDependent && 'hidden'}`}>
              , you are requesting for your dependent{' '}
              <span className="font-semibold capitalize">
                {request?.depFirstName?.toLowerCase()}{' '}
                {request?.depLastName?.toLowerCase()}
              </span>
            </span>
            , Kindly answer the following:
          </p>

          <ol className="p-2 md:p-4 shadow-md rounded-md border mb-4">
            {/* Chief Complaint */}
            <li>
              <Label
                htmlFor="complaint"
                className="text-blue-500 text-bold mb-2">
                Why are you requesting for an LOA (Chief complaint)?
              </Label>
              <div className="w-full border-b-2 border-dotted mb-2"></div>
              <div className="mb-3">
                <InputSelectMultiple
                  id="complaint"
                  label="Select or type complaint"
                  register={register('complaint')}
                  required={true}
                  errors={errors?.complaint}
                  control={control}
                  option={
                    complaint.sort(function (a, b) {
                      var textA = a.label.toUpperCase()
                      var textB = b.label.toUpperCase()
                      return textA < textB ? -1 : textA > textB ? 1 : 0
                    }) || []
                  }
                />
              </div>
            </li>

            {/* Provider */}
            <li className="mt-2 mb-4">
              <Label
                htmlFor="preferredProvider"
                className="text-blue-500 text-bold mb-2">
                Find your preferred accredited provider{' '}
                <b>(Hospital / Clinic)</b>
              </Label>
              <div className="w-full border-b-2 border-dotted mb-3"></div>
              <a
                className="px-6 py-2 text-sm transition duration-200 ease-in-out bg-gradient-to-r from-cyan-300 to-blue-300 hover:bg-gradient-to-l transform hover:-translate-y-1 hover:scale-110 hover:shadow-sm cursor-pointer rounded-md"
                onClick={() => findProvider()}>
                Find and select your preferred provider
              </a>
              <input
                type="hidden"
                {...register('provider', {
                  required:
                    'You must select Hospital or Clinic to complete the assessment',
                })}
              />
              <span className="ml-2 text-red-500 text-xs font-semibold">
                {errors?.provider?.message}
              </span>

              <div
                className={`flex mt-4 p-2 border border-1 border-gray-400 border-dashed bg-gray-100 ${
                  !selectedHospital && 'hidden'
                }`}>
                <div className="basis-1/2 text-sm">
                  <p className="font-bold mb-1">
                    Hospital / Clinic:{' '}
                    <span className="font-normal">
                      {selectedHospital?.name}
                    </span>
                  </p>
                  <p className="font-bold mb-1">
                    Address:{' '}
                    <span className="font-normal">
                      {selectedHospital?.address}
                    </span>
                  </p>
                  <p className="font-bold mb-1">
                    City:{' '}
                    <span className="font-normal">
                      {selectedHospital?.city}
                    </span>
                  </p>
                  <p className="font-bold mb-1">
                    State:{' '}
                    <span className="font-normal">
                      {selectedHospital?.state}
                    </span>
                  </p>
                  {/* <p className="font-bold mb-1">
                    Email:{' '}
                    <span className="font-normal">
                      {selectedHospital?.email2}
                    </span>
                  </p> */}
                  {/* <p className="font-bold mb-1">
                    Send loa to provider:{' '}
                    <input
                      type="checkbox"
                      checked={sendLoaToProvider}
                      onChange={() =>
                        setSendLoadToProvider(sendLoaToProvider == 0 ? 1 : 0)
                      }
                    />
                  </p> */}
                </div>
                <div
                  className={`basis-1/2 text-sm border-l-2 pl-2 flex items-center ${
                    !selectedDoctor && 'justify-center'
                  }`}>
                  <div
                    className={`text-red-600 font-semibold ${
                      selectedDoctor && 'hidden'
                    }`}>
                    No doctor selected
                  </div>
                  <div className={`capitalize ${!selectedDoctor && 'hidden'}`}>
                    <p className="font-bold mb-1">
                      Doctor:{' '}
                      <span className="font-normal">
                        {selectedDoctor?.last}, {selectedDoctor?.first}
                      </span>
                    </p>
                    <p className="font-bold mb-1">
                      Specialization:{' '}
                      <span className="font-normal">
                        {selectedDoctor?.specialization}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </li>

            {/* Email Address */}
            <li>
              <div className="grid lg:grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-blue-500 text-bold mb-2 lg:text-xs">
                    Please provide us your email address for the LOA and other
                    notification
                  </Label>
                  <div className="w-full border-b-2 border-dotted mb-2"></div>
                  <div className="mb-3">
                    <Input
                      id="email"
                      register={{
                        ...register('email', {
                          required:
                            'This is required so we can send the LOA to your email address',
                        }),
                      }}
                      type="email"
                      placeholder="Email address"
                      errors={errors?.email}
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="altEmail"
                    className="text-blue-500 text-bold mb-2 lg:text-xs">
                    Alternate Email (Optional)
                  </Label>
                  <div className="w-full border-b-2 border-dotted mb-2"></div>
                  <div className="mb-3">
                    <Input
                      id="altEmail"
                      register={{
                        ...register('altEmail'),
                      }}
                      type="altEmail"
                      placeholder="Alternate Email address"
                      errors={errors?.altEmail}
                    />
                  </div>
                </div>
              </div>
            </li>

            {/* Mobile Number */}
            <li>
              <Label htmlFor="contact" className="text-blue-500 text-bold mb-2">
                We can also notify you thru SMS (Approval / Disapproval, LOA
                Number, Approval code){' '}
                {/* <span className="text-orange-800">
                                    *Optional
                                </span> */}
              </Label>
              <div className="w-full border-b-2 border-dotted mb-2"></div>
              <div className="mb-3 md:w-3/6">
                <InputMask
                  id="contact"
                  register={{
                    ...register('contact'),
                  }}
                  placeholder="Contact number"
                  errors={errors?.contact}
                />
              </div>
            </li>
          </ol>

          <div className="w-full text-center grid gap-2 grid-cols-2">
            <Button
              loading={loading}
              className="mr-2 bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
              <ButtonText text="Submit Request" loading={loading} />
            </Button>

            <Link href="/">
              <Button className="bg-red-300 hover:bg-red-600 active:bg-red-700 cursor-pointer">
                <SlHome className="mr-2" />
                <span>Go Back to Home Page</span>
              </Button>
            </Link>
          </div>

          {/* Backdrop form */}
          <div
            className={`absolute inset-0 flex justify-center items-center z-10 bg-black/70 backdrop-blur-sm rounded-md ${
              request?.status && request?.status === 1 && 'hidden'
            }`}>
            <span className="text-white font-semibold">
              {request?.status ? (
                <div className="text-center">
                  Your request has been submitted, your reference # is{' '}
                  <span className="text-orange-300">{refno}</span>
                  . <br /> We will notify you through the email and mobile
                  number you provided.
                  <br />
                  <br />
                  <Link href="/">
                    <Button className="bg-red-300 hover:bg-red-600 active:bg-red-700 cursor-pointer">
                      <SlHome className="mr-2" />
                      <span>Go Back to Home Page</span>
                    </Button>
                  </Link>
                </div>
              ) : loading ? (
                <>Loading data, please wait a moment...</>
              ) : (
                <>
                  We cannot find you in our database, please go back to the
                  member's form.
                </>
              )}
            </span>
          </div>
        </div>
      </form>

      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}

export default RequestForLoaConsultation
