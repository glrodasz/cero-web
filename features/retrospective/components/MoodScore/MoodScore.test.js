import { render, screen } from '@testing-library/react'
import MoodScore from './MoodScore'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return {
    Paragraph: dummyRender('Paragraph'),
    Score: dummyRender('Score'),
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
  }
})

describe('[ features / retrospective / components / MoodScore ]', () => {
  describe('when no score has been chosen', () => {
    it('should render only the faces', () => {
      // Arrange
      const props = { onClickScore: () => {} }

      // Act
      const { asFragment } = render(<MoodScore {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when a score has been chosen', () => {
    it('should name the chosen face', () => {
      // Arrange
      const props = { score: 2.5, onClickScore: () => {} }

      // Act
      render(<MoodScore {...props} />)

      // Assert
      expect(screen.getByText(/Te sentiste: Normal/)).toBeTruthy()
    })
  })
})
