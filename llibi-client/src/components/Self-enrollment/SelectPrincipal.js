const Select = ({
    register,
    disabled = false,
    errors,
    className,
    options,
    ...props
}) => (
    <>
        <select
            {...register}
            disabled={disabled}
            className={`${className} ${
                errors ? 'bg-red-100' : 'bg-gray-100 text-gray-900'
            } border-none focus:ring-0 outline-none focus:outline-none text-sm font-bold block w-full -mt-2`}
            {...props}>
            {options &&
                options.map((row, i) => (
                    <option key={i} value={row.value}>
                        {row.label}
                    </option>
                ))}
        </select>
    </>
)

export default Select
