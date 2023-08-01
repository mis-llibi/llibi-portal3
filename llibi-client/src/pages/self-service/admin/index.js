import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Head from 'next/head'

import ApplicationLogo from '@/components/ApplicationLogo'
import Label from '@/components/Label'
import Input from '@/components/Input'
import InputSelect from '@/components/InputSelect'
import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdmin } from '@/hooks/self-service/admin'

import { SyncLoader } from 'react-spinners'

import Form from '@/pages/self-service/admin/form'

import Clock from 'react-live-clock'

const Admin = () => {
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

    const [name, setName] = useState()
    const [searchStatus, setSearchStatus] = useState()

    const { clients, searchRequest } = useAdmin({
        name: name,
        status: searchStatus,
    })

    const checkRequestStatus = data => {
        setSearchStatus(data?.value)
    }

    const searchForm = data => {
        setLoading(true)
        if (timer) {
            clearTimeout(timer)
            setTimer(null)
        }
        setTimer(
            setTimeout(() => {
                setName(data?.name)
            }, 1000),
        )
    }

    /*
        useEffect(() => {
            const intervalId = setInterval(() => {
                //assign interval to a variable to clear it.
                console.log(name)
            }, 10000)

            return () => clearInterval(intervalId) //This is important
        }, []) 
    */

    useEffect(() => {
        setLoading(true)
        //assign interval to a variable to clear it.
        searchRequest({
            setRequest,
            setLoading,
            name: name,
            status: searchStatus,
        })
    }, [name, searchStatus])

    const view = row => {
        console.log(row)
        setBody({
            title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
            content: <Form setRequest={setRequest} row={row} />,
            //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
            modalOuterContainer: 'w-full h-full',
            //modalContainer: '',
            modalContainer: 'h-full',
            modalBody: 'h-full overflow-y-scroll',
        })
        toggle()
    }

    const status = [
        { value: 2, label: 'Pending' },
        { value: 3, label: 'Approved' },
        { value: 4, label: 'Disapproved' },
        { value: 5, label: 'Downloaded' },
    ]

    return (
        <ProviderLayout>
            <Head>
                <title>LLIBI PORTAL - ADMIN</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Main form white background */}
                    <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg">
                        {/* Main Header, title and logo */}
                        <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
                            <ApplicationLogo width={200} />
                            <div className="my-auto w-full">
                                <div className="w-full text-center md:text-right">
                                    <p>
                                        Member{' '}
                                        <span className="text-blue-900">
                                            Client Care Portal
                                        </span>
                                    </p>
                                    <p className="text-sm text-shadow-lg text-gray-700">
                                        <Clock
                                            format={
                                                'dddd, MMMM Do, YYYY, h:mm:ss A'
                                            }
                                            ticking={true}
                                            timezone={'Asia/Manila'}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

                        {/* Action Form */}
                        <form
                            onChange={handleSubmit(searchForm)}
                            className="w-full">
                            <div className="flex gap-2">
                                <div className="basis-1/3 mb-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-blue-500 text-bold">
                                        Patient Name / Member ID
                                    </Label>
                                    <Input
                                        id="name"
                                        register={{
                                            ...register('name'),
                                        }}
                                        placeholder="Search for patient's name or member ID"
                                        errors={errors?.name}
                                    />
                                </div>
                                <div className="basis-1/3 mb-2">
                                    <Label
                                        htmlFor="status"
                                        className="text-blue-500 text-bold">
                                        Request Status
                                    </Label>
                                    <InputSelect
                                        id="searchStatus"
                                        label="Default = Pending"
                                        onChange={e => checkRequestStatus(e)}
                                        required={false}
                                        register={{
                                            ...register('searchStatus'),
                                        }}
                                        errors={errors?.searchStatus}
                                        control={control}
                                        option={status}
                                    />
                                </div>
                                <div className="basis-1/3 flex place-items-center pl-5">
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
                                            LOA Type
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left">
                                            D/T Created
                                        </th>
                                        <th className="border border-gray-300 p-2 text-left w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients?.length > 0 ? (
                                        clients?.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={`${
                                                    (row.status === 2 &&
                                                        'bg-orange-50') ||
                                                    (row.status === 3 &&
                                                        'bg-green-50') ||
                                                    (row.status === 4 &&
                                                        'bg-red-100') ||
                                                    (row.status === 5 &&
                                                        'bg-purple-100')
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
                                                    {row.loaType.toUpperCase() ||
                                                        'N/A'}
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
                                                <td className="border border-gray-300 p-2">
                                                    {row.createdAt}
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
                                                colSpan={6}>
                                                No patient found
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

export default Admin
