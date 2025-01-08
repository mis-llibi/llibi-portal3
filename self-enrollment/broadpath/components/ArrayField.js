import { useEffect, useRef } from 'react'

import Button from '@/components/ButtonLink'
import Input from '@/components/Self-enrollment/InputDep'
import InputFile from '@/components/Self-enrollment/InputFileBroadpath'
import Select from '@/components/Self-enrollment/SelectDependent'

import { FiTrash2 } from 'react-icons/fi'

import Swal from 'sweetalert2'

import options from '@/hooks/self-enrollment/BroadpathOptions'

const ArrayField = ({ props }) => {
  const renderCounter = useRef(0)
  useEffect(() => {
    renderCounter.current = renderCounter.current + 1
    if (renderCounter.current >= 3)
      props?.fields.map((item, i) => {
        props?.setValue(`deps.${i}.relation`, '')
        props?.setValue(`deps.${i}.birth_date`, '')
        props?.setValue(`deps.${i}.attachment`, '')
      })
  }, [props?.civilStatus])

  const renderFields = useRef(true)
  useEffect(() => {
    if (props?.fields.length == 3 && renderFields.current && props?.isDirty)
      Swal.fire(
        'Succeeding Dependent',
        'By enrolling your 3rd and succeeding dependents, you are agreeing to 100% premium dependent contribution.',
        'warning',
      )
    if (props?.fields.length >= 3) renderFields.current = false
    else renderFields.current = true
  }, [props?.fields])

  //const principalLName = props?.client?.principal[0]?.last_name?.toLowerCase()
  //let crel = []

  let arrayRelation = new Map()

  return (
    <>
      <ul className="mb-2">
        {props?.fields.map((item, i, row) => {
          //const lName = props?.watch(`deps.${i}.last_name`)

          const rel = props?.watch(`deps.${i}.relation`)

          const prevRelation = props?.watch(`deps.${i - 1}.relation`) || ''

          arrayRelation.set(i, props?.watch(`deps.${i}.relation`))
          const arrRelation = Array.from(arrayRelation.values())

          /* ${
            !i && 'hidden'
          } */
          return (
            <li
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4 border-b-2 pb-2 mb-2">
              {/* delete button */}
              <div className="ml-2 col-span-1 md:col-span-3 lg:col-span-5 flex gap-2 lg:-mb-2">
                <div
                  onClick={() => {
                    props?.remove(i)
                    //removeThis();
                  }}
                  className={`flex cursor-pointer hover:underline text-red-700 text-xs font-bold `}>
                  <FiTrash2 className="text-sm  mr-2" />{' '}
                  <p>Delete this Dependent</p>
                </div>

                {/* check dependents */}
                <span className="flex-grow text-xs text-right mr-4 font-bold">
                  {props?.watch(`deps.${i}.relation`)}
                </span>
              </div>
              <input
                label="ID"
                type="hidden"
                {...props?.register(`deps.${i}.id`)}
              />
              <Input
                label="Last Name"
                register={props?.register(`deps.${i}.last_name`, {
                  required: true,
                })}
                className={'capitalize'}
                placeholder="Enter your last name"
                errors={props?.errors?.deps?.[i]?.last_name}
              />
              <Input
                label="First Name"
                register={props?.register(`deps.${i}.first_name`, {
                  required: true,
                })}
                className={'capitalize'}
                placeholder="Enter your first name"
                errors={props?.errors?.deps?.[i]?.first_name}
              />
              <Input
                label="Middle Name"
                optional={1}
                register={props?.register(`deps.${i}.middle_name`)}
                className={'capitalize'}
                placeholder="Enter your middle name"
                errors={props?.errors?.deps?.[i]?.middle_name}
              />
              <Select
                label="Relation"
                register={props?.register(`deps.${i}.relation`, {
                  required: true,
                })}
                options={[
                  {
                    value: '',
                    label: 'Select relation',
                  },
                  ...(options.relation(
                    props?.civilStatus,
                    rel,
                    prevRelation,
                    arrRelation,
                    i,
                    row,
                  ) || []),
                ]}
                className={'capitalize'}
                placeholder="Enter your relation"
                errors={props?.errors?.deps?.[i]?.relation}
              />
              <Input
                label="Birth Date"
                type="date"
                onKeyDown={e => {
                  e.preventDefault()
                }}
                disabled={!props?.watch(`deps.${i}.relation`)}
                register={props?.register(`deps.${i}.birth_date`, {
                  required: true,
                  max: props?.watch(`deps.${i}.relation`)
                    ? options.getDate('max', props?.watch(`deps.${i}.relation`))
                    : 0,
                  min: props?.watch(`deps.${i}.relation`)
                    ? options.getDate('min', props?.watch(`deps.${i}.relation`))
                    : 0,
                })}
                className={'capitalize'}
                placeholder="Enter your birth date"
                errors={props?.errors?.deps?.[i]?.birth_date}
              />
              <Select
                label="Gender"
                register={props?.register(`deps.${i}.gender`, {
                  required: true,
                })}
                options={[
                  {
                    value: '',
                    label: 'Select gender',
                  },
                  ...options.gender(),
                ]}
                className={'capitalize'}
                placeholder="Enter your gender"
                errors={props?.errors?.deps?.[i]?.gender}
              />
              <Select
                label="Civil Status"
                register={props?.register(`deps.${i}.civil_status`, {
                  required: true,
                })}
                options={[
                  {
                    value: '',
                    label: 'Select civil status',
                  },
                  ...options.civilStatus(rel),
                ]}
                placeholder="Enter your civil status"
                errors={props?.errors?.deps?.[i]?.civil_status}
              />
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                {/* attachments */}
                <InputFile
                  label={`Document Requirement(s):`}
                  id={item?.mId}
                  attachments={item?.attachments}
                  loading={props?.loading}
                  setLoading={props?.setLoading}
                  civilStatus={props?.civilStatus}
                  rel={rel}
                  client={props?.client}
                  reset={props?.reset}
                  /*tooltip={
                        (options.falseRelation(
                            lName,
                            principalLName,
                            rel,
                        ) &&
                            options.checkDocRequirements(
                                rel,
                            )) ||
                        ''
                    }*/
                  type="file"
                  disabled={item?.attachments}
                  /*disabled={
                        !options.falseRelation(
                            lName,
                            principalLName,
                            rel,
                        )
                    }*/
                  accept="image/*, application/pdf"
                  multiple
                  register={props?.register(`deps.${i}.attachment`, {
                    required: !item?.attachments,
                    /*options.falseRelation(
                        lName,
                        principalLName,
                        rel,
                    ) && !item?.attachments,*/
                  })}
                  errors={
                    /*options.falseRelation(
                        lName,
                        principalLName,
                        rel,
                    ) &&*/
                    !item?.attachments && props?.errors?.deps?.[i]?.attachment
                  }
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="lg:flex">
        <div className="basis-42">
          {/* append button */}
          <Button
            disabled={!props?.client?.principal[0]}
            onClick={() => {
              props?.append({})
            }}
            className="bg-blue-500 rounded-md text-white cursor-pointer mr-2 text-sm normal-case">
            Add Dependent
          </Button>
        </div>
        <div className="flex-grow mt-2 lg:mt-0 flex place-items-center justify-end hidden">
          <p
            className={`text-xs md:text-sm text-center md:text-left lg:text-right ${
              props?.fields.length <= 2 && 'hidden'
            }`}>
            Your annual premium is ₱ xxx with monthly premium of ₱ xxx. Premium
            refund is not allowed if membership is terminated/ deleted mid
            policy year.
          </p>
        </div>
      </div>
    </>
  )
}

export default ArrayField
