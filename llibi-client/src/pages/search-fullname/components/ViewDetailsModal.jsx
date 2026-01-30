import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import dayjs from 'dayjs'

import { FaX } from 'react-icons/fa6'
import { SyncLoader } from 'react-spinners'
import {
  exportClientErrorLogsExcel,
  searchClientErrorLogs,
} from '@/hooks/search-masterlist/masterlist'

export default function ViewDetailsModal({ setViewDetailsModal, memberData }) {
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      // Pass member_id, first_name, and last_name in request body
      const searchQuery = {
        first_name: memberData?.first_name || '',
        last_name: memberData?.last_name || '',
      }
      const result = await searchClientErrorLogs(searchQuery, setErrors)

      if (result && result.length > 0) {
        setResults(result)
      }
      setLoading(false)
    }

    if (memberData) {
      fetchDetails()
    }
  }, [memberData])

  const handleClose = () => {
    setViewDetailsModal(false)
  }

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      setViewDetailsModal(false)
    }
  }

  const triggerBlobDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'export.xlsx'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadExcel = async () => {
    if (!memberData) return

    setExporting(true)
    const searchQuery = {
      first_name: memberData?.first_name || '',
      last_name: memberData?.last_name || '',
    }

    const exported = await exportClientErrorLogsExcel(searchQuery, setErrors)
    if (exported?.blob) {
      triggerBlobDownload(exported.blob, exported.filename)
    }
    setExporting(false)
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="sticky top-0 z-30 bg-white px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Member Details</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadExcel}
                disabled={loading || exporting}
                className="bg-green-600 text-white px-3 py-2 mx-4 rounded-md text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                {exporting ? 'Downloading…' : 'Download Excel'}
              </button>
              <FaX
                className="text-black/30 cursor-pointer"
                onClick={handleClose}
              />
            </div>
          </div>
        </div>

        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(90vh - 72px)' }}>
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <SyncLoader color="#23b9ff" size={11} />
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Member ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      First Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Last Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Date of Birth
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Dependent Member ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Dependent First Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Dependent Last Name
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Dependent Date of Birth
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      Date Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, index) => {
                    const isDependent = row.is_dependent === 1
                    const fullName = [
                      row.first_name,
                      row.middle_name,
                      row.last_name,
                      row.suffix,
                    ]
                      .filter(Boolean)
                      .join(' ')

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isDependent
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                            {isDependent ? 'DEPENDENT' : 'EMPLOYEE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.member_id || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.first_name || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.last_name || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {row.birth_date
                            ? dayjs(row.birth_date).format('MMM DD, YYYY')
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.dependent_member_id || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.dependent_first_name || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {row.dependent_last_name || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {row.dependent_dob
                            ? dayjs(row.dependent_dob).format('MMM DD, YYYY')
                            : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {row.created_at
                            ? dayjs(row.created_at).format('MMM DD, YYYY')
                            : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {errors.map((error, idx) => (
                    <div key={idx}>{error}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No details found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
