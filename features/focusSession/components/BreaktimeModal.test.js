import BreaktimeModal from './BreaktimeModal'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testing')
  return {
    Modal: dummyRender('Modal'),
    CenteredContent: dummyRender('CenteredContent'),
    Picture: dummyRender('Picture'),
    Heading: dummyRender('Heading'),
    Spacer: { Horizontal: dummyRender('Spacer') },
    Paragraph: dummyRender('Paragraph'),
    Button: dummyRender('Button'),
  }
})

describe('[ features / focusSession / components / BreaktimeModal ]', () => {
  describe('when `BreaktimeModal` is mounted', () => {
    it('should render', () => {
      const props = {
        onClickClose: () => {},
      }
      const { asFragment } = render(<BreaktimeModal {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
