import InputMask from 'react-input-mask'

const Input = ({ register, disabled = false, errors, className, ...props }) => (
    <>
        <InputMask
            mask="+63 (999)-999-9999"
            {...register}
            disabled={disabled}
            className={`${className} ${
                errors
                    ? 'bg-red-100 focus:outline-red-900'
                    : 'bg-gray-200 text-gray-900 border-gray-300 focus:outline-blue-500'
            } focus:bg-yellow-50 border focus:border-white text-sm rounded-lg focus:outline focus:outline-1 block w-full p-2.5`}
            {...props}
        />
        <span className="text-xs text-red-600 font-semibold w-full text-center">
            {errors?.message && errors?.message}
        </span>
    </>
)

export default Input
