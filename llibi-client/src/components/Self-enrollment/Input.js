const Input = ({ register, disabled = false, errors, className, ...props }) => {
    return (
        <div
            className={`py-2 px-4 rounded ${
                errors ? 'bg-red-50' : 'bg-gray-100'
            }`}>
            <label className="text-sm font-bold">
                {props?.label}{' '}
                {props?.optional && (
                    <span className="text-orange-900 italic text-xs">
                        Optional
                    </span>
                )}
            </label>
            <input
                {...register}
                disabled={disabled}
                className={`${className} ${
                    errors
                        ? 'bg-red-50 focus:outline-red-900'
                        : 'bg-gray-100 text-gray-900 focus:outline-blue-500'
                } rounded focus:bg-yellow-50 border-none focus:border-white text-sm focus:outline focus:outline-1 block w-full p-2.5`}
                {...props}
            />
            <span className="text-xs text-red-600 font-semibold w-full text-center">
                {errors?.message && errors?.message}
            </span>
        </div>
    )
}

export default Input
