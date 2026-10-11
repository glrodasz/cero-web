import PropTypes from 'prop-types'
import {
  Spacer,
  Heading,
  LoadingError,
  Paragraph,
  Textarea,
} from '@glrodasz/components'

import PageLayout from '../../common/components/PageLayout'
import MoodScore from '../components/MoodScore'
import RetrospectiveFooter from '../components/RetrospectiveFooter'
import RetrospectiveTasks from '../components/RetrospectiveTasks'

import {
  createBlockersChangeHandler,
  createRegisterSessionHandler,
  createScoreHandler,
  createSkipRegisterSessionHandler,
} from '../handlers'
import { getTaskSections } from '../helpers'

import useRetrospectiveFeedback from '../hooks/useRetrospectiveFeedback'
import useFocusSessions from '../../focusSession/hooks/useFocusSessions'
import useTasks from '../../tasks/hooks/useTasks'
import httpCodes from '../../../utils/httpCodes'

const Retrospective = ({ initialData }) => {
  const tasks = useTasks({ initialData: initialData.tasks })
  const focusSessions = useFocusSessions()
  const feedback = useRetrospectiveFeedback()

  return (
    <PageLayout
      content={
        <LoadingError
          isLoading={tasks.isLoading}
          errorMessage={tasks.error?.message}
        >
          <RetrospectiveTasks sections={getTaskSections(tasks.data)} />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <>
              <Spacer.Vertical size="lg" />
              <div>
                <Heading size="xl">¿Cómo te sentiste en esta sesión?</Heading>
                <Spacer.Vertical size="sm" />
                <MoodScore
                  score={feedback.score}
                  onClickScore={createScoreHandler({ feedback })}
                />
              </div>
              <Spacer.Vertical size="md" />
              <Heading size="xl">¿Qué bloqueos tuviste? (opcional)</Heading>
              <Spacer.Vertical size="sm" />
              <Paragraph>
                Durante el día, existen distractores y escribirlos te ayuda a
                identificarlos para mantenerte enfocado y saludable.
              </Paragraph>
              <Spacer.Vertical size="md" />
              <Textarea
                placeholder="Escribe acá..."
                onChange={createBlockersChangeHandler({ feedback })}
              />
            </>
          </div>
        </LoadingError>
      }
      footer={
        <RetrospectiveFooter
          isRegisterDisabled={feedback.score === null}
          isRegistering={focusSessions.isFinishing}
          hasRegisterError={
            !!focusSessions.finishError &&
            focusSessions.finishError.status !== httpCodes.NOT_FOUND
          }
          onClickRegisterSession={createRegisterSessionHandler({
            focusSessions,
            feedback,
          })}
          onClickSkipRegisterSession={createSkipRegisterSessionHandler({
            focusSessions,
          })}
        />
      }
    />
  )
}

Retrospective.propTypes = {
  initialData: PropTypes.shape({
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        status: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }),
}

Retrospective.defaultProps = {
  initialData: {},
}

export default Retrospective
