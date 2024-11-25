import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import axios from '@/lib/axios'

import { BiSend } from 'react-icons/bi'
import Swal from 'sweetalert2'

export default function PendingDocuments({ row }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'required_document',
  })

  const getDocuments = async () => {
    try {
      const response = await axios.get(
        `/api/members-enrollment/pending-documents/${row.id}`,
      )

      // setDocuments(response.data)

      // Clear existing fields
      setValue('required_document', [])

      // Set the fetched data
      response.data?.forEach(item => append({ ...item, document_id: item.id }))
    } catch (error) {
      throw error
    }
  }

  const submitForm = async data => {
    const formData = new FormData()

    formData.append('member_id', data.required_document[0].link_id)
    for (let i in data.required_document) {
      formData.append('file[]', data.required_document[i].file[0])
      formData.append('document_id[]', data.required_document[i].document_id)
    }

    try {
      const response = await axios.post(
        '/api/members-enrollment/upload-pending-documents',
        formData,
      )
      Swal.fire('Success', 'Submit documents success.', 'success')
    } catch (error) {
      if (error.response.status === 422) {
        const responseError = error.response.data.errors
        Object.keys(responseError).map((item, index) => {
          const errorMessage = responseError[item][0]
          const errorIndex = item.split('.')
          setError(`required_document.${errorIndex[1]}.file`, {
            type: 'manual',
            message: errorMessage,
          })
        })

        return
      }

      Swal.fire('Error', 'Something went wrong', 'error')
      throw new Error(
        `Something went wrong. ${error.response.status} ${error.response.statusText}`,
      )
    }
  }

  useEffect(() => {
    getDocuments()
  }, [])

  return (
    <div className="w-[60em] px-3 max-h-[75vh] overflow-y-auto">
      {fields?.map((field, index) => (
        <div key={index} className="grid grid-cols-2 mb-3">
          <div>
            <h4 className="text-lg">{field.file_required}</h4>
          </div>
          <div>
            <input
              className="file:text-sm file:border-0 file:bg-gray-100 file:py-1 hover:bg-gray-100 px-2 py-1 rounded-md border"
              type="file"
              {...register(`required_document.${index}.file`, {
                required: 'Document is required',
              })}
            />
            <p className="text-red-600 text-xs">
              {errors?.required_document &&
                errors.required_document[index]?.file?.message}
            </p>
          </div>
        </div>
      ))}

      <button
        disabled={isSubmitting}
        onClick={handleSubmit(data => submitForm(data))}
        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 text-xs rounded-md flex gap-2 items-center">
        {isSubmitting ? (
          'Loading...'
        ) : (
          <>
            <BiSend size={14} />
            Submit
          </>
        )}
      </button>
    </div>
  )
}
