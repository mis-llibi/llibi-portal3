const InputDep = ({
    register,
    disabled = false,
    className,
    errors,
    ...props
}) => {
    return (
        <div className={`p-2 rounded ${errors ? 'bg-red-50' : 'bg-blue-50'}`}>
            <label className="text-xs font-bold">
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
                        : 'bg-blue-50 text-gray-900 focus:outline-blue-500'
                } rounded focus:bg-yellow-50 border-none focus:border-white text-xs focus:outline focus:outline-1 block w-full p-1.5`}
                {...props}
            />
            <span className="text-xs text-red-600 w-full text-center">
                {errors?.message && errors?.message}
            </span>
        </div>
    )
}

export default InputDep
