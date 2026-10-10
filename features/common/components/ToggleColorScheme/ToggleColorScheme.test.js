import ToggleColorScheme from './ToggleColorScheme'
import { render } from '@testing-library/react'

jest.mock('../../hooks/useColorScheme', () => () => ({
  isDarkMode: false,
  setIsDarkMode: () => {},
}))

describe('[ features / common / components / ToggleColorScheme ]', () => {
  describe('when `ToggleColorScheme` is mounted', () => {
    it('should render', () => {
      const { asFragment } = render(<ToggleColorScheme />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
