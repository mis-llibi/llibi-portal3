'use client'
import React, { useState, useEffect } from "react"
import Swal from "sweetalert2"

export default function EditableProcedureRow ({
  item,
  index,
  procedure,
  mutate,
  setGetUpdatedProcedures,
}){
  const [isEditing, setIsEditing] = useState(false)
  const [editedCost, setEditedCost] = useState(item?.cost)
  const [status, setStatus] = useState(item?.status?.trim() || "PENDING")

  // ✅ Keep parent updated with any local edit (even if not saved)
  useEffect(() => {
    const updatedProcedures = procedure.procedures.map((p, i) =>
      i === index ? { ...p, cost: editedCost, status } : p
    )
    setGetUpdatedProcedures(updatedProcedures)
  }, [editedCost, status]) // runs whenever cost or status changes

  const handleSave = () => {
    if (status === "PENDING") {
      Swal.fire({
        title: "Set the value",
        text: "Select the status of the procedure",
        icon: "warning",
      })
      return
    }

    const updatedProcedures = procedure.procedures.map((p, i) =>
      i === index ? { ...p, cost: editedCost, status } : p
    )

    // ✅ Update local + SWR data
    setGetUpdatedProcedures(updatedProcedures)
    mutate({ ...procedure, procedures: updatedProcedures }, false)

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: `${item?.procedure_name} updated successfully.`,
      timer: 1200,
      showConfirmButton: false,
    })

    setIsEditing(false)
  }

  const handleCancel = () => {
    // ✅ Reset local fields to original values from backend
    setEditedCost(item?.cost)
    setStatus(item?.status?.trim() || "PENDING")
    setIsEditing(false)
  }

  return (
    <tr className="border-b hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-gray-700">{item?.procedure_name}</td>

      <td className="px-4 py-3 text-sm font-medium text-gray-700">
        {isEditing ? (
          <input
            type="number"
            min="0"
            value={editedCost}
            onChange={(e) => setEditedCost(e.target.value)}
            className="border rounded px-2 py-1 w-24 text-sm"
          />
        ) : (
          `₱${Number(editedCost || 0).toLocaleString()}`
        )}
      </td>

      <td className="px-4 py-3 text-sm font-medium text-gray-700">
        {isEditing ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="DENIED">DENIED</option>
          </select>
        ) : (
          <span
            className={`${
              status === "APPROVED"
                ? "text-green-600"
                : status === "DENIED"
                ? "text-red-600"
                : "text-gray-500"
            } font-semibold`}
          >
            {status}
          </span>
        )}
      </td>

      <td className={`px-4 py-3 text-center ${(procedure?.client_request?.status === 3 || procedure?.client_request?.status === 4) && "hidden"}`}>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  )
}


