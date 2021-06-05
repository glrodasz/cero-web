import isObject from './isObject'
import { renderToStaticMarkup } from 'react-dom/server'

const EMPTY_SPACE = ' '

const objectStringify = (obj) =>
  isObject(obj) && Object.keys(obj).length
    ? `${EMPTY_SPACE}${JSON.stringify(obj)}`
    : ''

const cleanMarkup = (markup) =>
  markup
    .replace(/&amp;quot;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '[')
    .replace(/&gt;/g, ']')

const renderStatic = (children) =>
  cleanMarkup(`${renderToStaticMarkup(children)}`)

const dummyComponent = ({ name, props, children }) =>
  `[${name}${objectStringify(props)}${!children ? ' /' : ''}]${
    children ? `${children}[/${name}]${EMPTY_SPACE}` : ''
  }`

export const dummyRender = (name) => (props) => {
  if (props.children) {
    const { children, ...rest } = props
    return dummyComponent({
      name,
      props: rest,
      children: renderStatic(children),
    })
  }

  return `${dummyComponent({ name, props })}${EMPTY_SPACE}`
}
