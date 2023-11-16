import React, { useEffect, useState, useReducer } from 'react'
import { useRouter } from 'next/router'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

import axios from '@/lib/axios'
import useSWR from 'swr'

import DisplaySelectedUtilization from '@/components/Layouts/Corporate/DisplaySelectedUtilization'
import DisplaySelectedLaboratory from '@/components/Layouts/Corporate/DisplaySelectedLaboratory'
import UtilizationTab from '@/components/Layouts/Corporate/Tabs/UtilizationTab'
import LaboratoryTab from '@/components/Layouts/Corporate/Tabs/LaboratoryTab'

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
  GET_EMPLOYEE: 'getEmployee',
  ADD_UTILIZATION: 'addUtilization',
  MINUS_UTILIZATION: 'minusUtilization',
  ADD_LABORATORY: 'addLaboratory',
  MINUS_LABORATORY: 'minusLaboratory',
  SEARCH_UTILIZATION: 'searchUtilization',
  RESET_UTILIZATION: 'resetUtilization',
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
    case REDUCER_ACTIONS.RESET_UTILIZATION:
      return {
        ...state,
        utilization: 0,
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
    case REDUCER_ACTIONS.SEARCH_UTILIZATION:
      return {
        ...state,
        employee: {
          ...state.employee,
          utilization: action.payload.searchUtilization,
        },
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
  reservation: 4500,
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
        Number(state.reservation) -
        Number(state.utilization) -
        Number(state.laboratory)
      : Number(state.employee?.ipr) -
        Number(state.reservation) -
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

      setSelectedUtil([...selectedUtil, { ...params, isSelected: true }])
    } else {
      dispatch({
        type: REDUCER_ACTIONS.MINUS_UTILIZATION,
        payload: { utilization: Number(params.eligible) },
      })

      const removeUnchecked = selectedUtil.filter(row => row.id !== params.id)
      setSelectedUtil(removeUnchecked)
    }
  }

  const handleSelectUtilizationAll = async e => {
    if (e.target.checked) {
      const totalEligible = state.employee?.utilization?.reduce(
        (n, { eligible }) => Number(n) + Number(eligible),
        0,
      )
      dispatch({
        type: REDUCER_ACTIONS.ADD_UTILIZATION,
        payload: { utilization: Number(totalEligible) },
      })

      const dump_arr = []
      const dump = {
        ...state.employee?.utilization.map(item => {
          return dump_arr.push({ ...item, isSelected: true })
        }),
      }
      setSelectedUtil(dump_arr)
      // console.log(dump_arr)
    } else {
      dispatch({
        type: REDUCER_ACTIONS.RESET_UTILIZATION,
        payload: { utilization: Number(0) },
      })

      setSelectedUtil([])
    }
  }

  const handleSelectLaboratory = async (e, params) => {
    if (e.target.checked) {
      dispatch({
        type: REDUCER_ACTIONS.ADD_LABORATORY,
        payload: { laboratory: Number(params.cost) },
      })

      setSelectedLab([...selectedLab, { ...params, isSelected: true }])
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

  const [search, setSearch] = useState()
  const handleSearch = e => {
    let search_str = e.target.value.toLowerCase()
    const searched = state.employee?.utilization?.filter(data => {
      return (
        data.diagname.toLowerCase().includes(search_str) ||
        data.eligible.toLowerCase().includes(search_str) ||
        data.claimnumb.toLowerCase().includes(search_str)
      )
    })

    setSearch(searched)
  }

  const [searchLab, setSearchLab] = useState()
  const handleSearchLab = e => {
    let search_str = e.target.value.toLowerCase()
    const searched = laboratory?.filter(data => {
      return data.procedure.toLowerCase().includes(search_str)
    })

    setSearchLab(searched)
  }

  useEffect(() => {
    setSearch(state.employee?.utilization)
    setSearchLab(laboratory)
  }, [state.employee])

  return (
    <div className="px-10 mx-auto">
      <img
        src="https://llibi.app/company-images/llibi_logo.png"
        alt="LLIBI LOGO"
        width={250}
      />
      <div className="flex flex-col-reverse lg:flex-row px-3 mt-5 gap-3">
        <div className="flex-grow border p-3 rounded-md shadow-md">
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
              <UtilizationTab
                search={search}
                handleSearch={handleSearch}
                handleSelectUtilizationAll={handleSelectUtilizationAll}
                handleSelectUtilization={handleSelectUtilization}
                selectedUtil={selectedUtil}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {/* <table className="w-full">
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
                      <tr key={lab.id}>
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
              </table> */}
              <LaboratoryTab
                search={searchLab}
                handleSearch={handleSearchLab}
                // handleSelectUtilizationAll={handleSelectUtilizationAll}
                handleSelectLaboratory={handleSelectLaboratory}
                selectedLab={selectedLab}
              />
            </CustomTabPanel>
          </div>
        </div>
        <div className="w-full lg:w-[400px] border p-3 rounded-md shadow-md">
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
                <thead>
                  <tr>
                    <td>MBL</td>
                    <td className="text-right">
                      {Number(state.employee?.opr) > 0 &&
                        formatter.format(state.employee?.opr)}

                      {Number(state.employee?.ipr) > 0 &&
                        Number(state.employee?.opr) === 0 &&
                        formatter.format(state.employee?.opr)}

                      {Number(state.employee?.ipr) === 0 &&
                        Number(state.employee?.opr) === 0 &&
                        formatter.format(state.employee?.opr)}
                    </td>
                  </tr>
                  <tr>
                    <td>Reservation</td>
                    <td className="text-right">
                      {formatter.format(state.reservation)}
                    </td>
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
                </thead>
              </table>
              <br />
              <hr />
              <table className="w-full">
                <thead>
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
                </thead>
              </table>
            </div>
          )}
        </div>
      </div>

      <DisplaySelectedUtilization utilization={selectedUtil} />
      <DisplaySelectedLaboratory laboratory={selectedLab} />
    </div>
  )
}
