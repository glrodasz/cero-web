import BreaktimeModal from './BreaktimeModal'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { shallowRender } = require('../../../utils/testing')
  return {
    Modal: shallowRender('Modal'),
    CenteredContent: shallowRender('CenteredContent'),
    Picture: shallowRender('Picture'),
    Heading: shallowRender('Heading'),
    Spacer: { Horizontal: shallowRender('Spacer') },
    Paragraph: shallowRender('Paragraph'),
    Button: shallowRender('Button'),
  }
})

describe('[ features / focusSession / components / BreaktimeModal ]', () => {
  describe('when `BreaktimeModal` is mounted', () => {
    it.only('should render', () => {
      const props = {
        onClickClose: () => {},
      }
      const { asFragment } = render(<BreaktimeModal {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
