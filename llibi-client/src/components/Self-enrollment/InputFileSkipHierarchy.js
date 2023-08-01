import { basePath } from '@/../next.config'

const Input = ({
    register,
    skipReason,
    disabled = false,
    errors,
    className,
    ...props
}) => {
    const skipDoc = () => {
        switch (skipReason) {
            case 'DEATH':
                return 'Death Certificate'
            case 'WORKING ABROAD':
                return 'Certificate of Employment Abroad / Photocopy of working VISA'
            case 'OTHER COVERAGE':
                return 'Photocopy of HMO card / Cert. of Cover of other HMO'
            default:
                return ''
        }
    }

    return (
        <div className={`p-2 rounded ${errors ? 'bg-red-50' : 'bg-blue-50'}`}>
            <div className="flex">
                <div className="flex-grow">
                    <label className="text-xs font-bold lg:flex gap-3">
                        <div>
                            {props?.label}{' '}
                            {skipReason && (
                                <p className="text-orange-900 italic text-xs">
                                    {skipDoc()}
                                </p>
                            )}
                        </div>
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
                        <a
                            href={`${basePath}/storage/${props?.attachments}`}
                            target="_blank"
                            className="bg-indigo-100 font-bold text-black-900 text-xs text-center w-full cursor-pointer py-1 px-2 rounded-md hover:shadow-xl hover:bg-pink-300 transition duration-300 ml-2">
                            View Skip Document
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Input
