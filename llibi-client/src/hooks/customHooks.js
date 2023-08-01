export const customHooks = () => {
    //Removing Undefined
    const removeUndefined = ({ obj }) => {
        let newObj = {}
        Object.keys(obj).forEach(key => {
            if (obj[key] === Object(obj[key]))
                newObj[key] = removeEmpty(obj[key])
            else if (obj[key] !== undefined) newObj[key] = obj[key]
        })
        return newObj
    }

    //Counting object that is not empty
    const removeEmptyObj = ({ ...obj }) => {
        Object.keys(obj).forEach(key => {
            if (
                obj[key] === null ||
                obj[key] === '' ||
                obj[key] === undefined ||
                obj[key] === false
            ) {
                delete obj[key]
            }
        })

        function ObjectLength(object) {
            var length = 0
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    ++length
                }
            }
            return length
        }

        return { length: ObjectLength(obj), values: obj }
    }

    return { removeUndefined, removeEmptyObj }
}
