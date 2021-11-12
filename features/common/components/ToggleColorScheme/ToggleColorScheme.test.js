import ToggleColorScheme from './ToggleColorScheme'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/tests/dummyRender')
  return {
    Check: dummyRender('Check'),
    Heading: dummyRender('Heading'),
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
