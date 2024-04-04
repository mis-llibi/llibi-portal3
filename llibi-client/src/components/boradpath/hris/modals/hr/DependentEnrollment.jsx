import React, { useEffect, useMemo, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Self-enrollment/InputDep'
import Select from '@/components/Self-enrollment/SelectDependent'
import Button from '@/components/Button'

import { BiSave } from 'react-icons/bi'

import { useForm } from 'react-hook-form'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'

import PrincipalList from '@/pages/members/components/broadpath/principal/PrincipalList'

import { insertNewEnrollee } from '@/hooks/members/ManageHrMember'

import birthDayChecker from '@/lib/birthdateValidation'

import broadpathRelationValidation from '@/lib/broadpathRelationValidation'
import broadpathCivilStatusValidation from '@/lib/broadpathCivilStatusValidation'
import moment from 'moment'

const INITIAL_ENROLLMENT_RELATION = {
  principal: 'PRINCIPAL',
  dependent: 'DEPENDENT',
}

export default function DependentEnrollment({
  loading,
  setLoader,
  enrollmentRelation,
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
  const watchFields = watch()

  const { show, setShow: modalSetShow, body, setBody, toggle } = ModalControl()
  const [selectedPrincipal, setSelectedPrincipal] = useState(null)
  const [isNewBorn, setIsNewBorn] = useState(false)
  const [isNewWedding, setIsNewWedding] = useState(false)

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

  const relationOptions = () => {
    if (isNewBorn) {
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Child', value: 'CHILD' },
      ]
    }

    if (isNewWedding) {
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Spouse', value: 'SPOUSE' },
      ]
    }
    return broadpathRelationValidation(selectedPrincipal?.civil_status)
  }

  const civilOptions = () => {
    if (isNewBorn) {
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Single', value: 'SINGLE' },
      ]
    }

    if (isNewWedding) {
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Married', value: 'MARRIED' },
      ]
    }
    return broadpathCivilStatusValidation(
      selectedPrincipal?.civil_status,
      watch('relation'),
    )
  }

  useEffect(() => {
    let timer1 = setTimeout(() => {
      showPrincipal()

      reset({
        member_id: '',
      })
    }, 500)

    return () => {
      clearTimeout(timer1)
    }
  }, [enrollmentRelation])

  useEffect(() => {
    const todayDate = moment()
    const birthDate = moment(watchFields.birthdate)
    const regularizationDate = moment(selectedPrincipal?.reg_date)

    const daysDifferenceBirthDate = dayType => {
      return todayDate.diff(birthDate, dayType)
    }
    const daysDifferenceRegularizationDate = todayDate.diff(
      regularizationDate,
      'days',
    )

    // console.log(
    //   daysDifferenceBirthDate('days'),
    //   daysDifferenceBirthDate('years'),
    //   daysDifferenceRegularizationDate,
    // )

    setIsNewBorn(
      daysDifferenceBirthDate('days') >= 15 &&
        daysDifferenceBirthDate('days') <= 30 &&
        daysDifferenceRegularizationDate >= 30,
    )
    setIsNewWedding(
      daysDifferenceBirthDate('year') >= 15 &&
        daysDifferenceRegularizationDate >= 30,
    )
  }, [watchFields.birthdate, selectedPrincipal?.reg_date])

  useEffect(() => {
    reset({
      member_id: selectedPrincipal?.member_id ?? '',
      principalMemberId: selectedPrincipal?.member_id ?? '',
      principalName:
        selectedPrincipal?.last_name && selectedPrincipal?.first_name
          ? `${selectedPrincipal?.last_name}, ${selectedPrincipal?.first_name}`
          : '',
      principalCivilStatus: selectedPrincipal?.civil_status ?? '',
      hiredate: moment(selectedPrincipal?.date_hired).format('Y-MM-DD'),
      regularization_date: moment(selectedPrincipal?.reg_date).format(
        'Y-MM-DD',
      ),
    })
  }, [selectedPrincipal])

  const PrincipalDetails = () => {
    return (
      <>
        <h1 className="text-xl text-blue-900 font-extrabold mb-3">
          Principal Details:
        </h1>
        <div className="grid grid-cols-2 gap-3 border-b mb-3">
          <div className="mb-3">
            <Label htmlFor="principalMemberId">Member Number</Label>
            <Input
              id="principalMemberId"
              className="block mt-1 w-full"
              register={register('principalMemberId')}
              disabled
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="principalCivilStatus">Civil Status</Label>
            <Input
              id="principalCivilStatus"
              className="block mt-1 w-full"
              register={register('principalCivilStatus')}
              disabled
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="principalName">Name</Label>
            <Input
              id="principalName"
              className="block mt-1 w-full"
              register={register('principalName')}
              disabled
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="hiredate">Hire Date</Label>
            <Input
              id="hiredate"
              type="date"
              className="block mt-1 w-full"
              register={register('hiredate')}
              disabled
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="regularization_date">Regularization Date</Label>
            <Input
              id="regularization_date"
              type="date"
              className="block mt-1 w-full"
              register={register('regularization_date')}
              disabled
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Modal show={show} body={body} toggle={toggle} />
      <form onSubmit={handleSubmit(submitForm)}>
        <PrincipalDetails />
        <h1 className="text-xl text-blue-900 font-extrabold mb-3">
          Dependent Details:
        </h1>
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
                  options={relationOptions()}
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
                options={civilOptions()}
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

            {(isNewBorn && watchFields.relation === 'CHILD') ||
            (isNewWedding && watchFields.relation === 'SPOUSE') ? (
              <div className="mb-3">
                <Label htmlFor="effectivity_date">Effectivity Date</Label>
                <Input
                  id="effectivity_date"
                  type="date"
                  className="block mt-1 w-full"
                  register={register('effectivity_date', {
                    required: 'Effectivity Date is required',
                  })}
                  errors={errors?.effectivity_date}
                />
                <p className="font-bold text-sm mt-3 bg-blue-50 text-blue-600 px-3 py-2 rounded-md w-36 text-center uppercase">
                  {isNewBorn ? 'Newly Born' : 'Newly Wedding'}
                </p>
              </div>
            ) : (
              ''
            )}

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
