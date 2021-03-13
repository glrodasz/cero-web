import PropTypes from 'prop-types'
import { useQueryCache } from 'react-query'

import {
  FullHeightContent,
  Button,
  Spacer,
  Heading,
  Paragraph,
  AddButton,
  CenteredContent,
  Modal,
  LoadingError,
} from '@glrodasz/components'

import TaskList from '../components/TaskList'
import UserHeader from '../../common/components/UserHeader/UserHeader'

import { MAXIMUM_BACKLOG_QUANTITY } from '../constants'

import useDeleteConfirmation from '../hooks/useDeleteConfirmation'
import useTasks from '../hooks/useTasks'
import useFocusSessions from '../hooks/useFocusSessions'

import {
  handleDragEnd,
  handleDeleteTask,
  handleAddTask,
  handleClickCancelRemove,
  handleClickConfirmRemove,
  handleClickStartSession,
} from '../handlers'

const PlanningContainer = ({ initialData }) => {
  const queryCache = useQueryCache()

  const deleteConfirmation = useDeleteConfirmation()

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
            {tasks.data?.length == 0 && (
              <>
                <Spacer.Horizontal size="lg" />
                <Heading size="lg">
                  Ahora dime, ¿cuál es la primera tarea en la que trabajarás
                  hoy?
                </Heading>
              </>
            )}
            <TaskList
              tasks={tasks.data}
              onDragEnd={handleDragEnd({
                tasksData: tasks.data,
                tasksApi: tasks.api,
                tasksSetLocalData: tasks.setLocalData,
              })}
              onDeleteTask={handleDeleteTask({
                setTaskId: deleteConfirmation.setTaskId,
                setShowDialog: deleteConfirmation.setShowDialog,
              })}
            />
            {tasks.data?.length === 1 && (
              <>
                <Spacer.Horizontal size="md" />
                <Heading size="lg">
                  Continúa listando las demás tareas de tu día...
                </Heading>
              </>
            )}
            {tasks.data?.length < MAXIMUM_BACKLOG_QUANTITY && (
              <>
                <Spacer.Horizontal size="md" />
                <AddButton
                  onAdd={handleAddTask({
                    tasks: tasks.data,
                    tasksApi: tasks.api,
                  })}
                  focusHelpText="Presiona enter"
                  blurHelpText="Clic para continuar"
                >
                  Toca para agregar la tarea
                </AddButton>
              </>
            )}
          </LoadingError>
        }
        footer={
          !!tasks.data?.length >= 1 && (
            <>
              <Spacer.Horizontal size="lg" />
              <Paragraph size="sm">
                Basados en la matriz de Eisenhower priorizamos tus tareas
                evitando listas de pendientes saturadas.
              </Paragraph>
              <Spacer.Horizontal size="sm" />
              <Button
                onClick={handleClickStartSession({
                  focusSessionsApi: focusSessions.api,
                })}
                isDisabled
                type="primary"
              >
                Empieza ahora
              </Button>
            </>
          )
        }
      />
      {deleteConfirmation.showDialog && (
        <Modal type="secondary">
          <CenteredContent>
            <Heading size="xl">
              ¿Estás seguro de querer eliminar esta tarea?
            </Heading>
            <Spacer.Horizontal size="md" />
            <Paragraph>La tarea se eliminará de manera permanente.</Paragraph>
            <Spacer.Horizontal size="sm" />
            <Button
              type="secondary"
              onClick={handleClickCancelRemove({
                setTaskId: deleteConfirmation.setTaskId,
                setShowDialog: deleteConfirmation.setShowDialog,
              })}
            >
              No, Regresar
            </Button>
            <Spacer.Horizontal size="xs" />
            <Button
              type="primary"
              onClick={handleClickConfirmRemove({
                taskId: deleteConfirmation.taskId,
                tasksApi: tasks.api,
                setShowDialog: deleteConfirmation.setShowDialog,
              })}
            >
              Sí, eliminar
            </Button>
          </CenteredContent>
        </Modal>
      )}
    </>
  )
}

PlanningContainer.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
    })
  ),
}

export default PlanningContainer
