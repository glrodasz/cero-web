import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  FullHeightContent,
  Button,
  Spacer,
  Picture,
  Heading,
  Paragraph,
  Modal,
  CenteredContent,
} from '@glrodasz/components'

// TODO: Move to the common components
import TaskList from '../../planning/components/TaskList'
import UserHeader from '../../common/components/UserHeader/UserHeader'

const FocusSessionContainer = ({ initialData }) => {
  // FIXME: use initial data with react query
  const { tasks } = initialData

  const [showModal, setShowModal] = useState(false)
  const onCloseModal = () => {
    setShowModal(false)
  }

  const onCompleteTask = () => {
    setShowModal(true)
  }

  const onDragEnd = () => {}
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
              onCompleteTask={onCompleteTask}
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
      {showModal && (
        <Modal onClose={onCloseModal} isCentered>
          <CenteredContent>
            <Picture src="/images/couch-pause.svg" width={200}></Picture>
            <Heading size="xl" color="tertiary" isInline>
              Tomate un tiempo para refrescarte
            </Heading>
            <Spacer.Horizontal size=" sm" />
            <Paragraph>
              Siempre hay que celebrar los pequeños triunfos, por eso te
              invitamos a tomar un descanso para despejar tu mente.
            </Paragraph>
            <Spacer.Horizontal size="md" />
            <div style={{ display: 'flex', gap: '0 20px' }}>
              <Button isMuted>5 min</Button>
              <Button isMuted>10 min</Button>
              <Button isMuted>15 min</Button>
            </div>
          </CenteredContent>
        </Modal>
      )}
    </>
  )
}

FocusSessionContainer.propTypes = {
  initialData: PropTypes.object,
}

export default FocusSessionContainer
