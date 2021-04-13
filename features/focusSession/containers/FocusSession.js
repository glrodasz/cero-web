import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import { FullHeightContent, LoadingError } from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'

import TasksList from '../../planning/components/TasksList'
import DeleteTaskModal from '../../planning/components/DeleteTaskModal'

import BreaktimeModal from '../components/BreaktimeModal'
import FocusSessionFooter from '../components/FocusSessionFooter'

import {
  handleClickDeleteTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleDragEndTask,
} from '../../planning/handlers'

import { handleClickCloseBreaktime } from '../handlers.js'

import useTasks from '../../planning/hooks/useTasks'
import useDeleteConfirmation from '../../planning/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'

const FocusSession = ({ initialData }) => {
  const queryCache = useQueryCache()

  const deleteConfirmation = useDeleteConfirmation()
  const breaktimeConfirmation = useBreaktimeConfirmation()

  const tasks = useTasks({
    queryCache,
    initialData: initialData.tasks,
    onRemove: () => deleteConfirmation.setTasksId(null),
  })

  const handleCheckCompleteTask = ({ breaktimeConfirmation }) => () => {
    breaktimeConfirmation.setShowDialog(true)
  }

  return (
    <>
      <FullHeightContent
        content={
          <LoadingError
            isLoading={tasks.isLoading}
            errorMessage={tasks.error?.message}
          >
            <UserHeader
              avatar="https://placeimg.com/200/200/people"
              title="Hola, Cristian"
              text="Conoce la metodologia RETO"
            />
            <TasksList
              tasks={tasks.data}
              onDragEndTask={handleDragEndTask({ tasks })}
              onClickDeleteTask={handleClickDeleteTask({
                deleteConfirmation,
              })}
              onCheckCompleteTask={handleCheckCompleteTask({
                breaktimeConfirmation,
              })}
              isActive
            />
          </LoadingError>
        }
        footer={<FocusSessionFooter onClickEndSession={() => {}} />}
      />
      {breaktimeConfirmation.showDialog && (
        <BreaktimeModal
          onClickClose={handleClickCloseBreaktime({ breaktimeConfirmation })}
        />
      )}
      {deleteConfirmation.showDialog && (
        <DeleteTaskModal
          onClickCancel={handleClickCancelRemove({ deleteConfirmation })}
          onClickConfirm={handleClickConfirmRemove({
            tasks,
            deleteConfirmation,
          })}
        />
      )}
    </>
  )
}

FocusSession.propTypes = {
  initialData: PropTypes.object,
}

export default FocusSession
