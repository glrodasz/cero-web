import { createClickHandler } from './handlers'
import useColorScheme from '../../hooks/useColorScheme'
import styles from './ToggleColorScheme.module.css'

// A switch rather than a checkbox: it applies the moment it's flipped.
const ToggleColorScheme = () => {
  const { isDarkMode, setIsDarkMode } = useColorScheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      className={styles.toggle}
      onClick={createClickHandler({ isDarkMode, setIsDarkMode })}
    >
      <span className={styles.label}>Dark mode</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </button>
  )
}

export default ToggleColorScheme
