import useSWR from 'swr'
import axios from '@/lib/axios'

export const useMasterlist = ({ search = '' }) => {
  const { data: masterlist, mutate } = useSWR(
    `/api/search-masterlist?search=${search}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/search-masterlist?search=${search}`,
        )

        return response.data
      } catch (error) {
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  )

  return { masterlist }
}
export const useBirthdateSearch = async (search, setErrors) => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  setErrors([])
  await csrf()

  try {
    const response = await axios.post('/api/search-birthdate-by-name', search)
    return response.data
  } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(Object.values(error.response.data.errors).flat())
    } else {
      setErrors(['An unexpected error occurred.'])
    }

    return null
  }
}

/**
 * Search for member/dependent details with optional search parameter
 * @param {string} search - Optional search query (case-insensitive)
 * @param {Function} setErrors - Error handler function
 * @returns {Promise<Array>} Array of member/dependent objects
 *
 * Response types:
 * - Member: { id, member_id, first_name, last_name, middle_name, suffix, birth_date,
 *             gender, civil_status, contact_number, email, company_name, incep_from,
 *             incep_to, is_dependent: 0 }
 * - Dependent: { id, member_id, first_name, last_name, middle_name, suffix, birth_date,
 *                gender, relation, principal_member_id, principal_first_name,
 *                principal_last_name, is_dependent: 1 }
 */
export const searchClientErrorLogs = async (search, setErrors) => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  setErrors([])
  await csrf()

  try {
    const response = await axios.post('/api/search-client-error-logs', search)
    return response.data
  } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(Object.values(error.response.data.errors).flat())
    } else {
      setErrors(['Failed to load member details.'])
    }
    return null
  }
}

const getFilenameFromContentDisposition = contentDisposition => {
  if (!contentDisposition) return null

  // Examples:
  // content-disposition: attachment; filename="file.xlsx"
  // content-disposition: attachment; filename*=UTF-8''file.xlsx
  const filenameStarMatch = /filename\*=UTF-8''([^;\n]+)/i.exec(
    contentDisposition,
  )
  if (filenameStarMatch?.[1]) {
    try {
      return decodeURIComponent(filenameStarMatch[1].replace(/"/g, ''))
    } catch {
      return filenameStarMatch[1].replace(/"/g, '')
    }
  }

  const filenameMatch = /filename=([^;\n]+)/i.exec(contentDisposition)
  if (filenameMatch?.[1]) return filenameMatch[1].replace(/"/g, '').trim()

  return null
}

export const exportClientErrorLogsExcel = async (search, setErrors) => {
  const csrf = () => axios.get('/sanctum/csrf-cookie')

  setErrors([])
  await csrf()

  try {
    const response = await axios.post(
      '/api/search-client-error-logs',
      { ...search, export: true },
      { responseType: 'blob' },
    )

    const filename =
      getFilenameFromContentDisposition(
        response.headers?.['content-disposition'],
      ) || 'client-error-logs.xlsx'

    return { blob: response.data, filename }
  } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(Object.values(error.response.data.errors).flat())
    } else {
      setErrors(['Failed to download Excel export.'])
    }

    return null
  }
}
