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

import Swal from 'sweetalert2'
import SingleToMarried from '@/pages/members/components/broadpath/milestone/SingleToMarried'
import SingleToSoloParent from '@/pages/members/components/broadpath/milestone/SingleToSoloParent'
import { useEnrollmentRelationStore } from '@/store/useEnrollmentRelationStore'

export default function DependentEnrollment({ loading, setLoader, mutate }) {
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

  const {
    enrollmentRelation,
    setEnrollmentRelation,
  } = useEnrollmentRelationStore()

  const { show, setShow: modalSetShow, body, setBody, toggle } = ModalControl()
  const [selectedPrincipal, setSelectedPrincipal] = useState(null)
  const [isNewBorn, setIsNewBorn] = useState(false)
  const birthDateCountDays = useMemo(() => {
    const todayDate = moment()
    const birthDate = moment(watchFields.birthdate)

    return todayDate.diff(birthDate, 'day')
  }, [watchFields?.birthdate])
  const [isNewWedding, setIsNewWedding] = useState(false)
  const [isMileStone, setIsMileStone] = useState(0)
  const [lateMarriage, setLateMarriage] = useState(false)

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
        if (
          ![
            'principalMemberId',
            'principalName',
            'principalCivilStatus',
          ].includes(key)
        ) {
          FORMDATA.append(key, data[key])
        }
      }
    }

    FORMDATA.append(
      `principalInfo`,
      JSON.stringify({
        principalMemberId: data.principalMemberId,
        principalName: data.principalName,
        principalCivilStatus: data.principalCivilStatus,
        principalBirthDate: data.principalBirthDate,
      }),
    )

    // if no relation key in data object
    if (enrollmentRelation === 'PRINCIPAL') {
      FORMDATA.delete('relation')
      FORMDATA.append('relation', 'PRINCIPAL')
    }

    FORMDATA.append('isMileStone', isMileStone >= 30 ? true : false)

    if (
      watchFields.relation === 'SPOUSE' &&
      watchFields.principalCivilStatus === 'SINGLE' &&
      isMileStone >= 30
    ) {
      showSingleToMarried({
        data,
        reset,
        isMileStone: isMileStone,
        relation: watchFields.relation,
      })
      return
    } else if (
      watchFields.relation === 'CHILD' &&
      watchFields.principalCivilStatus === 'SINGLE' &&
      isMileStone >= 30
    ) {
      showSingleToSoloParent({
        data,
        reset,
        isMileStone: isMileStone,
        relation: watchFields.relation,
      })
      return
    } else {
      await insertNewEnrollee({
        data: FORMDATA,
        reset,
        isMileStone: isMileStone,
        relation: watchFields.relation,
      })

      reset({
        member_id: '',
        principalMemberId: '',
        principalBirthDate: null,
        principalName: '',
        principalCivilStatus: '',
        hiredate: null,
        regularization_date: null,
        principalEmail: '',
      })
      setEnrollmentRelation(null)
    }

    mutate()
  }

  const showSingleToMarried = ({ data, reset, isMileStone, relation }) => {
    setBody({
      title: 'Are you sure you want to proceed?',
      content: (
        <SingleToMarried
          show={show}
          setShow={modalSetShow}
          data={data}
          reset={reset}
          isMileStone={isMileStone}
          relation={relation}
          setEnrollmentRelation={setEnrollmentRelation}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  const showSingleToSoloParent = ({ data, reset, isMileStone, relation }) => {
    setBody({
      title: 'Are you sure you want to proceed?',
      content: (
        <SingleToSoloParent
          show={show}
          setShow={modalSetShow}
          data={data}
          reset={reset}
          isMileStone={isMileStone}
          relation={relation}
          setEnrollmentRelation={setEnrollmentRelation}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
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
    const defaultOption = { label: 'Select Relation', value: '' }

    if (birthDateCountDays > 0 && isMileStone >= 30) {
      if (
        (isMileStone >= 30 &&
          watchFields?.principalCivilStatus === 'SINGLE' &&
          birthDateCountDays >= 15 &&
          birthDateCountDays <= 30) ||
        Math.ceil(birthDateCountDays / 365) <= 17
      ) {
        return [{ ...defaultOption }, { label: 'Child', value: 'CHILD' }]
      }

      if (
        isMileStone >= 30 &&
        watchFields?.principalCivilStatus === 'SINGLE' &&
        Math.ceil(birthDateCountDays / 365) >= 18 &&
        Math.ceil(birthDateCountDays / 365) <= 65
      ) {
        return [{ ...defaultOption }, { label: 'Spouse', value: 'SPOUSE' }]
      }

      return broadpathRelationValidation(selectedPrincipal?.civil_status)
    }

    if (birthDateCountDays > 0 && isMileStone < 30) {
      return broadpathRelationValidation(selectedPrincipal?.civil_status)
    }

    return [{ ...defaultOption }]
  }

  const civilOptions = () => {
    const defaultOption = { label: 'Select Relation', value: '' }

    if (isMileStone >= 30 && watchFields?.relation === 'CHILD') {
      return [{ ...defaultOption }, { label: 'Single', value: 'SINGLE' }]
    }

    if (isMileStone >= 30 && watchFields?.relation === 'SPOUSE') {
      return [{ ...defaultOption }, { label: 'Married', value: 'MARRIED' }]
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

    setIsNewBorn(
      daysDifferenceBirthDate('days') >= 15 &&
        daysDifferenceBirthDate('days') <= 30 &&
        daysDifferenceRegularizationDate >= 30,
    )
    setIsNewWedding(
      daysDifferenceBirthDate('year') >= 15 &&
        daysDifferenceRegularizationDate >= 30,
    )

    setIsMileStone(daysDifferenceRegularizationDate)
  }, [watchFields.birthdate, selectedPrincipal?.reg_date])

  useEffect(() => {
    reset({
      member_id: selectedPrincipal?.member_id ?? '',
      principalMemberId: selectedPrincipal?.member_id ?? '',
      principalBirthDate: selectedPrincipal?.birth_date,
      principalName:
        selectedPrincipal?.last_name && selectedPrincipal?.first_name
          ? `${selectedPrincipal?.last_name}, ${selectedPrincipal?.first_name}`
          : '',
      principalCivilStatus: selectedPrincipal?.civil_status ?? '',
      hiredate: selectedPrincipal?.date_hired,
      regularization_date: selectedPrincipal?.reg_date,
      principalEmail: selectedPrincipal?.contact?.email ?? '',
      principalEffectivityDate: selectedPrincipal?.reg_date,
    })
  }, [selectedPrincipal?.member_id])

  useEffect(() => {
    if (isMileStone < 30) {
      setValue(
        'effectivity_date',
        moment(watchFields.regularization_date).format('Y-MM-DD'),
      )
    } else {
      if (watchFields.relation === 'SPOUSE') {
        setValue(
          'effectivity_date',
          moment(watchFields.marriage_date).format('Y-MM-DD'),
        )
      } else if (watchFields.relation === 'CHILD') {
        setValue(
          'effectivity_date',
          moment(watchFields.birthdate).add(15, 'days').format('Y-MM-DD'),
        )
      } else {
        setValue(
          'effectivity_date',
          moment(watchFields.regularization_date).format('Y-MM-DD'),
        )
      }
    }
  }, [
    watchFields.regularization_date,
    watchFields.birthdate,
    watchFields.relation,
    watchFields.marriage_date,
  ])

  useEffect(() => {
    if (
      isMileStone >= 30 &&
      birthDateCountDays > 30 &&
      watchFields.relation === 'CHILD'
    ) {
      Swal.fire(
        'DISCLAIMER',
        'Please put a reason for late enrollment.',
        'warning',
      )
    }

    const todayDate = moment()
    const marriageDate = moment(watchFields.marriage_date)
    const marriageDateDiff = todayDate.diff(marriageDate, 'days')

    if (
      isMileStone >= 30 &&
      marriageDateDiff > 30 &&
      watchFields.relation === 'SPOUSE'
    ) {
      setLateMarriage(true)
      Swal.fire(
        'DISCLAIMER',
        'Please put a reason for late enrollment.',
        'warning',
      )
    } else {
      setLateMarriage(false)
    }
  }, [
    watchFields.regularization_date,
    birthDateCountDays,
    watchFields.relation,
    watchFields.marriage_date,
  ])

  useEffect(() => {
    return () => !enrollmentRelation && setEnrollmentRelation(null)
  }, [])

  const PrincipalDetails = () => {
    return (
      <div className="bg-gray-100 p-3 rounded-md mb-5">
        <h1 className="text-xl text-blue-900 font-extrabold mb-3">
          Principal Details:
        </h1>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* COL1 */}
          <div>
            <div>
              <Label htmlFor="principalMemberId">
                Employee Number:{' '}
                <span className="font-thin">
                  {watchFields.principalMemberId}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="principalMemberId"
                  className="block mt-1 w-full"
                  register={register('principalMemberId')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="principalName">
                Name:{' '}
                <span className="font-thin">{watchFields.principalName}</span>
              </Label>
              <div className="sr-only">
                <Input
                  id="principalName"
                  className="block mt-1 w-full"
                  register={register('principalName')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="principalEmail">
                Email:{' '}
                <span className="font-thin">{watchFields.principalEmail}</span>
              </Label>
              <div className="sr-only">
                <Input
                  id="principalEmail"
                  className="block mt-1 w-full"
                  register={register('principalEmail')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="principalBirthDate">
                Birth Date:{' '}
                <span className="font-thin">
                  {watchFields.principalBirthDate &&
                    moment(watchFields.principalBirthDate).format('MMM DD, Y')}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="principalBirthDate"
                  className="block mt-1 w-full"
                  register={register('principalBirthDate')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="principalCivilStatus">
                Civil Status:{' '}
                <span className="font-thin">
                  {watchFields.principalCivilStatus}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="principalCivilStatus"
                  className="block mt-1 w-full"
                  register={register('principalCivilStatus')}
                  disabled
                />
              </div>
            </div>
          </div>
          {/* COL2 */}
          <div>
            <div>
              <Label htmlFor="hiredate">
                Hired Date:{' '}
                <span className="font-thin">
                  {watchFields.hiredate &&
                    moment(watchFields.hiredate).format('MMM DD, Y')}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="hiredate"
                  type="date"
                  className="block mt-1 w-full"
                  register={register('hiredate')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="regularization_date">
                Regularization Date:{' '}
                <span className="font-thin">
                  {watchFields.regularization_date &&
                    moment(watchFields.regularization_date).format('MMM DD, Y')}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="regularization_date"
                  type="date"
                  className="block mt-1 w-full"
                  register={register('regularization_date')}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="regularization_date">
                Effectivity Date:{' '}
                <span className="font-thin">
                  {watchFields.principalEffectivityDate &&
                    moment(watchFields.principalEffectivityDate).format(
                      'MMM DD, Y',
                    )}
                </span>
              </Label>
              <div className="sr-only">
                <Input
                  id="regularization_date"
                  type="date"
                  className="block mt-1 w-full"
                  register={register('regularization_date')}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <div className="grid grid-cols-2 gap-5">
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
                onKeyDown={e => {
                  e.preventDefault()
                }}
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

            {(isNewBorn && watchFields.relation === 'CHILD') ||
            (isNewWedding &&
              watchFields.relation === 'SPOUSE' &&
              !lateMarriage) ? (
              <p className="font-bold text-sm mt-3 bg-blue-50 text-blue-600 px-3 py-2 rounded-md w-full text-center uppercase mb-3">
                {isNewBorn ? 'Newly Born' : 'Newly Wedded'}
              </p>
            ) : (
              ''
            )}

            {isMileStone &&
            birthDateCountDays > 30 &&
            watchFields.relation === 'CHILD' ? (
              <p className="font-bold text-sm mt-3 bg-red-50 text-red-600 px-3 py-2 rounded-md w-full text-center uppercase mb-3">
                LATE ENROLLMENT
              </p>
            ) : (
              ''
            )}

            {isMileStone &&
            lateMarriage &&
            watchFields.relation === 'SPOUSE' ? (
              <p className="font-bold text-sm mt-3 bg-red-50 text-red-600 px-3 py-2 rounded-md w-full text-center uppercase mb-3">
                LATE ENROLLMENT
              </p>
            ) : (
              ''
            )}
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

            {isMileStone >= 30 && watchFields.relation === 'SPOUSE' && (
              <div className="mb-3">
                <Label htmlFor="marriage_date">Marriage Date</Label>
                <Input
                  onKeyDown={e => {
                    e.preventDefault()
                  }}
                  id="marriage_date"
                  type="date"
                  className="block mt-1 w-full"
                  register={register('marriage_date', {})}
                  errors={errors?.marriage_date}
                />
              </div>
            )}

            <div className="mb-3">
              <Label htmlFor="effectivity_date">Effectivity Date</Label>
              <Input
                id="effectivity_date"
                type="date"
                className="block mt-1 w-full"
                register={register('effectivity_date', {
                  // required: 'Effectivity Date is required',
                  // min: isMileStone &&
                  //   watchFields.relation === 'SPOUSE' && {
                  //     message: 'Date of marriage should not more than 30 days.',
                  //     value: moment().subtract(30, 'd').format('Y-MM-DD'),
                  //   },
                  // max: {
                  //   message: 'Future date not allowed',
                  //   value: moment().format('Y-MM-DD'),
                  // },
                })}
                errors={errors?.effectivity_date}
                // min={
                //   isMileStone &&
                //   watchFields.relation === 'SPOUSE' &&
                //   moment().subtract(30, 'd').format('Y-MM-DD')
                // }
                // max={
                //   isMileStone &&
                //   watchFields.relation === 'SPOUSE' &&
                //   moment().format('Y-MM-DD')
                // }
                disabled
              />
            </div>

            {isMileStone >= 30 &&
              (birthDateCountDays > 30 || lateMarriage) &&
              watchFields.relation !== '' && (
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
              <Label htmlFor="attachment">
                Document Requirement(s){' '}
                <sup className="font-thin text-green-600">
                  please select relation and civil status
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
                register={register('attachment', {
                  required: isMileStone > 30 && 'Document is required.',
                })}
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
