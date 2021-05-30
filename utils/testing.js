import { renderToStaticMarkup } from 'react-dom/server'

const prettify = (obj) => JSON.stringify(obj)

const cleanMarkup = (markup) =>
  markup
    .replace(/&amp;quot;/g, '"')
    .replace(/&lt;/g, '(')
    .replace(/&gt;/g, ')')

const staticfy = (children) => cleanMarkup(`${renderToStaticMarkup(children)}`)

// TODO: Write tetst and check more consistent alternative
export const shallowRender = (name) => (props) => {
  if (props.children) {
    const { children, ...otherProps } = props
    return `(${name} ${prettify(otherProps)})${staticfy(children)}(/${name}) `
  }
  return `(${name} ${JSON.stringify(props)} /) `
}
