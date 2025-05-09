'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Components
import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout';
import Clock from 'react-live-clock';
import Input from '@/components/Input';
import InputSelect from '@/components/callback-request-components/InputSelect';
import Swal from 'sweetalert2';

// Loader
import { PuffLoader } from 'react-spinners';

// Logo
import ApplicationLogo from '@/components/ApplicationLogo';
import TextArea from '@/components/TextArea';

// Fetching
import axios from '@/lib/axios';

// Form Validations
import { useForm } from 'react-hook-form';
import Select from '@/components/Select';


export default function CallbackRequest() {
  const [status, setStatus] = useState([]);
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setloading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)


  const options = [
    { value: '', label: 'No options' },
    { value: 1, label: 'Provider' },
    { value: 2, label: 'Member' },
  ];

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
    control,
    reset
  } = useForm();

  const selectedOption = watch('selectOptions'); // Watch the selected value of Select

  const router = useRouter()

  const {emplid} = router.query

  const getHospitals = async () => {
    try {
      const response = await axios.get('/api/hospitals');
      const hospitalOptions = response.data.map((hospital) => ({
        value: hospital.id,
        label: hospital.name,
      }));
      setStatus(hospitalOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const getMasterlist = async (emplid) => {
    setloading(true)

    try {
        const response = await axios.get('/api/getMasterlist', {params: {
            emplid:emplid
        }})
        // console.log(response.data)
        setFirstName(response.data.first_name)
        setLastName(response.data.last_name)
        setMiddleName(response.data.middle_name)
        setloading(false)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    getHospitals();
    // console.log(emplid)
    if(emplid !== undefined){
        getMasterlist(emplid)
    }
  }, [emplid]);

  useEffect(() => {
    if(selectedOption === '2'){
        setValue('hospital', null)
    }
  }, [selectedOption, setValue])

  const submitForms = async(data) => {

    setLoadingSubmit(true)

    const dataForm = {
        data:data,
        emplID:emplid,
        callbackRequest:true,
        first_name:firstName,
        last_name:lastName
    }

    try {
        const response = await axios.post('/api/submitCallback', dataForm)
        // console.log(response)

        if(response.status === 201){
            setLoadingSubmit(false)
            Swal.fire({
                title: "Success",
                text: "Wait for the callback response",
                icon: 'success'
            })
            reset()

        }
    }
    catch (error) {
        // console.log(error)
        Swal.fire('Error', `${error}`, 'error')
        setLoadingSubmit(false)
    }

  };

  return (
    <>
      <div>
        <ProviderLayout>
          <Head>
            <title>LLIBI PORTAL - CALLBACK REQUEST</title>
          </Head>

          <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
                <div className="flex flex-col justify-center items-center gap-5 font-bold text-xl text-gray-900 md:flex-row md:justify-between px-3 ">
                  <ApplicationLogo width={200} />
                  <div className="text-center">
                    <h1 className="text-[#FD9727] md:text-right">Contact Us
                        {/* {emplid} */}
                    </h1>
                    {loading ?
                        <div className='flex justify-center items-center md:justify-end'>
                            <PuffLoader />
                        </div> :
                        <p className='text-sm md:text-right'>Hello, <span className='text-[#FD9727] '>{lastName}, {firstName} {middleName}.</span></p>
                    }

                    <p className="text-sm text-shadow-lg text-gray-700">
                      <Clock
                        format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                        ticking={true}
                        timezone={'Asia/Manila'}
                      />
                    </p>
                  </div>
                </div>
                <hr className="my-2 mb-3 border-b-4 shadow border-[#FD9727] rounded-lg " />
                <div className="w-full bg-[#FD9727] rounded-lg text-[0.7rem] text-white lg:text-[1rem] border-2 border-black/30">
                  <p className="p-2 shadow font-semibold">
                    Request for LLIBI 24/7 Client Care Executives to reach out to you through
                    communication channel(s) of your choice to increase callability and to hasten LOA request transactions/inquiry.
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-[0.6rem] font-bold lg:text-[0.8rem] lg:text-start">
                    Lacson and Lacson Client Care Executives will reach out to you using your inputted contact information as shown below.
                  </p>
                  <div className="mt-4">
                    <Select
                      options={options}
                      register={register('selectOptions', {
                        required: 'Please select an option',
                      })}
                      errors={errors?.selectOptions}
                    />
                  </div>
                </div>
                <form onSubmit={handleSubmit(submitForms)}>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                    {selectedOption === '1' && (
                        <>
                        <div>
                            <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold">Landline (Optional):</h1>
                            <Input
                            className="w-full"
                            placeholder="02"
                            register={register('landline')}
                            errors={errors?.landline}
                            />
                        </div>
                        <div>
                            <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold">Hospital:</h1>
                            <InputSelect
                            id="searchStatus"
                            label="Search Provider"
                            register={register('hospital')}
                            errors={errors?.hospital}
                            option={status}
                            control={control}
                            />
                        </div>
                        <div>
                            <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold">Mobile:</h1>
                            <Input
                            className="w-full"
                            placeholder="09"
                            register={register('mobile', {
                                required: 'Mobile number is required',
                            })}
                            errors={errors?.mobile}
                            />
                        </div>
                        <div className="my-5 col-span-2 flex flex-col justify-center items-center ">
                            <TextArea
                                className="w-full h-24"
                                placeholder="Your Request:"
                                register={register('request', {
                                required: 'Request details are required',
                                })}
                                errors={errors?.request}
                            />
                            <button
                                className="py-2 px-3 mt-4 text-white rounded-lg bg-[#FD9727]"
                                type="submit"
                            >
                                {loadingSubmit ? <PuffLoader size={35} /> : "Submit"}
                                {/* <PuffLoader size={40} /> */}
                            </button>
                            </div>
                        </>
                    )}
                    {selectedOption === '2' && (
                        <>
                        <div>
                            <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold">Landline (Optional):</h1>
                            <Input
                            className="w-full"
                            placeholder="02"
                            register={register('landline')}
                            errors={errors?.landline}
                            />
                        </div>
                        <div>
                            <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold">Mobile:</h1>
                            <Input
                            className="w-full"
                            placeholder="09"
                            register={register('mobile', {
                                required: 'Mobile number is required',
                            })}
                            errors={errors?.mobile}
                            />
                        </div>
                        <div className="my-5 col-span-2 flex flex-col justify-center items-center ">
                            <TextArea
                                className="w-full h-24"
                                placeholder="Your Request:"
                                register={register('request', {
                                required: 'Request details are required',
                                })}
                                errors={errors?.request}
                            />
                            <button
                                className="py-2 px-3 mt-4 text-white rounded-lg bg-[#FD9727]"
                                type="submit"
                            >
                                {loadingSubmit ? <PuffLoader size={35} /> : "Submit"}
                            </button>
                            </div>
                        </>
                    )}
                    </div>

                </form>
                <div className="w-full bg-[#FD9727] rounded-lg text-[0.7rem] text-white lg:text-[1rem] border-2 border-black/30 shadow">
                  <p className="p-2 font-semibold">
                    You may include instructions, patient details*, and other related information in advance. Doing so will enable the Client Care Executive to look up patient/member information in advance to shorten up the transaction.
                  </p>
                  <p className="p-2 font-semibold">
                    *NOTE: Before entering any personal and sensitive patient data, make sure to check our Privacy Notice at {' '}
                    <a href="https://llibi.com/data-privacy/" target='_blank' className='text-blue-200 underline'>https://llibi.com/data-privacy/</a> to know more information regarding how we handle your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ProviderLayout>
      </div>
    </>
  );
}
