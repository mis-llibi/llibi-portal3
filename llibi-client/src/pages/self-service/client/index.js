import ClientLayout from '@/components/Layouts/Self-service/ClientLayout'
import Head from 'next/head'

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

import TrackReferenceNumber from './TrackReferenceNumber'

const Client = () => {
    const {
        handleSubmit,
        register,
        control,
        watch,
        resetField,
        clearErrors,
        formState: { errors },
    } = useForm()

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

    const [request, setRequest] = useState()
    const submitForm = obj => {
        if (watch('toDo') != 5) {
            /* setFire(true)
            Swal.fire({
                title: '<strong>Terms Of Use</strong>',
                width: '100%',
                allowOutsideClick: false,
                html:
                    '<div style="line-height: 1.6;">' +
                    '<p style="text-align:left;">You are using the <b>LLIBI Client Care Portal</b> created, owned, and managed by Lacson and Lacson Insurance Brokers, Inc. (“LLIBI”/us/our) to provide online-based services to facilitate services to our MEMBERS for their transactions with us. Use of this <i>portal</i> is optional. Use of this Portal and data herein shall be in accordance with Philippine laws including Republic Act No. 10173 (Data Privacy Act of 2012). <br /><br />This Portal allows you, the User, to do the following:</p>' +
                    '<ul style="text-align:left;"><li>• Submit an online request for a letter of authorization, callback;</li><li>•	Upload copies of your doctor’s request, medical certificate, and other documents to facilitate your request;</li><li>• Confirm your active coverage by providing your membership data; and</li><li>• Provide only relevant data in connection to your request.</li></ul><br />' +
                    '<p style="text-align:left;">No enrolment is necessary for use of this <i>portal</i>. You are responsible to protect the confidentiality of the information you provide, including your date of birth, emergency card number, and other information. This Portal will never ask for payment information. Please do not provide any financial information such as bank account numbers, credit card numbers, and the like. <br /><br />While LLIBI will implement appropriate security measures, you are expected to use this <i>portal</i> only for the above purposes. No personal data will be stored in this <i>portal</i>. Further, to maintain the confidentiality of members’ data, and to provide you with continuous services through this <i>portal</i> you are expected to provide accurate information. Users are prohibited from using data mining tools. LLIBI reserves the right to decline access or services to this <i>portal</i> in case of suspected fraud or to facilitate investigation of similar cases.<br /><br />Your personal data will be shared only to those with a business need to know. LLIBI will retain your data and transaction records for a period of five (5) years from submission, or in accordance to your consent, whichever is appropriate or in compliance with applicable regulations.<br /><br />For more information on how LLIBI handles your personal data, please visit our Privacy Notice at <a style="color:blue;" href="https://llibi.com/data-privacy/" target="_blank">https://llibi.com/data-privacy/</a><br/><br />If you have questions, or would like to report a personal data breach, or if you believe your personal data have been compromised, please email <a style="color:blue;" href="mailto:privacy@llibi.com">privacy@llibi.com</a></p>' +
                    '</div>',
                showCancelButton: true,
                confirmButtonText: 'Yes, accept it',
                cancelButtonText: 'No, cancel',
            }).then(result => {
                //Read more about isConfirmed, isDenied below 
                if (result.isConfirmed) {
                    //Swal.fire('You accepted, terms of use', '', 'success')
                    setLoading(true)
                    const data = removeUndefined({ obj })
                    validate({ setLoading, ...data })
                }
            }) */
            setBody({
                title: '',
                content: (
                    <div className="p-6">
                        <h1 className="font-bold text-center text-2xl mb-4 border-b-2 border-blue-800 pb-2">
                            Terms of Use
                        </h1>
                        <p className="text-justify">
                            You are using the <b>LLIBI Client Care Portal</b>{' '}
                            created, owned, and managed by Lacson and Lacson
                            Insurance Brokers, Inc. (“LLIBI”/us/our) to provide
                            online-based services to facilitate services to our
                            MEMBERS for their transactions with us. Use of this{' '}
                            <i>portal</i> is optional. Use of this Portal and
                            data herein shall be in accordance with Philippine
                            laws including Republic Act No. 10173 (Data Privacy
                            Act of 2012). <br />
                            <br />
                            This Portal allows you, the User, to do the
                            following:
                        </p>
                        <ul>
                            <li>
                                • Submit an online request for a letter of
                                authorization, callback;
                            </li>
                            <li>
                                • Upload copies of your doctor’s request,
                                medical certificate, and other documents to
                                facilitate your request;
                            </li>
                            <li>
                                • Confirm your active coverage by providing your
                                membership data; and
                            </li>
                            <li>
                                • Provide only relevant data in connection to
                                your request.
                            </li>
                        </ul>
                        <br />
                        <p className="text-justify">
                            No enrolment is necessary for use of this{' '}
                            <i>portal</i>. You are responsible to protect the
                            confidentiality of the information you provide,
                            including your date of birth, emergency card number,
                            and other information. This Portal will never ask
                            for payment information. Please do not provide any
                            financial information such as bank account numbers,
                            credit card numbers, and the like. <br />
                            <br />
                            While LLIBI will implement appropriate security
                            measures, you are expected to use this <i>
                                portal
                            </i>{' '}
                            only for the above purposes. No personal data will
                            be stored in this <i>portal</i>. Further, to
                            maintain the confidentiality of members’ data, and
                            to provide you with continuous services through this{' '}
                            <i>portal</i> you are expected to provide accurate
                            information. Users are prohibited from using data
                            mining tools. LLIBI reserves the right to decline
                            access or services to this <i>portal</i> in case of
                            suspected fraud or to facilitate investigation of
                            similar cases.
                            <br />
                            <br />
                            Your personal data will be shared only to those with
                            a business need to know. LLIBI will retain your data
                            and transaction records for a period of five (5)
                            years from submission, or in accordance to your
                            consent, whichever is appropriate or in compliance
                            with applicable regulations.
                            <br />
                            <br />
                            For more information on how LLIBI handles your
                            personal data, please visit our Privacy Notice at{' '}
                            <a
                                className="text-blue-700"
                                href="https://llibi.com/data-privacy/"
                                target="_blank">
                                https://llibi.com/data-privacy/
                            </a>
                            <br />
                            <br />
                            If you have questions, or would like to report a
                            personal data breach, or if you believe your
                            personal data have been compromised, please email{' '}
                            <a
                                className="text-blue-700"
                                href="mailto:privacy@llibi.com">
                                privacy@llibi.com
                            </a>
                        </p>
                        <div className="text-center mt-4">
                            <Button
                                loading={loading}
                                className="bg-green-500 hover:bg-green-400 active:bg-green-600 focus:outline-none focus:border-green-600"
                                autoFocus={true}
                                onClick={() => acceptTermsOfUse(obj)}>
                                <ButtonText
                                    text="Yes, I Accept the Terms of Use"
                                    loading={loading}
                                />
                            </Button>
                        </div>
                    </div>
                ),
                modalOuterContainer: 'w-11/12 md:w-4/6 py-4 h-screen',
                modalContainer: 'h-full rounded-md',
                modalBody: 'h-full overflow-y-scroll',
            })
            toggle()
        } else {
            setLoading(true)
            getRequest({ setLoading, setRequest, refno: obj?.refNumber })
        }
    }

    const acceptTermsOfUse = obj => {
        setShow(false)
        setLoading(true)
        const data = removeUndefined({ obj })
        validate({ setLoading, ...data })
    }

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
                                        <span className="text-blue-900">
                                            Client Care Portal
                                        </span>
                                    </p>
                                    <p className="text-sm text-shadow-lg text-gray-700">
                                        <Clock
                                            format={
                                                'dddd, MMMM Do, YYYY, h:mm:ss A'
                                            }
                                            ticking={true}
                                            timezone={'Asia/Manila'}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

                        {/* Bread Crumb */}
                        {/* <BreadCrumb
                            breadActive={0}
                            breadCrumb={BreadList?.clientForm}
                        /> */}

                        {/* Action Form */}
                        <form onSubmit={handleSubmit(submitForm)}>
                            <div className="lg:grid grid-cols-7 gap-4">
                                {/* Image */}
                                <div
                                    className="col-span-2 hidden lg:block h-full bg-contain bg-repeat"
                                    style={{
                                        backgroundImage: `url(
                                            ${basePath}/self-service/bg-portal.webp)`,
                                        boxShadow:
                                            '0px 0px 3px 1px rgba(0,0,0,0.15)',
                                        borderRadius: 8,
                                    }}>
                                    {/* <img
                                        classN
                                        ame="overflow-hidden h-full w-full shadow-lg rounded-lg place-items-center"
                                        src={`${basePath}/self-service/portal_bg.webp`}
                                    /> */}

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
                                            Good day, what can we do for you
                                            today?
                                        </p>
                                        {/* <div className="w-full border-b-2 border-dotted mb-2"></div> */}

                                        {/* Error handler for any transactions */}
                                        {errors?.toDo && (
                                            <p className="ml-4 text-sm text-red-600 w-full mb-2">
                                                Please select a request you want
                                                to proceed
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
                                                            {...register(
                                                                'toDo',
                                                                {
                                                                    required: true,
                                                                },
                                                            )}
                                                            id="requestLOA"
                                                            value="1"
                                                            className="w-3 h-3"
                                                        />{' '}
                                                        <Label htmlFor="requestLOA">
                                                            Request for a LOA
                                                        </Label>
                                                    </div>
                                                    {/* Type of loa to file */}
                                                    <div
                                                        className={`my-2 flex ml-10 bg-gray-700 shadow rounded-md p-2 border-blue-200 ${
                                                            watch('toDo') !==
                                                                '1' && 'hidden'
                                                        }`}>
                                                        <div className="basis-1/2">
                                                            <div className="flex gap-2 items-center">
                                                                <input
                                                                    type="radio"
                                                                    {...register(
                                                                        'typeLOA',
                                                                        {
                                                                            required:
                                                                                watch(
                                                                                    'toDo',
                                                                                ) ===
                                                                                    '1' &&
                                                                                '* Required',
                                                                        },
                                                                    )}
                                                                    id="consultation"
                                                                    value="consultation"
                                                                    className={`w-3 h-3`}
                                                                />{' '}
                                                                <Label
                                                                    htmlFor="consultation"
                                                                    className="text-white">
                                                                    Consultation{' '}
                                                                    <span className="text-red-200 text-xs">
                                                                        {
                                                                            errors
                                                                                ?.typeLOA
                                                                                ?.message
                                                                        }
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        </div>
                                                        <div className="basis-1/2">
                                                            <div className="flex gap-2 items-center">
                                                                <input
                                                                    type="radio"
                                                                    {...register(
                                                                        'typeLOA',
                                                                    )}
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
                                                {/* scheduleCall */}
                                                <li className="flex gap-2 mb-2 items-center">
                                                    <input
                                                        type="radio"
                                                        {...register('toDo', {
                                                            required: true,
                                                        })}
                                                        id="scheduleCall"
                                                        value="2"
                                                        className="w-3 h-3"
                                                    />{' '}
                                                    <Label htmlFor="scheduleCall">
                                                        Request for Callback /
                                                        Schedule a Call
                                                    </Label>
                                                </li>
                                                {/* requestCallback */}
                                                {/* <li className="flex gap-2 mb-2 items-center">
                                                <input
                                                    type="radio"
                                                    {...register('toDo', {
                                                        required: true,
                                                    })}
                                                    id="requestCallback"
                                                    value="3"
                                                    className="w-3 h-3"
                                                />{' '}
                                                <Label htmlFor="requestCallback">
                                                    Request for a Callback
                                                </Label>
                                            </li> */}
                                                {/* fileReimbursement */}
                                                {/* <li className="flex gap-2 mb-2 items-center">
                                                <input
                                                    type="radio"
                                                    {...register('toDo', {
                                                        required: true,
                                                    })}
                                                    id="fileReimbursement"
                                                    value="4"
                                                    className="w-3 h-3"
                                                />{' '}
                                                <Label htmlFor="fileReimbursement">
                                                    File for a Reimbursement
                                                </Label>
                                            </li> */}
                                                {/* trackRefNumber */}
                                                <li>
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="radio"
                                                            {...register(
                                                                'toDo',
                                                                {
                                                                    required: true,
                                                                },
                                                            )}
                                                            id="trackRefNumber"
                                                            value="5"
                                                            className="w-3 h-3"
                                                        />{' '}
                                                        <Label htmlFor="trackRefNumber">
                                                            Track Reference
                                                            Number
                                                        </Label>
                                                    </div>
                                                    <div
                                                        className={`my-2 ml-10 bg-gray-700 shadow rounded-xl p-2 border-blue-200 ${
                                                            watch('toDo') !==
                                                                '5' && 'hidden'
                                                        }`}>
                                                        <Input
                                                            register={register(
                                                                'refNumber',
                                                                {
                                                                    required:
                                                                        watch(
                                                                            'toDo',
                                                                        ) ===
                                                                        '5',
                                                                },
                                                            )}
                                                            id="refNumber"
                                                            placeholder="Please type reference # here"
                                                            className={
                                                                'rounded'
                                                            }
                                                            errors={
                                                                errors?.refNumber
                                                            }
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
                                                : watch('toDo') === '5' &&
                                                  'blur-sm'
                                        }`}>
                                        You may provide any of information below
                                        to verify your membership. Please choose
                                        one (1) only.
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
                                                Use personal details{' '}
                                                <span className="text-red-400 text-xs">
                                                    {
                                                        errors?.principalType
                                                            ?.message
                                                    }
                                                </span>
                                            </Label>
                                        </h1>
                                        <div className="w-full border-b-2 border-dotted mb-2"></div>

                                        {/* Personal information for principal */}
                                        <div className="flex gap-2 mb-2 relative p-2">
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="lastName"
                                                    className={'mb-1'}>
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    register={{
                                                        ...register(
                                                            'lastName',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'principalType',
                                                                    ) === '1' &&
                                                                    'Last name is required',
                                                            },
                                                        ),
                                                    }}
                                                    placeholder="Enter your Last Name"
                                                    errors={errors?.lastName}
                                                />
                                            </div>
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="firstName"
                                                    className={'mb-1'}>
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    register={{
                                                        ...register(
                                                            'firstName',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'principalType',
                                                                    ) === '1' &&
                                                                    'First name is required',
                                                            },
                                                        ),
                                                    }}
                                                    placeholder="Enter your First Name"
                                                    errors={errors?.firstName}
                                                />
                                            </div>
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="dob"
                                                    className={'mb-1'}>
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    register={{
                                                        ...register('dob', {
                                                            required:
                                                                watch(
                                                                    'principalType',
                                                                ) === '1' &&
                                                                'Date of Birth is required',
                                                        }),
                                                    }}
                                                    placeholder="Enter your Date of Birth"
                                                    errors={errors?.dob}
                                                />
                                            </div>
                                            <div
                                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md ${
                                                    watch('principalType') ===
                                                        '1' && 'hidden'
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
                                                Use insurance details
                                            </Label>
                                        </h1>
                                        <div className="w-full border-b-2 border-dotted mb-2"></div>

                                        {/* Member id for principal */}
                                        <div className="flex gap-2 mb-2 relative p-2">
                                            <div className="basis-1/2">
                                                <Label
                                                    htmlFor="memberID"
                                                    className={'mb-1'}>
                                                    Member ID
                                                </Label>
                                                <Input
                                                    id="memberID"
                                                    register={{
                                                        ...register(
                                                            'memberID',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'principalType',
                                                                    ) === '2'
                                                                        ? 'Member ID is required'
                                                                        : false,
                                                            },
                                                        ),
                                                    }}
                                                    className=""
                                                    placeholder="Enter your Member ID"
                                                    errors={errors?.memberID}
                                                />
                                            </div>

                                            <div className="basis-1/2">
                                                <Label
                                                    htmlFor="dob2"
                                                    className={'mb-1'}>
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id="dob2"
                                                    type="date"
                                                    register={{
                                                        ...register('dob2', {
                                                            required:
                                                                watch(
                                                                    'principalType',
                                                                ) === '2' &&
                                                                'Date of Birth is required',
                                                        }),
                                                    }}
                                                    placeholder="Enter your Date of Birth"
                                                    errors={errors?.dob2}
                                                />
                                            </div>

                                            <div
                                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                                                    watch('principalType') ===
                                                        '2' && 'hidden'
                                                }`}></div>
                                        </div>

                                        {/* Backdrop for Principal */}
                                        <div
                                            className={`absolute inset-0 flex justify-center items-center z-10 backdrop-blur-sm rounded-md ${
                                                watch('toDo') &&
                                                watch('toDo') !== '5' &&
                                                'hidden'
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
                                            disabled={!watch('typeLOA')}
                                        />
                                        <Label
                                            htmlFor="minorDependent"
                                            className="text-red-400 text-xs">
                                            <span className="text-blue-800">
                                                (Request for your dependent)
                                            </span>{' '}
                                            Please provide membership
                                            information for your dependent.
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
                                                        watch(
                                                            'minorDependent',
                                                        ) &&
                                                        ' - This is required to validate dependent membership',
                                                })}
                                                id="dependentTypePersonal"
                                                value="1"
                                                className="w-3 h-3"
                                            />
                                            <Label
                                                htmlFor="dependentTypePersonal"
                                                className="text-blue-500">
                                                Use dependent personal details{' '}
                                                <span className="text-red-400 text-xs">
                                                    {
                                                        errors?.dependentType
                                                            ?.message
                                                    }
                                                </span>
                                            </Label>
                                        </h1>
                                        <div className="w-full border-b-2 border-dotted mb-2"></div>

                                        {/* Personal information for dependent */}
                                        <div className="flex gap-2 mb-2 relative p-2">
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="depLastName"
                                                    className={'mb-1'}>
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="depLastName"
                                                    register={{
                                                        ...register(
                                                            'depLastName',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'dependentType',
                                                                    ) === '1' &&
                                                                    'Last name is required',
                                                            },
                                                        ),
                                                    }}
                                                    placeholder="Dependent Last Name"
                                                    errors={errors?.depLastName}
                                                />
                                            </div>
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="depFirstName"
                                                    className={'mb-1'}>
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="depFirstName"
                                                    register={{
                                                        ...register(
                                                            'depFirstName',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'dependentType',
                                                                    ) === '1' &&
                                                                    'First name is required',
                                                            },
                                                        ),
                                                    }}
                                                    placeholder="Dependent First Name"
                                                    errors={
                                                        errors?.depFirstName
                                                    }
                                                />
                                            </div>
                                            <div className="basis-1/3">
                                                <Label
                                                    htmlFor="depDob"
                                                    className={'mb-1'}>
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id="depDob"
                                                    type="date"
                                                    register={{
                                                        ...register('depDob', {
                                                            required:
                                                                watch(
                                                                    'dependentType',
                                                                ) === '1' &&
                                                                'Date of Birth is required',
                                                        }),
                                                    }}
                                                    placeholder="Dependent Date of Birth"
                                                    errors={errors?.depDob}
                                                />
                                            </div>

                                            <div
                                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                                                    watch('dependentType') ===
                                                        '1' && 'hidden'
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
                                                Use dependent insurance details
                                            </Label>
                                        </h1>
                                        <div className="w-full border-b-2 border-dotted mb-2"></div>

                                        {/* Member id for dependent */}
                                        <div className="flex gap-2 mb-2 relative p-2">
                                            <div className="basis-1/2">
                                                <Label
                                                    htmlFor="depMemberID"
                                                    className={'mb-1'}>
                                                    Member ID
                                                </Label>
                                                <Input
                                                    id="depMemberID"
                                                    register={{
                                                        ...register(
                                                            'depMemberID',
                                                            {
                                                                required:
                                                                    watch(
                                                                        'dependentType',
                                                                    ) === '2' &&
                                                                    'Member ID is required',
                                                            },
                                                        ),
                                                    }}
                                                    placeholder="Dependent Member ID"
                                                    errors={errors?.depMemberID}
                                                />
                                            </div>
                                            <div className="basis-1/2">
                                                <Label
                                                    htmlFor="depDob2"
                                                    className={'mb-1'}>
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id="depDob2"
                                                    type="date"
                                                    register={{
                                                        ...register('depDob2', {
                                                            required:
                                                                watch(
                                                                    'dependentType',
                                                                ) === '2' &&
                                                                'Date of Birth is required',
                                                        }),
                                                    }}
                                                    placeholder="Dependent Date of Birth"
                                                    errors={errors?.depDob2}
                                                />
                                            </div>
                                            <div
                                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
                                                    watch('dependentType') ===
                                                        '2' && 'hidden'
                                                }`}></div>
                                        </div>

                                        {/* Backdrop for Dependents */}
                                        <div
                                            className={`absolute inset-0 flex justify-center items-center z-10 backdrop-blur-sm rounded-md ${
                                                watch('typeLOA') &&
                                                watch('minorDependent') &&
                                                'hidden'
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
            </div>
        </ClientLayout>
    )
}

export default Client
