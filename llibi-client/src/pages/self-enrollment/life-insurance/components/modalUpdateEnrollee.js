import React from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

const ModalUpdateEnrollee = ({
    data,
    update,
    loading,
    setLoading,
    setShow,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const submitForm = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                "You are approving this employee's life insurance, do you want to continue?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!',
        }).then(result => {
            if (result.isConfirmed) {
                setLoading(true)
                update({ ...data, setLoading, setShow, reset })
            }
        })
    }

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit(submitForm)}>
                <input
                    type="hidden"
                    {...register('id')}
                    defaultValue={data?.id}
                />

                {/* Personal Information */}
                <h3 className="font-semibold text-blue-700">
                    Personal Information
                </h3>
                <hr className="mb-2"></hr>

                {/* empno */}
                <div className="mb-2 md:w-3/12">
                    <Label htmlFor="empno">Employee No</Label>
                    <Input
                        id="empno"
                        type="text"
                        readOnly
                        register={register('empno')}
                        className="block mt-1 w-full"
                        defaultValue={data?.member_id}
                        errors={errors?.empno}
                    />
                </div>

                {/* Full Name */}
                <div className="">
                    <div className="md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                readOnly
                                register={register('lastName')}
                                className="block mt-1 w-full"
                                defaultValue={data?.last_name}
                                errors={errors?.lastName}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                readOnly
                                register={register('firstName')}
                                className="block mt-1 w-full"
                                defaultValue={data?.first_name}
                                errors={errors?.firstName}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                type="text"
                                disabled
                                className="block mt-1 w-full"
                                defaultValue={data?.middle_name}
                                errors={errors?.middleName}
                            />
                        </div>
                    </div>
                </div>

                {/* DOB Gender MemberType */}
                <div className="">
                    <div className="md:grid grid-cols-3 gap-2">
                        <div className="mt-2">
                            <Label htmlFor="birthDate">Birth Date</Label>
                            <Input
                                disabled
                                id="birthDate"
                                type="date"
                                className="block mt-1 w-full"
                                defaultValue={data?.birth_date}
                                errors={errors?.birthDate}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                disabled
                                id="gender"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'Male', value: 'M' },
                                    { label: 'Female', value: 'F' },
                                ]}
                                defaultValue={data?.gender}
                                errors={errors?.gender}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="civilStatus">Civil Status</Label>
                            <Select
                                disabled
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
                                defaultValue={data?.civil_status}
                                errors={errors?.civilStatus}
                            />
                        </div>
                        <div className="mt-2">
                            <Label htmlFor="relationshipId">
                                Relationship ID
                            </Label>
                            <Select
                                disabled
                                id="relationshipId"
                                className="block mt-1 w-full"
                                options={[
                                    { label: 'Principal', value: 'Principal' },
                                    { label: 'Parent', value: 'Parent' },
                                    { label: 'Spouse', value: 'Spouse' },
                                    { label: 'Child', value: 'Child' },
                                ]}
                                defaultValue={data?.relationship_id}
                                errors={errors?.relationshipId}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <h3 className="font-semibold text-blue-700 mt-3">
                    Contact Details
                </h3>
                <hr className="mb-2"></hr>

                {/* Email & Mobile */}
                <div className="md:grid grid-cols-2 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            readOnly
                            register={register('email')}
                            className="block mt-1 w-full"
                            defaultValue={data?.email}
                            errors={errors?.email}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="mobile">Mobile No.</Label>
                        <Input
                            id="mobile"
                            type="text"
                            readOnly
                            register={register('mobile')}
                            className="block mt-1 w-full"
                            defaultValue={data?.mobile_no}
                            errors={errors?.mobile}
                        />
                    </div>
                </div>

                {/* Address */}
                <h3 className="font-semibold text-blue-700 mt-2">Address</h3>
                <hr className="mb-2"></hr>

                {/* Street, City, Province */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                            id="street"
                            type="text"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.street}
                            errors={errors?.street}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            type="text"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.city}
                            errors={errors?.city}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            type="text"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.province}
                            errors={errors?.province}
                        />
                    </div>
                </div>

                {/* Zip code */}
                <div className="md:grid grid-cols-3 gap-2">
                    <div className="mt-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                            id="zipCode"
                            type="text"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.zip_code}
                            errors={errors?.zipCode}
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <h3 className="font-semibold text-blue-700 mt-3">
                    Employment Details
                </h3>
                <hr className="mb-2"></hr>

                {/* Position, PlanType, DateHired */}
                <div className="md:grid grid-cols-3 gap-2 mb-4">
                    <div className="mt-2">
                        <Label htmlFor="dateHired">Date Hired</Label>
                        <Input
                            id="dateHired"
                            type="date"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.hire_date}
                            errors={errors?.hire_date}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="coverageDate">Coverage Date</Label>
                        <Input
                            id="coverageDate"
                            type="date"
                            disabled
                            className="block mt-1 w-full"
                            defaultValue={data?.coverage_date}
                            errors={errors?.coverageDate}
                        />
                    </div>
                </div>

                {/* Insurance Information */}
                <h3 className="font-semibold text-blue-700">
                    Insurance Information
                </h3>
                <hr className="mb-2"></hr>

                {/* insuranceNo */}
                <div className="md:grid grid-cols-3 gap-4 mb-4">
                    <div className="mt-2">
                        <Label htmlFor="insuranceNo">Insurance No</Label>
                        <Input
                            id="insuranceNo"
                            type="text"
                            register={register('insuranceNo', {
                                required: 'Insurance number is required',
                            })}
                            placeholder="Enter Life Insurance No."
                            className="block mt-1 w-full"
                            defaultValue={data?.insurance_no}
                            errors={errors?.insuranceNo}
                        />
                    </div>
                    <div className="grid place-items-center justify-start text-md">
                        <div htmlFor="insuranceNo">
                            Date/Time Approved: <br />{' '}
                            <b>{data?.insurance_encode_datetime || 'N/A'}</b>
                        </div>
                    </div>
                    <div className="grid place-items-center justify-start text-md">
                        <div htmlFor="insuranceNo">
                            Status: <br />
                            <span
                                className={`${
                                    (data?.li_status == 0 &&
                                        'text-orange-400') ||
                                    (data?.li_status == 1 &&
                                        'text-green-400') ||
                                    (data?.li_status == 2 && 'text-red-400')
                                }`}>
                                {data?.li_status == 0 && 'Pending'}
                                {data?.li_status == 1 && 'Approved'}
                                {data?.li_status == 2 && 'Denied'}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2"
                    loading={loading}>
                    Update Client Life Insurance
                </Button>
            </form>
        </div>
    )
}

export default ModalUpdateEnrollee
