import React, { useEffect } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

const modalUpdateEnrollmentAdmin = ({
    data,
    updateEnrollmentStatus,
    loading,
    setLoading,
    setShow,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm()

    const submitForm = data => {
        //console.log(data)
        setLoading(true)
        updateEnrollmentStatus({ ...data, setLoading, setShow, reset })
    }

    useEffect(() => {
        setValue('philHealthMember', data?.if_enrollee_is_a_philhealth_member)
        if (!data?.if_enrollee_is_a_philhealth_member)
            setValue('toBill', data?.philhealth_conditions)
        setValue('dateHired', data?.date_hired)
        setValue('effectiveDate', data?.effective_date)
        if (data?.date_hired != data?.effective_date) {
            setValue('changeEffectiveDate', 'YES')
        }
    }, [])

    useEffect(() => {
        if (data?.date_hired == data?.effective_date)
            setValue('effectiveDate', watch('dateHired'))
    }, [watch('dateHired')])

    useEffect(() => {
        if (watch('changeEffectiveDate')) {
            Swal.fire(
                'Are you sure?',
                'If you change the effective date, it is subject for standard cut-off',
                'warning',
            )
            setValue('effectiveDate', data?.effective_date)
        }

        if (!watch('changeEffectiveDate'))
            setValue('effectiveDate', watch('dateHired'))
    }, [watch('changeEffectiveDate')])

    useEffect(() => {
        setValue('philHealthConditions', watch('toBill'))
    }, [watch('toBill')])

    useEffect(() => {
        setValue(
            'philHealthConditions',
            !watch('philHealthMember') ? watch('toBill') : '',
        )
        //resetField('toBill')
    }, [watch('philHealthMember')])

    useEffect(() => {}, [watch('changeStatus')])

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit(submitForm)}>
                <input
                    type="hidden"
                    {...register('id')}
                    defaultValue={data?.id}
                />

                <div
                    className={`md:flex gap-2 border border-1 px-3 py-5 mb-2 shadow-sm ${
                        watch('changeStatus') == 4 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                    <div className="mb-2 basis-2/6">
                        <Label htmlFor="changeStatus">Set Status to:</Label>
                        <Select
                            id="changeStatus"
                            className="block mt-1 w-full"
                            options={[
                                { label: 'Approve', value: 4 },
                                { label: 'Deny', value: 6 },
                            ]}
                            register={register('changeStatus', {
                                required: 'Change status required',
                            })}
                            errors={errors?.changeStatus}
                        />
                    </div>
                    <div className="mb-2 basis-4/6">
                        <div
                            className={`${
                                watch('changeStatus') == 6 && 'hidden'
                            }`}>
                            <Label htmlFor="certificateNo">
                                Card Number
                            </Label>
                            <Input
                                id="certificateNo"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('certificateNo', {
                                    required:
                                        watch('changeStatus') == 4
                                            ? 'Card number is required'
                                            : false,
                                })}
                                errors={errors?.certificateNo}
                                disabled={watch('changeStatus') == 6}
                            />
                        </div>
                        <div
                            className={`${
                                watch('changeStatus') == 4 && 'hidden'
                            }`}>
                            <Label htmlFor="adminRemarks">Remarks</Label>
                            <TextArea
                                id="adminRemarks"
                                register={register('adminRemarks', {
                                    required:
                                        watch('changeStatus') == 6
                                            ? 'Remarks is required'
                                            : false,
                                })}
                                className={'mt-1 w-full'}
                                errors={errors?.adminRemarks}
                                disabled={
                                    watch('changeStatus') == 4
                                }></TextArea>
                        </div>
                    </div>
                </div>
                <div className="flex-grow mt-3 flex place-items-center float-right mb-2">
                    <Button
                        className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200"
                        loading={loading}>
                        Update Enrollment
                    </Button>
                </div>
                <div className="clear-both"></div>

                {/* Personal Information */}
                <h3 className="font-semibold text-blue-700">
                    Personal Information
                </h3>
                <hr className="mb-2"></hr>

                <div className="mb-2 md:w-3/12">
                    <Label htmlFor="empno">Employee No</Label>
                    <Input
                        id="empno"
                        type="text"
                        className="block mt-1 w-full"
                        register={register('empno')}
                        defaultValue={data?.employee_no}
                        disabled
                    />
                </div>

                {/* Full Name */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('lastName')}
                                defaultValue={data?.last_name}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('firstName')}
                                defaultValue={data?.first_name}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('middleName')}
                                defaultValue={data?.middle_name}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="extension">Extension</Label>
                        <Select
                            id="extension"
                            className="block mt-1 w-full"
                            options={[
                                { label: 'None', value: '' },
                                { label: 'SR.', value: 'SR.' },
                                { label: 'JR.', value: 'JR.' },
                                { label: 'III', value: 'III' },
                                { label: 'IV', value: 'IV' },
                                { label: 'V', value: 'V' },
                                { label: 'VI', value: 'VI' },
                                { label: 'VII', value: 'VII' },
                                { label: 'VIII', value: 'VIII' },
                                { label: 'IX', value: 'IX' },
                                { label: 'X', value: 'X' },
                            ]}
                            register={register('extension')}
                            defaultValue={data?.extension}
                            disabled
                        />
                    </div>
                </div>

                {/* DOB Gender MemberType */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                className="block mt-1 w-full"
                                register={register('birthDate')}
                                defaultValue={data?.birth_date}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                id="gender"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'Male', value: 'M' },
                                    { label: 'Female', value: 'F' },
                                ]}
                                register={register('gender')}
                                defaultValue={data?.gender}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="civilStatus">Civil Status</Label>
                            <Select
                                id="civilStatus"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'Single', value: 'Single' },
                                    { label: 'Married', value: 'Married' },
                                    {
                                        label: 'Single Parent',
                                        value: 'Single Parent',
                                    },
                                    { label: 'Widowed', value: 'Widowed' },
                                ]}
                                register={register('civilStatus')}
                                defaultValue={data?.civil_status}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="memberType">Member Type</Label>
                        <Select
                            id="memberType"
                            className="block mt-1 w-full"
                            options={[
                                { label: 'Principal', value: 'P' },
                                { label: 'Dependent', value: 'D' },
                                { label: 'Guardian', value: 'G' },
                            ]}
                            register={register('memberType')}
                            defaultValue={data?.member_type}
                            disabled
                        />
                    </div>
                </div>

                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="relationshipId">
                                Relationship ID
                            </Label>
                            <Select
                                id="relationshipId"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'Principal', value: 'Principal' },
                                    { label: 'Parent', value: 'Parent' },
                                    { label: 'Spouse', value: 'Spouse' },
                                    { label: 'Child', value: 'Child' },
                                ]}
                                register={register('relationshipId')}
                                defaultValue={data?.relationship_id}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Contact Details
                </h3>
                <hr className="mb-2"></hr>

                <div className="md:grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="lastname"
                            type="email"
                            className="block mt-1 w-full"
                            register={register('email')}
                            defaultValue={data?.email}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="mobile">Mobile No.</Label>
                        <Input
                            id="mobile"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('mobile')}
                            defaultValue={data?.mobile_no}
                            disabled
                        />
                    </div>
                    <div className="mt-2"></div>
                </div>

                {/* Address */}
                <h3 className="font-semibold text-blue-700 mt-2">Address</h3>
                <hr className="mb-2"></hr>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                            id="street"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('street')}
                            defaultValue={data?.street}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('city')}
                            defaultValue={data?.city}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('province')}
                            defaultValue={data?.province}
                            disabled
                        />
                    </div>
                </div>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                            id="zipCode"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('zipCode')}
                            defaultValue={data?.zip_code}
                            disabled
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Employment Details
                </h3>
                <hr className="mb-2"></hr>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('position')}
                            defaultValue={data?.position}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="planType">Plan Type</Label>
                        <Input
                            id="planType"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('planType')}
                            defaultValue={data?.plan_type}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="dateHired">Date Hired</Label>
                        <Input
                            id="dateHired"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('dateHired')}
                            disabled
                        />
                    </div>
                </div>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="regDate">Reg Date</Label>
                        <Input
                            id="regDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('regDate')}
                            defaultValue={data?.reg_date}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                            id="effectiveDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('effectiveDate')}
                            readOnly={!watch('changeEffectiveDate')}
                            disabled
                        />
                    </div>
                    <div className="mt-2 flex">
                        <div className="md:mt-8">
                            <label
                                htmlFor="changeEffectiveDate"
                                className="inline-flex items-center">
                                <input
                                    id="changeEffectiveDate"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register('changeEffectiveDate')}
                                    value="YES"
                                    disabled
                                />
                                <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                                    Change Effectivity Date
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* PhilHealth Form */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    PhilHealth Form
                </h3>
                <hr className="mb-2"></hr>

                {/* Check if philhealth member */}
                <div className="block mt-3 flex">
                    <div className="flex-grow">
                        <label
                            htmlFor="philHealthMember"
                            className="inline-flex items-center">
                            <input
                                id="philHealthMember"
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                {...register('philHealthMember')}
                                value="YES"
                                disabled
                            />
                            <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                                If Enrollee is a Philhealth member
                            </div>
                        </label>
                    </div>
                    <div
                        className={`basis-2/3 flex ${
                            watch('philHealthMember') && 'hidden'
                        }`}>
                        <div className="mr-2">
                            <label
                                htmlFor="toBill"
                                className="inline-flex items-center">
                                <input
                                    id="toBill"
                                    type="radio"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register('toBill')}
                                    value="YES TO BILL"
                                    disabled
                                />
                                <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                                    YES TO BILL
                                </div>
                            </label>
                        </div>
                        <div>
                            <label
                                htmlFor="notToBill"
                                className="inline-flex items-center">
                                <input
                                    id="notToBill"
                                    type="radio"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register('toBill')}
                                    value="NOT TO BILL"
                                    disabled
                                />
                                <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                                    NOT TO BILL
                                </div>
                            </label>
                        </div>
                        <p className="text-xs ml-2 text-red-400 mt-1">
                            (This is required if enrollee is not a Philhealth
                            Member)
                        </p>
                    </div>
                </div>

                <div className="mt-2">
                    <Label htmlFor="philHealthConditions">
                        PhilHealth Conditions
                    </Label>
                    <TextArea
                        id="philHealthConditions"
                        register={register('philHealthConditions')}
                        className={'mt-1 w-full'}
                        defaultValue={data?.philhealth_conditions}
                        readOnly={watch('toBill')}
                        disabled></TextArea>
                </div>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                            id="branchName"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('branchName')}
                            defaultValue={data?.branch_name}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="philHealthNo">PhilHealth No.</Label>
                        <Input
                            id="philHealthNo"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('philHealthNo')}
                            defaultValue={data?.philhealth_no}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="seniorCitizenIDNo">
                            Senior Citizen ID No.
                        </Label>
                        <Input
                            id="seniorCitizenIDNo"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('seniorCitizenIDNo')}
                            defaultValue={data?.senior_citizen_id_no}
                            disabled
                        />
                    </div>
                </div>

                {/* Client Remarks */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Client Remark(s)
                </h3>
                <hr className="mb-2"></hr>

                <div className="mt-2">
                    <Label htmlFor="clientRemarks">Remarks</Label>
                    <TextArea
                        id="clientRemarks"
                        className={'mt-1 w-full'}
                        register={register('clientRemarks')}
                        defaultValue={data?.client_remarks}
                        disabled></TextArea>
                </div>
            </form>
        </div>
    )
}

export default modalUpdateEnrollmentAdmin
