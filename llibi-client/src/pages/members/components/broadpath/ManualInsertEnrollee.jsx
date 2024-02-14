import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Self-enrollment/InputDep'
import Select from '@/components/Self-enrollment/SelectDependent'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'
import axios from '@/lib/axios'
import moment from 'moment'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'

import { useManageEnrollee } from '@/hooks/members/ManageEnrollee'

const ManualInsertEnrollee = ({
  create,
  loading,
  setLoading,
  setShow,
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
  const { insertNewEnrollee } = useManageEnrollee(1)

  const submitForm = async data => {
    const FORMDATA = new FormData()

    for (let key in data) {
      if (key === 'attachment') {
        for (let index = 0; index < data[key].length; index++) {
          FORMDATA.append('attachment[]', data[key][index])
        }
      } else {
        FORMDATA.append(key, data[key])
      }
    }

    await insertNewEnrollee({ setLoading, setShow, data: FORMDATA, reset })
  }

  return (
    <div className="p-4">
      <Modal show={show} body={body} toggle={toggle} />
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <Label htmlFor="oid">OID/Member ID</Label>
          <Input
            id="oid"
            className="block mt-1 w-full"
            register={register('oid', {
              required: 'OID/Member ID is required',
            })}
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
          <Label htmlFor="middlename">Middle Name</Label>
          <Input
            id="middlename"
            className="block mt-1 w-full"
            register={register('middlename', {
              required: 'Middle Name is required',
            })}
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
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            register={register('gender', {
              required: 'Gender is required',
            })}
            errors={errors?.gender}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="relation">Relation</Label>
          <Select
            id="relation"
            className="block mt-1 w-full"
            options={[
              { label: 'Select Relation', value: '' },
              { label: 'Principal', value: 'PRINCIPAL' },
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
