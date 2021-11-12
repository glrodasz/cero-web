import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import { FullHeightContent, LoadingError, Link } from '@glrodasz/components'

import UserHeader from '../../common/components/UserHeader'
import Board from '../../tasks/components/Board'
import DeleteTaskModal from '../../tasks/components/DeleteTaskModal'
import BreaktimeConfirmation from '../components/BreaktimeConfirmation'
import BreaktimeTimer from '../components/BreaktimeTimer'
import FocusSessionFooter from '../components/FocusSessionFooter'

// TODO: Move to tasks features
import {
  handleClickDeleteTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleDragEndTask,
} from '../../planning/handlers'

import {
  handleClickCloseBreaktimeConfirmation,
  handleClickCloseBreaktimeTimer,
  handleClickChooseBreaktime,
  handleClickEndSession,
  handleCheckCompleteTask,
} from '../handlers.js'

import useTasks from '../../tasks/hooks/useTasks'
import useDeleteConfirmation from '../../tasks/hooks/useDeleteConfirmation'
import useBreaktimeConfirmation from '../hooks/useBreaktimeConfirmation'
import useBreaktimeTimer from '../hooks/useBreaktimeTimer'
import useFocusSessions from '../hooks/useFocusSessions'

const FocusSession = ({ initialData }) => {
  const queryCache = useQueryCache()

  const deleteConfirmation = useDeleteConfirmation()
  const breaktimeConfirmation = useBreaktimeConfirmation()
  const breaktimeTimer = useBreaktimeTimer()

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
              text={
                <>
                  <span>Conoce la metodologia</span> <Link>RETO</Link>
                </>
              }
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
          onClickClose={handleClickCloseBreaktimeTimer({ breaktimeTimer })}
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
