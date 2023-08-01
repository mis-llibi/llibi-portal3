import React from 'react'

import { BarLoader } from 'react-spinners'

import { basePath } from '@/../next.config'

const TrackReferenceNumber = ({ request }) => {
    console.log(request)

    const hospital = request?.provider?.split('++')
    const doctor = request?.doctorName?.split('++')

    return (
        <div className="w-full h-full">
            <div className="p-4 w-full shadow-md border-t-2 border-blue-900 rounded mb-3">
                <div className="grid md:grid-cols-3 gap-2">
                    <p className="capitalize mb-2">
                        Requestor
                        <br />
                        <b>
                            {request?.lastName}, {request?.firstName}
                        </b>
                    </p>
                    <p
                        className={`capitalize mb-2 ${
                            request?.isDependent || 'hidden'
                        }`}>
                        Patient Name{' '}
                        <span className="text-red-700">(Dependent)</span>
                        <br />
                        <b>
                            {request?.depLastName}, {request?.depFirstName}
                        </b>
                    </p>

                    <p
                        className={`capitalize mb-2 ${
                            !request?.isDependent || 'hidden'
                        }`}>
                        Patient Name
                        <br />
                        <b>
                            {request?.lastName}, {request?.firstName}
                        </b>
                    </p>
                    {/* LOA type */}
                    <p className={`capitalize mb-2`}>
                        LOA Type
                        <br />
                        <b>{request?.loaType}</b>
                    </p>
                </div>

                {/* provider */}
                <p className={`capitalize font-bold text-blue-700`}>
                    Preferred Provider
                </p>
                <div
                    className={`flex p-2 border border-1 border-gray-400 border-dashed bg-gray-100 ${
                        !hospital && 'hidden'
                    }`}>
                    <div className="basis-1/2 text-sm">
                        <p className="font-bold mb-1">
                            Hospital / Clinic:{' '}
                            <span className="font-normal">
                                {' '}
                                {hospital && hospital[0]}
                            </span>
                        </p>
                        <p className="font-bold mb-1">
                            Address:{' '}
                            <span className="font-normal">
                                {hospital && hospital[1]}
                            </span>
                        </p>
                        <p className="font-bold mb-1">
                            City:{' '}
                            <span className="font-normal">
                                {(hospital && hospital[2]) || 'N/A'}
                            </span>
                        </p>
                        <p className="font-bold mb-1">
                            State:{' '}
                            <span className="font-normal">
                                {(hospital && hospital[3]) || 'N/A'}
                            </span>
                        </p>
                    </div>
                    <div
                        className={`basis-1/2 text-sm border-l-2 pl-2 flex items-center ${
                            request?.doctorID == 0 && 'justify-center'
                        }`}>
                        <div
                            className={`text-red-600 font-semibold ${
                                request?.doctorID != 0 && 'hidden'
                            }`}>
                            No Requested Doctor
                        </div>
                        <div
                            className={`capitalize ${
                                request?.doctorID == 0 && 'hidden'
                            }`}>
                            <p className="font-bold mb-1">
                                Doctor:{' '}
                                <span className="font-normal">
                                    {(doctor && doctor[0]) || 'N/A'}
                                </span>
                            </p>
                            <p className="font-bold mb-1">
                                Specialization:{' '}
                                <span className="font-normal">
                                    {(doctor && doctor[1]) || 'N/A'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {/* <div className="bg-blue-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer">
                    <img
                        src={`${basePath}/self-service/track-request-form.avif`}
                        className={`w-full h-full grayscale`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        Membership Validated
                    </p>
                </div> */}
                <div className="bg-orange-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer">
                    <img
                        src={`${basePath}/self-service/track-request-sent.webp`}
                        className={`w-full h-full`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        Request for LOA sent
                    </p>
                </div>
                <div className="h-48 w-full grid place-items-center">
                    <BarLoader color="#3EB8DF" width={'100%'} height={10} />
                </div>
                <div className="bg-red-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer">
                    <img
                        src={`${basePath}/self-service/track-processing.avif`}
                        className={`w-full h-full ${
                            request?.status == 2 && 'animate-pulse'
                        }`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        {request?.status == 2
                            ? 'Validating your request'
                            : 'Request Validated'}
                    </p>
                </div>
                <div className="h-48 w-full grid place-items-center">
                    <BarLoader color="#3EB8DF" width={'100%'} height={10} />
                </div>
                <div
                    className={`bg-green-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer ${
                        request?.status == 2 || 'hidden'
                    }`}>
                    <img
                        src={`${basePath}/self-service/track-checking.webp`}
                        className={`w-full h-full grayscale`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        Request is pending
                    </p>
                </div>
                <div
                    className={`bg-green-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer ${
                        request?.status == 3 || 'hidden'
                    }`}>
                    <img
                        src={`${basePath}/self-service/track-approved.webp`}
                        className={`w-full h-full animate-pulse`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        Request is approved
                    </p>
                </div>
                <div
                    className={`bg-green-50 h-48 w-full border-2 p-2 hover:scale-105 transition duration-150 cursor-pointer ${
                        request?.status == 4 || 'hidden'
                    }`}>
                    <img
                        src={`${basePath}/self-service/track-rejected.webp`}
                        className={`w-full h-full animate-pulse`}
                    />
                    <p className="text-xs text-center -mt-5 font-bold">
                        Request is disapproved
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TrackReferenceNumber
