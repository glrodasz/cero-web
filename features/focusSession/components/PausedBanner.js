import PropTypes from 'prop-types'
import { Button, Paragraph, Spacer } from '@glrodasz/components'

// A pause outlives its modal: a reload, or a phone closing the tab during a
// break, brings the user back to a stopped clock. This says so.
const PausedBanner = ({ onResume }) => {
  return (
    <div role="status">
      <Spacer.Vertical size="sm" />
      <Paragraph weight="medium" isCentered>
        Tu sesión está en pausa
      </Paragraph>
      <Spacer.Vertical size="xs" />
      <Button type="secondary" onClick={onResume}>
        Reanudar
      </Button>
    </div>
  )
}

PausedBanner.propTypes = {
  onResume: PropTypes.func.isRequired,
}

export default PausedBanner
