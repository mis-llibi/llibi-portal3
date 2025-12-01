import React, { useEffect, useState } from "react";
import { FindShowLoa } from "@/hooks/self-service/findShowLoa";
import { MoonLoader } from "react-spinners";

export default function ShowLoa({ row }) {
    const { FindPatientAllLoa } = FindShowLoa();

    const [loading, setLoading] = useState(false);
    const [getLoaFiles, setGetLoaFiles] = useState([]);
    const [getLoaClaimed, setGetLoaClaimed] = useState([]);

    useEffect(() => {
        setLoading(true);
        FindPatientAllLoa({
            setLoading,
            fullname:
                row.isDependent == null
                    ? `${row.lastName}, ${row.firstName}`
                    : `${row.depLastName}, ${row.depFirstName}`,
            inscode: row.inscode,
            compcode: row.company_code,
            setGetLoaFiles,
            setGetLoaClaimed,
        });
    }, [row]);

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <MoonLoader />
                </div>
            ) : (
                <>
                <div>
                    Benefit Type: {row?.benefit_type}
                </div>
                <div className="flex items-start justify-center gap-10 w-full py-5">

                    {/* LEFT TABLE */}
                    <div className="w-1/2">
                        <h2 className="font-semibold text-lg mb-2">Issued LOA</h2>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-3 py-2">LOA Number</th>
                                    <th className="border px-3 py-2">LOA Type</th>
                                    <th className="border px-3 py-2">Patient Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getLoaFiles.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="text-center py-3 text-gray-500">
                                            No data
                                        </td>
                                    </tr>
                                ) : (
                                    getLoaFiles.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border px-3 py-2">{item.document_number}</td>
                                            <td className="border px-3 py-2">{item.type}</td>
                                            <td className="border px-3 py-2">{item.patient_name}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* RIGHT TABLE */}
                    <div className="w-1/2">
                        <h2 className="font-semibold text-lg mb-2">Processed LOA</h2>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-3 py-2">LOA Number</th>
                                    <th className="border px-3 py-2">LOA Type</th>
                                    <th className="border px-3 py-2">Diagnosis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getLoaClaimed.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="text-center py-3 text-gray-500">
                                            No data
                                        </td>
                                    </tr>
                                ) : (
                                    getLoaClaimed.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border px-3 py-2">{item.loanumb}</td>
                                            <td className="border px-3 py-2">{item.claimtype}</td>
                                            <td className="border px-3 py-2">{item.diagnosis}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                </>
            )}
        </>
    );
}
