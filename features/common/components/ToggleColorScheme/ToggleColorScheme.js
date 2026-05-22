import { Check, Heading } from '@glrodasz/components'

import { createClickHandler } from './handlers'
import useColorScheme from '../../hooks/useColorScheme'

const ToggleColorScheme = () => {
  const { isDarkMode, setIsDarkMode } = useColorScheme()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        width: 150,
      }}
      onClick={createClickHandler({ isDarkMode, setIsDarkMode })}
    >
      <Check isChecked={isDarkMode} /> <Heading>Dark Mode</Heading>
    </div>
  )
}

export default ToggleColorScheme
