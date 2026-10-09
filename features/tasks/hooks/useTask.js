import { tasksApi } from '../../common/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useLocalData from '../../common/hooks/useLocalData'

const QUERY_KEY = 'task'
const UPDATE_MUTATION_KEY = [QUERY_KEY, 'update']

const useTask = ({ id }) => {
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: fetchedData,
  } = useQuery([QUERY_KEY, id], () => tasksApi.getById({ id }))

  // Every edit in the task detail saves on its own, so the change shows right
  // away and is rolled back if the write fails.
  const { mutate: update, error: updateError } = useMutation(
    (params) => tasksApi.update(params),
    {
      mutationKey: UPDATE_MUTATION_KEY,
      onMutate: async ({ id, task }) => {
        await queryClient.cancelQueries([QUERY_KEY, id])
        const previousTask = queryClient.getQueryData([QUERY_KEY, id])
        queryClient.setQueryData([QUERY_KEY, id], (currentTask) => ({
          ...currentTask,
          ...task,
        }))
        return { previousTask }
      },
      onError: (_error, { id }, context) => {
        queryClient.setQueryData([QUERY_KEY, id], context?.previousTask)
      },
      onSettled: () => {
        // Refetching while a later edit is still in flight would briefly
        // bring back the value it is replacing; the last one to settle
        // refetches for all of them. Invalidating by the bare string also
        // refreshes the board's `tasks` query.
        if (queryClient.isMutating({ mutationKey: UPDATE_MUTATION_KEY }) > 1)
          return

        queryClient.invalidateQueries(QUERY_KEY)
      },
    }
  )

  const { localData, setLocalData } = useLocalData(fetchedData)

  return {
    isLoading,
    error,
    updateError,
    data: localData,
    setLocalData,
    api: {
      update,
    },
  }
}

export default useTask
