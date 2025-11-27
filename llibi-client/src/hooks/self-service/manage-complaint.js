import useSWR from 'swr'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useManageComplaint = ({ status, page = 1, search = "" }) => {
    const key = `${env.apiPath}/self-service/get-complaints/${status || 3}?page=${page}&search=${search}`

    const { data: complaints, mutate, error } = useSWR(
        key,
        () =>
            axios.get(key).then(res => res.data),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: true,
            refreshInterval: 10000,
        }
    )

    const csrf = () => axios.get(`sanctum/csrf-cookie`)

    const approveStatus = async({...props}) => {
        await csrf()

        axios.put(`${env.apiPath}/self-service/approve-complaint`, props)
        .then(res => {
            if(res.status == 200){
                Swal.fire({
                    title: "Success",
                    text: "Approve Status Successfully",
                    icon:"success"
                })
                mutate()
            }
        })
        .catch(err => {
            if(err){
                Swal.fire({
                    title: "Failed",
                    text: "Approve Status Failed",
                    icon:"error"
                })
            }
        })


    }

    const deleteStatus = async({...props}) => {
        await csrf()

        axios.delete(`${env.apiPath}/self-service/delete-complaint`, {
            params: props
        })
        .then(res => {
            if(res.status == 200){
                Swal.fire({
                    title: "Success",
                    text: "Delete Complaint Successfully",
                    icon:"success"
                })
                mutate()
            }
        })
        .catch(err => {
            if(err){
                Swal.fire({
                    title: "Failed",
                    text: "Delete Complaint Failed",
                    icon:"error"
                })
            }
        })
    }

    const editComplaint = async({...props}) => {
        await csrf()


        axios.put(`${env.apiPath}/self-service/edit-complaint`, props)
            .then(res => {
                if(res.status == 200){
                    Swal.fire({
                        title: "Success",
                        text: "Edit Complaint Successfully",
                        icon: "success"
                    })
                    mutate()
                }
            })
            .catch(err => {
                if(err){
                    Swal.fire({
                        title: "Failed",
                        text: "Update Complaint Failed",
                        icon:"error"
                    })
                }
            })
    }


  const isLoading = !complaints && !error

    return {
        complaints,
        isLoading,
        mutate,
        approveStatus,
        deleteStatus,
        editComplaint
    }
}
