import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'


import ApplicationLogo from '@/components/ApplicationLogo'

// Components
import Clock from 'react-live-clock'
import Label from '@/components/Label'
import InputSelect from '@/components/InputSelect'
import DatePicker from '@/components/client-uploaded-loa/DateRangePicker'

// Helpers
import dayjs from 'dayjs'

// Forms
import { useForm } from 'react-hook-form'
import { useClientUploaded } from '@/hooks/client-uploaded-loa/client-uploaded-loa'
import Head from 'next/head'
import Datatable from '@/components/client-uploaded-loa/DataTable'


function ClientUploadLOA() {



    const [loading, setLoading] = useState(false)
    const [loaData, setLoaData] = useState([])


    const { selectDate } = useClientUploaded({})

    const handleOkButton = (data) => {

        var dateFirst = dayjs(data[0]).format('YYYY-MM-DD')
        var dateLast = dayjs(data[1]).format('YYYY-MM-DD')


        setLoading(true)

        selectDate({
            dateFirst,
            dateLast,
            setLoading,
            setLoaData
        })
    }






  return (
    <>

    <Head>
        <title>Issued LOA</title>
    </Head>


    <div className='py-4 px-2 bg-gray-200 flex justify-center items-center'>
      <div className='bg-white py-2 px-6 rounded-md w-full md:w-4/5 '>
        <div className='flex flex-col md:flex-row justify-between items-center'>
            <ApplicationLogo width={200} />
            <div>
                <h1 className='text-center font-bold text-lg'>Issued LOA  - <span className='text-blue-900'>Voice vs Non-Voice</span></h1>
                <p className='font-bold text-sm text-shadow-lg text-gray-700 text-center md:text-right'>
                    <Clock
                    format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                    ticking={true}
                    timezone={'Asia/Manila'}
                    />
                </p>
            </div>
        </div>

        <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg" />

        <div className='flex flex-col md:flex-row gap-2'>
            <div className=" basis-full  mb-2">
            <DatePicker loading={loading} handleOkButton={handleOkButton} />
            </div>
        </div>

        <Datatable loaData={loaData} />

      </div>
    </div>



    </>
  )
}

export default ClientUploadLOA
