import useDialogWithState from '../../common/hooks/useDialogWithState'

const useBreaktimeTimer = () => {
  const { value: time, setValue: setTime, ...dialog } = useDialogWithState()

  return { ...dialog, time, setTime }
}

export default useBreaktimeTimer
