import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import {
  FullHeightContent,
  Button,
  Spacer,
  LoadingError,
} from '@glrodasz/components'

// TODO: Move to the common components
import UserHeader from '../../common/components/UserHeader'

import TasksList from '../../planning/components/TasksList'
import DeleteTaskModal from '../../planning/components/DeleteTaskModal'
import useTasks from '../../planning/hooks/useTasks'
import useDeleteConfirmation from '../../planning/hooks/useDeleteConfirmation'

import BreaktimeModal from '../components/BreaktimeModal'

import {
  handleClickDeleteTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleDragEndTask,
} from '../../planning/handlers'

import { handleClickCloseBreaktime } from '../handlers.js'

import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import FocusSessionFooter from '../components/FocusSessionFooter'

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
            {/* {tasks?.length < MAXIMUM_BACKLOG_QUANTITY && (
              <>
                <Spacer.Horizontal size="md" />
                <AddButton
                  onAdd={(value) =>
                    createTask({ description: value, priority: tasks.length })
                  }
                  focusHelpText="Presiona enter"
                  blurHelpText="Clic para continuar"
                >
                  Toca para agregar la tarea
                </AddButton>
              </>
            )} */}
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
