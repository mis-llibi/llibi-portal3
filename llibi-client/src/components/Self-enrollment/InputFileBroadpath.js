import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { BsFillQuestionSquareFill } from 'react-icons/bs'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import UploadedFiles from '@/pages/self-enrollment/broadpath/components/UploadedFiles'

import { basePath } from '@/../next.config'

const Input = ({ register, disabled = false, errors, className, ...props }) => {
  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))

  const { show, body, setBody, toggle } = ModalControl()

  const onView = id => {
    setBody({
      title: <b className="text-blue-900">Uploaded Files</b>,
      content: (
        <UploadedFiles
          id={id}
          setLoading={props?.setLoading}
          client={props?.client}
          reset={props?.reset}
        />
      ),
      modalOuterContainer: 'w-full md:w-6/12 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  const checkRequiredDoc = () => {
    const rel = props?.rel

    const image = props?.civilStatus
    //if (rel == 'DOMESTIC PARTNER') image = 'SINGLE WITH DOMESTIC PARTNER'

    setBody({
      title: '',
      content: (
        <img src={`${basePath}/self-enrollment/broadpath/${image}.jpg`} />
      ),
      modalOuterContainer: 'w-full md:w-6/12 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  return (
    <div className={`p-2 rounded ${errors ? 'bg-red-50' : 'bg-blue-50'}`}>
      <div className="flex">
        <div className="flex-grow">
          <label className="text-xs font-bold lg:flex gap-3">
            <p>
              {props?.label}{' '}
              {props?.optional && (
                <span className="text-orange-900 italic text-xs">Optional</span>
              )}
            </p>{' '}
            {/* <a
              className="text-xs transition-all text-blue-800 hover:text-blue-900 hover:italic hover:underline cursor-pointer"
              onClick={() => checkRequiredDoc()}>
              Click to view the required docs
            </a> */}
            {props?.tooltip && (
              <HtmlTooltip
                title={
                  <>
                    <Typography color="inherit">
                      <b>Requirements</b>
                    </Typography>
                    <div className="w-52">{props?.tooltip}</div>
                  </>
                }>
                <a className="float-right cursor-pointer animate-bounce duration-700">
                  <BsFillQuestionSquareFill className="text-red-900 text-2xl" />
                </a>
              </HtmlTooltip>
            )}
          </label>
          <input
            {...register}
            disabled={disabled}
            className={`${className} ${
              errors
                ? 'bg-red-50 focus:outline-red-900'
                : 'bg-blue-50 text-gray-900 focus:outline-blue-500'
            } rounded focus:bg-yellow-50 border-none focus:border-white text-xs focus:outline focus:outline-1 block w-full p-1.5`}
            type={props?.type}
            accept={props?.accept}
            multiple={props?.multiple}
            placeholder={props?.placeholder}
          />
          <span className="text-xs text-red-600 font-semibold w-full text-center">
            {errors?.message && errors?.message}
          </span>
        </div>
        <div className="basis-2/6 flex place-items-center justify-center">
          {props?.attachments && (
            <span
              onClick={() => onView(props?.id)}
              className="bg-indigo-100 font-bold text-black-900 text-xs text-center w-full cursor-pointer py-1 px-2 rounded-md hover:shadow-xl hover:bg-pink-300 transition duration-300 ml-2">
              View Uploaded File(s)
            </span>
          )}
        </div>
      </div>
      <Modal
        className={!props?.nloading && 'hidden'}
        show={show}
        body={body}
        toggle={toggle}
      />
    </div>
  )
}

export default Input
