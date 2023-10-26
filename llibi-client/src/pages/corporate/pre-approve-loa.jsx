import React, { useEffect, useState, useReducer } from 'react'
import { useRouter } from 'next/router'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import axios from '@/lib/axios'
import useSWR from 'swr'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && children}
    </div>
  )
}

const REDUCER_ACTIONS = {
  GET_EMPLOYEE: 'get_Employee',
  ADD_UTILIZATION: 'addUtilization',
  MINUS_UTILIZATION: 'minusUtilization',
  ADD_LABORATORY: 'addLaboratory',
  MINUS_LABORATORY: 'minusLaboratory',
}

function reducer(state, action) {
  switch (action.type) {
    case REDUCER_ACTIONS.GET_EMPLOYEE:
      return { ...state, employee: action.payload.employee }
      break
    case REDUCER_ACTIONS.ADD_UTILIZATION:
      return {
        ...state,
        utilization: state.utilization + action.payload.utilization,
      }
      break
    case REDUCER_ACTIONS.MINUS_UTILIZATION:
      return {
        ...state,
        utilization: state.utilization - action.payload.utilization,
      }
      break
    case REDUCER_ACTIONS.ADD_LABORATORY:
      return {
        ...state,
        laboratory: state.laboratory + action.payload.laboratory,
      }
      break
    case REDUCER_ACTIONS.MINUS_LABORATORY:
      return {
        ...state,
        laboratory: state.laboratory - action.payload.laboratory,
      }
      break

    default:
      return state
      break
  }
}

const INITIALSTATE = {
  employee: null,
  utilization: 0,
  laboratory: 0,
  remainingLimit: 0,
}

const laboratory = [
  {
    id: 1,
    procedure: 'X-RAY',
    cost: 700,
  },
  {
    id: 2,
    procedure: 'FSB',
    cost: 500,
  },
]

export default function PreApproveLoa() {
  const router = useRouter()
  const { employee_id } = router.query
  const [state, dispatch] = useReducer(reducer, INITIALSTATE)

  const [value, setValue] = useState(0)
  const [selectedUtil, setSelectedUtil] = useState([])
  const [selectedLab, setSelectedLab] = useState([])

  const remainingLimit =
    Number(state.employee?.opr) > 0
      ? Number(state.employee?.opr) -
        Number(state.utilization) -
        Number(state.laboratory)
      : Number(state.employee?.opr) -
        Number(state.utilization) -
        Number(state.laboratory)

  const { data: employee, isLoading, isValidating, mutate, error } = useSWR(
    employee_id
      ? `${process.env.apiPath}/pre-approve/get-employees?employee_id=${employee_id}`
      : null,
    async () => {
      const response = await axios.get(
        `${process.env.apiPath}/pre-approve/get-employees?employee_id=${employee_id}`,
      )

      dispatch({
        type: REDUCER_ACTIONS.GET_EMPLOYEE,
        payload: { employee: response.data },
      })

      return response.data
    },
    { revalidateOnFocus: false },
  )

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSelectUtilization = async (e, params) => {
    if (e.target.checked) {
      dispatch({
        type: REDUCER_ACTIONS.ADD_UTILIZATION,
        payload: { utilization: Number(params.eligible) },
      })

      setSelectedUtil([...selectedUtil, { id: params.id, isSelected: true }])
    } else {
      dispatch({
        type: REDUCER_ACTIONS.MINUS_UTILIZATION,
        payload: { utilization: Number(params.eligible) },
      })

      const removeUnchecked = selectedUtil.filter(row => row.id !== params.id)
      setSelectedUtil(removeUnchecked)
    }
  }

  const handleSelectLaboratory = async (e, params) => {
    if (e.target.checked) {
      dispatch({
        type: REDUCER_ACTIONS.ADD_LABORATORY,
        payload: { laboratory: Number(params.cost) },
      })

      setSelectedLab([...selectedLab, { id: params.id, isSelected: true }])
    } else {
      dispatch({
        type: REDUCER_ACTIONS.MINUS_LABORATORY,
        payload: { laboratory: Number(params.cost) },
      })

      const removeUnchecked = selectedLab.filter(row => row.id !== params.id)
      setSelectedLab(removeUnchecked)
    }
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  })

  return (
    <div className="px-10 mx-auto">
      <img
        src="https://llibi.app/company-images/llibi_logo.png"
        alt="LLIBI LOGO"
        width={250}
      />
      <div className="flex flex-col-reverse lg:flex-row px-3 mt-5 gap-3">
        <div className="flex-grow border p-3 rounded-md">
          <div className="w-full">
            <Tabs
              className="mb-3"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab label="Utilization" />
              <Tab label="Laboratory" />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="uppercase">
                    <th>Claim #</th>
                    <th>Claim Date</th>
                    <th>Claim Type</th>
                    <th>Diagnosis</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.employee?.utilization &&
                    state.employee?.utilization?.map((util, i) => {
                      return (
                        <tr key={i}>
                          <td>{util.claimnumb}</td>
                          <td>{util.claimdate}</td>
                          <td className="text-center">{util.claimtype}</td>
                          <td>{util.diagname}</td>
                          <td className="text-right">
                            {formatter.format(util.eligible)}
                          </td>
                          <td className="text-center">
                            <input
                              checked={selectedUtil.some(
                                row => row.id === util.id,
                              )}
                              onChange={e => handleSelectUtilization(e, util)}
                              type="checkbox"
                            />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Procedure</th>
                    <th>Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratory.map((lab, i) => {
                    return (
                      <tr>
                        <td>{lab.procedure}</td>
                        <td className="text-right">
                          {formatter.format(lab.cost)}
                        </td>
                        <td className="text-center">
                          <input
                            checked={selectedLab.some(row => row.id === lab.id)}
                            onChange={e => handleSelectLaboratory(e, lab)}
                            type="checkbox"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </CustomTabPanel>
          </div>
        </div>
        <div className="w-full lg:w-[400px] border p-3 rounded-md">
          {!employee ? (
            <div>Loading...</div>
          ) : (
            <div>
              <h4 className="font-medium">
                <span className="font-bold">Company:</span>{' '}
                <span className="">{state.employee?.companies?.name}</span>
              </h4>
              <h4 className="font-medium">
                <span className="font-bold">Employee:</span>{' '}
                <span className="">
                  {state.employee?.last}, {state.employee?.given}{' '}
                  {state.employee?.middle}.
                </span>
              </h4>
              <h4 className="font-medium">
                <span className="font-bold">Plan Type:</span>{' '}
                <span className="">
                  {state.employee?.companies?.plantype}{' '}
                  {state.employee?.companies?.sharetype}
                </span>
              </h4>
              {/* <h4 className="font-medium">Combined IPOP -Per Illness</h4> */}
              {/* <h4 className="font-medium">Shared limit - Dep</h4> */}

              <br />
              <hr />
              <br />

              <table className="w-full">
                <tr>
                  <td>MBL</td>
                  <td className="text-right">
                    {Number(state.employee?.opr) > 0 &&
                      formatter.format(state.employee?.opr)}

                    {Number(state.employee?.ipr) > 0 &&
                      Number(state.employee?.opr) === 0 &&
                      formatter.format(state.employee?.opr)}
                  </td>
                </tr>
                <tr>
                  <td>Reservation</td>
                  <td className="text-right">{formatter.format(4500.0)}</td>
                </tr>
                <tr>
                  <td>Utilization</td>
                  <td className="text-right">
                    {formatter.format(state.utilization)}
                  </td>
                </tr>
                <tr>
                  <td>Laboratory Cost</td>
                  <td className="text-right">
                    {formatter.format(state.laboratory)}
                  </td>
                </tr>
              </table>
              <br />
              <hr />
              <table className="w-full">
                <tr>
                  <td>Remaining Limit</td>
                  <td className="text-right">
                    {/* {formatter.format(
                      state.employee?.opr -
                        state.utilization -
                        state.laboratory,
                    )} */}

                    {formatter.format(remainingLimit)}
                  </td>
                </tr>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
