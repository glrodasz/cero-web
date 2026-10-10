// The corner of a `width` × `height` area closest to the point (`x`, `y`), as
// `top-left`, `top-right`, `bottom-left` or `bottom-right`. A point exactly on
// a midline goes to the top/left side.
const getNearestCorner = ({ x, y, width, height }) => {
  const vertical = y <= height / 2 ? 'top' : 'bottom'
  const horizontal = x <= width / 2 ? 'left' : 'right'

  return `${vertical}-${horizontal}`
}

export default getNearestCorner
