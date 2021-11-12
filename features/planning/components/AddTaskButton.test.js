import AddTaskButton from './AddTaskButton'
import { render } from '@testing-library/react'

jest.mock('@glrodasz/components', () => {
  const { dummyRender } = require('../../../utils/tests/dummyRender')
  return {
    Spacer: { Vertical: dummyRender('Spacer.Vertical') },
    AddButton: dummyRender('Button'),
  }
})

jest.mock('../constants', () => ({
  MAXIMUM_BACKLOG_QUANTITY: 1,
}))

describe('[ features / planning / components / AddTaskButton ]', () => {
  describe('when `AddTaskButton` is mounted', () => {
    it('should render', () => {
      const props = {
        tasksLength: 0,
        onClickAddTask: () => {},
      }
      const { asFragment } = render(<AddTaskButton {...props} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
