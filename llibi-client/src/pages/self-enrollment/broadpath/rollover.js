import React, { useState, useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'

import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

const rollover = () => {
  const router = useRouter()

  const { client, updateClientInfoRollover } = ManageClientInfo({
    id: router.query.id,
    company: 'BROADPATH',
  })

  const depsForm = {
    mId: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    gender: '',
    civil_status: '',
    relation: '',
    birth_date: '',
    attachment: '',
  }

  const { handleSubmit } = useForm({
    defaultValues: {
      deps: [depsForm],
    },
  })

  const [page, setPage] = useState(false)
  const [bill, setBill] = useState(0)

  useEffect(() => {
    if (client?.principal[0]?.form_locked == 2) {
      window.location.pathname = `/self-enrollment/broadpath/form-locked`
    } else {
      switch (client?.principal[0]?.mbl) {
        case 200000:
          setBill(19807.2)
          break
        case 150000:
          setBill(19398.4)
          break
      }

      if (client?.principal.length > 0)
        if (client?.principal[0]?.status == 1) {
          window.location.pathname = `/self-enrollment/broadpath/`
        } else if (client?.principal[0]?.status == 2) {
          window.location.pathname = `/self-enrollment/broadpath/dependents/`
        } else {
          setPage(true)
        }
    }
  }, [client?.principal])

  const [loading, setLoading] = useState(false)

  const onRollover = () => {
    let tr = ''
    let num, bil, com
    client?.dependent.map((item, i) => {
      switch (i) {
        case 0:
          num = i + 1 + 'st'
          bil = '20%'
          com = bill * 0.2
          break
        case 1:
          num = i + 1 + 'nd'
          bil = '20%'
          com = bill * 0.2
          break
        case 2:
          num = i + 1 + 'rd'
          bil = '100%'
          com = bill * 1
          break
        default:
          num = i + 1 + 'th'
          bil = '100%'
          com = bill * 1
          break
      }

      return (tr += `
        <tr>
          <td style="background-color:#fafafa;text-align:left;">
            ${item?.last_name.toUpperCase()}, ${item?.first_name.toUpperCase()}
          </td>
          <td style="background-color:#fafafa;text-align:left;">
            ${item?.birth_date}
          </td>
          <td style="background-color:#fafafa;text-align:left;">
            ${item?.relation}
          </td>
      </tr>
      <tr>
        <td colspan="3" style="background-color:#eeeeee;padding:2px;text-align:left;font-size:14px;">
        ${num} Dependent: ${bil} of ₱ ${bill?.toLocaleString(
        'en',
        2,
      )} = ₱ ${com?.toLocaleString('en', 2)}
        </td>
      </tr>
      <tr>
        <td colspan="3" style="background-color:#fafafa;padding:2px;"></td>
      </tr>
      <tr>
        <td colspan="3" style="background-color:#fafafa;padding:2px;"></td>
      </tr>`)
    })

    const computation = client?.dependent?.map((item, i) => {
      switch (i) {
        case 0:
          com = bill * 0.2
          break
        case 1:
          com = bill * 0.2
          break
        case 2:
          com = bill * 1
          break
        default:
          com = bill * 1
          break
      }

      return {
        num,
        bil,
        com,
      }
    })

    const annual = computation.reduce(function (s, a) {
      return s + a.com
    }, 0)

    const monthly = annual / 12

    let html =
      '<div style="padding:4px;">You have no included dependent/s</div>'
    if (client?.dependent?.length > 0) {
      html = `<table style="background-color:#333;width:100%;">
                <thead>
                  <tr>
                    <th style="color:#fafafa;text-align:left;">Name</th>
                    <th style="color:#fafafa;text-align:left;">Birth Date</th>
                    <th style="color:#fafafa;text-align:left;">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  ${tr}
                  <tr>
                    <td style="background-color:#F3F0C4;font-size:25px;">
                      Annual: 
                    </td>
                    <td  colspan="2" style="background-color:#F3F0C4;font-size:25px;text-align:left;">₱ <b>${annual?.toLocaleString(
                      'en',
                      2,
                    )}</b></td>
                  </tr>
                  <tr>
                    <td style="background-color:#F3F0C4;font-size:25px;">
                      Monthly: 
                    </td>
                    <td colspan="2" style="background-color:#F3F0C4;font-size:25px;text-align:left;">₱ <b>${monthly?.toLocaleString(
                      'en',
                      2,
                    )}</b></td>
                  </tr>
                </tbody>
              </table>`
    }

    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 1,
    }

    Swal.fire({
      title: 'Rollover Information and Dependent/s',
      width: 700,
      html: html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue rollover',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateClientInfoRollover({ ...ndata, setLoading })
      }
    })
  }

  const onUpdateExisting = () => {
    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 2,
    }

    Swal.fire({
      title: 'Are you sure?',
      text:
        'Thank you for your submission. Once you click Yes, you will not be able to make any further changes and your enrollment will be processed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update existing dependent/s',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateClientInfoRollover({ ...ndata, setLoading })
      }
    })
  }

  const onReset = () => {
    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 3,
    }

    Swal.fire({
      title: 'Are you sure?',
      text:
        'Thank you for your submission. Once you click Yes, you will not be able to make any further changes and your enrollment will be processed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset dependent/s',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateClientInfoRollover({ ...ndata, setLoading })
      }
    })
  }

  //privacy notice
  useEffect(() => {
    if (page)
      Swal.fire({
        title: '<strong><u>PRIVACY NOTICE</u></strong>',
        icon: 'info',
        html:
          '<div style="text-align:left;font-size:16px;">LLIBI collects your personal data (i.e. email address, mobile number) for the purpose of allowing you to enroll your dependents using our enrollment portal. For more information on our privacy policy, you may visit <a target="_blank" href="https://www.llibi.com/data-privacy" style="color:blue;">www.llibi.com/data-privacy</a> or email us at <a href="mailto:privacy@llibi.com" style="color:blue;">privacy@llibi.com</a>.</div>',
      })
  }, [page])

  return (
    <>
      <GuestLayout title="Broadpath Self-Enrollment Portal">
        <div className="pb-2 lg:pb-0 lg:pr-2">
          {/* header */}
          <div className="flex gap-2">
            <div>
              {/* client logo */}
              <img
                src={`${basePath}/self-enrollment/broadpath/logo.png`}
                width={150}
              />
            </div>
            <div className="flex-grow flex place-items-center">
              <h1 className="text-xl font-bold text-gray-800">
                <span className="text-blue-500">Dependent</span> Renewal Portal
              </h1>
            </div>
          </div>

          {/* employee information */}
          <div className="mt-3 p-4 rounded-md bg-gray-100">
            <div className="mb-2 text-gray-900 font-bold mb-2 lg:flex gap-2">
              {/* header employee name */}
              <div className="flex gap-2">
                <div className="flex place-items-center">
                  <h1>Employee Information</h1>
                </div>
                <div className="ml-3 flex place-items-center">
                  <p className="text-sm md:text-lg text-green-900 capitalize">
                    {client
                      ? client?.principal[0]?.first_name +
                        ' ' +
                        client?.principal[0]?.last_name
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {/* gender and relation select */}
              <div className="-mt-2 ml-6">
                <div className="mt-4 md:grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Gender</p>
                    <p className="ml-2 font-bold">
                      {client?.principal[0]?.gender || 'N/A'}
                    </p>
                  </div>
                  <div className="pr-2 flex md:flex-none lg:flex text-sm">
                    <p className="font-normal">Civil Status</p>
                    <p className="ml-2 font-bold">
                      {client?.principal[0]?.civil_status || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* grid personal data */}
            <div className="grid md:grid-cols-2 lg:flex gap-2 text-sm truncate">
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Date of Birth</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.birth_date || 'N/A'}
                </p>
              </div>
              <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Hire Date</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.hire_date || 'N/A'}
                </p>
              </div>
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>OID</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.member_id || 'N/A'}
                </p>
              </div>
              <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Room & Board</p>
                <p className="ml-2 font-bold text-red-400">
                  {client?.principal[0]?.room_and_board?.toLocaleString(
                    'en-US',
                  ) || 'N/A'}
                </p>
              </div>
              <div className="pr-2 flex md:flex-none lg:flex">
                <p>MBL</p>
                <p className="ml-2 font-bold text-red-400">
                  ₱{' '}
                  {client?.principal[0]?.mbl?.toLocaleString('en-US') || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* instructions */}
          <div className="mt-3 bg-gray-100 p-4 rounded-lg">
            <div className="mb-3">
              <h1 className="font-bold text-xl">Instructions</h1>
            </div>
            <div className="mb-3 border-b-2 border-gray-400 border-dotted pb-3">
              <h1 className="font-bold mb-2 text-green-400">Roll Over:</h1>
              <p className="text-sm">
                Allows you to enroll existing dependents. Your enrollment will
                have no changes in your information as well as that of your
                dependent/s.
              </p>
            </div>
            <div className="mb-3 border-b-2 border-gray-400 border-dotted pb-3">
              <h1 className="font-bold mb-2 text-blue-400">
                Updating Existing:
              </h1>
              <p className="text-sm">
                Allows you to add, delete and/or change enrolled dependent/s and
                dependent/s’ information. You may be required to submit
                supporting documents.
              </p>
            </div>
            <div className="mb-3 border-b-2 border-gray-400 border-dotted pb-3">
              <h1 className="font-bold mb-2 text-red-400">Reset:</h1>
              <p className="text-sm">
                Allows you to change your enrollment as well as that of your
                dependent/s due to change in civil status. You may be required
                to submit supporting documents.
              </p>
            </div>
            <div className="mb-3">
              <p className="font-bold italic text-red-500 text-center text-xs">
                Please choose your enrollment option carefully. Once chosen, you
                can no longer change enrollment option.
              </p>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 grid md:grid-cols-3 gap-0.5">
            <Button
              onClick={handleSubmit(onRollover)}
              className="p-3 bg-green-400 hover:bg-green-700 focus:bg-green-900 active:bg-green-500 ring-green-200">
              Roll Over
            </Button>
            <Button
              onClick={handleSubmit(onUpdateExisting)}
              className="p-3  bg-blue-400 hover:bg-blue-700 focus:bg-blue-900 active:bg-blue-500 ring-blue-200">
              Update Existing
            </Button>
            <Button
              onClick={handleSubmit(onReset)}
              className="p-3 bg-red-400 hover:bg-red-700 focus:bg-red-900 active:bg-red-500 ring-red-200">
              Reset
            </Button>
          </div>
        </div>
        <Loader loading={loading} />
      </GuestLayout>
    </>
  )
}

export default rollover
