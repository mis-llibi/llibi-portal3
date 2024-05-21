import React, { useEffect, useState, useReducer, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import axios from '@/lib/axios'

import UtilizationTab from '@/components/Layouts/Corporate/Tabs/UtilizationTab'
import LaboratoryTab from '@/components/Layouts/Corporate/Tabs/LaboratoryTab'

import Loader from '@/components/Loader'

import Swal from 'sweetalert2'
import PatientCardDetails from '@/components/corporate/pre-approved/PatientCardDetails'
import ReservationCardDetails from '@/components/corporate/pre-approved/ReservationCardDetails'

import { useLaboratoryStore } from '@/store/useLaboratoryStore'
import { useUtulizationStore } from '@/store/useUtulizationStore'
import ShowSelectedUtilAndLab from '@/components/corporate/pre-approved/modal/ShowSelectedUtilAndLab'
import ShowSpecialInstruction from '@/components/corporate/pre-approved/modal/ShowSpecialInstruction'
import HeaderTabButton from '@/components/corporate/pre-approved/HeaderTabButton'

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
  reservation: 0,
  remainingLimit: 0,
}

import {
  MODAL_AVAILABLE,
  useModalUtilAndLabStore,
} from '@/store/useModalUtilAndLabStore'

export default function PreApprovedLoa() {
  const router = useRouter()
  const {
    employee_id,
    patient_id,
    company_id,
    hospital_class,
    hospital_id,
  } = router.query
  const [state, dispatch] = useReducer(reducer, INITIALSTATE)

  const [value, setValue] = useState(0)

  const { selectedLab, setSelectedLab } = useLaboratoryStore()
  const { selectedUtil, setSelectedUtil } = useUtulizationStore()

  const showModal = useModalUtilAndLabStore(state => state.showModal)

  const MBL = () => {
    if (Number(state.employee?.ipr) > 0) {
      return state.employee?.ipr
    }

    if (Number(state.employee?.opr) > 0) {
      return state.employee?.opr
    }

    if (Number(state.employee?.opr) > 0 && Number(state.employee?.ipr) > 0) {
      return state.employee?.opr
    }

    return 0
  }

  const remainingLimit = useMemo(() => {
    let rem = 0
    let mbl = Number(MBL())
    let reserving_amount = Number(state.employee?.reserving_amount)
    rem =
      (mbl <= 0 ? reserving_amount : mbl - reserving_amount) -
      Number(state.utilization) -
      Number(state.laboratory)

    rem =
      (mbl <= 0 ? reserving_amount : mbl - reserving_amount) -
      Number(state.utilization) -
      Number(state.laboratory)

    rem =
      (mbl <= 0 ? reserving_amount : mbl - reserving_amount) -
      Number(state.utilization) -
      Number(state.laboratory)

    rem =
      (mbl <= 0 ? reserving_amount : mbl - reserving_amount) -
      Number(state.utilization) -
      Number(state.laboratory)

    return rem
  }, [
    state.utilization,
    state.laboratory,
    state.employee?.ipr,
    state.employee?.opr,
  ])

  const getEmployee = async () => {
    try {
      const patient_ids = patient_id || employee_id
      const response = await axios.get(
        `${process.env.apiPath}/pre-approve/get-employees?employee_id=${employee_id}&patient_id=${patient_ids}&company_id=${company_id}&hospital_id=${hospital_id}`,
      )

      dispatch({
        type: REDUCER_ACTIONS.GET_EMPLOYEE,
        payload: { employee: response.data },
      })
    } catch (error) {
      // alert(error.response.data.message)

      if (error.response.status === 500) {
        Swal.fire('Ooop...', 'Something went wrong.', 'error')
        return
      }
      Swal.fire('', error.response.data.message, 'error')
      // throw new Error(error)
    }
  }

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

  const handleSelectLaboratory = async (checked, params) => {
    if (checked) {
      dispatch({
        type: REDUCER_ACTIONS.ADD_LABORATORY,
        payload: {
          laboratory: Number(hospital_class == 1 ? params.cost : params.cost2),
        },
      })

      setSelectedLab([...selectedLab, { ...params, isSelected: true }])
    } else {
      dispatch({
        type: REDUCER_ACTIONS.MINUS_LABORATORY,
        payload: {
          laboratory: Number(hospital_class == 1 ? params.cost : params.cost2),
        },
      })

      const removeUnchecked = selectedLab.filter(row => row.id !== params.id)
      setSelectedLab(removeUnchecked)
    }
  }

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
    const searched = state.employee?.laboratory?.filter(data => {
      return data.laboratory.toLowerCase().includes(search_str)
    })

    setSearchLab(searched)
  }

  useEffect(() => {
    if (employee_id) {
      getEmployee()
    }
  }, [employee_id])

  useEffect(() => {
    setSearch(state.employee?.utilization)
    setSearchLab(state.employee?.laboratory)
  }, [state.employee])

  const saveLogs = async () => {
    let data = {
      employee: state.employee,
      utilization: selectedUtil,
      laboratory: selectedLab,
      mbl_amount: Number(MBL()),
      utilization_amount: state.utilization,
      laboratory_amount: state.laboratory,
    }

    try {
      const response = await axios.post(
        `${process.env.apiPath}/pre-approve-logs`,
        data,
      )
    } catch (error) {
      throw error.response.message
    }
  }

  return (
    <>
      <Head>
        <title>LLIBI - PRE APPROVED LOA</title>
      </Head>
      <div className="md:max-w-7xl lg:max-w-fit mx-auto">
        <img
          src="https://llibi.app/images/lacson-logo.png"
          alt="LLIBI LOGO"
          width={250}
        />
        <div className="flex flex-col-reverse lg:flex-row px-3 mt-5 gap-3 font-[poppins]">
          <div className="flex-grow border border-gray-300  p-3 rounded-md">
            <div className="w-full lg:w-[60vw]">
              <Tabs
                className="mb-3"
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example">
                <Tab className="font-[poppins] text-xs" label="Utilization" />
                <Tab className="font-[poppins] text-xs" label="Laboratory" />
                <HeaderTabButton state={state} />
              </Tabs>
              <CustomTabPanel value={value} index={0}>
                <UtilizationTab
                  search={search}
                  handleSearch={handleSearch}
                  handleSelectUtilization={handleSelectUtilization}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <LaboratoryTab
                  search={searchLab}
                  handleSearch={handleSearchLab}
                  handleSelectLaboratory={handleSelectLaboratory}
                />
              </CustomTabPanel>
            </div>
          </div>
          <div className="w-full lg:w-[400px] border border-gray-300 p-3 rounded-md">
            {!state.employee ? (
              <div>Loading...</div>
            ) : (
              <div>
                <PatientCardDetails employee={state.employee} />
                <ReservationCardDetails
                  state={state}
                  remainingLimit={remainingLimit}
                  mbl={MBL()}
                  saveLogs={saveLogs}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal === MODAL_AVAILABLE.viewSelected && <ShowSelectedUtilAndLab />}
      {showModal === MODAL_AVAILABLE.viewSpecialInstruction && (
        <ShowSpecialInstruction />
      )}

      {!state.employee && <Loader loading={true} />}
    </>
  )
}

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
