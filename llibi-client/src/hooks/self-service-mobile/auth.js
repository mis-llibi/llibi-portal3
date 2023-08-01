import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { api } from '@/../next.config'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR(`${api}/api/user`, () =>
        axios
            .get(`${api}/api/user`)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
                //router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get(`${api}/sanctum/csrf-cookie`)

    const login = async ({ setErrors, setStatus, setLoading, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post(`${api}/login`, props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(Object.values(error.response.data.errors).flat())
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const [logoutLoad, setLogoutLoad] = useState(false)
    const logout = async () => {
        setLogoutLoad(true)
        if (!error) {
            await axios
                .post(`${api}/logout`)
                .then(() => mutate())
                .finally(() => {
                    setLogoutLoad(false)
                })
        }
        window.location.pathname = '/self-service-mobile'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        login,
        logout,
        logoutLoad,
    }
}
