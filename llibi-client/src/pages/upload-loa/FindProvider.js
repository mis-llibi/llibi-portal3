import React from 'react'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import { useClient } from '@/hooks/self-service/client'

import { SyncLoader } from 'react-spinners'

import { useRouter } from 'next/router'

import Swal from 'sweetalert2'



function FindProvider({setShow, setSelectHospital}) {

  const [timer, setTimer] = useState(null)

  const [hospitalLoading, setHospitalLoading] = useState(false)
  const [hospital, setHospital] = useState()

  const { handleSubmit, register, watch, formState: { errors }, resetField } = useForm()

  const { searcHospital} = useClient()

  const onSearchHospital = search =>{

    setHospitalLoading(true)

    if(timer){
        clearTimeout(timer)
        setTimer(null)
    }

    setTimer(
        setTimeout(() => {
            // resetField('hospital')
            if (search){
                searcHospital({ search, setHospital, setHosploading: setHospitalLoading })
            }
        }, 1000)
    )


  }

  const checkIfTMCProvider = (provider) => {
    if(provider?.hosp_code !== "TMC"){
        Swal.fire({
            title: 'Error',
            text: "TMC provider only",
            icon: "warning"
        })
        resetField('hospital')
        return
    }

  }

  const onChooseProvider = data => {
    // console.log(data.hospital)
    // console.log(hospital[data.hospital])


    Swal.fire({
        title: 'Submission',
        text: "Are you sure on this provider?",
        icon: "warning",
        confirmButtonText: "Yes, accept it",
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonText: 'No, cancel',
    }).then(result => {
        // console.log(result)

        if(result.isConfirmed){
            setSelectHospital(hospital[data.hospital])
            setShow(false)
        }

    })


  }

  return (
    <>
    <form className='px-2' onSubmit={handleSubmit(onChooseProvider)}>
      <span className="text-red-500 text-sm font-semibold">
        {errors?.hospital?.message}
      </span>
      <div>
          <div>
            <Label htmlFor="searchHospital" className="mb-2">
              Search for Hospital or Clinic{' '}
              <span className="text-xs text-orange-900">
                (You must choose The Medical City Branches)
              </span>
            </Label>
            <Input
              id="searchHospital"
              onChange={e => onSearchHospital(e.target.value)}
              placeholder="Enter Hospital or Clinic name"
            />
          </div>
          <div
            className={`h-96 w-full bg-gray-50 mt-2 rounded-md overflow-y-auto ${
              (!hospital || hospitalLoading) && 'flex items-center justify-center'
            }`}>
            {hospitalLoading ? (
              <SyncLoader color="#CDCDCD" margin={10} size={15} />
            ) : hospital ? (
              <>
                <div className="p-2">
                  {hospital?.map((row, index) => {
                    return (
                    <div
                      key={index}
                      className="w-full border-b border-dashed min-h-8 py-2 px-1 flex items-center gap-2">
                      <input
                        // disabled={docloading}
                        type="radio"
                        {...register('hospital', {
                          required:
                            'Warning : You must choose a Hospital or Clinic to continue',
                        })}
                        // Remove this if other provider is using E-LOA
                        onChange={() => checkIfTMCProvider(row)}
                        id={`hospital-${row.id}`}
                        value={index}
                        className="w-3 h-3"
                      />{' '}
                      <Label htmlFor={`hospital-${row.id}`}>{row.name} {row.accept_eloa == 1 ? "⭐" : ""} </Label>
                      {/* <h1 className='text-right w-1/2'>{row.accept_eloa == 1 ? "⭐" : ""}</h1> */}
                    </div>
                  )
                  })}
                </div>
              </>
            ) : (
              <span className="text-orange-600 font-semibold text-sm">
                No hospital found, please search the name of the hospital
              </span>
            )}
          </div>
        <div className="absolute bottom-2 right-4">
            <Button

            className={`float-right bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 ${
                !hospital && 'hidden'
            }`}>
            <ButtonText text="Submit Selected Provider" />
            </Button>
            <div className="clear-both"></div>
        </div>
      </div>
    </form>



    </>
  )
}

export default FindProvider
