const _ = require('lodash')

const getInfoData = ({fields = [], object={}})=>{
    return _.pick(object, fields)
}

const asyncHandlerError = fn =>{
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

const getSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el, 1]))
}
const getUnSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeNullObject = obj =>{
    Object.keys(obj).forEach(k=>{
        if(obj[k] === null){
            delete obj[k]
        }
    })
    return obj
}

const parserNestedObject = obj => {
    const final = {}
    Object.keys(obj).forEach( x => {
        if(obj[x] !== null && typeof obj[x] === 'object' && !Array.isArray(obj[x]) ){
            const res = parserNestedObject(obj[x])
            Object.keys(res).forEach( y => {
                final[`${x}.${y}`] = res[y]
            })
        }
        else{
            final[x] = obj[x]
        }
    })
    return final
}
module.exports = {
    getInfoData,
    asyncHandlerError,
    getSelectData,
    getUnSelectData,
    removeNullObject,
    parserNestedObject
}