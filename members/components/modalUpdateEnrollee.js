import React, { useEffect } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

import moment from 'moment'

const modalUpdateMember = ({ data, update, loading, setLoading, setShow }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm()

  const submitForm = data => {
    setLoading(true)
    update({ ...data, setLoading, setShow, reset })
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
    clearErrors('effectiveDate')
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

      const dateHired = moment(watch('dateHired'))

      let start = moment()
      let end = moment(dateHired).format('YYYY-MM-DD')
      const lapseDays = start.diff(end, 'days')

      if (lapseDays > 30) {
        const setCutOffDate =
          dateHired.format('DD') <= 15
            ? moment().add(1, 'M').date(1).format('YYYY-MM-DD')
            : moment().add(1, 'M').date(16).format('YYYY-MM-DD')
        setValue('effectiveDate', setCutOffDate)
        // console.log(setCutOffDate)
      } else {
        setValue('effectiveDate', data?.effective_date)
      }
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

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(submitForm)}>
        <input type="hidden" {...register('id')} defaultValue={data?.id} />

        {/* Personal Information */}
        <h3 className="font-semibold text-blue-700">Personal Information</h3>
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
            defaultValue={data?.employee_no}
            errors={errors?.empno}
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
                register={register('middleName', {
                  required: 'Middle name is required',
                })}
                defaultValue={data?.middle_name}
                errors={errors?.middleName}
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
            />
          </div>
        </div>

        {/* relationshipId */}
        <div className="md:flex gap-2">
          <div className="basis-10/12 md:grid grid-cols-3 gap-2">
            <div className="mt-2">
              <Label htmlFor="relationshipId">Relationship ID</Label>
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
        <h3 className="font-semibold text-blue-700 mt-2">Contact Details</h3>
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
          <div className="mt-2"></div>
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
        <h3 className="font-semibold text-blue-700 mt-2">Employment Details</h3>
        <hr className="mb-2"></hr>

        {/* Position, PlanType, DateHired */}
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
              // onInput={() => setValue('changeEffectiveDate', undefined)}
              errors={errors?.dateHired}
            />
          </div>
        </div>

        {/* RegDate EffectiveDate */}
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
        <h3 className="font-semibold text-blue-700 mt-2">PhilHealth Form</h3>
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
              <label htmlFor="toBill" className="inline-flex items-center">
                <input
                  id="toBill"
                  type="radio"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  {...register('toBill', {
                    required: !watch('philHealthMember'),
                  })}
                  value="YES TO BILL"
                />
                <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                  YES TO BILL
                </div>
              </label>
            </div>
            <div>
              <label htmlFor="notToBill" className="inline-flex items-center">
                <input
                  id="notToBill"
                  type="radio"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  {...register('toBill', {
                    required: !watch('philHealthMember'),
                  })}
                  value="NOT TO BILL"
                />
                <div className="ml-2 mt-1 text-sm text-gray-600 cursor-pointer">
                  NOT TO BILL
                </div>
              </label>
            </div>
            <p className="text-xs ml-2 text-red-400 mt-1">
              (This is required if enrollee is not a Philhealth Member)
            </p>
          </div>
        </div>

        {/* philHealthConditions */}
        <div className="mt-2">
          <Label htmlFor="philHealthConditions">PhilHealth Conditions</Label>
          <TextArea
            id="philHealthConditions"
            register={register('philHealthConditions')}
            className={'mt-1 w-full'}
            defaultValue={data?.philhealth_conditions}
            readOnly={!watch('philHealthMember')}></TextArea>
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
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="seniorCitizenIDNo">Senior Citizen ID No.</Label>
            <Input
              id="seniorCitizenIDNo"
              type="text"
              className="block mt-1 w-full"
              register={register('seniorCitizenIDNo')}
              defaultValue={data?.senior_citizen_id_no}
            />
          </div>
        </div>

        {/* Client Remarks */}
        <h3 className="font-semibold text-blue-700 mt-2">Client Remark(s)</h3>
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
          Update Enrollee
        </Button>
      </form>
    </div>
  )
}

export default modalUpdateMember
