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

const ProviderLookupForm = ({
    setShow,
    setSelectedHospital,
    setSelectedDoctor,
}) => {
    const router = useRouter()

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors },
        resetField,
    } = useForm()

    const { searcHospital, searchDoctor } = useClient()

    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(null)

    const [hosploading, setHosploading] = useState(false)
    const [hospital, setHospital] = useState()
    const onSearchHospital = search => {
        setHosploading(true)
        if (timer) {
            clearTimeout(timer)
            setTimer(null)
        }
        setTimer(
            setTimeout(() => {
                resetField('hospital')
                if (search)
                    searcHospital({ search, setHospital, setHosploading })
            }, 1000),
        )
    }

    const [docloading, setDocloading] = useState(false)
    const [doctor, setDoctor] = useState()
    const onSearchDoctor = search => {
        setDocloading(true)
        if (timer) {
            clearTimeout(timer)
            setTimer(null)
        }
        setTimer(
            setTimeout(() => {
                if (search)
                    searchDoctor({
                        id: hospital[watch('hospital')]?.id,
                        search,
                        setDoctor,
                        setDocloading,
                    })
            }, 1000),
        )
    }

    useEffect(() => {
        resetField('docSearch')
        resetField('doctor')
        if (watch('hospital') && router?.query?.loatype == 'consultation') {
            setDocloading(true)
            searchDoctor({
                id: hospital[watch('hospital')]?.id,
                search: '',
                setDoctor,
                setDocloading,
            })
        } else {
            setDoctor()
        }
    }, [watch('hospital')])

    const onChooseProvider = data => {
        if (router?.query?.loatype == 'consultation') {
            Swal.fire({
                title:
                    '<strong>Doctor’s clinic schedule may change without further notice.</strong>',
                icon: 'warning',
                allowOutsideClick: false,
                html:
                    '<p style="text-align:left;">We encourage you to call doctor’s clinic to verify availability for the date/time of consultation.</p>',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, accept it',
                cancelButtonText: 'No, cancel',
            }).then(result => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    //Swal.fire('You accepted, terms of use', '', 'success')
                    setShow(false)
                    setSelectedHospital(hospital[data.hospital])
                    setSelectedDoctor(doctor ? doctor[data.doctor] : '')
                }
            })
        } else {
            setShow(false)
            setSelectedHospital(hospital[data.hospital])
            setSelectedDoctor(doctor ? doctor[data.doctor] : '')
        }
    }

    return (
        <form onSubmit={handleSubmit(onChooseProvider)} className="px-2">
            <span className="text-red-500 text-sm font-semibold">
                {errors?.hospital?.message}
            </span>
            <div
                className={`${
                    router?.query?.loatype == 'consultation' && 'flex'
                } gap-2`}>
                <div className="basis-1/2">
                    <div>
                        <Label htmlFor="searchHospital" className="mb-2">
                            Search for Hospital or Clinic{' '}
                            <span className="text-xs text-orange-900">
                                (You must choose hospital or clinic first)
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
                            (!hospital || hosploading) &&
                            'flex items-center justify-center'
                        }`}>
                        {hosploading ? (
                            <SyncLoader color="#CDCDCD" margin={10} size={15} />
                        ) : hospital ? (
                            <>
                                <div className="p-2">
                                    {hospital?.map((row, index) => (
                                        <div
                                            key={index}
                                            className="w-full border-b border-dashed min-h-8 py-2 px-1 flex items-center gap-2">
                                            <input
                                                disabled={docloading}
                                                type="radio"
                                                {...register('hospital', {
                                                    required:
                                                        'Warning : You must choose a Hospital or Clinic to continue',
                                                })}
                                                id={`hospital-${row.id}`}
                                                value={index}
                                                className="w-3 h-3"
                                            />{' '}
                                            <Label
                                                htmlFor={`hospital-${row.id}`}>
                                                {row.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <span className="text-orange-600 font-semibold text-sm">
                                No hospital found, please search the name of the
                                hospital
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className={`basis-1/2 ${
                        router?.query?.loatype == 'laboratory' && 'hidden'
                    }`}>
                    <div>
                        <Label className="mb-2">Doctor (optional)</Label>
                        <Input
                            register={{ ...register('docSearch') }}
                            disabled={!watch('hospital') || hosploading}
                            onChange={e => onSearchDoctor(e.target.value)}
                            placeholder="Enter Doctor's name / Specialization"
                        />
                    </div>
                    <div
                        className={`h-96 w-full bg-gray-50 mt-2 rounded-md overflow-y-auto ${
                            (!doctor || docloading) &&
                            'flex items-center justify-center'
                        }`}>
                        {docloading ? (
                            <SyncLoader color="#CDCDCD" margin={10} size={15} />
                        ) : doctor ? (
                            <>
                                <div className="p-2">
                                    {doctor?.map((row, index) => (
                                        <div
                                            key={index}
                                            className="w-full border-b border-dashed min-h-8 py-2 px-1 flex items-center gap-2">
                                            <input
                                                type="radio"
                                                {...register('doctor')}
                                                id={`doctor-${row.id}`}
                                                value={index}
                                                className="w-3 h-3"
                                            />{' '}
                                            <Label htmlFor={`doctor-${row.id}`}>
                                                {row.last}, {row.first}
                                                <br /> {row.specialization}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <span className="text-orange-600 font-semibold text-sm">
                                No doctor found, please search the name of the
                                doctor
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-2 right-4">
                <Button
                    loading={loading}
                    className={`float-right bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 ${
                        !hospital && 'hidden'
                    }`}>
                    <ButtonText
                        text="Submit Selected Provider"
                        loading={loading}
                    />
                </Button>
                <div className="clear-both"></div>
            </div>
        </form>
    )
}

export default ProviderLookupForm
