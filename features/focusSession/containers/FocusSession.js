import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useUser } from '@auth0/nextjs-auth0'

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
import Chronometer from '../components/Chronometer'
import AddTaskButton from '../../planning/components/AddTaskButton'

import EditTask from '../../tasks/containers/EditTask'

import {
  handleDeleteTask,
  handleCancelRemove,
  handleConfirmRemove,
  handleDragEndTask,
  handleAddTask,
  handleOpenEditTaskModal,
} from '../../tasks/handlers'

import {
  handleClickCloseBreaktimeConfirmation,
  handleClickCloseBreaktimeTimer,
  handleClickChooseBreaktime,
  handleClickEndSession,
  handleCheckCompleteTask,
  createHandlerPauseChronometer,
} from '../handlers.js'

import useEditTaskModal from '../../tasks/hooks/useEditTaskModal'
import useTasks from '../../tasks/hooks/useTasks'
import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import useBreaktimeTimer from '../hooks/useBreaktimeTimer'
import useFocusSessions from '../hooks/useFocusSessions'
import useFocusSession from '../hooks/useFocusSession'
import useChronometer from '../hooks/useChronometer'

import isEmpty from '../../../utils/isEmpty'
import isObject from '../../../utils/isObject'

import {
  MAXIMUM_BACKLOG_QUANTITY,
  MAXIMUN_IN_PRIORITY_TASKS,
} from '../../../config'
import { COMPLETED_COLUMN_ID } from '../../tasks/constants'

const getActivePause = ({ focusSession }) => {
  return focusSession?.data?.pauses?.find((pause) => pause.endTime === null)
}

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

  const focusSession = useFocusSession({
    initialData: initialData.activeFocusSession,
    onResume: () => resumeTime(),
  })

  const activePause = getActivePause({ focusSession })
  const isPaused = isObject(activePause) && !isEmpty(activePause)

  const startTime = useMemo(
    () => focusSession?.data?.startTime ?? 0,
    [focusSession?.data?.startTime]
  )
  const pauseStartTime = useMemo(
    () => activePause?.startTime ?? 0,
    [activePause?.startTime]
  )

  const { currentTime, clearTime, resumeTime } = useChronometer({
    startTime,
    pauseStartTime,
    isPaused,
  })

  const focusSessions = useFocusSessions()

  const tasksLength = tasks.data?.filter(
    (task) => task.status !== COMPLETED_COLUMN_ID
  )?.length
  const shouldShowAddTaskButton =
    tasksLength < MAXIMUM_BACKLOG_QUANTITY + MAXIMUN_IN_PRIORITY_TASKS

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
            <Chronometer
              currentTime={currentTime}
              isPaused={isPaused}
              onPause={createHandlerPauseChronometer({
                focusSession,
                clearTime,
              })}
            />
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
            {shouldShowAddTaskButton && (
              <>
                <Spacer.Vertical size="lg" />
                <AddTaskButton
                  id="focus-session"
                  isShown={shouldShowAddTaskButton}
                  onAddTask={handleAddTask({ tasks })}
                />
              </>
            )}
          </LoadingError>
        }
        footer={
          <FocusSessionFooter
            onClickEndSession={handleClickEndSession({
              focusSessions,
            })}
          />
        }
      />
      {breaktimeConfirmation.showDialog && (
        <BreaktimeConfirmation
          onClose={handleClickCloseBreaktimeConfirmation({
            breaktimeConfirmation,
          })}
          onChoose={handleClickChooseBreaktime({
            breaktimeTimer,
            breaktimeConfirmation,
            focusSession,
          })}
        />
      )}
      {breaktimeTimer.showDialog && (
        <BreaktimeTimer
          breaktime={breaktimeTimer.time}
          onClose={handleClickCloseBreaktimeTimer({
            breaktimeTimer,
            focusSession,
          })}
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
