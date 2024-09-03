import React, { useState, useEffect } from 'react'

import GuestLayout from '@/components/Layouts/Self-enrollment/GuestLayout'

import { basePath } from '@/../next.config'
import Button from '@/components/Button'
import Loader from '@/components/Loader'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'

import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'

import Swal from 'sweetalert2'

import useAge from './components/UseAge'

import options from '@/hooks/self-enrollment/BroadpathOptions'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import ChangeAddress from './components/ChangeAddress'
const rollover = () => {
  const router = useRouter()

  const { client, updateClientInfoRollover } = ManageClientInfo({
    id: router.query.id,
    company: 'DEEL',
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
      window.location.pathname = `/self-enrollment/deel/form-locked-submitted`
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
          window.location.pathname = `/self-enrollment/deel/`
        } else if (client?.principal[0]?.status == 2) {
          window.location.pathname = `/self-enrollment/deel/dependents/`
        } else {
          setPage(true)
        }
    }
  }, [client?.principal])

  const [loading, setLoading] = useState(false)

  const onStartOver = () => {
    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 1,
    }

    Swal.fire({
      title: 'Are you sure?',
      text:
        'Once you click Yes, you will not be able to make any further changes and your enrollment will be processed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Start Over',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateClientInfoRollover({ ...ndata, setLoading })
      }
    })
  }

  const onRollover = () => {
    let tr = ''
    let num,
      bil,
      com,
      count = 0

    client?.dependent.map((item, i) => {
      if (options.ageEval(useAge(item?.birth_date), item?.relation)) {
        count++
      }

      switch (count) {
        case 1:
          num = '1st'
          bil = '20%'
          com = bill * 0.2
          break
        case 2:
          num = '2nd'
          bil = '20%'
          com = bill * 0.2
          break
        case 3:
          num = '3rd'
          bil = '100%'
          com = bill * 1
          break
        default:
          num = count + 1 + 'th'
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
            ${useAge(item?.birth_date)}
          </td>
          <td style="background-color:#fafafa;text-align:left;">
            ${item?.relation}
          </td>
          <td style="background-color:#fafafa;text-align:left;">
            ${
              options.ageEval(useAge(item?.birth_date), item?.relation)
                ? '<div style="background-color:#53E73C;padding:2px;font-size:12px;">Retain</div>'
                : '<div style="background-color:#E74C3C;padding:2px;font-size:12px;color:#EEEEEE;">Overage</div>'
            }
          </td>
        </tr>
      ${
        options.ageEval(useAge(item?.birth_date), item?.relation)
          ? `<tr>
            <td colspan="5" style="background-color:#eeeeee;padding:2px;text-align:left;font-size:14px;">
            ${num} Dependent: ${bil} of ₱ ${bill?.toLocaleString(
              'en',
              2,
            )} = ₱ ${com?.toLocaleString('en', 2)}
            </td>
          </tr>`
          : `<tr>
          <td colspan="5" style="background-color:#eeeeee;padding:2px;text-align:left;font-size:13px;color:#E7513C;">
            This dependent will be excluded in the renewal due to overage. (Premium already excluded in the computation)
          </td>
        </tr>`
      }
      <tr>
        <td colspan="5" style="background-color:#fafafa;padding:2px;"></td>
      </tr>
      <tr>
        <td colspan="5" style="background-color:#fafafa;padding:2px;"></td>
      </tr>`)
    })

    /* const computation = client?.dependent
      ?.filter(item => {
        // Make sure item, item.birth_date, and item.relation are defined
        if (!item || !item.birth_date || !item.relation) {
          return false
        }
        const age = useAge(item.birth_date) // Assuming useAge returns the age correctly
        return options.ageEval(age, item.relation)
      })
      ?.map((item, i) => {
        let nCom

        switch (i) {
          case 0:
            nCom = bill * 0.2
            break
          case 1:
            nCom = bill * 0.2
            break
          case 2:
            nCom = bill * 1
            break
          default:
            nCom = bill * 1
            break
        }

        return { nCom }
      })

    const annual = computation.reduce(function (s, a) {
      return s + a.nCom
    }, 0)

    const monthly = annual / 52 */

    const info = `<table style="background-color:#fafafa;width:100%;margin-bottom:10px;">
                    <thead>
                      <tr>
                        <th colspan="2" style="font-size:1.5em;color:#2980B9;">
                        ${
                          client
                            ? client?.principal[0]?.first_name +
                              ' ' +
                              client?.principal[0]?.last_name
                            : 'N/A'
                        }
                        <div style="margin-bottom:10px;"></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr>
                          <td style="text-align:left;">Gender: 
                            <b>${client?.principal[0]?.gender || 'N/A'}</b>
                          </td>
                          <td style="text-align:left;">Civil Status: 
                            <b>${
                              client?.principal[0]?.civil_status || 'N/A'
                            }</b>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:left;">Birth Date: 
                            <b>${
                              client?.principal[0]?.birth_date || 'N/A'
                            }</b> / 
                            Age: 
                            <b>${
                              useAge(client?.principal[0]?.birth_date) || 'N/A'
                            }</b>
                          </td>
                          <td style="text-align:left;">Hire Date: 
                            <b>${client?.principal[0]?.hire_date || 'N/A'}</b>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:left;">Member ID: 
                            <b>${client?.principal[0]?.member_id || 'N/A'}</b>
                          </td>
                          <td style="text-align:left;">Room & Board: 
                            <b>${
                              client?.principal[0]?.room_and_board || 'N/A'
                            }</b>
                          </td>
                        </tr>
                    </tbody>
                  </table>`

    let html =
      '<div style="padding:4px;color:#E74C3C;background-color:#eeeeee;">You have no included dependent/s</div>'

    if (client?.dependent?.length > 0) {
      html = `<table style="background-color:#333;width:100%;">
                <thead>
                  <tr>
                    <th style="color:#fafafa;text-align:left;">Name</th>
                    <th style="color:#fafafa;text-align:left;">Birth Date</th>
                    <th style="color:#fafafa;text-align:left;">Age</th>
                    <th style="color:#fafafa;text-align:left;">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  ${tr}
                </tbody>
              </table>`
    }

    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 2,
    }

    Swal.fire({
      title: 'Rollover / retain existing principal and dependent information',
      width: 800,
      html: info + html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, retain dependent/s',
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
      rollover: 3,
    }

    Swal.fire({
      title: 'Are you sure?',
      text:
        'Once you click Yes, you will not be able to make any further changes and your enrollment will be processed.',
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

  const onOptOut = () => {
    const ndata = {
      id: client?.principal[0]?.id,
      member_id: client?.principal[0]?.member_id,
      rollover: 4,
    }

    Swal.fire({
      title: 'Are you sure?',
      text:
        'Once you click Yes, you will not be able to make any further changes and your enrollment will be processed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Opt Out',
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true)
        updateClientInfoRollover({ ...ndata, setLoading })
      }
    })
  }

  const { show, body, setBody, toggle } = ModalControl()

  const onView = () => {
    setBody({
      title: <b className="text-blue-900">Update my card delivery address</b>,
      content: <ChangeAddress props={client?.principal[0]?.contact} />,
      modalOuterContainer: 'w-full md:w-6/12 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
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
      <GuestLayout title="Deel Self-Enrollment Portal">
        <div className="pb-2 lg:pb-0 lg:pr-2">
          {/* header */}
          <div className="flex gap-2">
            <div>
              {/* client logo */}
              <img
                src={`${basePath}/self-enrollment/deel/logo.jpg`}
                width={100}
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
              <div className="md:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Age</p>
                <p className="ml-2 font-bold">
                  {useAge(client?.principal[0]?.birth_date) || 'N/A'}
                </p>
              </div>
              <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
                <p>Hire Date</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.hire_date || 'N/A'}
                </p>
              </div>
              <div className="pr-2 flex md:flex-none lg:flex">
                <p>Member ID</p>
                <p className="ml-2 font-bold">
                  {client?.principal[0]?.member_id || 'N/A'}
                </p>
              </div>
              {/*  <div className="lg:border-r-2 border-gray-300 pr-2 flex md:flex-none lg:flex">
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
              </div> */}
            </div>
          </div>

          {/* change address */}
          <div className="mt-3 p-1">
            <Button
              onClick={handleSubmit(onView)}
              className="p-3 bg-orange-400 hover:bg-orange-700 focus:bg-orange-900 active:bg-orange-500 ring-orange-200">
              Update my card delivery address
            </Button>
          </div>

          {/* instructions */}
          <div className="mt-3 bg-gray-100 p-4 rounded-lg">
            <div className="mb-3">
              <h1 className="font-bold text-xl">Instructions</h1>
            </div>
            <div
              onClick={handleSubmit(onStartOver)}
              className="mb-3 border-b hover:border-2 border-gray-400 hover:border-dotted py-2 hover:shadow-xs hover:pl-2 hover:rounded-md cursor-pointer hover:bg-cyan-50 transition duration-500 delay-200">
              <h1 className="font-bold mb-2 text-cyan-400">
                New / Start Over:
              </h1>
              <p className="text-sm">
                Allows you to enroll yourself and your dependents. You may be
                required to submit supporting documents.
              </p>
            </div>
            <div
              onClick={handleSubmit(onRollover)}
              className="mb-3 border-b hover:border-2 border-gray-400 hover:border-dotted py-2 hover:shadow-xs hover:pl-2 hover:rounded-md cursor-pointer hover:bg-green-50 transition duration-500 delay-200">
              <h1 className="font-bold mb-2 text-green-400">
                Roll Over / Retain Dependent/s:
              </h1>
              <p className="text-sm">
                Allows you to retain and re-enroll your existing dependents
                based on your existing enrollment information.
              </p>
            </div>
            <div
              onClick={handleSubmit(onUpdateExisting)}
              className="mb-3 border-b hover:border-2 border-gray-400 hover:border-dotted py-2 hover:shadow-xs hover:pl-2 hover:rounded-md cursor-pointer hover:bg-blue-50 transition duration-500 delay-200">
              <h1 className="font-bold mb-2 text-blue-400">
                Updating Existing (Add/Delete Dependent/s):
              </h1>
              <p className="text-sm">
                Allows you to update civil status, add, delete and/or change
                enrolled dependent/s and dependent/s’ information. You may be
                required to submit supporting documents.
              </p>
            </div>

            <div
              onClick={handleSubmit(onOptOut)}
              className="mb-3 border-b hover:border-2 border-gray-400 hover:border-dotted py-2 hover:shadow-xs hover:pl-2 hover:rounded-md cursor-pointer hover:bg-red-50 transition duration-500 delay-200">
              <h1 className="font-bold mb-2 text-red-400">Opt Out:</h1>
              <p className="text-sm">
                You and your dependent/s will not be enrolled.
              </p>
            </div>
            {/* 
            <div className="mb-3 border-b-2 border-gray-400 border-dotted pb-3">
              <h1 className="font-bold mb-2 text-red-400">Reset:</h1>
              <p className="text-sm">
                Allows you to change your enrollment as well as that of your
                dependent/s due to change in civil status. You may be required
                to submit supporting documents.
              </p>
            </div>
            */}
            <div className="mb-3">
              <p className="font-bold italic text-red-500 text-center text-xs">
                Please choose your enrollment option carefully. Once chosen, you
                can no longer change enrollment option.
              </p>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 grid md:grid-cols-2 gap-0.5">
            {/* <Button
              onClick={handleSubmit(onRollover)}
              className="p-3 bg-green-400 hover:bg-green-700 focus:bg-green-900 active:bg-green-500 ring-green-200">
              Roll Over / Retain Dependent/s
            </Button>
            <Button
              onClick={handleSubmit(onUpdateExisting)}
              className="p-3  bg-blue-400 hover:bg-blue-700 focus:bg-blue-900 active:bg-blue-500 ring-blue-200">
              Update Existing (Add/Delete Dependent/s)
            </Button> */}
            {/* <Button
              onClick={handleSubmit(onReset)}
              className="p-3 bg-red-400 hover:bg-red-700 focus:bg-red-900 active:bg-red-500 ring-red-200">
              Reset
            </Button> */}
          </div>
        </div>

        <Modal className={'hidden'} show={show} body={body} toggle={toggle} />

        <Loader loading={loading} />
      </GuestLayout>
    </>
  )
}

export default rollover
