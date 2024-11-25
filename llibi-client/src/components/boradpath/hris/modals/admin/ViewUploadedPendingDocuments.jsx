import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useFieldArray, useForm } from 'react-hook-form'
import axios from '@/lib/axios'

import { BiSend, BiFile } from 'react-icons/bi'
import Swal from 'sweetalert2'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export default function ViewUploadedPendingDocuments({
  showModal,
  setShowModal,
  row,
  mutate,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'required_document',
  })

  const [selectedFile, setSelectedFile] = useState(null)

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
      Swal.fire('Error', 'Something went wrong', 'error')
      throw new Error(
        `Something went wrong. ${error.response.status} ${error.response.statusText}`,
      )
    }
  }

  const handleClose = () => {
    setShowModal(false)
  }

  useEffect(() => {
    getDocuments()
  }, [])

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={showModal}>
        <DialogTitle>
          <span className="font-[poppins] font-bold uppercase">
            View Uploaded Pending Documents
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="font-[poppins] grid grid-cols-2 md:grid-cols-3 gap-3">
            {fields?.map((field, index) => (
              <div key={index} className="bg-blue-600/80 rounded-md p-6">
                <div className="text-center mb-3">
                  <h4 className="text-xs text-white">{field.file_required}</h4>
                </div>
                <div className="flex justify-center items-center">
                  {field.file_link ? (
                    <div className="overflow-hidden rounded-md">
                      <a href={field.file_link} target="_blank">
                        {/* <img
                          className="hover:scale-105 transition-transform duration-1000 ease-in-out rounded-md grayscale hover:grayscale-0 cursor-pointer"
                          src={field.file_link}
                          alt={field.file_name}
                          width={150}
                          height={150}
                        /> */}

                        <BiFile
                          size={48}
                          className="hover:scale-110 transition-transform duration-500 ease-in-out rounded-md cursor-pointer text-[#F8F8FF]"
                        />
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm">N/A</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions className="font-[poppins]">
          <button
            type="button"
            className="border px-3 py-2 text-xs uppercase font-semibold rounded-md"
            onClick={handleClose}>
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
