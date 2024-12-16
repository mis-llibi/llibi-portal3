import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'

const InputSelect = ({
    register,
    disabled = false,
    required = true,
    errors,
    control,
    option,
    ...props
}) => {
    // Custom styles for the react-select
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontSize: 14,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            backgroundColor: state.isSelected ? '#FD9727' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: '#FD9727',
                color: 'white'
            },
            cursor: 'pointer',
        }),
        control: (base, state) => ({
            ...base,
            padding: 2,
            fontSize: 14,
            border: '1px solid #FD9727',
            borderRadius: 6,
            backgroundColor: errors && '#FEE2E2;',
            color: state.isSelected ? '#EA871F' : '#003BC2',
            boxShadow: 'none',
        }),
        placeholder: base => ({
            ...base,
            fontSize: 14,
            color: '#767676',
        }),
    }


    return (
        <>
            <Controller
                name={register?.name}
                control={control}
                rules={{ required: required }}
                render={({ field: { value, onChange } }) => {
                    return (
                        <Select
                            instanceId={props?.id}
                            options={option}
                            menuPlacement="auto"
                            placeholder={
                                errors
                                    ? `${props?.label} is required`
                                    : `${props?.label}`
                            }
                            onChange={opt => onChange(opt?.value)}
                            value={option.find(opt => opt?.value === value)}
                            isClearable={true}
                            classNamePrefix={`focus:ring focus:ring-0 focus:ring-opacity-50`}
                            className='w-full'
                            styles={customStyles}
                            {...props}
                        />
                    )
                }}
            />
            <span className="text-xs text-red-600 w-full text-center">
                {errors?.message && errors?.message}
            </span>
        </>
    )
}

export default InputSelect
