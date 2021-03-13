import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQueryCache, useMutation } from 'react-query'

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
import { focusSessionsApi } from '../api'

import { useTasks } from '../hooks/tasks'
import { handleDragEnd, handleDeleteTask } from '../handlers'

const PlanningContainer = ({ initialData }) => {
  const queryCache = useQueryCache()

  // Focus Sessions
  const [createFocusSession] = useMutation(() => focusSessionsApi.create(), {
    onSuccess: () => {
      // Query Invalidations
      queryCache.invalidateQueries('focusSessions')
    },
  })

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null)

  const { tasksData, tasksIsLoading, tasksError, tasksCrud } = useTasks({
    queryCache,
    initialData: initialData.tasks,
    crudCallbacks: {
      delete: () => setCurrentTaskId(null),
    },
  })

  // TODO: It oculd possible live in useTasks
  const [tasks, setTasks] = useState(tasksData)
  useEffect(() => {
    setTasks(tasksData)
  }, [tasksData])

  return (
    <>
      <FullHeightContent
        content={
          <LoadingError
            isLoading={tasksIsLoading}
            errorMessage={tasksError?.message}
          >
            <UserHeader
              avatar="https://placeimg.com/200/200/people"
              title="Hola, Cristian"
              text="Conoce la metodologia RETO"
            />
            {tasks?.length == 0 && (
              <>
                <Spacer.Horizontal size="lg" />
                <Heading size="lg">
                  Ahora dime, ¿cuál es la primera tarea en la que trabajarás
                  hoy?
                </Heading>
              </>
            )}
            <TaskList
              tasks={tasks}
              onDragEnd={handleDragEnd({ tasks, setTasks, tasksCrud })}
              onDeleteTask={handleDeleteTask({
                setCurrentTaskId,
                setShowDeleteConfirmation,
              })}
            />
            {tasks?.length === 1 && (
              <>
                <Spacer.Horizontal size="md" />
                <Heading size="lg">
                  Continúa listando las demás tareas de tu día...
                </Heading>
              </>
            )}
            {tasks?.length < MAXIMUM_BACKLOG_QUANTITY && (
              <>
                <Spacer.Horizontal size="md" />
                <AddButton
                  onAdd={(value) =>
                    tasksCrud.create({
                      description: value,
                      priority: tasks.length,
                    })
                  }
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
          !!tasks?.length >= 1 && (
            <>
              <Spacer.Horizontal size="lg" />
              <Paragraph size="sm">
                Basados en la matriz de Eisenhower priorizamos tus tareas
                evitando listas de pendientes saturadas.
              </Paragraph>
              <Spacer.Horizontal size="sm" />
              <Button
                onClick={() => createFocusSession()}
                isDisabled
                type="primary"
              >
                Empieza ahora
              </Button>
            </>
          )
        }
      />
      {showDeleteConfirmation && (
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
              onClick={() => {
                setShowDeleteConfirmation(false)
                setCurrentTaskId(null)
              }}
            >
              No, Regresar
            </Button>
            <Spacer.Horizontal size="xs" />
            <Button
              type="primary"
              onClick={() => {
                tasksCrud.delete({ id: currentTaskId })
                setShowDeleteConfirmation(false)
              }}
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
