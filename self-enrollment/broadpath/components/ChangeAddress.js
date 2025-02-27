import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Loader from '@/components/Loader'

import { useRouter } from 'next/router'

import { ManageClientInfo } from '@/hooks/self-enrollment/ManageClientInfo'

const ChangeAddress = props => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { updateClientAddress } = ManageClientInfo({
    id: router.query.id,
    company: 'BROADPATH',
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue('linkId', props?.props?.link_id)
    setValue('street', props?.props?.street)
    setValue('barangay', props?.props?.barangay)
    setValue('city', props?.props?.city)
    setValue('province', props?.props?.province)
    setValue('zipCode', props?.props?.zip_code)
  }, [props])

  const onSubmit = data => {
    setLoading(true)
    updateClientAddress({ ...data, setLoading, reset })
  }

  return (
    <div className="w-full">
      <input type="hidden" {...register('linkId')} />
      <input type="hidden" {...register('changeAddress')} value="yes" />
      {/* information text fields */}
      <div className="mb-2">
        <div className="mt-2">
          <Label className="mb-2">House / Unit Number and Street</Label>
          <Input
            label="House / Unit Number and Street"
            register={register('street', {
              required: 'This is required',
            })}
            className={'capitalize'}
            placeholder="Enter House / Unit Number and Street"
            errors={errors?.street}
          />
        </div>
        <div className="mt-2">
          <Label className="mb-2">Barangay</Label>
          <Input
            label="Barangay"
            register={register('barangay', {
              required: 'This is required',
            })}
            className={'capitalize'}
            placeholder="Enter your Barangay"
            errors={errors?.barangay}
          />
        </div>
        <div className="mt-2">
          <Label className="mb-2">City / Municipality</Label>
          <Input
            label="City / Municipality"
            register={register('city', {
              required: 'This is required',
            })}
            className={'capitalize'}
            placeholder="Enter your City / Municipality"
            errors={errors?.city}
          />
        </div>
        <div className="mt-2">
          <Label className="mb-2">Province</Label>
          <Input
            label="Province"
            register={register('province', {
              required: 'This is required',
            })}
            className={'capitalize'}
            placeholder="Enter your Province"
            errors={errors?.province}
          />
        </div>
        <div className="mt-2">
          <Label className="mb-2">Zip Code</Label>
          <Input
            label="Zip Code"
            register={register('zipCode', {
              required: 'This is required',
            })}
            type="number"
            min="0"
            className={'capitalize'}
            placeholder="Enter your Zip Code"
            errors={errors?.zipCode}
          />
        </div>
      </div>

      <div className="mt-5">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!props?.props}
          className={'mr-2'}>
          Submit Changes
        </Button>
      </div>

      <Loader loading={loading} />
    </div>
  )
}

export default ChangeAddress
