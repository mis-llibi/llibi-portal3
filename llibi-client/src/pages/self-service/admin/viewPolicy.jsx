import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import axios from '@/lib/axios'
import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import SyncLoader from 'react-spinners/SyncLoader'
import { set } from 'react-hook-form'

export default function ViewPolicy() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState(false)
  const [companies, setCompanies] = useState([])
  const [link, setLink] = useState('')
  const [linkClicked, setLinkClicked] = useState(false)

  // get companies
  useEffect(() => {
    setContentLoading(true)
    axios
      .get('/self-service/get-companies')
      .then(res => {
        console.log(res.data)
        setCompanies(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setContentLoading(false)
      })
  }, [])

  const filteredCompanies =
    search.length > 0
      ? companies.filter(company =>
          company.name.toLowerCase().includes(search.toLowerCase()),
        )
      : []

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const handleShowModalViewPolicyIframe = () => setBody(modalViewPolicyIframe)

  const modalViewPolicyIframe = () => {
    setBody({
        title: 'View Policy',
        content: (
            <div className="flex flex-col justify-center lg:w-full md:w-full sm:w-full lg:h-[32rem] md:h-96 sm:h-96">
                {link.length > 0 && (
                    <iframe
                    src={link}
                    height="100%"
                    title="View Policy"
                    className='lg:w-full md:w-full sm:w-full'
                    ></iframe>
                )}
            </div>
        ),
        noClose: false,
        modalOuterContainer: 'w-2/3',
        modalContainer: 'rounded-lg',
        modalBody: 'h-full',
        })
        toggle()
  }

  useEffect(() => {
    if (link.length > 0 && linkClicked) {
      handleShowModalViewPolicyIframe()
      setLinkClicked(false)
    }
  }, [linkClicked])

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '20px',
        }}>
        {contentLoading ? (
          <SyncLoader color="#0EB0FB" loading={contentLoading} size={10} />
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                padding: '10px',
              }}>
              <input
                type="text"
                placeholder="Input Company Code"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '30px',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #0EB0FB',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                padding: '10px',
              }}>
              {loading ? (
                <SyncLoader color="#0EB0FB" loading={loading} size={10} />
              ) : (
                <>
                  <table className="table table-auto w-full">
                    <thead className="text-center border-b-2 border-b-blue-gray-800">
                      {filteredCompanies.length === 0 ? null : (
                        <tr>
                          <th>Company Name</th>
                          <th>Policy</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {filteredCompanies.map((company, index) => (
                        <tr
                          key={index}
                          className="text-center border-b-2 border-b-blue-gray-800">
                          <td>{company.name}</td>
                          <td>
                            <a
                                onClick={() => {
                                    
                                    setLink(
                                      `${process.env.NEXT_PUBLIC_LLIBI_DIGITALOCEAN_SPACES}/Policies/${company.name}.pdf`,
                                    )
                                    setLinkClicked(true)
                                }}
                              className="text-blue-500 cursor-pointer">
                              View Policy
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
      <Modal show={show} body={body} toggle={toggle} />
    </div>
  )
}
