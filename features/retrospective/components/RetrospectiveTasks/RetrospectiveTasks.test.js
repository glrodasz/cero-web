import { render } from '@testing-library/react'
import RetrospectiveTasks from './RetrospectiveTasks'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return {
    Accordion: dummyRender('Accordion'),
    Paragraph: dummyRender('Paragraph'),
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
  }
})

describe('[ features / retrospective / components / RetrospectiveTasks ]', () => {
  describe('when `RetrospectiveTasks` is mounted', () => {
    it('should render a section per status, empty ones included', () => {
      // Arrange
      const props = {
        sections: [
          {
            status: 'in-progress',
            title: 'En progreso',
            tasks: [{ id: 1, description: 'Escribir las pruebas' }],
          },
          { status: 'pending', title: 'Pendientes', tasks: [] },
        ],
      }

      // Act
      const { asFragment } = render(<RetrospectiveTasks {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
