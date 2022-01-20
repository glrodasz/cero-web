import isObject from './isObject'

const isEmpty = (value) => {
  if (isObject(value)) {
    return Object.keys(value).length === 0
  }

  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0
  }
}
export default isEmpty
