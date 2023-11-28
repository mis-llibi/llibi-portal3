import React, { useEffect } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TextArea from '@/components/TextArea'

import { useForm } from 'react-hook-form'

const modalUpdateMember = ({ data }) => {
    const {
        register,
        handleSubmit,
        reset,
        resetField,
        watch,
        setValue,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        setValue('philHealthMember', data?.if_enrollee_is_a_philhealth_member)
        //if (!data?.if_enrollee_is_a_philhealth_member)
        setValue('philHealthConditions', data?.philhealth_conditions)
        setValue('toBill', data?.philhealth_conditions)
        setValue('dateHired', data?.date_hired)
        setValue('effectiveDate', data?.effective_date)
    }, [])

    useEffect(() => {
        if (data?.date_hired == data?.effective_date)
            setValue('effectiveDate', watch('dateHired'))
    }, [watch('dateHired')])

    useEffect(() => {
        if (!watch('changeEffectiveDate'))
            setValue('effectiveDate', watch('dateHired'))
    }, [watch('changeEffectiveDate')])

    useEffect(() => {
        setValue(
            'philHealthConditions',
            !watch('philHealthMember') ? watch('toBill') : '',
        )
    }, [watch('philHealthMember')])

    const checkStatus = () => {
        switch (data?.status) {
            case 4:
                return {
                    color: 'bg-green-400',
                    status: 'Enrolled',
                    text: `Card #: ${data?.certificate_no}`,
                    date: data?.changed_status_at,
                }
            case 6:
                return {
                    color: 'bg-red-400',
                    status: 'Denied',
                    text: `Remarks: ${data?.admin_remarks}`,
                    date: data?.changed_status_at,
                }
            case 7:
                return {
                    color: 'bg-blue-400',
                    status: 'For Correction',
                    text: 'N/A',
                    date: data?.updated_at,
                }
            case 8:
                return {
                    color: 'bg-red-400',
                    status: 'For Cancellation',
                    text: `Remarks: ${data?.client_remarks}`,
                    date: data?.updated_at,
                }
            case 9:
                return {
                    color: 'bg-red-400',
                    status: 'Cancelled',
                    text: `Remarks: ${data?.admin_remarks}`,
                    date: data?.updated_at,
                }
            default:
                return {
                    color: 'bg-gray-100',
                    status: 'Pending',
                    text: `N/A`,
                    date: data?.updated_at,
                }
        }
    }

    return (
        <div className="p-4">
            <form>
                <input
                    type="hidden"
                    {...register('id')}
                    defaultValue={data?.id}
                    disabled
                />

                <div className={`md:flex gap-2 mb-2`}>
                    <div
                        className={`mb-1 basis-1/4 border-2 p-2 text-center ${
                            checkStatus().color
                        }`}>
                        {checkStatus().status}
                    </div>
                    <div className="mb-1 flex-grow border-2 p-2 bg-orange-50">
                        {checkStatus().text}
                    </div>
                    <div className="mb-1 basis-1/4 border-2 p-2 bg-orange-50">
                        {checkStatus().date}
                    </div>
                </div>

                {/* Personal Information */}
                <h3 className="font-semibold text-blue-700">
                    Personal Information
                </h3>
                <hr className="mb-2"></hr>

                {/* Emp No */}
                <div className="mb-2 md:w-3/12">
                    <Label htmlFor="empno">Employee No</Label>
                    <Input
                        id="empno"
                        type="text"
                        className="block mt-1 w-full"
                        register={register('empno', {
                            required: 'Employee number is required',
                        })}
                        defaultValue={data?.employee_no}
                        errors={errors?.empno}
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
                                register={register('lastName', {
                                    required: 'Last name is required',
                                })}
                                defaultValue={data?.last_name}
                                errors={errors?.lastName}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('firstName', {
                                    required: 'First name is required',
                                })}
                                defaultValue={data?.first_name}
                                errors={errors?.firstName}
                                disabled
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                type="text"
                                className="block mt-1 w-full"
                                register={register('middleName', {
                                    required: 'Middle name is required',
                                })}
                                defaultValue={data?.middle_name}
                                errors={errors?.middleName}
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
                            register={register('extension', {
                                required: false,
                            })}
                            defaultValue={data?.extension}
                            errors={errors?.extension}
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
                                register={register('birthDate', {
                                    required: 'DOB is required',
                                })}
                                defaultValue={data?.birth_date}
                                errors={errors?.birthDate}
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
                                register={register('gender', {
                                    required: 'Gender is required',
                                })}
                                defaultValue={data?.gender}
                                errors={errors?.gender}
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
                                register={register('civilStatus', {
                                    required: 'Civil status is required',
                                })}
                                defaultValue={data?.civil_status}
                                errors={errors?.civilStatus}
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
                            register={register('memberType', {
                                required: 'Member type is required',
                            })}
                            defaultValue={data?.member_type}
                            errors={errors?.memberType}
                            disabled
                        />
                    </div>
                </div>

                {/* relationshipId */}
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
                                register={register('relationshipId', {
                                    required: 'Relationship ID is required',
                                })}
                                defaultValue={data?.relationship_id}
                                errors={errors?.relationshipId}
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

                {/* email, mobile */}
                <div className="md:grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="lastname"
                            type="email"
                            className="block mt-1 w-full"
                            register={register('email', {
                                required: 'Email address is required',
                            })}
                            defaultValue={data?.email}
                            errors={errors?.email}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="mobile">Mobile No.</Label>
                        <Input
                            id="mobile"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('mobile', {
                                required: 'Mobile no. is required',
                            })}
                            defaultValue={data?.mobile_no}
                            errors={errors?.mobile}
                            disabled
                        />
                    </div>
                    <div className="mt-2"></div>
                </div>

                {/* Address */}
                <h3 className="font-semibold text-blue-700 mt-2">Address</h3>
                <hr className="mb-2"></hr>

                {/* street, city, province */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                            id="street"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('street', {
                                required: 'Street is required',
                            })}
                            defaultValue={data?.street}
                            errors={errors?.street}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('city', {
                                required: 'City is required',
                            })}
                            defaultValue={data?.city}
                            errors={errors?.city}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('province', {
                                required: 'Province is required',
                            })}
                            defaultValue={data?.province}
                            errors={errors?.province}
                            disabled
                        />
                    </div>
                </div>

                {/* zipCode */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                            id="zipCode"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('zipCode', {
                                required: 'Zip code is required',
                            })}
                            defaultValue={data?.zip_code}
                            errors={errors?.zipCode}
                            disabled
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <h3 className="font-semibold text-blue-700 mt-2">
                    Employment Details
                </h3>
                <hr className="mb-2"></hr>

                {/* position, planType, dateHired */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('position', {
                                required: 'Position is required',
                            })}
                            defaultValue={data?.position}
                            errors={errors?.position}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="planType">Plan Type</Label>
                        <Input
                            id="planType"
                            type="text"
                            className="block mt-1 w-full"
                            register={register('planType', {
                                required: 'Plan type is required',
                            })}
                            defaultValue={data?.plan_type}
                            errors={errors?.planType}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="dateHired">Date Hired</Label>
                        <Input
                            id="dateHired"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('dateHired', {
                                required: 'Date hired is required',
                            })}
                            errors={errors?.dateHired}
                            disabled
                        />
                    </div>
                </div>

                {/* regDate, effectiveDate */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="regDate">Reg Date</Label>
                        <Input
                            id="regDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('regDate', {
                                required: 'Reg date is required',
                            })}
                            defaultValue={data?.reg_date}
                            errors={errors?.regDate}
                            disabled
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                            id="effectiveDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('effectiveDate', {
                                required: 'Effective date is required',
                            })}
                            errors={errors?.effectiveDate}
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
                                    {...register('toBill', {
                                        required: !watch('philHealthMember'),
                                    })}
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
                                    {...register('toBill', {
                                        required: !watch('philHealthMember'),
                                    })}
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

                {/* philHealthConditions */}
                <div className="mt-2">
                    <Label htmlFor="philHealthConditions">
                        PhilHealth Conditions
                    </Label>
                    <TextArea
                        id="philHealthConditions"
                        register={register('philHealthConditions')}
                        className={'mt-1 w-full'}
                        defaultValue={data?.philhealth_conditions}
                        disabled></TextArea>
                </div>

                {/* branchName, philHealthNo, seniorCitizenIDNo */}
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

export default modalUpdateMember
