import { renderToStaticMarkup } from 'react-dom/server'
import isEmpty from '../isEmpty'

const EMPTY_SPACE = ' '
const NEW_LINE = '\n'

const objectStringify = (obj) =>
  !isEmpty(obj) ? `${EMPTY_SPACE}${JSON.stringify(obj)}` : ''

const cleanMarkup = (markup) =>
  markup
    .replace(/&amp;quot;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '[')
    .replace(/&gt;/g, ']')

const renderStatic = (children) => {
  const isAnString = typeof children === 'string'
  return !isAnString
    ? cleanMarkup(`${renderToStaticMarkup(children)}`)
    : children
}

const dummyComponent = ({ name, props, children }) => {
  const stringifiedProps = objectStringify(props)
  const closeTag = children ? `]${children}[/${name}]` : ' /]'

  return `${NEW_LINE}[${name}${stringifiedProps}${closeTag}`
}

export const dummyRender = (name) => (props) => {
  if (props.children) {
    const { children, ...rest } = props
    return dummyComponent({
      name,
      props: rest,
      children: `${renderStatic(children)}`,
    })
  }

  return `${dummyComponent({ name, props })}`
}
