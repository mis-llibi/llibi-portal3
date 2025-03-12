function gender() {
  return [
    {
      value: 'MALE',
      label: 'Male',
    },
    {
      value: 'FEMALE',
      label: 'Female',
    },
  ]
}

function civilStatus(relation) {
  switch (relation) {
    case 'CHILD':
      return [
        {
          value: 'SINGLE',
          label: 'Single',
        },
      ]
    case 'SIBLING':
      return [
        {
          value: 'SINGLE',
          label: 'Single',
        },
      ]
    case 'SPOUSE':
      return [
        {
          value: 'MARRIED',
          label: 'Married',
        },
      ]
    case 'PARENT':
      return [
        {
          value: 'SINGLE',
          label: 'Single',
        },
        {
          value: 'SINGLE WITH DOMESTIC PARTNER',
          label: 'Single With Domestic Partner / Same Gender Partner',
        },
        {
          value: 'SINGLE PARENT',
          label: 'Single Parent / Solo Parent',
        },
        {
          value: 'MARRIED',
          label: 'Married',
        },
      ]
    case 'DOMESTIC PARTNER':
      return [
        {
          value: 'SINGLE',
          label: 'Single',
        },
      ]
    default:
      return [
        {
          value: 'SINGLE',
          label: 'Single',
        },
        /* {
          value: 'SINGLE WITH DOMESTIC PARTNER',
          label: 'Single With Domestic Partner / Same Gender Partner',
        }, */
        {
          value: 'SINGLE PARENT',
          label: 'Single Parent / Solo Parent',
        },
        {
          value: 'MARRIED',
          label: 'Married',
        },
      ]
  }
}

function relation(civilStatus, rel, prevRelation, arrRelation, i, row) {
  switch (civilStatus) {
    case 'SINGLE':
      return [
        {
          value: 'PARENT',
          label: 'Parent',
        },
        {
          value: 'SIBLING',
          label: 'Sibling',
        },
        {
          value: 'DOMESTIC PARTNER',
          label: 'Domestic Partner / Same Gender Partner',
        },
      ]
    case 'SINGLE WITH DOMESTIC PARTNER':
      return [
        {
          value: 'DOMESTIC PARTNER',
          label: 'Domestic Partner / Same Gender Partner',
        },
      ]
    case 'SINGLE PARENT':
      const elementCounts = arrRelation.reduce(
        (count, item) => ((count[item] = count[item] + 1 || 1), count),
        {},
      )

      if (i === 0)
        return [
          {
            value: 'CHILD',
            label: 'Child',
          },
          {
            value: 'PARENT',
            label: 'Parent',
          },
          {
            value: 'SIBLING',
            label: 'Sibling',
          },
          {
            value: 'DOMESTIC PARTNER',
            label: 'Domestic Partner / Same Gender Partner',
          },
        ]

      if (
        i + 1 === row.length &&
        (prevRelation === 'PARENT' || prevRelation === 'DOMESTIC PARTNER')
      ) {
        switch (prevRelation) {
          case 'PARENT':
            if (elementCounts['PARENT'] === 2 && rel !== 'PARENT') {
              return [
                {
                  value: 'CHILD',
                  label: 'Child',
                },
              ]
            } else {
              return [
                {
                  value: 'CHILD',
                  label: 'Child',
                },
                {
                  value: 'PARENT',
                  label: 'Parent',
                },
              ]
            }
          case 'DOMESTIC PARTNER':
            if (
              elementCounts['DOMESTIC PARTNER'] === 1 &&
              rel !== 'DOMESTIC PARTNER'
            ) {
              return [
                {
                  value: 'CHILD',
                  label: 'Child',
                },
              ]
            } else {
              return [
                {
                  value: 'CHILD',
                  label: 'Child',
                },
                {
                  value: 'DOMESTIC PARTNER',
                  label: 'Domestic Partner / Same Gender Partner',
                },
              ]
            }
        }
      } else {
        if (arrRelation.includes('PARENT')) {
          if (elementCounts['PARENT'] === 2 && rel !== 'PARENT') {
            return [
              {
                value: 'CHILD',
                label: 'Child',
              },
            ]
          } else {
            return [
              {
                value: 'CHILD',
                label: 'Child',
              },
              {
                value: 'PARENT',
                label: 'Parent',
              },
            ]
          }
        } else if (arrRelation.includes('DOMESTIC PARTNER')) {
          if (
            elementCounts['DOMESTIC PARTNER'] === 1 &&
            rel !== 'DOMESTIC PARTNER'
          ) {
            return [
              {
                value: 'CHILD',
                label: 'Child',
              },
            ]
          } else {
            return [
              {
                value: 'CHILD',
                label: 'Child',
              },
              {
                value: 'DOMESTIC PARTNER',
                label: 'Domestic Partner / Same Gender Partner',
              },
            ]
          }
        } else {
          return [
            {
              value: 'CHILD',
              label: 'Child',
            },
            {
              value: 'PARENT',
              label: 'Parent',
            },
            {
              value: 'SIBLING',
              label: 'Sibling',
            },
            {
              value: 'DOMESTIC PARTNER',
              label: 'Domestic Partner / Same Gender Partner',
            },
          ]
        }
      }
    case 'MARRIED':
      if (i == 0) {
        return [
          {
            value: 'SPOUSE',
            label: 'Spouse',
          },
          {
            value: 'CHILD',
            label: 'Child',
          },
        ]
      } else {
        return [
          {
            value: 'CHILD',
            label: 'Child',
          },
        ]
      }
  }
}

function getDate(point, relation) {
  let day = 0,
    message
  if (
    relation === 'SPOUSE' ||
    relation === 'PARENT' ||
    relation == 'DOMESTIC PARTNER'
  ) {
    if (point === 'max') day = -6574 //18 years old (365.25 * 18)
    if (point === 'min') day = -23741 //65 years old (365.25 * 65)

    message = `${relation.toLowerCase()} must be 18 to 65 yrs old`
  } else if (relation === 'CHILD' || relation === 'SIBLING') {
    if (point === 'max') day = -15 //15 days
    if (point === 'min') day = -8395 //23 years old (365.25 * 23)

    message = `${relation.toLowerCase()} must be 15 days to 23 yrs old`
  }
  const current = new Date()
  current.setDate(current.getDate() + day)
  return { message: message, value: current.toISOString().slice(0, 10) }
}

function ageEval(age, relation) {
  let evaluate = false
  if (
    relation === 'SPOUSE' ||
    relation === 'PARENT' ||
    relation === 'DOMESTIC PARTNER'
  ) {
    if (age >= 18 && age <= 65) evaluate = true //18 to 65 years old
  } else if (relation === 'CHILD' || relation === 'SIBLING') {
    if (age >= 0 && age <= 23) evaluate = true //15 days to 23 years old
  }
  return evaluate
}

function falseRelation(lastName, principalLastName, relation) {
  if (
    lastName?.toLowerCase() == principalLastName?.toLowerCase() &&
    relation != 'DOMESTIC PARTNER'
  )
    return false
  return true
}

function checkDocRequirements(relation) {
  switch (relation) {
    case 'PARENT':
      return (
        <ul>
          <li className="mb-2">
            If parent’s surname is not same as that of employee, submit{' '}
            <b>Employee's Birth Certificate</b>
          </li>
          <li>
            If mother's surname is not same as that of employee
            (remarried/married someone else), submit{' '}
            <b>Mother's Birth Certificate</b>
          </li>
        </ul>
      )
    case 'CHILD':
      return (
        <ul>
          <li className="mb-2">
            If child’s surname is not same as that of employee, submit{' '}
            <b>Child’s Birth Certificate</b>.
          </li>
          <li>
            For adopted child/ren, submit scanned copy of{' '}
            <b>
              PSA/LCR Birth Certificate AND Scanned copy of legal adopting
              papers capturing approval and legality (e.g. DSWD certification,
              PSA Birth Certificate reflecting new surname)
            </b>
          </li>
        </ul>
      )
    case 'SIBLING':
      return (
        <ul>
          <li className="mb-2">
            If sibling’s surname is not same as that of employee, submit{' '}
            <b>Sibling’s Birth Certificate</b>.
          </li>
          <li>
            For adopted siblings, submit scanned copy of{' '}
            <b>
              PSA/LCR Birth Certificate AND Scanned copy of legal adopting
              papers capturing approval and legality (e.g. DSWD certification,
              PSA Birth Certificate reflecting new surname)
            </b>
          </li>
        </ul>
      )
    case 'SPOUSE':
      return (
        <ul>
          <li className="mb-2">
            If spouse’s surname is not same as that of employee, submit{' '}
            <b>PSA/LCR Marriage Certificate</b>
          </li>
        </ul>
      )
    case 'DOMESTIC PARTNER':
      return (
        <ul>
          <li>
            <b>Certificate of No Marriage (CENOMAR)</b> of Employee and Common
            Law/ Same Sex Partner
          </li>
          <li className="text-center">and</li>
          <li>
            <b>Barangay Certification</b> of Cohabitation with duration of
            residence to be indicated (minimum of 6 months)
          </li>
        </ul>
      )
  }
}

export default {
  gender,
  civilStatus,
  relation,
  getDate,
  ageEval,
  falseRelation,
  checkDocRequirements,
}
