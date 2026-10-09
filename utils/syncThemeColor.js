// Points every `<meta name="theme-color">` at the current value of a CSS
// custom property, so the browser UI follows the page's theme even when it was
// picked by hand rather than by the OS preference the metas' media queries read.
const syncThemeColor = (cssVariable) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim()

  if (!color) return

  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', color))
}

export default syncThemeColor
