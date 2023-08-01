import React from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import { ManageClientsApproval } from '@/hooks/self-enrollment/ManageClientsApproval'

import Swal from 'sweetalert2'

const ModalUpdateEnrollee = ({
    data,
    company,
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

    const { clients } = ManageClientsApproval({
        memberId: data?.member_id,
        company: company,
    })

    const submitForm = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                'System will send email and sms notification to this client, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!',
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
                        className="block mt-1 w-full"
                        register={register('empno', {
                            required: 'Employee number is required',
                        })}
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
                                className="block mt-1 w-full"
                                register={register('lastName', {
                                    required: 'Last name is required',
                                })}
                                defaultValue={data?.last_name}
                                errors={errors?.lastName}
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
                                id="birthDate"
                                type="date"
                                className="block mt-1 w-full"
                                register={register('birthDate', {
                                    required: 'DOB is required',
                                })}
                                defaultValue={data?.birth_date}
                                errors={errors?.birthDate}
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
                            />
                        </div>
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
                            className="block mt-1 w-full"
                            register={register('email', {
                                required: 'Email address is required',
                            })}
                            defaultValue={data?.email}
                            errors={errors?.email}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="altEmail">
                            Alternate Email Address
                        </Label>
                        <Input
                            id="altEmail"
                            type="altEmail"
                            className="block mt-1 w-full"
                            register={register('altEmail', {
                                required: 'Email address is required',
                            })}
                            defaultValue={data?.email2}
                            errors={errors?.altEmail}
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
                            className="block mt-1 w-full"
                            register={register('street', {
                                required: 'Street is required',
                            })}
                            defaultValue={data?.street}
                            errors={errors?.street}
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
                            className="block mt-1 w-full"
                            register={register('zipCode', {
                                required: 'Zip code is required',
                            })}
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
                            className="block mt-1 w-full"
                            register={register('dateHired', {
                                required: 'Date hired is required',
                            })}
                            defaultValue={data?.hire_date}
                            errors={errors?.hire_date}
                        />
                    </div>
                    <div className="mt-2">
                        <Label htmlFor="coverageDate">Coverage Date</Label>
                        <Input
                            id="coverageDate"
                            type="date"
                            className="block mt-1 w-full"
                            register={register('coverageDate', {
                                required: 'Coverage date is required',
                            })}
                            defaultValue={data?.coverage_date}
                            errors={errors?.coverageDate}
                        />
                    </div>
                </div>

                {/* For Approval Details */}
                <h3 className="font-semibold text-red-700 mt-3">
                    Approval - Certificate No. Encoding
                </h3>
                <hr className="mb-4"></hr>

                <div className="w-full border p-2 bg-gray-200">
                    <table className="table-auto w-full bg-white">
                        <thead>
                            <tr>
                                <th className="border">Name</th>
                                <th className="border">Relation</th>
                                <th className="border">Certificate #</th>
                                <th className="border">Date/Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients?.map((item, i) => (
                                <tr key={i}>
                                    <td className="border p-2">
                                        {item.first_name} {item.last_name}
                                    </td>
                                    <td className="border p-2">
                                        {item.relation}
                                    </td>
                                    <td className="border p-2">
                                        <Input
                                            type="text"
                                            className="block mt-1 w-full"
                                            placeholder="Input Cert # Here"
                                            register={register(
                                                `certificateNo${item.id}`,
                                            )}
                                            defaultValue={item?.certificate_no}
                                            errors={errors?.certificateNo}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        {item.certificate_encode_datetime ||
                                            'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* <tbody>
                            {clients &&
                                clients?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border p-2">
                                            {item.first_name} {item.last_name}
                                        </td>
                                        <td className="border p-2">
                                            {item.relation}
                                        </td>
                                        <td className="border p-2">
                                            {item.birth_date}
                                        </td>
                                        <td className="border p-2">
                                            <InputCheckBox
                                                type="checkbox"
                                                label="Remove this member"
                                                labelClass="text-red-800"
                                                register={register(
                                                    `cancelBox${item.id}`,
                                                )}
                                                className={'capitalize'}
                                                errors={errors?.cancelBox}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody> */}
                    </table>
                </div>

                <Button
                    className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2"
                    loading={loading}>
                    Update Member & Dependents
                </Button>
            </form>
        </div>
    )
}

export default ModalUpdateEnrollee
