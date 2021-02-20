import React from 'react'

import {
  FullHeightContent,
  Button,
  Avatar,
  Spacer,
  Heading,
  Paragraph,
  AddButton,
} from '@glrodasz/components'

// TODO: Move to the common components
import TaskList from '../../planning/components/TaskList'
import { MAXIMUM_BACKLOG_QUANTITY } from '../../planning/constants'
import UserHeader from '../../common/components/UserHeader/UserHeader'

const FocusSessionContainer = ({ initialData }) => {
  // FIXME: use initial data with react query
  const { tasks } = initialData

  const onDragEnd = (result) => {}
  const deleteTask = () => {}

  return (
    <>
      <FullHeightContent
        content={
          <>
            <UserHeader
              avatar="https://placeimg.com/200/200/people"
              title="Hola, Cristian"
              text="Conoce la metodologia RETO"
            />
            <TaskList
              tasks={tasks}
              onDragEnd={onDragEnd}
              onDeleteTask={deleteTask}
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
          </>
        }
        footer={
          <>
            <Spacer.Horizontal size="lg" />
            <Button onClick={() => {}} isDisabled type="primary">
              Finalizar tu sesión
            </Button>
          </>
        }
      />
    </>
  )
}

export default FocusSessionContainer
