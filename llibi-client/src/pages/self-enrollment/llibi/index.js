import React, { useState, useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'
import Input from '@/components/Self-enrollment/Input'
import Select from '@/components/Self-enrollment/Select'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'
import options from '@/hooks/self-enrollment/LlibiOptions'

import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

const Home = () => {
    const router = useRouter()

    const { client, updateClientInfo } = ManageClientInfo({
        id: router.query.id,
        company: 'LLIBI',
    })

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { isDirty, errors },
    } = useForm()

    const [page, setPage] = useState(false)
    useEffect(() => {
        setValue('id', client?.principal[0]?.id)
        setValue('first_name', client?.principal[0]?.first_name)
        setValue('middle_name', client?.principal[0]?.middle_name)
        setValue('last_name', client?.principal[0]?.last_name)
        setValue('birth_date', client?.principal[0]?.birth_date)
        setValue('gender', client?.principal[0]?.gender)
        setValue('civil_status', client?.principal[0]?.civil_status)

        if (client?.principal[0]?.form_locked == 1) {
            window.location.pathname = `/self-enrollment/llibi/form-locked`
        } else {
            if (client?.principal.length > 0)
                if (client?.principal[0]?.status == 2) {
                    window.location.pathname = `/self-enrollment/llibi/dependents/`
                } else {
                    setPage(true)
                }
        }
    }, [client?.principal])

    const [loading, setLoading] = useState(false)

    const onSubmit = data => {
        setLoading(true)
        updateClientInfo({ ...data, setLoading, reset })
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
            <GuestLayout title="LLIBI Self-Enrollment Portal">
                <div className="lg:flex">
                    <input type="hidden" {...register('id')} />

                    {/* personal details */}
                    <div className="basis-1/2 lg:border-r-4 pb-2 lg:pb-0 lg:pr-2">
                        {/* header */}
                        <div className="flex gap-2">
                            <div>
                                {/* client logo */}
                                <img
                                    src={`${basePath}/self-enrollment/llibi/logo.png`}
                                    width={150}
                                />
                            </div>
                            <div className="flex-grow flex place-items-center">
                                <h1 className="text-xl font-bold text-gray-800">
                                    Self-Enrollment Portal
                                </h1>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="text-center text-sm font-semibold">
                                To facilitate enrollment for yourself and your
                                dependents, kindly provide the following
                                information below:
                            </p>
                        </div>

                        {/* important notice */}
                        <div className="mt-3 p-4 rounded-md bg-orange-50">
                            <h1 className="mb-2 text-blue-600 font-bold">
                                Important Notice
                            </h1>
                            <p className="text-sm text-justify">
                                Please review and make the necessary corrections
                                (if any) to your{' '}
                                <span className="text-blue-400 font-bold">
                                    personal information
                                </span>{' '}
                                before submitting as these will be used for your
                                Healthcare enrollment. Once submitted, data
                                provided becomes final.
                            </p>
                        </div>

                        {/* information text fields */}
                        <div>
                            <div className="mt-2">
                                <Input
                                    label="First Name"
                                    register={register('first_name', {
                                        required: 'This is required',
                                    })}
                                    className={'capitalize'}
                                    placeholder="Enter your first name"
                                    errors={errors?.first_name}
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Middle Name"
                                    register={register('middle_name')}
                                    optional={1}
                                    className={'capitalize'}
                                    placeholder="Enter your middle name"
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Last Name"
                                    register={register('last_name', {
                                        required: 'This is required',
                                    })}
                                    className={'capitalize'}
                                    placeholder="Enter your last name"
                                    errors={errors?.last_name}
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Birth Date"
                                    register={register('birth_date', {
                                        required: 'This is required',
                                    })}
                                    type="date"
                                    placeholder="Enter your birth date"
                                    errors={errors?.birth_date}
                                />
                            </div>
                            <div className="mt-2">
                                <Select
                                    label="Gender"
                                    register={register('gender', {
                                        required: 'This is required',
                                    })}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Pleace select gender',
                                        },
                                        ...options?.gender(),
                                    ]}
                                    errors={errors?.gender}
                                />
                            </div>
                            <div className="mt-2">
                                <Select
                                    label="Civil Status"
                                    register={register('civil_status', {
                                        required: 'This is required',
                                    })}
                                    options={[
                                        {
                                            value: '',
                                            label: 'Pleace select civil status',
                                        },
                                        ...options?.civilStatus(),
                                    ]}
                                    errors={errors?.civil_status}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address details & Buttons */}
                    <div className="basis-1/2 lg:pl-2 flex place-items-center mt-2">
                        <div className="w-full">
                            <h1 className="font-bold text-center border-b-2 border-dotted">
                                Address for Card Delivery
                            </h1>
                            {/* information text fields */}
                            <div className="mb-2">
                                <div className="mt-2">
                                    <Input
                                        label="House / Unit Number and Street"
                                        register={register('street', {
                                            required: 'This is required',
                                        })}
                                        className={'capitalize'}
                                        placeholder="Enter House / Unit Number and Street"
                                        errors={errors?.street}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Input
                                        label="Barangay"
                                        register={register('barangay', {
                                            required: 'This is required',
                                        })}
                                        className={'capitalize'}
                                        placeholder="Enter your Barangay"
                                        errors={errors?.barangay}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Input
                                        label="City / Municipality"
                                        register={register('city', {
                                            required: 'This is required',
                                        })}
                                        className={'capitalize'}
                                        placeholder="Enter your City / Municipality"
                                        errors={errors?.city}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Input
                                        label="Province"
                                        register={register('province', {
                                            required: 'This is required',
                                        })}
                                        className={'capitalize'}
                                        placeholder="Enter your Province"
                                        errors={errors?.province}
                                    />
                                </div>
                                <div className="mt-2">
                                    <Input
                                        label="Zip Code"
                                        register={register('zipCode', {
                                            required: 'This is required',
                                        })}
                                        type="number"
                                        min="0"
                                        className={'capitalize'}
                                        placeholder="Enter your Zip Code"
                                        errors={errors?.zipCode}
                                    />
                                </div>
                            </div>

                            <div className="">
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!client?.principal[0]}
                                    className={'mr-2'}>
                                    Proceed to Enrollment
                                </Button>
                                <Button
                                    disabled={!client?.principal[0]}
                                    className={
                                        'mt-2 bg-red-800 hover:bg-red-700 focus:bg-red-900 active:bg-red-500  ring-red-200 hidden'
                                    }>
                                    I do not want to Enroll
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Loader loading={loading} />
            </GuestLayout>
        </>
    )
}

export default Home
