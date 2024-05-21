import React from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Select from '@/components/Select'
import InputFile from '@/components/InputFile'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdmin } from '@/hooks/self-service/admin'

import Swal from 'sweetalert2'

import { basePath } from '@/../next.config'

import { ManageUploadedFiles } from '@/hooks/self-service/ManageUploadedFiles'

//import { RiDeleteBin2Line } from 'react-icons/ri'

const Form = ({ setRequest, row }) => {
  const { files } = ManageUploadedFiles({ id: row?.id })

  const onImageError = ev => {
    ev.target.src = `${basePath}/pdf.png`
  }

  const {
    handleSubmit,
    register,
    watch,
    resetField,
    setValue,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [client, setClient] = useState(row)

  const { updateRequest, viewBy } = useAdmin({ name: '', status: '' })

  const submitForm = data => {
    const dataMerge = {
      ...data,
      hospital_email1: row?.email1,
      hospital_email2: row?.email2,
      email_format_type: 'consultation',
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateRequest({ setRequest, setClient, setLoading, ...dataMerge })
      }
    })
  }

  useEffect(() => {
    resetField('attachLOA')
    resetField('loaNumber')
    resetField('approvalCode')
  }, [watch('status')])

  const hospital = client?.providerName?.split('++')
  const doctor = client?.doctorName?.split('++')

  const laboratoryRemarks = [
    { label: 'Choose Disapprove Remarks', value: '' },
    {
      label: 'Coverage Exclusion - General check up / No diagnosis',
      value: 'Coverage Exclusion - General check up / No diagnosis',
    },
    {
      label: 'Coverage Exclusion - Dental related',
      value: 'Coverage Exclusion - Dental related',
    },
    {
      label: 'Coverage Exclusion - Beautification purposes',
      value: 'Coverage Exclusion - Beautification purposes',
    },
    {
      label: 'Coverage Exlcusion - Error of Refraction',
      value: 'Coverage Exlcusion - Error of Refraction',
    },
    {
      label: 'Coverage Exclusion - HIV/STD related',
      value: 'Coverage Exclusion - HIV/STD related',
    },
    {
      label: 'Coverage Exclusion - Mental Ilness',
      value: 'Coverage Exclusion - Mental Ilness',
    },
    {
      label: 'Coverage Exclusion - Congenital Condition',
      value: 'Coverage Exclusion - Congenital Condition',
    },
    {
      label: 'Coverage Exclusion - Self-inflicted Injury',
      value: 'Coverage Exclusion - Self-inflicted Injury',
    },
    {
      label: 'Coverage Exclusion - Immunization',
      value: 'Coverage Exclusion - Immunization',
    },
    {
      label: 'Coverage Exclusion - Circumcision',
      value: 'Coverage Exclusion - Circumcision',
    },
    {
      label: 'Coverage Exclusion - Well baby care',
      value: 'Coverage Exclusion - Well baby care',
    },
    {
      label: 'Coverage Exclusion - Non Surgical Tuberculosis',
      value: 'Coverage Exclusion - Non Surgical Tuberculosis',
    },
    {
      label: 'Coverage Exclusion - Screening Purposes',
      value: 'Coverage Exclusion - Screening Purposes',
    },
    {
      label: 'Coverage Exclusion - School / Travel / Work Requirement',
      value: 'Coverage Exclusion - School / Travel / Work Requirement',
    },
    {
      label: 'Coverage Limit Exhausted',
      value: 'Coverage Limit Exhausted',
    },
    {
      label: 'Restricted / No access to medical facility',
      value: 'Restricted / No access to medical facility',
    },
    {
      label: `Incomplete Information: No Doctor's Request`,
      value: `Incomplete Information: No Doctor's Request`,
    },
    {
      label: `Incomplete Information: No diagnosis / impression on Doctor's Request`,
      value: `Incomplete Information: No diagnosis / impression on Doctor's Request`,
    },
    {
      label: 'Laboratory Test / Procedure not related to diagnosis',
      value: 'Laboratory Test / Procedure not related to diagnosis',
    },
    { label: 'Others', value: 'Others' },
  ]

  const consultationRemarks = [
    { label: 'Choose Disapprove Remarks', value: '' },
    {
      label: 'Coverage Exclusion - General check up / No diagnosis',
      value: 'Coverage Exclusion - General check up / No diagnosis',
    },
    {
      label: 'Coverage Exclusion - Dental related',
      value: 'Coverage Exclusion - Dental related',
    },
    {
      label: 'Coverage Exclusion - Beautification purposes',
      value: 'Coverage Exclusion - Beautification purposes',
    },
    {
      label: 'Coverage Exlcusion - Error of Refraction',
      value: 'Coverage Exlcusion - Error of Refraction',
    },
    {
      label: 'Coverage Exclusion - HIV/STD related',
      value: 'Coverage Exclusion - HIV/STD related',
    },
    {
      label: 'Coverage Exclusion - Mental Ilness',
      value: 'Coverage Exclusion - Mental Ilness',
    },
    {
      label: 'Coverage Exclusion - Congenital Condition',
      value: 'Coverage Exclusion - Congenital Condition',
    },
    {
      label: 'Coverage Exclusion - Self-inflicted Injury',
      value: 'Coverage Exclusion - Self-inflicted Injury',
    },
    {
      label: 'Coverage Exclusion - Immunization',
      value: 'Coverage Exclusion - Immunization',
    },
    {
      label: 'Coverage Exclusion - Circumcision',
      value: 'Coverage Exclusion - Circumcision',
    },
    {
      label: 'Coverage Exclusion - Well baby care',
      value: 'Coverage Exclusion - Well baby care',
    },
    {
      label: 'Coverage Exclusion - Non Surgical Tuberculosis',
      value: 'Coverage Exclusion - Non Surgical Tuberculosis',
    },
    {
      label: 'Coverage Limit Exhausted',
      value: 'Coverage Limit Exhausted',
    },
    {
      label: 'Restricted / No access to medical facility',
      value: 'Restricted / No access to medical facility',
    },
    { label: 'Others', value: 'Others' },
  ]

  useEffect(() => {
    setValue('disapproveRemarks', '')
    if (watch('optionRemarks') !== 'Others')
      setValue('disapproveRemarks', watch('optionRemarks'))
  }, [watch('optionRemarks')])

  useEffect(() => {
    return () => {
      const unView = async () => {
        const reponse = await viewBy(row, 'unview')
        if (!reponse.status) return
      }

      unView()
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="flex">
        <div className="basis-3/5">
          <div className="flex flex-col h-screen">
            {client?.loaAttachment && client?.status !== 4 ? (
              <object
                className="w-full h-full"
                data={`${basePath}/${client?.loaAttachment}`}
                type="application/pdf"></object>
            ) : (
              <div className="flex flex-grow bg-black/30 justify-center place-items-center py-10">
                No LOA attachment found
              </div>
            )}
          </div>
        </div>

        {/* Patients personal & Membership information */}
        <div className="basis-2/5 m-4 p-2 rounded-md">
          {/* Memberhip Details FORM */}
          <div className={`mb-5 ${client?.status !== 2 && 'hidden'}`}>
            <input type="hidden" {...register('id')} value={client?.id} />
            <h2 className="text-xl mb-2 w-full text-center">MANAGE LOA</h2>
            <div className="mb-3 border-b-2 border-dotted pb-1">
              <Label className="text-bold text-md mb-2">SET STATUS:</Label>

              <div className="flex mb-5">
                <div className="basis-1/2 flex gap-2 items-center">
                  <input
                    type="radio"
                    {...register('status', {
                      required: true,
                    })}
                    id="approve"
                    value="3"
                    className="w-4 h-4"
                  />{' '}
                  <Label htmlFor="approve" className="text-md text-green-800">
                    APPROVE REQUEST FOR LOA
                  </Label>
                </div>
                <div className="basis-1/2 flex gap-2 items-center">
                  <input
                    type="radio"
                    {...register('status', {
                      required: true,
                    })}
                    id="disapprove"
                    value="4"
                    className="w-4 h-4"
                  />{' '}
                  <Label htmlFor="disapprove" className="text-md text-red-500">
                    DISAPPROVE REQUEST FOR LOA
                  </Label>
                </div>
              </div>

              {watch('status') === '3' && (
                <>
                  <Label className="text-bold text-md mb-2">
                    EMAIL FORMAT:
                  </Label>
                  <div className="grid grid-cols-2">
                    {files?.client_request?.client_request?.loa_type ===
                      'consultation' && (
                      <>
                        <div className="flex gap-2 items-center">
                          <input
                            type="radio"
                            {...register('email_format_type', {
                              required: true,
                            })}
                            id="consultation"
                            value="consultation"
                            className="w-4 h-4"
                          />
                          <Label htmlFor="consultation" className="text-md">
                            CONSULTATION
                          </Label>
                        </div>

                        <div className="basis-1/2 flex gap-2 items-center">
                          <input
                            type="radio"
                            {...register('email_format_type', {
                              required: true,
                            })}
                            id="2n1-standalone"
                            value="2n1-standalone"
                            className="w-4 h-4"
                          />
                          <Label htmlFor="2n1-standalone" className="text-md">
                            2N1 AND STANDALONE
                          </Label>
                        </div>
                      </>
                    )}

                    {files?.client_request?.client_request?.loa_type ===
                      'laboratory' && (
                      <>
                        <div className="basis-1/2 flex gap-2 items-center">
                          <input
                            type="radio"
                            {...register('email_format_type', {
                              required: true,
                            })}
                            id="laboratory"
                            value="laboratory"
                            className="w-4 h-4"
                          />
                          <Label htmlFor="laboratory" className="text-md">
                            LABORATORY
                          </Label>
                        </div>
                        <div className="basis-1/2 flex gap-2 items-center">
                          <input
                            type="radio"
                            {...register('email_format_type', {
                              required: true,
                            })}
                            id="pre-approved-laboratory"
                            value="pre-approved-laboratory"
                            className="w-4 h-4"
                          />
                          <Label
                            htmlFor="pre-approved-laboratory"
                            className="text-md">
                            PRE-APPROVED LABORATORY
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-red-600 w-full text-center">
                    {errors?.email_format_type &&
                      '*Email format that will be sent to the client.'}
                  </span>
                </>
              )}
            </div>

            {/* APPROVE BOX */}
            <div
              className={`relative p-2 ${watch('status') !== '3' && 'hidden'}`}>
              <div className="">
                <Label htmlFor="attachLOA" className="text-bold text-md">
                  ATTACH LOA:
                </Label>
                <InputFile
                  id="attachLOA"
                  register={{
                    ...register('attachLOA', {
                      required:
                        watch('status') === '3' && 'LOA Attachment is required',
                    }),
                  }}
                  disabled={watch('status') === '3' ? false : true}
                  type="file"
                  accept=".pdf"
                  className="w-full"
                  placeholder="LOA Number"
                  errors={errors?.attachLOA}
                />
              </div>
              {/* <div className="mb-3 border-b-2 border-dotted pb-1">
                                <Label
                                    htmlFor="loaNumber"
                                    className="text-bold text-md">
                                    LOA NUMBER:
                                </Label>
                                <Input
                                    id="loaNumber"
                                    register={{
                                        ...register('loaNumber', {
                                            required:
                                                watch('status') === '3' &&
                                                'LOA # is required',
                                        }),
                                    }}
                                    disabled={
                                        watch('status') === '3' ? false : true
                                    }
                                    placeholder="LOA Number"
                                    errors={errors?.loaNumber}
                                />
                            </div> */}
              {/*
                                <div className="mb-3 border-b-2 border-dotted pb-1">
                                    <Label className="text-bold text-md">
                                        APPROVAL CODE:
                                    </Label>
                                    <Input
                                        id="approvalCode"
                                        register={{
                                            ...register('approvalCode', {
                                                required:
                                                    watch('status') === '3' &&
                                                    'Approval is required',
                                            }),
                                        }}
                                        disabled={
                                            watch('status') === '3' ? false : true
                                        }
                                        placeholder="Approval Code"
                                        errors={errors?.approvalCode}
                                    />
                                </div> 
                            */}

              {/* Backdrop form */}
              <div
                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/30 backdrop-blur-sm rounded-md ${
                  watch('status') === '3' && 'hidden'
                }`}>
                <span className="text-white font-semibold"></span>
              </div>
            </div>

            {/* DISAPPROVE BOX */}
            <div
              className={`relative p-2 ${watch('status') !== '4' && 'hidden'}`}>
              <div className="">
                <Select
                  defaultValue=""
                  register={{
                    ...register('optionRemarks', {
                      required:
                        watch('status') === '4' &&
                        'Remarks is required when you choose disapprove',
                    }),
                  }}
                  options={
                    client?.loaType === 'consultation'
                      ? consultationRemarks
                      : laboratoryRemarks
                  }
                  errors={errors?.optionRemarks}
                />
                <div
                  className={
                    watch('optionRemarks') !== 'Others' ? `hidden` : `mt-4`
                  }>
                  <Label
                    htmlFor="disapproveRemarks"
                    className="text-bold text-md">
                    REMARKS:
                  </Label>
                  <Input
                    id="disapproveRemarks"
                    register={{
                      ...register('disapproveRemarks', {
                        required:
                          watch('status') === '4' &&
                          'Remarks is required when you choose disapprove',
                      }),
                    }}
                    disabled={watch('status') === '4' ? false : true}
                    placeholder="Disapprove Remarks"
                    errors={errors?.disapproveRemarks}
                  />
                </div>
              </div>
            </div>

            <div className="w-full text-center">
              <Button
                loading={loading}
                className="bg-green-600 hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900">
                <ButtonText text="Update Request" loading={loading} />
              </Button>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-5">
            <h2 className="text-xl mb-2 w-full text-center">
              {client?.isDependent ? 'DEPENDENT' : 'EMPLOYEE'} DETAILS
            </h2>
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                DATE/TIME CREATED:{' '}
                <span className={`text-blue-500`}>{client?.createdAt}</span>
              </Label>
            </div>
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                FULL NAME:{' '}
                <span
                  className={`text-blue-500 ${
                    client?.isDependent && 'hidden'
                  }`}>
                  {client?.lastName}, {client?.firstName}
                </span>
                <span
                  className={`text-blue-500 ${
                    !client?.isDependent && 'hidden'
                  }`}>
                  {client?.depLastName}, {client?.depFirstName}
                </span>
              </Label>
            </div>
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                DATE OF BIRTH:{' '}
                <span
                  className={`text-blue-500 ${
                    client?.isDependent && 'hidden'
                  }`}>
                  {client?.dob}
                </span>
                <span
                  className={`text-blue-500 ${
                    !client?.isDependent && 'hidden'
                  }`}>
                  {client?.depDob}
                </span>
              </Label>
            </div>
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                MEMBER ID:{' '}
                <span
                  className={`text-blue-500 ${
                    client?.isDependent && 'hidden'
                  }`}>
                  {client?.memberID}
                </span>
                <span
                  className={`text-blue-500 ${
                    !client?.isDependent && 'hidden'
                  }`}>
                  {client?.depMemberID}
                </span>
              </Label>
            </div>

            <div
              className={`mb-3 border-b-2 border-dotted ${
                !client?.isDependent && 'hidden'
              }`}>
              <Label className="text-bold text-md">
                CONTACT PERSON:{' '}
                <span className={`text-blue-500`}>
                  {client?.lastName}, {client?.firstName}
                </span>
              </Label>
            </div>

            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                EMAIL:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {client?.email}
                </span>
              </Label>
            </div>

            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                ALT EMAIL:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {client?.altEmail || 'N/A'}
                </span>
              </Label>
            </div>

            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                CONTACT #:{' '}
                <span className={`text-blue-500`}>
                  {client?.contact || 'NONE'}
                </span>
              </Label>
            </div>
          </div>

          {/* CONSULTATION: Assessment Form */}
          <div
            className={`mb-5 ${
              client?.loaType !== 'consultation' && 'hidden'
            }`}>
            <h2 className="text-xl mb-2 w-full text-center">
              HEALTH ASSESSMENT (CONSULTATION)
            </h2>

            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                COMPLAINT(S):{' '}
                <span className={`text-red-900`}>{client?.complaint}</span>
              </Label>
            </div>
          </div>

          {/* LABORATORY: Assessment Form */}
          <div
            className={`mb-5 ${client?.loaType !== 'laboratory' && 'hidden'}`}>
            <h2 className="text-xl mb-2 w-full text-center">
              HEALTH ASSESSMENT (LABORATORY)
            </h2>

            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                LABORATORY ATTACHMENT:{' '}
                {/* <span>
                                    <a
                                        href={`${basePath}/${client?.labAttachment}`}
                                        target="_blank"
                                        className="px-3 bg-red-900 text-white hover:bg-red-800 rounded-md">
                                        View Document Here...
                                    </a>
                                </span> */}
              </Label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
                {files?.attachment?.length > 0 ? (
                  files?.attachment?.map((item, i) => {
                    return (
                      <div
                        key={i}
                        className="bg-blue-50 p-2 rounded-md shadow-sm">
                        <a
                          href={`${basePath}/storage/${item?.file_link}`}
                          target="_blank"
                          key={i}
                          className="bg-gray-200 w-full h-32 flex place-items-center cursor-pointer hover:shadow-md transition-all duration-200 ease-in truncate touch-pan-right grayscale hover:grayscale-0 scale-95 hover:scale-100 hover:origin-top">
                          <img
                            onError={onImageError}
                            src={`${basePath}/storage/${item?.file_link}`}
                          />
                        </a>
                        <div className="text-xs mt-2 font-bold text-center truncate">
                          <p>{item?.file_name}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center cols-span-2 md:col-span-4">
                    No uploaded files
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PROVIDER */}
          {/* className={`${
                            client?.loaType === 'laboratory' ? 'hidden' : ''
                        }`} */}
          <div>
            {/* HOSPITAL */}
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                HOSPITAL/CLINIC:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {hospital && hospital[0]}
                </span>
                <br />
                ADDRESS:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {hospital && hospital[1]}
                </span>
                <br />
                CITY:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {hospital && hospital[2]}
                </span>
                <br />
                STATE:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {hospital && hospital[3]}
                </span>
                <br />
              </Label>
            </div>

            {/* DOCTOR */}
            <div className={`mb-3 border-b-2 border-dotted`}>
              <Label className="text-bold text-md">
                DOCTOR NAME:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {doctor && doctor[0]}
                </span>
                <br />
                SPECIALIZATION:{' '}
                <span className={`text-blue-500 uppercase`}>
                  {doctor && doctor[1]}
                </span>
              </Label>
            </div>
          </div>

          {/* DIAGNOSIS */}
          <div>
            <Label className="text-bold text-md hidden">
              DIAGNOSIS:{' '}
              <span className={`text-red-900`}>
                {client?.diagnosis || 'N/A'}
              </span>
            </Label>
          </div>

          {/* Memberhip Details DETAILS */}
          <div className={`mb-5 ${client?.status === 2 && 'hidden'}`}>
            <h2 className="text-xl mb-2 w-full text-center">
              STATUS OF REQUEST
            </h2>
            <div className="mb-3 border-b-2 border-dotted hidden">
              <Label className="text-bold text-md">
                LOA NUMBER:{' '}
                <span className={`text-blue-500`}>
                  {client?.loaNumber || 'N/A'}
                </span>
              </Label>
            </div>
            <div className="mb-3 border-b-2 border-dotted hidden">
              <Label className="text-bold text-md">
                APPROVAL CODE:{' '}
                <span className={`text-blue-500`}>
                  {client?.approvalCode || 'N/A'}
                </span>
              </Label>
            </div>
            <div className="mb-3 border-b-2 border-dotted">
              <Label className="text-bold text-md">
                STATUS:{' '}
                <span
                  className={`${
                    (client?.status === 2 && 'text-orange-500') ||
                    (client?.status === 3 && 'text-green-500') ||
                    (client?.status === 4 && 'text-red-500') ||
                    (client?.status === 5 && 'text-purple-500')
                  }`}>
                  {client?.status === 2 && 'PENDING'}
                  {client?.status === 3 && 'APPROVED'}
                  {client?.status === 4 && 'DISAPPROVED'}
                  {client?.status === 5 && 'DOWNLOADED'}
                </span>
              </Label>
            </div>
            <div
              className={`mb-3 border-b-2 border-dotted ${
                client?.status !== 4 && 'hidden'
              }`}>
              <Label className="text-bold text-md">
                REMARKS: <span>{client?.remarks}</span>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Form
