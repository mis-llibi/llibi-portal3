import React, { useEffect } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'
import ButtonLink from '@/components/ButtonLink'

import { useForm } from 'react-hook-form'
import { customHooks } from '@/hooks/customHooks'

import { useManageCorrection } from '@/hooks/members/ManageCorrection'

import Swal from 'sweetalert2'

const modalMemberCorrection = ({
    data,
    forMemberCorrection,
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
        formState: { isDirty, errors },
        clearErrors,
    } = useForm()

    const { removeEmptyObj } = customHooks()
    const { corrections } = useManageCorrection({ id: data?.id })

    const submitForm = data => {
        //console.log(countObjectNotEmpty({ ...data }))
        if (removeEmptyObj({ ...data }).length <= 1 || !isDirty) {
            Swal.fire(
                'Untouched Fields',
                'You have not added or modify corrections to this member',
                'question',
            )
        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You are submitting these corrections to the LLIBI',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it',
            }).then(result => {
                if (result.isConfirmed) {
                    setLoading(true)
                    forMemberCorrection({
                        ...data,
                        setLoading,
                        setShow,
                        reset,
                    })
                }
            })

            //console.log(removeEmptyObj({ ...data }).values)
        }
    }

    useEffect(() => {
        let list
        if (corrections) list = corrections[0]
        if (list) {
            setValue('link_id', list?.id)

            setValue('firstName', list?.first_name)
            setValue('lastName', list?.last_name)
            setValue('middleName', list?.middle_name)
            setValue('extension', list?.extension)

            setValue('birthDate', list?.birth_date)
            setValue('gender', list?.gender)
            setValue('civilStatus', list?.civil_status)
            setValue('memberType', list?.memberType)
            setValue('relationshipId', list?.relationship_id)

            setValue('email', list?.email)
            setValue('mobile', list?.mobile_no)

            setValue('street', list?.street)
            setValue('city', list?.city)
            setValue('province', list?.province)
            setValue('zipCode', list?.zip_code)

            setValue('position', list?.position)
            setValue('planType', list?.plan_type)

            setValue('regDate', list?.reg_date)
            setValue('dateHired', list?.date_hired)
            setValue('effectiveDate', list?.effective_date)
            if (list?.date_hired != list?.effective_date) {
                setValue('changeEffectiveDate', 'YES')
            }

            setValue(
                'philHealthMember',
                list?.if_enrollee_is_a_philhealth_member,
            )
            if (!list?.if_enrollee_is_a_philhealth_member)
                setValue('toBill', list?.philhealth_conditions)
        }
    }, [corrections])

    useEffect(() => {
        let list
        if (corrections) list = corrections[0]

        clearErrors('effectiveDate')
        if (list?.date_hired == list?.effective_date)
            setValue('effectiveDate', watch('dateHired'))
    }, [watch('dateHired')])

    useEffect(() => {
        if (watch('changeEffectiveDate')) {
            Swal.fire(
                'Are you sure?',
                'If you change the effective date, it is subject for standard cut-off',
                'warning',
            )
            /* setValue('effectiveDate', data?.effective_date) */
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
    }, [watch('philHealthMember')])

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit(submitForm)}>
                <input
                    type="hidden"
                    {...register('id')}
                    defaultValue={data?.id}
                />

                <input type="hidden" {...register('link_id')} />

                {/* Personal Information */}
                <h3 className="font-semibold text-blue-700">
                    Personal Information
                </h3>
                <hr className="mb-2"></hr>

                <div className="mb-2 md:w-3/12">
                    <Label htmlFor="oldEmpno">Old Employee No</Label>
                    <Input
                        id="oldEmpno"
                        type="text"
                        className="block mt-1 w-full bg-green-50"
                        defaultValue={data?.employee_no}
                        disabled
                    />
                </div>
                <div className="mb-2 md:w-3/12">
                    <Label htmlFor="empno">New Employee No</Label>
                    <Input
                        id="empno"
                        type="text"
                        className="block mt-1 w-full"
                        register={register('empno')}
                    />
                </div>

                {/* Old Full Name */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="oldLastName">Old Last Name</Label>
                            <Input
                                id="oldLastName"
                                type="text"
                                className="block mt-1 w-full bg-green-50"
                                defaultValue={data?.last_name}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="oldFirstName">Old First Name</Label>
                            <Input
                                id="oldFirstName"
                                type="text"
                                className="block mt-1 w-full bg-green-50"
                                defaultValue={data?.first_name}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="oldMiddleName">
                                Old Middle Name
                            </Label>
                            <Input
                                id="oldMiddleName"
                                type="text"
                                className="block mt-1 w-full bg-green-50"
                                defaultValue={data?.middle_name}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="oldExtension">Old Extension</Label>
                        <Select
                            id="oldExtension"
                            className="block mt-1 w-full bg-green-50"
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
                            defaultValue={data?.extension}
                            disabled
                        />
                    </div>
                </div>

                {/* New First Name */}
                <div className="md:flex gap-2 border-b-2 border-dotted pb-3">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="lastName">New Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('lastName')}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="firstName">New First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('firstName')}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="middleName">New Middle Name</Label>
                            <Input
                                id="middleName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('middleName')}
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="extension">New Extension</Label>
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
                            errors={errors?.extension}
                        />
                    </div>
                </div>

                {/* Old DOB Gender MemberType */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="oldBirthDate">Old Birth Date</Label>
                            <Input
                                id="oldBirthDate"
                                type="date"
                                className="block mt-1 w-full bg-green-50"
                                defaultValue={data?.birth_date}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="oldGender">Old Gender</Label>
                            <Select
                                id="oldGender"
                                className="block mt-1 w-full bg-green-50"
                                options={[
                                    { label: 'Male', value: 'M' },
                                    { label: 'Female', value: 'F' },
                                ]}
                                defaultValue={data?.gender}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="oldCivilStatus">
                                Old Civil Status
                            </Label>
                            <Select
                                id="oldCivilStatus"
                                className="block mt-1 w-full bg-green-50"
                                options={[
                                    { label: 'Single', value: 'Single' },
                                    { label: 'Married', value: 'Married' },
                                    {
                                        label: 'Single Parent',
                                        value: 'Single Parent',
                                    },
                                    { label: 'Widowed', value: 'Widowed' },
                                ]}
                                defaultValue={data?.civil_status}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="OldMemberType">Member Type</Label>
                        <Select
                            id="OldMemberType"
                            className="block mt-1 w-full bg-green-50"
                            options={[
                                { label: 'Principal', value: 'P' },
                                { label: 'Dependent', value: 'D' },
                                { label: 'Guardian', value: 'G' },
                            ]}
                            defaultValue={data?.member_type}
                            disabled
                        />
                    </div>
                </div>

                {/* New DOB Gender MemberType */}
                <div className="md:flex gap-2 border-b-2 border-dotted pb-3">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="birthDate">New Birth Date</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                className="block mt-1 w-full"
                                register={register('birthDate')}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="gender">New Gender</Label>
                            <Select
                                id="gender"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'No Changes', value: '' },
                                    { label: 'Male', value: 'M' },
                                    { label: 'Female', value: 'F' },
                                ]}
                                register={register('gender')}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="civilStatus">
                                New Civil Status
                            </Label>
                            <Select
                                id="civilStatus"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'No Changes', value: '' },
                                    { label: 'Single', value: 'Single' },
                                    { label: 'Married', value: 'Married' },
                                    {
                                        label: 'Single Parent',
                                        value: 'Single Parent',
                                    },
                                    { label: 'Widowed', value: 'Widowed' },
                                ]}
                                register={register('civilStatus')}
                            />
                        </div>
                    </div>
                    <div className="basis-2/12 mt-2">
                        <Label htmlFor="memberType">Member Type</Label>
                        <Select
                            id="memberType"
                            className="block mt-1 w-full"
                            options={[
                                { label: 'No Changes', value: '' },
                                { label: 'Principal', value: 'P' },
                                { label: 'Dependent', value: 'D' },
                                { label: 'Guardian', value: 'G' },
                            ]}
                            register={register('memberType')}
                            errors={errors?.memberType}
                        />
                    </div>
                </div>

                {/* Old Relationship ID */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="oldRelationshipId">
                                Old Relationship ID
                            </Label>
                            <Select
                                id="oldRelationshipId"
                                className="block mt-1 w-full bg-green-50"
                                options={[
                                    { label: 'Principal', value: 'Principal' },
                                    { label: 'Parent', value: 'Parent' },
                                    { label: 'Spouse', value: 'Spouse' },
                                    { label: 'Child', value: 'Child' },
                                ]}
                                defaultValue={data?.relationship_id}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* New Relationship ID */}
                <div className="md:flex gap-2">
                    <div className="basis-10/12 md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="relationshipId">
                                New Relationship ID
                            </Label>
                            <Select
                                id="relationshipId"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'No Changes', value: '' },
                                    { label: 'Principal', value: 'Principal' },
                                    { label: 'Parent', value: 'Parent' },
                                    { label: 'Spouse', value: 'Spouse' },
                                    { label: 'Child', value: 'Child' },
                                ]}
                                register={register('relationshipId')}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Contact Details
                </h3>
                <hr className="mb-2"></hr>

                {/* Old Email & Mobile */}
                <div className="md:grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="oldEmail">Old Email Address</Label>
                        <Input
                            id="oldEmail"
                            type="email"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.email}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="mobile">Mobile No.</Label>
                        <Input
                            id="mobile"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.mobile_no}
                            disabled
                        />
                    </div>
                </div>

                {/* New Email & Mobile */}
                <div className="md:grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="email">New Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            className="block mt-1 w-full"
                            register={register('email')}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="mobile">New Mobile No.</Label>
                        <Input
                            id="mobile"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('mobile')}
                        />
                    </div>
                </div>

                {/* Address */}
                <h3 className="font-semibold text-blue-700 mt-2">Address</h3>
                <hr className="mb-2"></hr>

                {/* Old Street, City, Province Zipcode */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="oldStreet">Old Street</Label>
                        <Input
                            id="oldStreet"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.street}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldCity">Old City</Label>
                        <Input
                            id="oldCity"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.city}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldProvince">Old Province</Label>
                        <Input
                            id="oldProvince"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.province}
                            disabled
                        />
                    </div>
                </div>

                <div className="md:grid grid-cols-3 gap-2 border-b-2 border-dotted pb-3">
                    <div className="mt-2">
                        <Label htmlFor="oldZipCode">Old Zip Code</Label>
                        <Input
                            id="oldZipCode"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.zip_code}
                            disabled
                        />
                    </div>
                </div>

                {/* New Street, City, Province Zipcode */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="street">New Street</Label>
                        <Input
                            id="street"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('street')}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('city')}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('province')}
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
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Employment Details
                </h3>
                <hr className="mb-2"></hr>

                {/* Old Position, PType, DateHired, RegDate, EffDate */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="oldPosition">Old Position</Label>
                        <Input
                            id="oldPosition"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.position}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldPlanType">Old Plan Type</Label>
                        <Input
                            id="oldPlanType"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.plan_type}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldDateHired">Old Date Hired</Label>
                        <Input
                            id="oldDateHired"
                            type="date"
                            className="block mt-1 w-full bg-green-50"
                            disabled
                        />
                    </div>
                </div>

                <div className="md:grid grid-cols-3 gap-2 border-b-2 border-dotted pb-3">
                    <div className="mt-2">
                        <Label htmlFor="oldRegDate">Old Reg Date</Label>
                        <Input
                            id="oldRegDate"
                            type="date"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.reg_date}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldEffectiveDate">
                            Old Effective Date
                        </Label>
                        <Input
                            id="oldEffectiveDate"
                            type="date"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.effective_date}
                            disabled
                        />
                    </div>
                </div>

                {/* New Position, PType, DateHired, RegDate, EffDate */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="position">New Position</Label>
                        <Input
                            id="position"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('position')}
                            defaultValue={data?.position}
                            errors={errors?.position}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="planType">New Plan Type</Label>
                        <Input
                            id="planType"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('planType')}
                            defaultValue={data?.plan_type}
                            errors={errors?.planType}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="dateHired">New Date Hired</Label>
                        <Input
                            id="dateHired"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('dateHired')}
                            errors={errors?.dateHired}
                        />
                    </div>
                </div>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="regDate">New Reg Date</Label>
                        <Input
                            id="regDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('regDate')}
                            errors={errors?.regDate}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="effectiveDate">
                            New Effective Date
                        </Label>
                        <Input
                            id="effectiveDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('effectiveDate')}
                            errors={errors?.effectiveDate}
                            readOnly={!watch('changeEffectiveDate')}
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

                {/*Old philhealth member */}
                <div className="block mt-3 flex">
                    <div className="flex-grow">
                        <label
                            htmlFor="oldPhilHealthMember"
                            className="inline-flex items-center">
                            <input
                                id="oldPhilHealthMember"
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                defaultChecked={
                                    data?.if_enrollee_is_a_philhealth_member
                                }
                                value="YES"
                                disabled
                            />
                            <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                                If Enrollee is a Philhealth member
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-2">
                    <Label htmlFor="oldPhilHealthConditions">
                        Old PhilHealth Conditions
                    </Label>
                    <TextArea
                        id="oldPhilHealthConditions"
                        className={'mt-1 w-full bg-green-50'}
                        defaultValue={data?.philhealth_conditions}
                        disabled></TextArea>
                </div>

                <div className="md:grid grid-cols-3 gap-2 border-b-2 border-dotted pb-3">
                    <div className="mt-2">
                        <Label htmlFor="oldBranchName">Old Branch Name</Label>
                        <Input
                            id="oldBranchName"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.branch_name}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldPhilHealthNo">
                            Old PhilHealth No.
                        </Label>
                        <Input
                            id="oldPhilHealthNo"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.philhealth_no}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="oldSeniorCitizenIDNo">
                            Old Senior Citizen ID No.
                        </Label>
                        <Input
                            id="oldSeniorCitizenIDNo"
                            type="text"
                            className="block mt-1 w-full bg-green-50"
                            defaultValue={data?.senior_citizen_id_no}
                            disabled
                        />
                    </div>
                </div>

                {/* New philhealth member */}
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
                        New PhilHealth Conditions
                    </Label>
                    <TextArea
                        id="philHealthConditions"
                        register={register('philHealthConditions')}
                        className={'mt-1 w-full'}
                        readOnly={!watch('philHealthMember')}></TextArea>
                </div>

                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="branchName">New Branch Name</Label>
                        <Input
                            id="branchName"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('branchName')}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="philHealthNo">New PhilHealth No.</Label>
                        <Input
                            id="philHealthNo"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('philHealthNo')}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="seniorCitizenIDNo">
                            New Senior Citizen ID No.
                        </Label>
                        <Input
                            id="seniorCitizenIDNo"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('seniorCitizenIDNo')}
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
                        defaultValue={data?.client_remarks}></TextArea>
                </div>

                <Button
                    className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2"
                    loading={loading}>
                    Submit Member Corrections
                </Button>

                <ButtonLink
                    className="bg-red-400 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 ring-red-200 my-2 float-right"
                    loading={loading}
                    onClick={() => reset()}>
                    Reset Fields
                </ButtonLink>
            </form>
        </div>
    )
}

export default modalMemberCorrection
