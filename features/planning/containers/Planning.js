import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import { FullHeightContent, LoadingError, Link } from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'
import Board from '../../tasks/components/Board'
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal'
import PlanningOnboarding from '../components/PlanningOnboarding'

import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useEditTaskModal from '../../tasks/hooks/useEditTaskModal'
import useTasks from '../../tasks/hooks/useTasks'
import useTask from '../../tasks/hooks/useTask'
import useFocusSessions from '../../focusSession/hooks/useFocusSessions'

import {
  handleDragEndTask,
  handleClickDeleteTask,
  handleClickAddTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleClickStartSession,
  handleOpenEditTaskModal,
  handleCloseEditTaskModal,
} from '../../tasks/handlers'

import PlanningFooter from '../components/PlanningFooter'
import AddTaskButton from '../components/AddTaskButton'
import EditTaskModal from '../../tasks/components/EditTaskModal'

const Planning = ({ initialData }) => {
  const queryCache = useQueryCache()

  const deleteConfirmation = useDeleteConfirmation()
  const editTaskModal = useEditTaskModal()

  const tasks = useTasks({
    queryCache,
    initialData: initialData.tasks,
    onRemove: () => deleteConfirmation.setTasksId(null),
  })

  const task = useTask({
    id: editTaskModal.taskId,
    queryCache,
  })

  const focusSessions = useFocusSessions({ queryCache })
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
                onDragEndTask={handleDragEndTask({ tasks })}
                onDeleteTask={handleClickDeleteTask({
                  deleteConfirmation,
                })}
                onEditTask={handleOpenEditTaskModal({
                  tasks,
                  editTaskModal,
                })}
              />
            </PlanningOnboarding>
            <AddTaskButton
              id="planning"
              tasksLength={tasksLength}
              onClickAddTask={handleClickAddTask({ tasks })}
            />
          </LoadingError>
        }
        footer={
          <PlanningFooter
            tasksLength={tasksLength}
            onClickStartSession={handleClickStartSession({ focusSessions })}
          />
        }
      />

      {editTaskModal.showDialog && (
        <EditTaskModal
          task={task?.data}
          onClose={handleCloseEditTaskModal({ editTaskModal })}
          onDelete={handleClickDeleteTask({
            deleteConfirmation,
          })}
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
