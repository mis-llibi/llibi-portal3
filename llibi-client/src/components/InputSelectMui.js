import React, { useState, useEffect } from 'react'

import { Select, Option, SelectField, MenuItem } from '@material-tailwind/react'

const InputSelectMui = ({
    register,
    disabled = false,
    errors,
    option,
    className,
    ...props
}) => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
    }, [])

    const onChange = (event, child) => {
        console.log(event.target?.value)
        console.log(child)
    }

    return (
        <>
            {loading && (
                <Select
                    variant="outlined"
                    {...register}
                    label={props?.label}
                    color={errors && 'red'}
                    className={`${className} focus:ring-0`}
                    defaultValue="test"
                    {...props}
                    onChange={onChange}>
                    {option &&
                        option?.map((val, i) => (
                            <Option key={i} value={val}>
                                {val}
                            </Option>
                        ))}
                </Select>
            )}
        </>
    )
}

export default InputSelectMui
