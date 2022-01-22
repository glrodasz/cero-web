import BreaktimeConfirmation from './BreaktimeConfirmation'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  return {
    Modal: dummyRender('Modal'),
    CenteredContent: dummyRender('CenteredContent'),
    Picture: dummyRender('Picture'),
    Heading: dummyRender('Heading'),
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    Paragraph: dummyRender('Paragraph'),
    Button: dummyRender('Button'),
  }
})

describe('[ features / focusSession / components / BreaktimeConfirmation ]', () => {
  describe('when `BreaktimeConfirmation` is mounted', () => {
    it('should render', () => {
      const props = {
        onClickClose: () => {},
        onClickChoose: () => {},
      }
      const { asFragment } = render(<BreaktimeConfirmation {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
