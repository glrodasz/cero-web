import { render } from '@testing-library/react'
import PlanningMethodology from './PlanningMethodology'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  return {
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    Paragraph: dummyRender('Paragraph'),
  }
})

describe('[ features / planning / components / PlanningMethodology ]', () => {
  describe('when `tasksLength` is greater or equal to one', () => {
    it('should explain the methodology', () => {
      // Arrange
      const props = { tasksLength: 1 }

      // Act
      const { asFragment } = render(<PlanningMethodology {...props} />)
      const result = asFragment()

      // Assert
      expect(result).toMatchSnapshot()
    })
  })

  describe('when `tasksLength` is less than one', () => {
    it('should return null', () => {
      // Arrange
      const props = { tasksLength: 0 }
      const expected = null

      // Act
      const { container } = render(<PlanningMethodology {...props} />)
      const result = container.firstChild

      // Assert
      expect(result).toBe(expected)
    })
  })
})
