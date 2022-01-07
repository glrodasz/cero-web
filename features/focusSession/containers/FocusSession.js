import PropTypes from 'prop-types'

import {
  FullHeightContent,
  LoadingError,
  Link,
  Spacer,
} from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'
import Board from '../../tasks/components/Board'
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal'
import BreaktimeConfirmation from '../components/BreaktimeConfirmation'
import BreaktimeTimer from '../components/BreaktimeTimer'
import FocusSessionFooter from '../components/FocusSessionFooter'

import EditTask from '../../tasks/containers/EditTask'

import {
  handleDeleteTask,
  handleCancelRemove,
  handleConfirmRemove,
  handleDragEndTask,
  handleOpenEditTaskModal,
} from '../../tasks/handlers'

import {
  handleClickCloseBreaktimeConfirmation,
  handleClickCloseBreaktimeTimer,
  handleClickChooseBreaktime,
  handleClickEndSession,
  handleCheckCompleteTask,
} from '../handlers.js'

import useEditTaskModal from '../../tasks/hooks/useEditTaskModal'
import useTasks from '../../tasks/hooks/useTasks'
import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import useBreaktimeTimer from '../hooks/useBreaktimeTimer'
import useFocusSessions from '../hooks/useFocusSessions'
import { useUser } from '@auth0/nextjs-auth0'
import Chronometer from '../components/Chronometer'

const FocusSession = ({ initialData }) => {
  const { user, isLoading: isLoadingUser, error: errorUser } = useUser()
  const deleteConfirmation = useDeleteConfirmation()
  const breaktimeConfirmation = useBreaktimeConfirmation()
  const breaktimeTimer = useBreaktimeTimer()
  const editTaskModal = useEditTaskModal()

  const tasks = useTasks({
    initialData: initialData.tasks,
    onRemove: () => {
      deleteConfirmation.setTaskId(null)
      editTaskModal.setShowDialog(false)
    },
  })

  const focusSessions = useFocusSessions()

  return (
    <>
      <FullHeightContent
        content={
          <LoadingError
            isLoading={tasks.isLoading}
            errorMessage={tasks.error?.message}
          >
            <LoadingError
              isLoading={isLoadingUser}
              errorMessage={errorUser?.message}
            >
              <UserHeader
                avatar={user?.picture}
                title={`Hola, ${user?.name}`}
                text={
                  <>
                    <span>Conoce la metodologia</span> <Link>RETO</Link>
                  </>
                }
              />
            </LoadingError>
            <Spacer.Vertical size="sm" />
            <Chronometer />
            <Board
              isActive
              tasks={tasks.data}
              onDragEnd={handleDragEndTask({ tasks })}
              actions={{
                onDeleteTask: handleDeleteTask({
                  deleteConfirmation,
                }),
                onCompleteTask: handleCheckCompleteTask({
                  breaktimeConfirmation,
                  tasks,
                }),
                onEditTask: handleOpenEditTaskModal({
                  tasks,
                  editTaskModal,
                }),
              }}
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
        <BreaktimeConfirmation
          onClickClose={handleClickCloseBreaktimeConfirmation({
            breaktimeConfirmation,
          })}
          onClickChoose={handleClickChooseBreaktime({
            breaktimeTimer,
            breaktimeConfirmation,
          })}
        />
      )}
      {breaktimeTimer.showDialog && (
        <BreaktimeTimer
          breaktime={breaktimeTimer.time}
          onClose={handleClickCloseBreaktimeTimer({ breaktimeTimer })}
        />
      )}
      <EditTask
        editTaskModal={editTaskModal}
        deleteConfirmation={deleteConfirmation}
      />
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

FocusSession.propTypes = {
  initialData: PropTypes.object,
}

export default FocusSession
