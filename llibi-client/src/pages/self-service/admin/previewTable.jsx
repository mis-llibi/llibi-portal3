import React from 'react'

export default function PreviewTable({ previewData }) {
  const data = previewData?.data
  return (
    <>
      <table className="table-auto w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Member ID</th>
            <th className="border border-gray-300 p-2 text-left">COMPANY</th>
            <th className="border border-gray-300 p-2 text-left">
              Patient's Name
            </th>
            <th className="border border-gray-300 p-2 text-left">LOA Type</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">
              D/T Created
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((row, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2">
                  {row.isDependent ? row.depMemberID : row.memberID}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.company_name}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.isDependent
                    ? `${row.depLastName}, ${row.depFirstName}`
                    : `${row.lastName}, ${row.firstName}`}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.loaType.toUpperCase() || 'N/A'}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.status === 2 && 'Pending'}
                  {row.status === 3 && 'Approved'}
                  {row.status === 4 && 'Disapproved'}
                  {row.status === 5 && 'Downloaded'}
                </td>
                <td className="border border-gray-300 p-2">{row.createdAt}</td>
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
    </>
  )
}
