import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
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
import PauseTimer from '../components/PauseTimer'

import EditTask from '../../tasks/containers/EditTask'

import {
  createDeleteTaskHandler,
  createCancelRemoveHandler,
  createConfirmRemoveHandler,
  createDragEndTaskHandler,
  createAddTaskHandler,
  createOpenEditTaskModalHandler,
} from '../../tasks/handlers'

import {
  createCloseBreaktimeConfirmationHandler,
  createCloseBreaktimeTimerHandler,
  createChooseBreaktimeHandler,
  createEndSessionHandler,
  createCheckCompleteTaskHandler,
  createPauseChronometerHandler,
  createClosePauseTimerHandler,
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
  MAXIMUM_IN_PRIORITY_TASKS,
} from '../../../config'
import { COMPLETED_COLUMN_ID } from '../../tasks/constants'
import useDialog from '../../common/hooks/useDialog'

const getActivePause = ({ focusSession }) => {
  return focusSession?.data?.pauses?.find((pause) => pause.endTime === null)
}

const FocusSession = ({ initialData }) => {
  const { user, isLoading: isLoadingUser, error: errorUser } = useUser()
  const deleteConfirmation = useDeleteConfirmation()
  const breaktimeConfirmation = useBreaktimeConfirmation()
  const breaktimeTimer = useBreaktimeTimer()
  const editTaskModal = useEditTaskModal()
  const pauseTimer = useDialog()
  const [renderChronometer, setRenderChronometer] = useState(false)

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

  useEffect(() => setRenderChronometer(true), [])

  const focusSessions = useFocusSessions()

  const tasksLength = tasks.data?.filter(
    (task) => task.status !== COMPLETED_COLUMN_ID
  )?.length
  const shouldShowAddTaskButton =
    tasksLength < MAXIMUM_BACKLOG_QUANTITY + MAXIMUM_IN_PRIORITY_TASKS

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
            {renderChronometer && (
              <Chronometer
                currentTime={currentTime}
                isPaused={isPaused}
                onPause={createPauseChronometerHandler({
                  focusSession,
                  pauseTimer,
                  clearTime,
                })}
              />
            )}
            <Board
              isActive
              tasks={tasks.data}
              onDragEnd={createDragEndTaskHandler({ tasks })}
              actions={{
                onDeleteTask: createDeleteTaskHandler({
                  deleteConfirmation,
                }),
                onCompleteTask: createCheckCompleteTaskHandler({
                  breaktimeConfirmation,
                  tasks,
                }),
                onEditTask: createOpenEditTaskModalHandler({
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
                  onAddTask={createAddTaskHandler({ tasks })}
                />
              </>
            )}
          </LoadingError>
        }
        footer={
          <FocusSessionFooter
            onClickEndSession={createEndSessionHandler({
              focusSessions,
            })}
          />
        }
      />
      {breaktimeConfirmation.showDialog && (
        <BreaktimeConfirmation
          onClose={createCloseBreaktimeConfirmationHandler({
            breaktimeConfirmation,
          })}
          onChoose={createChooseBreaktimeHandler({
            breaktimeTimer,
            breaktimeConfirmation,
            focusSession,
          })}
        />
      )}
      {breaktimeTimer.showDialog && (
        <BreaktimeTimer
          breaktime={breaktimeTimer.time}
          onClose={createCloseBreaktimeTimerHandler({
            breaktimeTimer,
            focusSession,
          })}
        />
      )}
      {pauseTimer.showDialog && (
        <PauseTimer
          onClose={createClosePauseTimerHandler({
            pauseTimer,
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
          onClickCancel={createCancelRemoveHandler({ deleteConfirmation })}
          onClickConfirm={createConfirmRemoveHandler({
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
