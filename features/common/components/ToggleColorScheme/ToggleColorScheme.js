import { Check, Heading } from '@glrodasz/components'

import { handleClick } from './handlers'
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
      onClick={handleClick({ isDarkMode, setIsDarkMode })}
    >
      <Check isChecked={isDarkMode} /> <Heading>Dark Mode</Heading>
    </div>
  )
}

export default ToggleColorScheme
