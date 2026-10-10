import { render } from '@testing-library/react'
import TaskDetailSection from './TaskDetailSection'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../../utils/testUtils/dummyRender')
  return { Icon: dummyRender('Icon') }
})

describe('[ features / tasks / components / TaskDetailSection ]', () => {
  describe('when it is empty', () => {
    it('should render the action in a dashed box', () => {
      // Arrange
      const props = { action: { label: 'Agregar notas', onClick: () => {} } }

      // Act
      const { asFragment } = render(<TaskDetailSection {...props} />)

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when it is filled', () => {
    it('should render its content in a solid box', () => {
      // Act
      const { asFragment } = render(
        <TaskDetailSection isFilled>content</TaskDetailSection>
      )

      // Assert
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
