import React, { useState, useEffect } from 'react'

import { Input } from '@material-tailwind/react'

const InputMui = ({
    register,
    disabled = false,
    errors,
    className,
    ...props
}) => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
    }, [])
    return (
        <>
            {loading && (
                <Input
                    variant="outlined"
                    label={props?.label}
                    className={`${className} focus:ring-0`}
                    {...register}
                    {...props}
                    color={errors && 'red'}
                />
            )}
            <span className="text-xs text-red-600 font-semibold w-full text-center">
                {errors?.message && errors?.message}
            </span>
        </>
    )
}

export default InputMui
