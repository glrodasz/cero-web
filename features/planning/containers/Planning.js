import PropTypes from 'prop-types'

import { FullHeightContent, LoadingError, Link } from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'
import Board from '../../tasks/components/Board'
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal'
import PlanningOnboarding from '../components/PlanningOnboarding'

import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useEditTaskModal from '../../tasks/hooks/useEditTaskModal'
import useTasks from '../../tasks/hooks/useTasks'
import useFocusSessions from '../../focusSession/hooks/useFocusSessions'

import {
  handleDragEndTask,
  handleDeleteTask,
  handleAddTask,
  handleCancelRemove,
  handleConfirmRemove,
  handleStartSession,
  handleOpenEditTaskModal,
} from '../../tasks/handlers'

import PlanningFooter from '../components/PlanningFooter'
import AddTaskButton from '../components/AddTaskButton'
import EditTask from '../../tasks/containers/EditTask'

const Planning = ({ initialData }) => {
  const deleteConfirmation = useDeleteConfirmation()
  const editTaskModal = useEditTaskModal()

  const tasks = useTasks({
    initialData: initialData.tasks,
    onRemove: () => {
      deleteConfirmation.setTaskId(null)
      editTaskModal.setShowDialog(false)
    },
  })

  const focusSessions = useFocusSessions()
  const tasksLength = tasks.data?.length

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
              text={
                <>
                  <span>Conoce la metodologia</span> <Link>RETO</Link>
                </>
              }
            />
            <PlanningOnboarding tasksLength={tasksLength}>
              <Board
                isActive={false}
                tasks={tasks.data}
                onDragEnd={handleDragEndTask({ tasks })}
                actions={{
                  onDeleteTask: handleDeleteTask({
                    deleteConfirmation,
                  }),
                  onEditTask: handleOpenEditTaskModal({
                    tasks,
                    editTaskModal,
                  }),
                }}
              />
            </PlanningOnboarding>
            <AddTaskButton
              id="planning"
              tasksLength={tasksLength}
              onClickAddTask={handleAddTask({ tasks })}
            />
          </LoadingError>
        }
        footer={
          <PlanningFooter
            tasksLength={tasksLength}
            onClickStartSession={handleStartSession({ focusSessions })}
          />
        }
      />
      <EditTask editTaskModal={editTaskModal} />
      {deleteConfirmation.showDialog && (
        <DeleteTaskModal
          onClickCancel={handleCancelRemove({ deleteConfirmation })}
          onClickConfirm={handleConfirmRemove({
            tasks,
            deleteConfirmation,
          })}
        />
      )}
    </>
  )
}

Planning.propTypes = {
  initialData: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        priority: PropTypes.number.isRequired,
      })
    ),
  }),
}

export default Planning
