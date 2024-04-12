export default function birthDayChecker(point, relation) {
  let day = 0,
    message
  if (
    relation === 'PRINCIPAL' ||
    relation === 'SPOUSE' ||
    relation === 'PARENT' ||
    relation == 'DOMESTIC PARTNER'
  ) {
    if (point === 'max') day = -6570 //18 years old
    if (point === 'min') day = -24090 //65 years old

    message = `${relation.toLowerCase()} must be 18 to 65 yrs old`
  } else if (relation === 'CHILD' || relation === 'SIBLING') {
    if (point === 'max') day = -15 //15 days
    if (point === 'min') day = -8395 //23 years old

    message = `${relation.toLowerCase()} must be 15 days to 23 yrs old`
  }
  const current = new Date()
  current.setDate(current.getDate() + day)
  return {
    message: message.charAt(0).toUpperCase() + message.slice(1),
    value: current.toISOString().substring(0, 10),
  }
}
