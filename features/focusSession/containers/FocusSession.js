import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import { FullHeightContent, LoadingError } from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'
import Board from '../../tasks/components/Board'
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal'
import BreaktimeModal from '../components/BreaktimeModal'
import FocusSessionFooter from '../components/FocusSessionFooter'

// TODO: Move to tasks features
import {
  handleClickDeleteTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleDragEndTask,
} from '../../planning/handlers'

import {
  handleClickCloseBreaktime,
  handleClickEndSession,
  handleCheckCompleteTask,
} from '../handlers.js'

import useTasks from '../../tasks/hooks/useTasks'
import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import useFocusSessions from '../hooks/useFocusSessions'

const FocusSession = ({ initialData }) => {
  const queryCache = useQueryCache()

  const deleteConfirmation = useDeleteConfirmation()
  const breaktimeConfirmation = useBreaktimeConfirmation()

  const tasks = useTasks({
    queryCache,
    initialData: initialData.tasks,
    onRemove: () => deleteConfirmation.setTasksId(null),
  })

  const focusSessions = useFocusSessions({ queryCache })

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
            <Board
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
        footer={
          <FocusSessionFooter
            onClickEndSession={handleClickEndSession({
              focusSessions,
              initialData,
            })}
          />
        }
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
