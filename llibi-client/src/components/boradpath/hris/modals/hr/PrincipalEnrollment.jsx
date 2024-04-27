import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Self-enrollment/InputDep'
import Select from '@/components/Self-enrollment/SelectDependent'
import Button from '@/components/Button'

import { BiSave } from 'react-icons/bi'

import { useForm } from 'react-hook-form'

import ModalControl from '@/components/ModalControl'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'

import PrincipalList from '@/pages/members/components/broadpath/principal/PrincipalList'

import { insertNewEnrollee } from '@/hooks/members/ManageHrMember'

import birthDayChecker from '@/lib/birthdateValidation'

import broadpathRelationValidation from '@/lib/broadpathRelationValidation'
import broadpathCivilStatusValidation from '@/lib/broadpathCivilStatusValidation'
import moment from 'moment'
import Swal from 'sweetalert2'

const INITIAL_ENROLLMENT_RELATION = {
  principal: 'PRINCIPAL',
  dependent: 'DEPENDENT',
}

export default function PrincipalEnrollment({
  loading,
  setLoader,
  enrollmentRelation,
  setEnrollmentRelation,
  mutate,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm({ mode: 'onChange' })

  const { show, setShow: modalSetShow, body, setBody, toggle } = ModalControl()
  const [selectedPrincipal, setSelectedPrincipal] = useState(null)
  const [
    showReasonForLateEnrollment,
    setShowReasonForLateEnrollment,
  ] = useState(false)

  const submitForm = async data => {
    const FORMDATA = new FormData()

    if (!enrollmentRelation) {
      alert('Please select relation to enroll')
      return
    }

    for (let key in data) {
      if (key === 'attachment') {
        for (let index = 0; index < data[key].length; index++) {
          FORMDATA.append('attachment[]', data[key][index])
        }
      } else {
        FORMDATA.append(key, data[key])
      }
    }

    // if no relation key in data object
    if (enrollmentRelation === 'PRINCIPAL') {
      FORMDATA.delete('relation')
      FORMDATA.append('relation', 'PRINCIPAL')
    }

    // console.log([...FORMDATA])
    await insertNewEnrollee({
      data: FORMDATA,
      reset,
    })
    mutate()
    setEnrollmentRelation(null)
  }

  const showPrincipal = row => {
    setBody({
      title: 'Principal List',
      content: (
        <PrincipalList
          show={show}
          setShow={modalSetShow}
          setSelectedPrincipal={setSelectedPrincipal}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  useEffect(() => {
    if (enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent) {
      showPrincipal()
    }

    reset({
      member_id: '',
    })
  }, [enrollmentRelation])

  useEffect(() => {
    reset({
      principalName:
        selectedPrincipal?.last_name && selectedPrincipal?.first_name
          ? `${selectedPrincipal?.last_name}, ${selectedPrincipal?.first_name} | ${selectedPrincipal?.civil_status}`
          : '',
      member_id: selectedPrincipal?.member_id ?? '',
    })
  }, [selectedPrincipal])

  useEffect(() => {
    setValue('effectivity_date', watch('regularization_date'))

    const today = moment()
    const regDate = moment(watch('regularization_date'))

    const regDateDiffToday = today.diff(regDate, 'days')

    setShowReasonForLateEnrollment(regDateDiffToday > 30)

    if (regDateDiffToday > 30) {
      Swal.fire(
        'DISCLAIMER',
        'Please put a reason for late enrollment.',
        'warning',
      )
    }
  }, [watch('regularization_date')])

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="grid grid-cols-2 gap-3">
          {enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent && (
            <div className="mb-3">
              <Label htmlFor="principalName">Principal Details</Label>
              <Input
                id="principalName"
                className="block mt-1 w-full"
                register={register('principalName')}
                disabled
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* COLUMN 1 */}
          <div>
            <div className="mb-3">
              <Label htmlFor="member_id">Employee Number</Label>
              <Input
                id="member_id"
                className="block mt-1 w-full"
                register={register('member_id', {
                  required: 'Employee Number is required',
                })}
                disabled={
                  enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent
                }
                errors={errors?.member_id}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                className="block mt-1 w-full"
                register={register('lastname', {
                  required: 'Last Name is required',
                })}
                errors={errors?.lastname}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                className="block mt-1 w-full"
                register={register('firstname', {
                  required: 'First Name is required',
                })}
                errors={errors?.firstname}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="middlename">
                Middle Name{' '}
                <span className="font-thin text-xs">(optional)</span>
              </Label>
              <Input
                id="middlename"
                className="block mt-1 w-full"
                register={register('middlename')}
                errors={errors?.middlename}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                className="block mt-1 w-full"
                register={register('birthdate', {
                  required: 'Birth Date is required',
                  min: birthDayChecker('min', 'PRINCIPAL'),
                  max: birthDayChecker('max', 'PRINCIPAL'),
                })}
                errors={errors?.birthdate}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="block mt-1 w-full"
                register={register('email', { required: 'Email is required' })}
                errors={errors?.email}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="mobile_no">Mobile Number</Label>
              <Input
                id="mobile_no"
                className="block mt-1 w-full"
                register={register('mobile_no', {
                  required: 'Mobile is required',
                })}
                errors={errors?.mobile_no}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="street">House No./Street</Label>
              <Input
                id="street"
                className="block mt-1 w-full"
                register={register('street', {
                  required: 'Street is required',
                })}
                errors={errors?.street}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="barangay">Barangay/District</Label>
              <Input
                id="barangay"
                className="block mt-1 w-full"
                register={register('barangay', {
                  required: 'Barangay is required',
                })}
                errors={errors?.barangay}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                className="block mt-1 w-full"
                register={register('city', { required: 'City is required' })}
                errors={errors?.city}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                className="block mt-1 w-full"
                register={register('province', {
                  required: 'Province is required',
                })}
                errors={errors?.province}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                className="block mt-1 w-full"
                register={register('zip_code', {
                  required: 'Zip Code is required',
                })}
                errors={errors?.zip_code}
              />
            </div>
          </div>
          {/* COLUMN 2 */}
          <div>
            <div className="mb-3">
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                className="block mt-1 w-full"
                options={[
                  { label: 'Select Gender', value: '' },
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                ]}
                register={register('gender', {
                  required: 'Gender is required',
                })}
                errors={errors?.gender}
              />
            </div>
            {enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent && (
              <div className="mb-3">
                <Label htmlFor="relation">Relation</Label>
                <Select
                  id="relation"
                  className={`block mt-1 w-full`}
                  options={broadpathRelationValidation(
                    selectedPrincipal?.civil_status,
                  )}
                  register={register('relation', {
                    required: 'Relation is required',
                  })}
                  errors={errors?.relation}
                />
              </div>
            )}
            <div className="mb-3">
              <Label htmlFor="civilstatus">Civil Status</Label>
              <Select
                id="civilstatus"
                className="block mt-1 w-full"
                options={broadpathCivilStatusValidation(
                  selectedPrincipal?.civil_status,
                  watch('relation'),
                )}
                register={register('civilstatus', {
                  required: 'Civil Status is required',
                })}
                errors={errors?.civilstatus}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="nationality">
                Nationality{' '}
                <span className="font-thin text-xs">(optional)</span>
              </Label>
              <Input
                id="nationality"
                className="block mt-1 w-full"
                register={register('nationality')}
                errors={errors?.nationality}
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="hiredate">Hire Date</Label>
              <Input
                onKeyDown={e => {
                  e.preventDefault()
                }}
                id="hiredate"
                type="date"
                className="block mt-1 w-full"
                register={register('hiredate', {
                  required: 'Hire Date is required',
                })}
                errors={errors?.hiredate}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="regularization_date">Regularization Date</Label>
              <Input
                onKeyDown={e => {
                  e.preventDefault()
                }}
                id="regularization_date"
                type="date"
                className="block mt-1 w-full"
                register={register('regularization_date', {
                  required: 'Regularization Date is required',
                })}
                errors={errors?.regularization_date}
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="effectivity_date">Effectivity Date</Label>
              <Input
                id="effectivity_date"
                type="date"
                className="block mt-1 w-full"
                register={register('effectivity_date')}
                disabled
              />
            </div>
            {showReasonForLateEnrollment && (
              <div className="mb-3">
                <Label htmlFor="reason_for_late_enrollment">
                  Reason for late enrollment
                </Label>
                <Input
                  id="reason_for_late_enrollment"
                  type="text"
                  className="block mt-1 w-full"
                  register={register('reason_for_late_enrollment', {
                    required: 'Reason for late enrollment is required',
                  })}
                  errors={errors?.reason_for_late_enrollment}
                />
              </div>
            )}

            <div className="mb-3">
              {showReasonForLateEnrollment && (
                <p className="font-bold text-sm mt-3 bg-red-50 text-red-600 px-3 py-2 rounded-md w-full text-center uppercase mb-3">
                  LATE ENROLLMENT
                </p>
              )}
            </div>

            <div className="mb-3">
              <Label htmlFor="attachment">
                Document Requirement(s)
                <sup className="font-thin text-red-600">
                  please select civil status
                </sup>
                :
              </Label>
              <InputFile
                label={``}
                id="attachment"
                loading={loading}
                setLoader={setLoader}
                civilStatus={watch('civilstatus')}
                rel={watch('relation')}
                reset={reset}
                type="file"
                accept="image/*, application/pdf"
                multiple
                register={register('attachment')}
                errors={errors?.attachment}
              />
            </div>
          </div>
        </div>

        <Button
          disabled={isSubmitting}
          className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2 flex gap-1"
          loading={isSubmitting}>
          <BiSave size={16} />
          <span>Save</span>
        </Button>
      </form>
    </>
  )
}
