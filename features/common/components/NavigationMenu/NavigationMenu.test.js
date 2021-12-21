import NavigationMenu from './NavigationMenu'
import { render } from '@testing-library/react'

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/home',
  }),
}))

jest.mock('../../hooks/useBreakpoints', () => () => ({
  isDesktop: true,
}))

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/tests/dummyRender')
  return {
    IconLabel: dummyRender('IconLabel'),
  }
})

describe('[ features / common / components / NavigationMenu ]', () => {
  describe('when `NavigationMenu` is mounted', () => {
    it('should render', () => {
      // Arrange
      const props = {}

      // Act
      const { asFragment } = render(<NavigationMenu {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
