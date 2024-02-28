import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Self-enrollment/InputDep'
import Select from '@/components/Self-enrollment/SelectDependent'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'

import PrincipalList from './PrincipalList'
import { insertNewEnrollee } from '@/hooks/members/ManageHrMember'

const INITIAL_ENROLLMENT_RELATION = {
  principal: 'PRINCIPAL',
  dependent: 'DEPENDENT',
}

const ManualInsertEnrollee = ({
  create,
  loading,
  setLoading,
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
    const isSuccessSubmit = await insertNewEnrollee({
      setLoading,
      setShow,
      data: FORMDATA,
      reset,
    })
    if (isSuccessSubmit) {
      setEnrollmentRelation(null)
      mutate()
    }
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
      modalContainer: 'h-full',
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
      oid: '',
    })
  }, [enrollmentRelation])

  useEffect(() => {
    reset({
      oid: selectedPrincipal?.member_id ?? '',
    })
  }, [selectedPrincipal])

  return (
    <div className="p-4">
      <Modal show={show} body={body} toggle={toggle} />
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <span className="text-gray-700 text-sm">
            Please select what relation to enroll
          </span>
          <div className="flex justify-center gap-3 border rounded-md p-3 mb-3">
            <Label
              htmlFor="enrollment_relation_principal"
              className={`${
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal &&
                'bg-blue-700 text-white'
              } border p-3 w-40 flex justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
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
              PRINCIPAL
            </Label>
            <Label
              htmlFor="enrollment_relation_dependent"
              className={`${
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent &&
                'bg-blue-700 text-white'
              } border p-3 w-40 flex justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
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
              DEPENDENT
            </Label>
          </div>
          <Label htmlFor="oid">OID/Member ID</Label>
          <Input
            id="oid"
            className="block mt-1 w-full"
            register={register('oid', {
              required: 'OID/Member ID is required',
            })}
            disabled={
              enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent
            }
            errors={errors?.oid}
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
            })}
            errors={errors?.birthdate}
          />
        </div>
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
              options={[
                { label: 'Select Relation', value: '' },
                { label: 'Parent', value: 'PARENT' },
                { label: 'Spouse', value: 'SPOUSE' },
                { label: 'Child', value: 'CHILD' },
                {
                  label: 'Domestic Partner / Same Gender Partner',
                  value: 'DOMESTIC PARTNER',
                },
              ]}
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
            options={[
              {
                value: '',
                label: 'Select Civil Status',
              },
              {
                value: 'SINGLE',
                label: 'Single',
              },
              {
                value: 'SINGLE WITH DOMESTIC PARTNER',
                label: 'Single With Domestic Partner / Same Gender Partner',
              },
              {
                value: 'SINGLE PARENT',
                label: 'Single Parent / Solo Parent',
              },
              {
                value: 'MARRIED',
                label: 'Married',
              },
            ]}
            register={register('civilstatus', {
              required: 'Civil Status is required',
            })}
            errors={errors?.civilstatus}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="attachment">Document Requirement(s):</Label>
          <InputFile
            label={``}
            id="attachment"
            loading={loading}
            setLoading={setLoading}
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

        <Button
          className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2"
          loading={loading}>
          Submit Enrollee
        </Button>
      </form>
    </div>
  )
}

export default ManualInsertEnrollee
