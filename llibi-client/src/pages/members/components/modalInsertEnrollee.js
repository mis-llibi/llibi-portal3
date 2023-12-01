import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import TextArea from '@/components/TextArea'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

import moment from 'moment'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import ModalLapseCutoffRemarks from './modalLapseCutoffRemarks'

const modalUploadEnrollee = ({ create, loading, setLoading, setShow }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm()

  const {
    show: lapseCutOffDaysShow,
    setShow: lapseCutOffDaysSetShow,
    body: lapseCutOffDaysBody,
    setBody: lapseCutOffDaysSetBody,
    toggle: lapseCutOffDaysToggle,
  } = ModalControl()

  const [isLapse, setIsLapse] = useState(false)

  const submitForm = data => {
    let start = moment()
    let end = moment(data.dateHired).format('YYYY-MM-DD')
    const lapseDays = start.diff(end, 'days')

    if (lapseDays > 30) {
      Swal.fire({
        title: 'Lorem Ipsum',
        text:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        icon: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '#3085d6',
        // cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Confirmed',
      }).then(result => {
        if (result.isConfirmed) {
          lapseCutOffDays(data)
        }
      })
      return
    }
    setLoading(true)
    create({ ...data, setLoading, setShow, reset })
  }

  const lapseCutOffDays = data => {
    lapseCutOffDaysSetBody({
      title: <span className="font-bold text-gray-700">Standard Cut-Off</span>,
      content: (
        <ModalLapseCutoffRemarks
          data={data}
          create={create}
          setLoading={setLoading}
          setShow={setShow}
          reset={reset}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    lapseCutOffDaysToggle()
  }

  useEffect(() => {
    clearErrors('effectiveDate')
    setValue('effectiveDate', watch('dateHired'))
  }, [watch('dateHired')])

  useEffect(() => {
    if (watch('changeEffectiveDate'))
      Swal.fire(
        'Are you sure?',
        'If you change the effective date, it is subject for standard cut-off',
        'warning',
      )

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
      <Modal
        className={!isLapse && 'hidden'}
        show={lapseCutOffDaysShow}
        body={lapseCutOffDaysBody}
        toggle={lapseCutOffDaysToggle}
      />
      <form onSubmit={handleSubmit(submitForm)}>
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
              errors={errors?.memberType}
            />
          </div>
        </div>

        {/* Relationship ID */}
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
              // onChange={e => {
              //   let start = moment()
              //   let end = moment(e.target.value).format('YYYY-MM-DD')
              //   const lapseDays = start.diff(end, 'days')
              //   console.log(start, end, lapseDays)
              // }}
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
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="philHealthNo">PhilHealth No.</Label>
            <Input
              id="philHealthNo"
              type="text"
              className="block mt-1 w-full"
              register={register('philHealthNo')}
            />
          </div>
          <div className="mt-2">
            <Label htmlFor="seniorCitizenIDNo">Senior Citizen ID No.</Label>
            <Input
              id="seniorCitizenIDNo"
              type="text"
              className="block mt-1 w-full"
              register={register('seniorCitizenIDNo')}
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
            register={register('clientRemarks')}></TextArea>
        </div>

        <Button
          className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2"
          loading={loading}>
          Submit Enrollee to Masterlist
        </Button>
      </form>
    </div>
  )
}

export default modalUploadEnrollee
