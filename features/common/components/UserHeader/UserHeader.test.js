import UserHeader from './UserHeader'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { shallowRender } = require('../../../../utils/testing')

  return {
    Avatar: shallowRender('Avatar'),
    Spacer: { Vertical: shallowRender('Space.Vertical') },
    Heading: shallowRender('Heading'),
    Paragraph: shallowRender('Paragraph'),
  }
})

describe('[ features / common / components / UserHeader ]', () => {
  describe('when `UserHeader` is mounted', () => {
    it('should render', () => {
      const props = {
        avatar: 'avatar',
        title: 'title',
        text: 'text',
      }
      const { asFragment } = render(<UserHeader {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when `UserHeader` is mounted with `isPrimary` as `true`', () => {
    it('should render', () => {
      const props = {
        avatar: 'avatar',
        title: 'title',
        text: 'text',
        isPrimary: true,
      }
      const { asFragment } = render(<UserHeader {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
