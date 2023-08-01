import Head from 'next/head'
import React, { useState } from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'

import { useForm } from 'react-hook-form'
import { useCode } from '@/hooks/approval-code/code'

import { SyncLoader } from 'react-spinners'

const index = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm()

    const [loading, setLoading] = useState(false)

    const [request, setRequest] = useState()
    const [timer, setTimer] = useState(null)

    const { searchRequest } = useCode()

    const searchForm = data => {
        setLoading(true)
        if (timer) {
            clearTimeout(timer)
            setTimer(null)
        }
        setTimer(
            setTimeout(() => {
                searchRequest({ setRequest, setLoading, ...data })
            }, 1000),
        )
    }

    //console.log(request)
    return (
        <>
            <Head>
                <title>LLIBI PORTAL - APPCODE</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Main form white background */}
                    <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg">
                        {/* Main Header, title and logo */}
                        <p className="font-bold text-2xl text-blue-900">
                            Approval Code{' '}
                            <span className="text-yellow-900">Checker</span>
                        </p>
                        <hr className="my-2"></hr>
                        <form
                            onChange={handleSubmit(searchForm)}
                            className="w-full">
                            <div className="flex">
                                <div className="basis-1/3 mb-2">
                                    <Label
                                        htmlFor="search"
                                        className="text-blue-500 text-bold">
                                        Search Code
                                    </Label>
                                    <Input
                                        id="search"
                                        register={{
                                            ...register('search'),
                                        }}
                                        placeholder="Search for patient's approval code"
                                        errors={errors?.search}
                                    />
                                </div>
                                <div className="basis-2/3 flex place-items-center pl-5">
                                    {loading && (
                                        <SyncLoader size={10} color="#0EB0FB" />
                                    )}
                                </div>
                            </div>
                        </form>
                        <div>
                            <table className="table-auto w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Approval Code
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            LOA Number
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Employee Name
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Patient Name
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Date/Time Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {request?.length > 0 ? (
                                        request?.map((row, i) => (
                                            <tr key={i}>
                                                <td className="border border-gray-300 p-2">
                                                    {row.approval_code}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.loa_number}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.employee_name}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.patient_name}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.datetime}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="text-center border bg-red-50 p-2 font-semibold"
                                                colSpan={5}>
                                                No patient found, please search
                                                approval code
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default index
