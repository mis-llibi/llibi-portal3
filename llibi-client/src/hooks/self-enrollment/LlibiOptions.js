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
                    value: 'SINGLE PARENT',
                    label: 'Single Parent / Solo Parent',
                },
                {
                    value: 'MARRIED',
                    label: 'Married',
                },
            ]
        default:
            return [
                {
                    value: 'SINGLE',
                    label: 'Single',
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
    }
}

function relation(civilStatus, i) {
    switch (civilStatus) {
        case 'SINGLE':
            return [
                {
                    value: 'PARENT',
                    label: 'Parent',
                },
            ]
        case 'SINGLE PARENT':
            if (i == 0) {
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
                ]
            }
        case 'MARRIED':
            if (i == 0) {
                return [
                    {
                        value: 'SPOUSE',
                        label: 'Spouse',
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
        if (point === 'max') day = -6570 //18 years old
        if (point === 'min') day = -24090 //65 years old

        message = `${relation.toLowerCase()} must be 18 to 65 yrs old`
    } else if (relation === 'CHILD' || relation === 'SIBLING') {
        if (point === 'max') day = -15 //15 days
        if (point === 'min') day = -8030 //23 years old

        message = `${relation.toLowerCase()} must be 15 days to 23 yrs old`
    }
    const current = new Date()
    current.setDate(current.getDate() + day)
    return { message: message, value: current.toISOString().substr(0, 10) }
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
                        If parent’s surname is not same as that of employee,
                        submit <b>Employee's Birth Certificate</b>
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
                        If child’s surname is not same as that of employee,
                        submit <b>Child’s Birth Certificate</b>.
                    </li>
                    <li>
                        For adopted child/ren, submit scanned copy of{' '}
                        <b>
                            PSA/LCR Birth Certificate AND Scanned copy of legal
                            adopting papers capturing approval and legality
                            (e.g. DSWD certification, PSA Birth Certificate
                            reflecting new surname)
                        </b>
                    </li>
                </ul>
            )
        case 'SPOUSE':
            return (
                <ul>
                    <li className="mb-2">
                        If spouse’s surname is not same as that of employee,
                        submit <b>PSA/LCR Marriage Certificate</b>
                    </li>
                </ul>
            )
        case 'DOMESTIC PARTNER':
            return (
                <ul>
                    <li>
                        <b>Certificate of No Marriage (CENOMAR)</b> of Employee
                        and Common Law/ Same Sex Partner
                    </li>
                    <li className="text-center">and</li>
                    <li>
                        <b>Barangay Certification</b> of Cohabitation with
                        duration of residence to be indicated (minimum of 6
                        months)
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
    falseRelation,
    checkDocRequirements,
}
