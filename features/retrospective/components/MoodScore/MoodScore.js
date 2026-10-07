import PropTypes from 'prop-types'
import { Paragraph, Score, Spacer } from '@glrodasz/components'

import { SCORE_LABELS } from '../../constants'

// `Score` shows no selection of its own, so the chosen face is named below it.
const MoodScore = ({ score, onClickScore }) => {
  return (
    <>
      <Score onClickScore={onClickScore} />
      {score !== null && (
        <>
          <Spacer.Vertical size="xs" />
          <Paragraph isCentered weight="medium">
            {`Te sentiste: ${SCORE_LABELS[score]}`}
          </Paragraph>
        </>
      )}
    </>
  )
}

MoodScore.propTypes = {
  score: PropTypes.number,
  onClickScore: PropTypes.func.isRequired,
}

MoodScore.defaultProps = {
  score: null,
}

export default MoodScore
