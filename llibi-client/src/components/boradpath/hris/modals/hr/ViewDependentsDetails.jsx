import Label from '@/components/Label'
import moment from 'moment'
import React from 'react'

export default function ViewDependentsDetails({ row }) {
  console.log(row)
  return (
    <div className="w-[90vw] md:w-[40em] px-2">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* COL1 */}
        <div>
          <div>
            <Label htmlFor="">
              Employee Number:{' '}
              <span className="font-thin">{row?.member_id}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Name: <span className="font-thin">{row?.full_name}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Email: <span className="font-thin">{row?.principalEmail}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Birth Date:{' '}
              <span className="font-thin">
                {row?.birth_date && moment(row?.birth_date).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Relation:{' '}
              <span className="font-thin">{row?.relationship_id}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Civil Status:{' '}
              <span className="font-thin">{row?.civil_status}</span>
            </Label>
          </div>
        </div>
        {/* COL2 */}
        <div>
          <div>
            <Label htmlFor="">
              Hired Date:{' '}
              <span className="font-thin">
                {row?.date_hired && moment(row?.date_hired).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Regularization Date:{' '}
              <span className="font-thin">
                {row?.reg_date && moment(row?.reg_date).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Certificate No.:{' '}
              <span className="font-thin">{row?.certificate_no}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Date Approved:{' '}
              <span className="font-thin">
                {row?.certificate_issued_at &&
                  moment(row?.certificate_issued_at).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
