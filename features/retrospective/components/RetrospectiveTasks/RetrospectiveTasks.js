import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Accordion, Paragraph, Spacer } from '@glrodasz/components'

const RetrospectiveTasks = ({ sections }) => {
  return (
    <div>
      {sections.map(({ status, title, tasks }, index) => (
        <Fragment key={status}>
          {index > 0 && <Spacer.Vertical size="sm" />}
          <Accordion title={title}>
            {tasks.length ? (
              tasks.map((task) => (
                <Fragment key={task.id}>
                  <Spacer.Vertical size="xs" />
                  <Paragraph>{task.description}</Paragraph>
                </Fragment>
              ))
            ) : (
              <>
                <Spacer.Vertical size="xs" />
                <Paragraph color="muted">Sin tareas</Paragraph>
              </>
            )}
          </Accordion>
        </Fragment>
      ))}
    </div>
  )
}

RetrospectiveTasks.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tasks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            .isRequired,
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
}

export default RetrospectiveTasks
