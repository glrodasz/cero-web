import ToggleColorScheme from './ToggleColorScheme'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { shallowRender } = require('../../../../utils/testing')
  return {
    Check: shallowRender('Check'),
    Heading: shallowRender('Heading'),
  }
})

jest.mock('./helpers.js', () => ({
  loadAndListenColorScheme: () => {},
}))

describe('[ features / common / components / ToggleColorScheme ]', () => {
  describe('when `ToggleColorScheme` is mounted', () => {
    it('should render', () => {
      const { asFragment } = render(<ToggleColorScheme />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
