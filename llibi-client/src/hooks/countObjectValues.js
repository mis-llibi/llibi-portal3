export const countObjectValues = () => {
    const removeUndefined = ({ obj }) => {
        let newObj = {}
        Object.keys(obj).forEach(key => {
            if (obj[key] === Object(obj[key]))
                newObj[key] = removeEmpty(obj[key])
            else if (obj[key] !== undefined) newObj[key] = obj[key]
        })
        return newObj
    }
    return { removeUndefined }
}
