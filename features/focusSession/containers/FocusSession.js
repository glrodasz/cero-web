import PropTypes from 'prop-types'
import { useEffect, useCallback, useMemo } from 'react'
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
  createHandlerPauseChronometer,
} from '../handlers.js'

import useEditTaskModal from '../../tasks/hooks/useEditTaskModal'
import useTasks from '../../tasks/hooks/useTasks'
import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import useBreaktimeTimer from '../hooks/useBreaktimeTimer'
import useFocusSessions from '../hooks/useFocusSessions'
import useFocusSession from '../hooks/useFocusSession'
import useTime from '../../common/hooks/useTime'

import { getChronometerStartTime } from '../helpers'
import isEmpty from '../../../utils/isEmpty'
import isObject from '../../../utils/isObject'
import time from '../../../utils/time'

import useChrommeter from '../hooks/useChronometer'

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

  // const activePause = getActivePause({ focusSession })
  // const isPaused = useMemo(
  //   () => isObject(activePause) && !isEmpty(activePause),
  //   [activePause]
  // )

  // const startTime = useMemo(() => focusSession?.data?.startTime ?? 0, [
  //   focusSession?.data?.startTime,
  // ])
  // const pauseStartTime = useMemo(() => activePause?.startTime ?? 0, [
  //   activePause?.startTime,
  // ])

  // useEffect(() => {
  //   console.log(
  //     '>>>startTime',
  //     startTime,
  //     '>>>pauseStartTime',
  //     pauseStartTime,
  //     isPaused
  //   )
  // }, [startTime, pauseStartTime, isPaused])

  // const { currentTime, clearTime, resumeTime } = useChrommeter({
  //   startTime,
  //   pauseStartTime,
  //   isPaused,
  // })

  const activePause = getActivePause({ focusSession })
  const isPaused = isObject(activePause) && !isEmpty(activePause)

  const activeFocusSessionStartTime = useMemo(
    () =>
      getChronometerStartTime({
        focusSessionTimestamp:
          focusSession?.data?.startTime +
          (activePause ? Date.now() - activePause.startTime : 0),
      }),
    [focusSession?.data?.startTime, activePause]
  )

  const { currentTime, clearTime, resumeTime } = useTime({
    startTime: activeFocusSessionStartTime,
  })

  useEffect(() => {
    if (isPaused) {
      clearTime()
    }
  }, [isPaused])

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
