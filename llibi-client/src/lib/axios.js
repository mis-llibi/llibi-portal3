import Axios from 'axios'

//const isProd = process.env.NODE_ENV === 'production'
import { env } from '@/../next.config'

const axios = Axios.create({
    baseURL: env.backEndUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export default axios

/* baseURL: isProd
        ? process.env.NEXT_PROD_BACKEND_URL
        : process.env.NEXT_PUBLIC_BACKEND_URL, */
