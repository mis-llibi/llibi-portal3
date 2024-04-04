import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Self-enrollment/InputDep'
import Select from '@/components/Self-enrollment/SelectDependent'
import Button from '@/components/Button'

import {
  MdOutlineFamilyRestroom,
  MdOutlineEscalatorWarning,
} from 'react-icons/md'
import { BiSave, BiUpload } from 'react-icons/bi'

import { useForm } from 'react-hook-form'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'

import PrincipalList from './principal/PrincipalList'
import { insertNewEnrollee } from '@/hooks/members/ManageHrMember'

import birthDayChecker from '@/lib/birthdateValidation'
import dependents from '@/pages/self-enrollment/deel/dependents'

import broadpathRelationValidation from '@/lib/broadpathRelationValidation'
import broadpathCivilStatusValidation from '@/lib/broadpathCivilStatusValidation'

const INITIAL_ENROLLMENT_RELATION = {
  principal: 'PRINCIPAL',
  dependent: 'DEPENDENT',
}

const ManualInsertEnrollee = ({
  create,
  loading,
  setLoader,
  setShow,
  mutate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm()

  const { show, setShow: modalSetShow, body, setBody, toggle } = ModalControl()
  // const { insertNewEnrollee } = useManageEnrollee(1)

  const [enrollmentRelation, setEnrollmentRelation] = useState(null)
  const [selectedPrincipal, setSelectedPrincipal] = useState(null)

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
    setLoader(true)
    const isSuccessSubmit = await insertNewEnrollee({
      setLoader,
      setShow,
      data: FORMDATA,
      reset,
    })
    if (isSuccessSubmit) {
      setEnrollmentRelation(null)
      mutate()
    }
    setLoader(false)
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

  const handleSetEnrollmentRelation = value => {
    setEnrollmentRelation(value)
    setSelectedPrincipal(null)
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

  return (
    <div className="p-3 font-[poppins]">
      <Modal show={show} body={body} toggle={toggle} />
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <span className="text-gray-700 text-sm font-semibold">
            Please select what relation to enroll
          </span>
          <div className="flex justify-center gap-3 border rounded-md p-3 mb-3">
            <Label
              htmlFor="enrollment_relation_principal"
              className={`${
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal &&
                'bg-blue-700 text-white'
              } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
              <input
                className="sr-only"
                type="radio"
                id="enrollment_relation_principal"
                value="PRINCIPAL"
                onChange={e => handleSetEnrollmentRelation(e.target.value)}
                checked={
                  enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal
                }
              />
              <MdOutlineEscalatorWarning size={32} />
              <span className="tracking-widest">PRINCIPAL</span>
            </Label>
            <Label
              htmlFor="enrollment_relation_dependent"
              className={`${
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent &&
                'bg-blue-700 text-white'
              } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
              <input
                className="sr-only"
                type="radio"
                id="enrollment_relation_dependent"
                value="DEPENDENT"
                onChange={e => setEnrollmentRelation(e.target.value)}
                checked={
                  enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent
                }
              />
              <MdOutlineFamilyRestroom size={32} />
              <span className="tracking-widest">DEPENDENT</span>
            </Label>
          </div>
        </div>

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
                <span className="text-gray-500 font-light">(optional)</span>
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
                  min: watch('relation')
                    ? birthDayChecker('min', watch('relation'))
                    : 0,
                  max: watch('relation')
                    ? birthDayChecker('max', watch('relation'))
                    : 0,
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
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                className="block mt-1 w-full"
                register={register('nationality', {
                  required: 'Nationality is required',
                })}
                errors={errors?.nationality}
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="hiredate">Hire Date</Label>
              <Input
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
              <Label htmlFor="egularization_date">Regularization Date</Label>
              <Input
                id="egularization_date"
                type="date"
                className="block mt-1 w-full"
                register={register('egularization_date', {
                  required: 'Regularization Date is required',
                })}
                errors={errors?.egularization_date}
              />
            </div>
            <div className="mb-3">
              <Label htmlFor="attachment">
                Document Requirement(s){' '}
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
                register={register('attachment', {
                  required: 'Attachment is required',
                })}
                errors={errors?.attachment}
              />
            </div>
          </div>
        </div>

        <Button
          className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2 flex gap-1"
          loading={loading}>
          <BiSave size={16} />
          <span>Save</span>
        </Button>
      </form>
    </div>
  )
}

export default ManualInsertEnrollee
