import PropTypes from 'prop-types'
import { render } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import useLocalData from './useLocalData'

const TASKS = [{ id: 1 }]

describe('[ features / common / hooks / useLocalData ]', () => {
  describe('when the fetched data arrives', () => {
    // A child given the stale value next to `isLoading: false` is what crashed
    // the board on a first, client-side load.
    it('should never hand a child the stale value', () => {
      // Arrange
      const received = []
      const Child = ({ data }) => {
        received.push(data)
        return null
      }
      Child.propTypes = { data: PropTypes.arrayOf(PropTypes.shape({})) }
      const Parent = ({ fetchedData }) => {
        const { localData } = useLocalData(fetchedData)
        return <Child data={localData} />
      }
      Parent.propTypes = { fetchedData: PropTypes.arrayOf(PropTypes.shape({})) }
      const { rerender } = render(<Parent fetchedData={undefined} />)

      // Act
      rerender(<Parent fetchedData={TASKS} />)
      const expected = [undefined, TASKS]

      // Assert
      expect(received).toEqual(expected)
    })
  })

  describe('when the data is overridden locally', () => {
    it('should keep the override until the next fetch', () => {
      // Arrange
      const reordered = [{ id: 2 }]
      const refetched = [{ id: 3 }]
      const { result, rerender } = renderHook(
        ({ fetchedData }) => useLocalData(fetchedData),
        { initialProps: { fetchedData: TASKS } }
      )

      // Act
      act(() => result.current.setLocalData(reordered))
      rerender({ fetchedData: TASKS })
      const afterSameData = result.current.localData
      rerender({ fetchedData: refetched })

      // Assert
      expect(afterSameData).toBe(reordered)
      expect(result.current.localData).toBe(refetched)
    })
  })
})
