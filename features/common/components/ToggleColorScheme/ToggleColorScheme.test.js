import ToggleColorScheme from './ToggleColorScheme'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => ({
  Check: (props) => `${JSON.stringify(props)}`,
  Heading: ({ children }) => children,
}))

jest.mock('./helpers.js', () => ({
  loadAndListenColorScheme: () => {},
}))

describe.only('[ features / common / ToggleColorScheme ]', () => {
  describe('when ToggleColorScheme is called', () => {
    it('should render', () => {
      const { asFragment } = render(<ToggleColorScheme />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
