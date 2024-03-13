export default function broadpathRelationValidation(principalCivilStatus) {
  switch (principalCivilStatus) {
    case 'SINGLE':
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Parent', value: 'PARENT' },
        { label: 'Child', value: 'CHILD' },
        { label: 'Sibling', value: 'SIBLING' },
        {
          label: 'Domestic Partner / Same Gender Partner',
          value: 'DOMESTIC PARTNER',
        },
      ]
      break
    case 'SINGLE WITH DOMESTIC PARTNER':
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Child', value: 'CHILD' },
        {
          label: 'Domestic Partner / Same Gender Partner',
          value: 'DOMESTIC PARTNER',
        },
      ]
      break
    case 'SINGLE PARENT':
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Child', value: 'CHILD' },
      ]
      break
    case 'MARRIED':
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Spouse', value: 'SPOUSE' },
        { label: 'Child', value: 'CHILD' },
      ]
      break

    default:
      return [
        { label: 'Select Relation', value: '' },
        { label: 'Parent', value: 'PARENT' },
        { label: 'Spouse', value: 'SPOUSE' },
        { label: 'Child', value: 'CHILD' },
        { label: 'Sibling', value: 'SIBLING' },
        {
          label: 'Domestic Partner / Same Gender Partner',
          value: 'DOMESTIC PARTNER',
        },
      ]
      break
  }
}
