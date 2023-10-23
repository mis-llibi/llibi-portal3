import React from 'react'

export default function PreviewTable({ previewData }) {
  const data = previewData?.data
  return (
    <>
      <table className="table-auto w-full text-sm">
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
            <th className="border border-gray-300 p-2 text-left">
              APPROVED BY
            </th>
            <th className="border border-gray-300 p-2 text-left">
              APPROVED DATE
            </th>
            <th className="border border-gray-300 p-2 text-left">
              HANDLING TIME (minutes)
            </th>
            <th className="border border-gray-300 p-2 text-center">VIBER</th>
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
                <td className="border border-gray-300 p-2">
                  {row.approved_by_last_name}, {row.approved_by_first_name}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.approved_date}
                </td>
                <td className="border border-gray-300 p-2">
                  {row.elapse_minutes}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {row.platform === 'viber' ? 'YES' : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="text-center border bg-red-50 p-2 font-semibold"
                colSpan={9}>
                No patient found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
