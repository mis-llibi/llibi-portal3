import React from 'react'
import { useForm } from 'react-hook-form'

export default function HrForms() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      company: '',
      patientFirstName: '',
      patientLastName: '',
      patientType: '',
      chiefComplaint: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Submitted data:', data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-6 py-6 md:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              HR Patient Form
            </h1>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Enter the patient details below.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 md:px-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Enter company name"
                  {...register('company', {
                    required: 'Company is required',
                  })}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="patientFirstName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Patient First Name
                </label>
                <input
                  id="patientFirstName"
                  type="text"
                  placeholder="Enter first name"
                  {...register('patientFirstName', {
                    required: 'Patient first name is required',
                  })}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                {errors.patientFirstName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.patientFirstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="patientLastName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Patient Last Name
                </label>
                <input
                  id="patientLastName"
                  type="text"
                  placeholder="Enter last name"
                  {...register('patientLastName', {
                    required: 'Patient last name is required',
                  })}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                {errors.patientLastName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.patientLastName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="patientType"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Patient Is Dependent
                </label>
                <select
                  id="patientType"
                  {...register('patientType', {
                    required: 'Patient type is required',
                  })}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="">Select patient type</option>
                  <option value="Dependent">Dependent</option>
                  <option value="Principal">Principal</option>
                </select>
                {errors.patientType && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.patientType.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="chiefComplaint"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Chief Complaint
                </label>
                <textarea
                  id="chiefComplaint"
                  rows={5}
                  placeholder="Enter chief complaint"
                  {...register('chiefComplaint', {
                    required: 'Chief complaint is required',
                  })}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                {errors.chiefComplaint && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.chiefComplaint.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
