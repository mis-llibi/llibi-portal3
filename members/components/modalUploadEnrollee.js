import React, { useState } from 'react'

import Label from '@/components/Label'
import InputFile from '@/components/InputFile'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

const modalUploadEnrollee = ({ upload, setLoading, setShow }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [lateEnrolledUploaded, setLateEnrolledUploaded] = useState()

  const onUpload = data => {
    setLoading(true)
    upload({ ...data, setLoading, setShow, reset, setLateEnrolledUploaded })
  }

  return (
    <>
      {lateEnrolledUploaded && (
        <div className="w-full p-4">
          <Label className={'font-bold mb-1'}>Late Enrolled</Label>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Birth Date</th>
                <th>Effective Date</th>
                <th>Date Hired</th>
              </tr>
            </thead>
            <tbody>
              {lateEnrolledUploaded.map(row => (
                <tr key={row.id} className="odd:bg-gray-100">
                  <td className="p-3">
                    {row.last_name}, {row.first_name}
                  </td>
                  <td className="p-3">{row.birth_date}</td>
                  <td className="p-3">{row.effective_date}</td>
                  <td className="p-3">{row.date_hired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <form onSubmit={handleSubmit(onUpload)} className="w-full p-4">
        <div>
          <Label className={'font-bold mb-1'} htmlFor="file">
            Members Masterlist File (.xlsx, .xls or .csv)
          </Label>
          <InputFile
            id="file"
            register={register('file', {
              required: 'Uploading masterlist requires excel file to import',
            })}
            type="file"
            accept=".xlsx,.csv,.xls"
            className="block mt-1 w-full"
            errors={errors?.file}
          />
        </div>
        <div>
          <Button className="bg-blue-600 hover:bg-blue-700 float-right mt-2 mb-2">
            Upload To Masterlist
          </Button>
        </div>
      </form>
    </>
  )
}

export default modalUploadEnrollee
