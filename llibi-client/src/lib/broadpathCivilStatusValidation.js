export default function broadpathCivilStatusValidation(
  principalCivilStatus,
  dependentRelation,
) {
  switch (principalCivilStatus) {
    case 'SINGLE':
      switch (dependentRelation) {
        case 'PARENT':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
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
          break
        case 'CHILD':
        case 'SIBLING':
        case 'DOMESTIC PARTNER':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
            {
              value: 'SINGLE',
              label: 'Single',
            },
          ]
          break
      }
      break

    case 'SINGLE WITH DOMESTIC PARTNER':
      switch (dependentRelation) {
        case 'CHILD':
        case 'DOMESTIC PARTNER':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
            {
              value: 'SINGLE',
              label: 'Single',
            },
          ]
          break
      }
      break
    case 'SINGLE PARENT':
      switch (dependentRelation) {
        case 'CHILD':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
            {
              value: 'SINGLE',
              label: 'Single',
            },
          ]
          break
        case 'PARENT':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
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
          break
      }
      break
    case 'MARRIED':
      switch (dependentRelation) {
        case 'SPOUSE':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
            {
              value: 'MARRIED',
              label: 'Married',
            },
          ]
          break
        case 'CHILD':
          return [
            {
              value: '',
              label: 'Select Civil Status',
            },
            {
              value: 'SINGLE',
              label: 'Single',
            },
          ]
          break
      }
      break

    default:
      return [
        {
          value: '',
          label: 'Select Civil Status',
        },
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
      break
  }
}
