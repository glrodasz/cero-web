import ReactDOMServer from 'react-dom/server'

const prettify = (obj) => JSON.stringify(obj)
const staticfy = (children) =>
  `${ReactDOMServer.renderToStaticMarkup(children)}`
    .replace(/&amp;quot;/g, '"')
    .replace(/&lt;/g, '(')
    .replace(/&gt;/g, ')')

// FIXME: Make this funciton recursive
export const shallowRender = (name) => (props) => {
  if (props.children) {
    const { children, ...otherProps } = props
    return `(${name} ${prettify(otherProps)})${staticfy(children)}(/${name}) `
  }
  return `(${name} ${JSON.stringify(props)} /) `
}
