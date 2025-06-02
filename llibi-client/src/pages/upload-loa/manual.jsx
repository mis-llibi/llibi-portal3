import React, { useState, useEffect } from 'react'
import Head from 'next/head'

// Components | Layout
import ManualLayout from '@/components/Layouts/Upload-LOA/ManualLayout'
import Clock from 'react-live-clock'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

// Logo
import ApplicationLogo from '@/components/ApplicationLogo'
import { useForm } from 'react-hook-form'

// Hooks
import { useUploadLOA } from '@/hooks/upload-loa/upload-loa'



function Manual() {

    const { register, handleSubmit, formState: {errors: error}, reset, watch  } = useForm({})
    const [greetingTime, setGreetingTime] = useState('')
    const [loading, setLoading] = useState(false)

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

    const { validateClient } = useUploadLOA({})

    const submitForm = (data) => {

        console.log(data)
        // setLoading(true)

        // validateClient({
        //     ...data,
        //     setLoading
        // })
    }

  return (
    <>
    <ManualLayout>
        <Head>
            <title>LLIBI PORTAL - MANUAL</title>
        </Head>

        <div className='px-2 py-10 flex justify-center items-center'>
            <div className='bg-white w-full rounded-2xl p-2 md:py-5 md:px-7 lg:w-3/4  '>
                <div className='flex flex-col justify-center items-center md:flex-row md:justify-between'>
                    <ApplicationLogo width={200} />
                    <div>
                        <p className='font-bold text-blue-900 text-center md:text-right text-lg lg:text-xl '>
                            Manual Upload LOA
                        </p>
                        <p className="font-bold text-sm text-shadow-lg text-gray-700 text-center md:text-right">
                            <Clock
                            format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                            ticking={true}
                            timezone={'Asia/Manila'}
                            />
                        </p>
                    </div>
                </div>
                <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

                <form onSubmit={handleSubmit(submitForm)}>
                    <div className='border-1 rounded-lg shadow-md mb-4'>
                        <p className='w-full bg-blue-900 text-white shadow rounded-t-lg p-2 text-center'>
                            {greetingTime}, please input the client's information
                        </p>
                        <div className='py-4 px-10'>
                            <Label>Request for LOA</Label>
                            <div
                                className={`my-2 flex gap-3 md:ml-10 bg-gray-700 shadow rounded-md p-2 border-blue-200 flex-col md:flex-row`}>
                                <div className="basis-1/2">
                                    <div className="flex gap-2 items-center">
                                        <input
                                        type="radio"
                                        {...register('typeLOA', {
                                            required:
                                            !watch('principalType') && '* Required',
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
                                            {error?.typeLOA?.message}
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
                        </div>
                    </div>

                    <p
                        className={`text-red-400 text-xs mb-2 font-bold px-10 text-justify md:px-20 ${
                        !watch('typeLOA')
                            && 'blur-sm'
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
                                watch('principalType') !== '1' &&
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
                            {error?.principalType?.message}
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
                                errors={error?.lastName}
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
                                errors={error?.firstName}
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
                                errors={error?.dob}
                                />
                            </div>
                            <div
                            className={`absolute inset-0 flex justify-center items-center z-10 bg-black/10 backdrop-blur-sm rounded-md  ${
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
                            errors={error?.memberID}
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
                            errors={error?.dob2}
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
                            watch('typeLOA') && 'hidden'
                        }`}></div>
                    </div>

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
                            {error?.dependentType?.message}
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
                            errors={error?.depLastName}
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
                            errors={error?.depFirstName}
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
                            errors={error?.depDob}
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
                            errors={error?.depMemberID}
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
                            errors={error?.depDob2}
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


                    <div className='flex justify-center items-center'>
                        <Button
                            loading={loading}
                            className="bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
                            <ButtonText
                            text="Submit and Proceed to Your Request"
                            loading={loading}
                            />
                        </Button>
                    </div>



                </form>

            </div>
        </div>


    </ManualLayout>



    </>
  )
}

export default Manual
