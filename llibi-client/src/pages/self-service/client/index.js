import ClientLayout from '@/components/Layouts/Self-service/ClientLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ApplicationLogo from '@/components/ApplicationLogo'
import Label from '@/components/Label'
import Input from '@/components/Input'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

/* import BreadCrumb from '@/components/BreadCrumb'
import BreadList from '@/components/BreadCrumbList' */

import { customHooks } from '@/hooks/customHooks'
import { useClient } from '@/hooks/self-service/client'

import Swal from 'sweetalert2'

import { basePath } from '@/../next.config'

import Clock from 'react-live-clock'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import TermsOfUse from '@/components/TermsOfUseModal'
import TermsOfUseModalControl from '@/components/TermsOfUseModalControl'

import TrackReferenceNumber from './TrackReferenceNumber'
import ComplaintForms from '@/components/Self-Service/ComplaintForms'

import { useClientRequestStore } from '@/store/useClientRequestStore'
import { useErrorLogsStore } from '@/store/useErrorLogsStore'
import ReportValidationError from '@/components/Self-Service/ReportValidationError'


const Client = () => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm()

  // const isDependent = useClientRequestStore(state => state.isDependent)
  const setIsDependent = useClientRequestStore(state => state.setIsDependent)

  //RESET FIELDS WHEN TODO IS CHANGED
  useEffect(() => {
    resetField('typeLOA')
    resetField('refNumber')

    //principal
    resetField('principalType')
    resetField('lastName')
    resetField('firstName')
    resetField('dob')
    resetField('memberID')
    resetField('dob2')

    //dependents
    resetField('minorDependent')
    resetField('dependentType')
    resetField('depLastName')
    resetField('depFirstName')
    resetField('depDob')
    resetField('depMemberID')
    resetField('depDob2')

    clearErrors()
  }, [watch('toDo')])

  useEffect(() => {
    resetField('dependentType')
    resetField('depLastName')
    resetField('depFirstName')
    resetField('depDob')
    resetField('depMemberID')
    resetField('depDob2')

    setIsDependent({ isDependent: watch('minorDependent') ?? false })
  }, [watch('minorDependent')])

  useEffect(() => {
    resetField('lastName')
    resetField('firstName')
    resetField('dob')
    resetField('memberID')
    resetField('dob2')
  }, [watch('principalType')])

  useEffect(() => {
    resetField('depLastName')
    resetField('depFirstName')
    resetField('depDob')
    resetField('depMemberID')
    resetField('depDob2')
  }, [watch('dependentType')])

  const [loading, setLoading] = useState(false)

  const { removeUndefined } = customHooks()

  const { validate, getRequest } = useClient()

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const { show: showTerms, setShow: setShowTerms, body: bodyTerms, setBody: setBodyTerms, toggle: toggleTerms } = TermsOfUseModalControl()

  const [request, setRequest] = useState()
  const [greeTingTime, setGreetingTime] = useState('')

  const { errorLogs } = useErrorLogsStore()

  const TODAY = new Date()
  const CURRENT_HOUR = TODAY.getHours()
  useEffect(() => {
    if (CURRENT_HOUR < 12) {
      setGreetingTime('Good morning')
    } else if (CURRENT_HOUR < 18) {
      setGreetingTime('Good afternoon')
    } else {
      setGreetingTime('Good evening')
    }
  }, [CURRENT_HOUR])


  const submitForm = obj => {
    // console.log(obj)
    obj['platform'] = router.query?.platform ?? ''
    if (watch('toDo') != 5) {
    setLoading(true)
    const data = removeUndefined({ obj })
    validate({ setLoading, ...data })
    } else {
      setLoading(true)
      getRequest({ setLoading, setRequest, refno: obj?.refNumber })
    }
  }

  const acceptTermsOfUse = () => {
    setShowTerms(false)
  }

  const handleDeclineTerms = () => {
    router.push(`/declined-TOU?prev=${encodeURIComponent(window.location.href)}`);
  }
  //console.log(errorLogs)
  useEffect(() => {
    if (errorLogs?.id) {
      setBody({
        title: ``,
        content: <ReportValidationError setShow={setShow} />,
        modalOuterContainer: '',
        modalContainer: 'h-full rounded-md',
        modalBody: 'h-full',
      })
      toggle()
    }

    setBodyTerms({
        title: '',
        content: (
          <div className="p-6">
            <h1 className="font-bold text-center text-2xl mb-4 border-b-2 border-blue-800 pb-2">
              Terms of Use
            </h1>
            <p className="text-justify">
              Please read these Terms of Use before using the <b>LLIBI Client Care Portal ("Portal").</b><br /><br />

              By using this Portal, you explicitly consent and agree to comply with the terms set forth below. If you do not agree with these terms, please discontinue your use of the Portal. <br /><br />

              <b>Terms of Use</b><br />

              This <i>Portal</i> is created, owned, and managed by Lacson and Lacson Insurance Brokers, Inc. ("LLIBI"/us/our), to facilitiate online-based services and transactions for our MEMBERS.<br /><br />

              Through this Portal, you may: <br />
            </p>
            <ul>
              <li>
                • Submit online requests for letters of authorization or callbacks;
              </li>
              <li>
                • Upload necessary documentation such as doctor's request and medical certificates;
              </li>
              <li>
                • Confirm active coverage by providing membership data; and
              </li>
              <li>
                • Provide relevant data required to process your requests.
              </li>
            </ul>
            <br />
            <p className="text-justify">
              No enrolment is necessary for use of this <i>Portal</i>.<br /><br />

              While LLIBI implements appropriate security measures, you are expected to use this Portal only for the above purposes. At the same time, you are responsible for safeguarding the confidentiality of the information you provide including your date of birth, emergency card number, and other information required for the use of this <i>Portal</i>.<br /><br />

              LLIBI will never ask for payment information (such as bank or credit card details) via this <i>Portal</i>. Please report immediately if you encounter such requests.<br /><br />

              By using this <i>Portal</i>, you also agree that any information provided will be shared with necessary LLIBI systems for processing your request.<br /><br />

              LLIBI reserves the right to deny access or services through the Portal if fraud is suspected, or if necessary, to conduct investigation.<br /><br />

              <b>Privacy Policy</b><br />

              Your use of the <i>Portal</i> and the personal data provided herein shall be processed strictly in compliance with Republic Act No. 10173, known as the Data Privacy Act of 2012, and its implementing rules and regulations.<br /><br />

              No personal data will be stored within this <i>Portal</i>. Further, to maintain the confidentiality of members’ data, and to provide you with continuous services through this <i>Portal</i>, you are expected to provide accurate information. Users are prohibited from using data mining tools.<br /><br />

              LLIBI reserves the right to decline access or services to this <i>Portal</i> in case of suspected fraud or to facilitate investigation of similar cases.<br /><br />

              Your personal data will only be shared internally within LLIBI’s systems on a strict “need-to-know” basis.  LLIBI will retain your data and transaction records for a period of five (5) years from submission, or in accordance to your consent, whichever is appropriate or in compliance with applicable regulations.<br /><br />

              You are guaranteed the rights provided under the Data Privacy Act, including the right to access, correction, objection, data portability, and the right to lodge a complaint with the National Privacy Commission (NPC).<br /><br />

              For more information on our data handling practices, or if you need assistance regarding your privacy rights, please visit our Privacy Notice at <a href='https://llibi.com/data-privacy/' target='_blank' className='text-blue-700'>https://llibi.com/data-privacy/</a>.<br /><br />

              <b>Liability</b><br />
              LLIBI shall not be liable for any damages or losses arising from your misuse of this <i>Portal</i>, or from circumstances beyond our control, such as unauthorized access resulting from your failure to adequately protect your personal information.<br /><br />

              <b>Changes to these Terms</b><br />
              We may modify these Terms of Use from time to time. Any updates will be clearly posted on this <i>Portal</i>, and your continued use after any changes signifies your acceptance of the updated terms.<br /><br />

              <b>Explicit Consent</b><br />
              By actively submitting information or proceeding with requests via this <i>Portal</i>, you explicitly consent to the collection, processing, and sharing of your personal as described in these Terms and our Privacy Policy.<br /><br />

              If you have any questions regarding these Terms, would like to report a personal data breach, if you believe your personal data have been compromised , or wish to withdraw your consent at any time, please contact us at <a className='text-blue-700' href='mailto:privacy@llibi.com'>privacy@llibi.com.</a>.

            </p>
            <div className="text-center mt-4 gap-3 flex justify-center items-center">
              <Button
                loading={loading}
                className="bg-green-500 hover:bg-green-400 active:bg-green-600 focus:outline-none focus:border-green-600"
                autoFocus={true}
                onClick={acceptTermsOfUse}>
                <ButtonText
                  text="Yes, I Accept the Terms of Use"
                //   loading={loading}
                />
              </Button>

              <Button
                loading={loading}
                className="bg-red-500 hover:bg-red-400 active:bg-red-600 focus:outline-none focus:border-red-600"
                autoFocus={true}
                onClick={handleDeclineTerms}>
                <ButtonText
                  text="No, I Don’t Want to Accept the Terms of Use."
                //   loading={loading}
                />
              </Button>
            </div>
          </div>
        ),
        modalOuterContainer: 'w-11/12 md:w-4/6 py-4 h-screen',
        modalContainer: 'h-full rounded-md',
        modalBody: 'h-full overflow-y-scroll',
      })
      toggleTerms()

  }, [errorLogs?.id])

  useEffect(() => {
    if (request) {
      setBody({
        title: `Request For LOA - Reference #: ${request?.refno}`,
        content: <TrackReferenceNumber request={request} />,
        modalOuterContainer: 'w-11/12 md:w-4/6 max-h-screen',
        modalContainer: 'h-full rounded-md',
        modalBody: 'h-full',
      })
      toggle()
    }
  }, [request])

  useEffect(() => {
    if (loading === 'send-complaint') {
      setBody({
        title: `SEND COMPLAINT`,
        content: <ComplaintForms setShow={setShow} setLoading={setLoading} />,
        modalOuterContainer: 'w-1/2 max-h-screen',
        modalContainer: 'h-full rounded-md',
        modalBody: 'h-full',
      })
      toggle()
    }
  }, [loading])

  // console.log(isDependent)

    const handleFormError = (errors) => {
        // console.log(errors)
        if (errors?.typeLOA) {
            Swal.fire({
            icon: 'warning',
            title: 'Type of LOA is required',
            text: 'Please select either Consultation or Laboratory before submitting.',
            })
        } else if (errors?.toDo) {
            Swal.fire({
            icon: 'warning',
            title: 'Action Required',
            text: 'Please select a request you want to proceed.',
            })
        } else if(errors?.principalType){
            Swal.fire({
                icon: "warning",
                title: 'Membership Verification',
                text: "Provide any information to verify your membership"
            })
        } else if(errors?.memberID || errors?.dob2){
            Swal.fire({
                icon: "warning",
                title: "Input fields are required",
                text: "Member ID and Date of Birth are required"
            })
        } else if(errors?.lastName || errors?.firstName || errors?.dob){
            Swal.fire({
                icon: "warning",
                title: "Input fields are required",
                text: "First Name, Last Name and Date of Birth are required"
            })
        } else if(errors?.dependentType){
            Swal.fire({
                icon: "warning",
                title: 'Dependent Verification',
                text: "Provide any information to verify your dependent"
            })
        } else if(errors?.depDob || errors?.depFirstName || errors?.depLastName){
            Swal.fire({
                icon: "warning",
                title: "Dependent Input fields are required",
                text: "Dependent First Name, Dependent Last Name and Dependent Date of Birth are required"
            })
        }else{
            Swal.fire({
                icon: "warning",
                title: "Dependent Input fields are required",
                text: "Dependent Member ID and Dependent Date of Birth are required"
            })
        }
    }

  return (
    <ClientLayout>
      <Head>
        <title>CLIENT CARE PORTAL - CLIENT</title>
      </Head>

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-4 lg:px-8">
          {/* Main form white background */}
          <div className="p-4 md:p-6 bg-white border border-gray-300 shadow-2xl rounded-2xl bg-opacity-90">
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
            <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

            {/* Action Form */}
            <form onSubmit={handleSubmit(submitForm, handleFormError)}>
              <div className="lg:grid grid-cols-7 gap-4">
                {/* Image */}
                <div
                  className="col-span-2 hidden lg:block h-full bg-contain bg-repeat"
                  style={{
                    backgroundImage: `url(
                                            ${basePath}/self-service/bg-portal.webp)`,
                    boxShadow: '0px 0px 3px 1px rgba(0,0,0,0.15)',
                    borderRadius: 8,
                  }}>
                  <div className="relative h-full w-full pt-5">
                    <img
                      className="sticky rounded-2xl left-0 right-0 top-20 w-full"
                      src={`${basePath}/self-service/portal_sticky.webp`}
                    />
                  </div>
                </div>
                {/* Personal Information */}
                <div className="lg:col-span-5">
                  <div className="border-1 rounded-lg shadow-md mb-4">
                    {/* first question */}
                    <p className="bg-blue-900 text-white shadow rounded-t-lg p-2 mb-3 text-bold text-center">
                      {greeTingTime}, what can we do for you?
                    </p>

                    {/* Error handler for any transactions */}
                    {errors?.toDo && (
                      <p className="ml-4 text-sm text-red-600 w-full mb-2">
                        Please select a request you want to proceed
                      </p>
                    )}

                    {/* Radio buttons for to dos */}
                    <div className="flex gap-2 mb-4 px-6 pb-4">
                      <ul className="w-full">
                        {/* Request for loa */}
                        <li className="mb-2">
                          <div className="flex gap-2 items-center">
                            <input
                              type="radio"
                              {...register('toDo', {
                                required: true,
                              })}
                              id="requestLOA"
                              value="1"
                              className="w-3 h-3"
                            />{' '}
                            <Label htmlFor="requestLOA">Request for LOA</Label>
                          </div>
                          {/* Type of loa to file */}
                          <div
                            className={`my-2 flex gap-3 md:ml-10 bg-gray-700 shadow rounded-md p-2 border-blue-200 flex-col md:flex-row ${
                              watch('toDo') !== '1' && 'hidden'
                            }`}>
                            <div className="basis-1/2">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  {...register('typeLOA', {
                                    required:
                                      watch('toDo') === '1' && '* Required',
                                  })}
                                  id="consultation"
                                  value="consultation"
                                  className={`w-3 h-3`}
                                />{' '}
                                <Label
                                  htmlFor="consultation"
                                  className="text-white">
                                  Consultation{' '}
                                  <span className="text-red-200 text-xs">
                                    {errors?.typeLOA?.message}
                                  </span>
                                </Label>
                              </div>
                            </div>
                            <div className="basis-1/2">
                              <div className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  {...register('typeLOA')}
                                  id="laboratory"
                                  value="laboratory"
                                  className="w-3 h-3"
                                />{' '}
                                <Label
                                  htmlFor="laboratory"
                                  className="text-white">
                                  Laboratory
                                </Label>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="flex gap-2 items-center">
                            <input
                              type="radio"
                              {...register('toDo', {
                                required: true,
                              })}
                              id="trackRefNumber"
                              value="5"
                              className="w-3 h-3"
                            />{' '}
                            <Label htmlFor="trackRefNumber">
                              Track Reference Number
                            </Label>
                          </div>
                          <div
                            className={`my-2 ml-10 bg-gray-700 shadow rounded-xl p-2 border-blue-200 ${
                              watch('toDo') !== '5' && 'hidden'
                            }`}>
                            <Input
                              register={register('refNumber', {
                                required: watch('toDo') === '5',
                              })}
                              id="refNumber"
                              placeholder="Please type reference # here"
                              className={'rounded'}
                              errors={errors?.refNumber}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p
                    className={`text-red-400 text-xs mb-2 font-bold ${
                      !watch('toDo')
                        ? 'blur-sm'
                        : watch('toDo') === '5' && 'blur-sm'
                    }`}>
                    You may provide any of information below to verify your
                    membership. Please choose one (1) only.
                  </p>
                  {/* Employee member info */}
                  <div className="border border-1 border-solid shadow-md rounded-md p-3 mb-4 relative">
                    <h1 className="text-blue-500 text-sm text-bold flex gap-2 items-center mb-2">
                      <input
                        type="radio"
                        {...register('principalType', {
                          required:
                            watch('toDo') !== '5' &&
                            '- This is required to validate your membership',
                        })}
                        id="principalTypePersonal"
                        value="1"
                        className="w-3 h-3"
                      />
                      <Label
                        htmlFor="principalTypePersonal"
                        className="text-blue-500">
                        Use principal member personal details (as shown in
                        Emergency Room card)
                        <span className="text-red-400 text-xs">
                          {errors?.principalType?.message}
                        </span>
                      </Label>
                    </h1>
                    <div className="w-full border-b-2 border-dotted mb-2"></div>

                    {/* Personal information for principal */}
                    <div className="flex gap-2 mb-2 relative p-2 flex-col md:flex-row">
                      <div className="basis-1/3">
                        <Label htmlFor="lastName" className={'mb-1'}>
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          register={{
                            ...register('lastName', {
                              required:
                                watch('principalType') === '1' &&
                                'Last name is required',
                            }),
                          }}
                          placeholder="Enter your Last Name"
                          errors={errors?.lastName}
                        />
                      </div>
                      <div className="basis-1/3">
                        <Label htmlFor="firstName" className={'mb-1'}>
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          register={{
                            ...register('firstName', {
                              required:
                                watch('principalType') === '1' &&
                                'First name is required',
                            }),
                          }}
                          placeholder="Enter your First Name"
                          errors={errors?.firstName}
                        />
                      </div>
                      <div className="basis-1/3">
                        <Label htmlFor="dob" className={'mb-1'}>
                          Date of Birth
                        </Label>
                        <Input
                          onKeyDown={e => {
                            e.preventDefault()
                          }}
                          id="dob"
                          type="date"
                          register={{
                            ...register('dob', {
                              required:
                                watch('principalType') === '1' &&
                                'Date of Birth is required',
                            }),
                          }}
                          placeholder="Enter your Date of Birth"
                          errors={errors?.dob}
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md ${
                          watch('principalType') === '1' && 'hidden'
                        }`}></div>
                    </div>
                    <h1 className="text-blue-500 text-sm text-bold flex gap-2 items-center mb-2">
                      <input
                        type="radio"
                        {...register('principalType')}
                        id="principalTypeMember"
                        value="2"
                        className="w-3 h-3"
                      />
                      <Label
                        htmlFor="principalTypeMember"
                        className="text-blue-500">
                        Use principal member insurance details
                      </Label>
                    </h1>
                    <div className="w-full border-b-2 border-dotted mb-2"></div>

                    {/* Member id for principal */}
                    <div className="flex gap-2 mb-2 relative p-2 flex-col md:flex-row">
                      <div className="basis-1/2">
                        <Label htmlFor="memberID" className={'mb-1'}>
                          Member ID
                        </Label>
                        <Input
                          id="memberID"
                          register={{
                            ...register('memberID', {
                              required:
                                watch('principalType') === '2'
                                  ? 'Member ID is required'
                                  : false,
                            }),
                          }}
                          className=""
                          placeholder="Enter your Member ID"
                          errors={errors?.memberID}
                        />
                      </div>

                      <div className="basis-1/2">
                        <Label htmlFor="dob2" className={'mb-1'}>
                          Date of Birth
                        </Label>
                        <Input
                          onKeyDown={e => {
                            e.preventDefault()
                          }}
                          id="dob2"
                          type="date"
                          register={{
                            ...register('dob2', {
                              required:
                                watch('principalType') === '2' &&
                                'Date of Birth is required',
                            }),
                          }}
                          placeholder="Enter your Date of Birth"
                          errors={errors?.dob2}
                        />
                      </div>

                      <div
                        className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                          watch('principalType') === '2' && 'hidden'
                        }`}></div>
                    </div>

                    {/* Backdrop for Principal */}
                    <div
                      className={`absolute inset-0 flex justify-center items-center z-10 backdrop-blur-sm rounded-md ${
                        watch('toDo') && watch('toDo') !== '5' && 'hidden'
                      }`}></div>
                  </div>

                  {/* checkbox if you want to request for your dependent */}
                  <div
                    className={`flex gap-2 items-center pl-2 mb-3 ${
                      !watch('typeLOA') && 'blur-sm'
                    }`}>
                    <input
                      type="checkbox"
                      {...register('minorDependent')}
                      id="minorDependent"
                      className="w-3 h-3"
                      disabled={!watch('typeLOA') || !watch('principalType')}
                    />
                    <Label
                      htmlFor="minorDependent"
                      className="text-red-400 text-xs">
                      <span className="text-blue-800">
                        (Request for your dependent)
                      </span>{' '}
                      Please provide membership information of your dependent.
                      Please choose one (1) only.
                    </Label>
                  </div>

                  {/* Dependent member info */}
                  <div className="border border-1 border-solid shadow-md rounded-md p-2 relative mb-3">
                    <h1 className="text-blue-500 text-bold flex gap-2 items-center mb-2">
                      <input
                        type="radio"
                        {...register('dependentType', {
                          required:
                            watch('minorDependent') &&
                            ' - This is required to validate dependent membership',
                        })}
                        id="dependentTypePersonal"
                        value="1"
                        className="w-3 h-3"
                      />
                      <Label
                        htmlFor="dependentTypePersonal"
                        className="text-blue-500">
                        Use dependent member personal details (as shown in
                        Emergency Room card)
                        <span className="text-red-400 text-xs">
                          {errors?.dependentType?.message}
                        </span>
                      </Label>
                    </h1>
                    <div className="w-full border-b-2 border-dotted mb-2"></div>

                    {/* Personal information for dependent */}
                    <div className="flex gap-2 mb-2 relative p-2 flex-col md:flex-row">
                      <div className="basis-1/3">
                        <Label htmlFor="depLastName" className={'mb-1'}>
                          Last Name
                        </Label>
                        <Input
                          id="depLastName"
                          register={{
                            ...register('depLastName', {
                              required:
                                watch('dependentType') === '1' &&
                                'Last name is required',
                            }),
                          }}
                          placeholder="Dependent Last Name"
                          errors={errors?.depLastName}
                        />
                      </div>
                      <div className="basis-1/3">
                        <Label htmlFor="depFirstName" className={'mb-1'}>
                          First Name
                        </Label>
                        <Input
                          id="depFirstName"
                          register={{
                            ...register('depFirstName', {
                              required:
                                watch('dependentType') === '1' &&
                                'First name is required',
                            }),
                          }}
                          placeholder="Dependent First Name"
                          errors={errors?.depFirstName}
                        />
                      </div>
                      <div className="basis-1/3">
                        <Label htmlFor="depDob" className={'mb-1'}>
                          Date of Birth
                        </Label>
                        <Input
                          onKeyDown={e => {
                            e.preventDefault()
                          }}
                          id="depDob"
                          type="date"
                          register={{
                            ...register('depDob', {
                              required:
                                watch('dependentType') === '1' &&
                                'Date of Birth is required',
                            }),
                          }}
                          placeholder="Dependent Date of Birth"
                          errors={errors?.depDob}
                        />
                      </div>

                      <div
                        className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                          watch('dependentType') === '1' && 'hidden'
                        }`}></div>
                    </div>
                    <h1 className="text-blue-500 text-bold flex gap-2 items-center mb-2">
                      <input
                        type="radio"
                        {...register('dependentType')}
                        id="dependentTypeMember"
                        value="2"
                        className="w-3 h-3"
                      />
                      <Label
                        htmlFor="dependentTypeMember"
                        className="text-blue-500">
                        Use dependent member insurance details
                      </Label>
                    </h1>
                    <div className="w-full border-b-2 border-dotted mb-2"></div>

                    {/* Member id for dependent */}
                    <div className="flex gap-2 mb-2 relative p-2 flex-col md:flex-row">
                      <div className="basis-1/2">
                        <Label htmlFor="depMemberID" className={'mb-1'}>
                          Member ID
                        </Label>
                        <Input
                          id="depMemberID"
                          register={{
                            ...register('depMemberID', {
                              required:
                                watch('dependentType') === '2' &&
                                'Member ID is required',
                            }),
                          }}
                          placeholder="Dependent Member ID"
                          errors={errors?.depMemberID}
                        />
                      </div>
                      <div className="basis-1/2">
                        <Label htmlFor="depDob2" className={'mb-1'}>
                          Date of Birth
                        </Label>
                        <Input
                          onKeyDown={e => {
                            e.preventDefault()
                          }}
                          id="depDob2"
                          type="date"
                          register={{
                            ...register('depDob2', {
                              required:
                                watch('dependentType') === '2' &&
                                'Date of Birth is required',
                            }),
                          }}
                          placeholder="Dependent Date of Birth"
                          errors={errors?.depDob2}
                        />
                      </div>
                      <div
                        className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                          watch('dependentType') === '2' && 'hidden'
                        }`}></div>
                    </div>

                    {/* Backdrop for Dependents */}
                    <div
                      className={`absolute inset-0 flex justify-center items-center z-10 backdrop-blur-sm rounded-md ${
                        watch('typeLOA') && watch('minorDependent') && 'hidden'
                      }`}></div>
                  </div>

                  <Button
                    loading={loading}
                    className="bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
                    <ButtonText
                      text="Submit and Proceed to Your Request"
                      loading={loading}
                    />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Modal show={show} body={body} toggle={toggle} />
        <TermsOfUse show={showTerms} body={bodyTerms} toggle={toggleTerms} />
      </div>
    </ClientLayout>
  )
}

export default Client
