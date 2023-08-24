import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Head from 'next/head'

import Label from '@/components/Label'
import Input from '@/components/Input'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProvider } from '@/hooks/self-service/provider'

import { SyncLoader } from 'react-spinners'

import Form from '@/pages/self-service/provider/form'

const provider = () => {
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm()

    const [loading, setLoading] = useState(false)

    const { show, setShow, body, setBody, toggle } = ModalControl()

    const [request, setRequest] = useState()
    const [timer, setTimer] = useState(null)

    const { searchRequest } = useProvider()

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

    const view = row => {
        //console.log(row)
        setBody({
            title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
            content: (
                <Form setShow={setShow} setRequest={setRequest} row={row} />
            ),
            //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
            modalOuterContainer: 'w-full h-full',
            //modalContainer: '',
            modalContainer: 'h-full',
            modalBody: 'h-full overflow-y-scroll',
        })
        toggle()
    }

    return (
        <ProviderLayout>
            <Head>
                <title>LLIBI PORTAL - PROVIDER</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Main form white background */}
                    <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg">
                        {/* Main Header, title and logo */}
                        <p className="font-bold text-2xl text-blue-900">
                            Member{' '}
                            <span className="text-yellow-900">
                                Self-service Portal
                            </span>{' '}
                            <span className="text-red-400">(Provider)</span>
                        </p>
                        <hr className="my-2"></hr>

                        {/* Action Form */}
                        <form
                            onChange={handleSubmit(searchForm)}
                            className="w-full">
                            <div className="flex">
                                <div className="basis-1/3 mb-2">
                                    <Label
                                        htmlFor="search"
                                        className="text-blue-500 text-bold">
                                        LOA Number / Approval Code
                                    </Label>
                                    <Input
                                        id="search"
                                        register={{
                                            ...register('search'),
                                        }}
                                        placeholder="Search for patient's LOA # or approval code"
                                        errors={errors?.search}
                                    />
                                </div>
                                <div className="basis-2/3 flex place-items-center pl-5">
                                    {loading && (
                                        <SyncLoader size={10} color="#0EB0FB" />
                                    )}
                                </div>
                            </div>

                            <table className="table-auto w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Member ID
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Patient's Name
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            LOA Number
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {request?.length > 0 ? (
                                        request?.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={`${
                                                    (row.status === 2 &&
                                                        'bg-orange-50') ||
                                                    (row.status === 3 &&
                                                        'bg-green-50') ||
                                                    (row.status === 4 &&
                                                        'bg-red-50') ||
                                                    (row.status === 5 &&
                                                        'bg-pink-50')
                                                }`}>
                                                <td className="border border-gray-300 p-2">
                                                    {row.isDependent
                                                        ? row.depMemberID
                                                        : row.memberID}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.isDependent
                                                        ? `${row.depLastName}, ${row.depFirstName}`
                                                        : `${row.lastName}, ${row.firstName}`}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.loaNumber || 'N/A'}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {row.status === 2 &&
                                                        'Pending'}
                                                    {row.status === 3 &&
                                                        'Approved'}
                                                    {row.status === 4 &&
                                                        'Disapproved'}
                                                    {row.status === 5 &&
                                                        'Downloaded'}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    <a
                                                        className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900"
                                                        onClick={() => {
                                                            view(row)
                                                        }}>
                                                        VIEW
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="text-center border bg-red-50 p-2 font-semibold"
                                                colSpan={5}>
                                                No patient found, please search
                                                for LOA # or approval code
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </form>
                        {/* End Table */}
                    </div>
                </div>

                <Modal show={show} body={body} toggle={toggle} />
            </div>
        </ProviderLayout>
    )
}

export default provider
