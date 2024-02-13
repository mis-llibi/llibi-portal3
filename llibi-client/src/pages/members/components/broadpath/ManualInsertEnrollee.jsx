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

const ManualInsertEnrollee = ({ create, loading, setLoading, setShow }) => {
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

  const submitForm = data => {}

  return (
    <div className="p-4">
      <Modal show={show} body={body} toggle={toggle} />
      <form onSubmit={handleSubmit(submitForm)}>
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
