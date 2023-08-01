const InputCheckBox = ({
    register,
    skip,
    disabled = false,
    className,
    errors,
    ...props
}) => {
    return (
        <div className={`p-2 rounded ${errors ? 'bg-red-50' : 'bg-blue-50'}`}>
            <label className={`text-xs font-bold ${props?.labelClass || ''}`}>
                {props?.label}
            </label>
            <div className="flex gap-2 mt-1">
                <input
                    {...register}
                    disabled={disabled}
                    className={`${className} ${
                        errors
                            ? 'bg-red-50 focus:outline-red-900'
                            : 'bg-blue-800 text-gray-900 focus:outline-blue-500'
                    } rounded focus:bg-yellow-50 border-none focus:border-white text-xs focus:outline focus:outline-1 block p-2`}
                    {...props}
                />
                <div className="flex items-center text-xs">
                    <p
                        className={`font-bold text-red-600 italic ${
                            !skip && 'hidden'
                        }`}>
                        Will not enroll dependent
                    </p>
                </div>
            </div>
            <span className="text-xs text-red-600 w-full text-center">
                {errors?.message && errors?.message}
            </span>
        </div>
    )
}

export default InputCheckBox
