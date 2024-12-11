import React from 'react'
import Head from 'next/head'



// Components
import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Clock from 'react-live-clock'
import Input from '@/components/Input'

// Logo
import ApplicationLogo from '@/components/ApplicationLogo'
import TextArea from '@/components/TextArea'


export default function CallbackRequest() {
  return (
    <>
    <div>
        <ProviderLayout>
            <Head>
                <title>LLIBI PORTAL - CALLBACK REQUEST</title>
            </Head>

            <div className='py-12'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                    <div className='p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg'>
                        <div className='flex flex-col justify-center items-center gap-5 font-bold text-xl text-gray-900 md:flex-row md:justify-between px-3 '>
                            <ApplicationLogo width={200} />
                            <div className='text-center'>
                                <h1 className='text-[#FD9727] md:text-right'>Contact Us</h1>
                                <p className='text-sm text-shadow-lg text-gray-700'>
                                    <Clock
                                        format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                                        ticking={true}
                                        timezone={'Asia/Manila'}
                                    />
                                </p>
                            </div>
                        </div>
                        <hr className="my-2 mb-3 border-b-4 shadow border-[#FD9727] rounded-lg " />
                        <div className='w-full bg-[#FD9727] rounded-lg text-[0.7rem] text-white lg:text-[1rem] border-2 border-black/30'>
                            <p className='p-2 shadow'>Request for LLIBI 24/7 Client Care Executives to reach out to you through communication channel(s) of your choice to increase callability and to hasten LOA request transactions/inquiry.</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-[0.6rem] font-bold lg:text-[0.8rem] lg:text-start">
                                Lacson and Lacson Client Care Executives will reach out to you using your inputted contact information as shown below.
                            </p>
                            <div className="md:flex md:gap-4">
                                <div className="my-3 flex items-center gap-3 w-full md:w-1/2">
                                    <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold w-24">Landline:</h1>
                                    <Input className="w-full md:w-[15rem]" placeholder="02" />
                                </div>
                                <div className="my-3 flex items-center gap-3 w-full md:w-1/2">
                                    <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold w-24">Hospital:</h1>
                                    <Input className="w-full md:w-[15rem]" placeholder="02" />
                                </div>
                            </div>
                            <div className="md:flex md:gap-4">
                                <div className="my-3 flex items-center gap-3 w-full md:w-1/2">
                                    <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold w-24">Mobile:</h1>
                                    <Input className="w-full md:w-[15rem]" placeholder="09" />
                                </div>
                                <div className="my-3 flex items-center gap-3 w-full md:w-1/2">
                                    <h1 className="text-[0.6rem] lg:text-[0.8rem] font-bold w-24">Email:</h1>
                                    <Input className="w-full md:w-[15rem]" placeholder="example@gmail.com" />
                                </div>
                            </div>
                            </div>

                        <div className='my-5 flex flex-col gap-2 justify-center items-center md:flex-none'>
                            <TextArea className="w-full h-24" placeholder="Your Request: " />
                            <button className='py-2 px-3 text-white rounded-lg bg-[#FD9727]'>Submit</button>
                        </div>
                        <div className='w-full bg-[#FD9727] rounded-lg text-[0.7rem] text-white lg:text-[1rem] border-2 border-black/30 shadow'>
                            <p className='p-2 font-semibold'>You may include instructions, patient details*, and other related information in advance. Doing so will enable the Client Care Executive to look up patient/member information in advance to shorten up the transaction.</p>
                            <p className='p-2 font-semibold'>*NOTE: Before entering any personal and sensitive patient data, make sure to check our Privacy Notice at https://llibi.com/data-privacy/ to know more information regarding how we handle your data.</p>
                        </div>
                    </div>
                </div>
            </div>


        </ProviderLayout>
    </div>



    </>
  )
}
