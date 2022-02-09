import AddTaskButton from './AddTaskButton'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/testUtils/dummyRender')
  return {
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    AddButton: dummyRender('Button'),
  }
})

describe('[ features / planning / components / AddTaskButton ]', () => {
  describe('when `AddTaskButton` is mounted', () => {
    it('should render', () => {
      const props = {
        isShown: true,
        onAddTask: () => {},
      }
      const { asFragment } = render(<AddTaskButton {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
