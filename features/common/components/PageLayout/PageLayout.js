import PropTypes from 'prop-types'

import styles from './PageLayout.module.css'

// The page's content with its main actions underneath. The footer sits at the
// bottom of the screen when the content is short, and floats over it once the
// content scrolls, so the primary action is always within reach.
const PageLayout = ({ content, footer }) => {
  return (
    <div className={styles['page-layout']}>
      <div className={styles.content}>{content}</div>
      <div className={styles.footer}>{footer}</div>
    </div>
  )
}

PageLayout.propTypes = {
  content: PropTypes.node.isRequired,
  footer: PropTypes.node,
}

export default PageLayout
