/* eslint-disable react-hooks/rules-of-hooks */
import { renderHook } from '@testing-library/react-hooks'
import useFocusSessions, {
  createMutation,
  finishMutation,
} from './useFocusSessions'

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => {},
  useMutation: jest
    .fn()
    .mockImplementationOnce(() => ({ mutateAsync: 'create' }))
    .mockImplementationOnce(() => ({ mutateAsync: 'finish' })),
}))

import { focusSessionsApi } from '../../planning/api'
jest.mock('../../planning/api', () => ({
  focusSessionsApi: {
    create: jest.fn(),
    finish: jest.fn(),
  },
}))

describe('[ features / focusSession / hooks / useFocusSessions ]', () => {
  describe('#default', () => {
    describe('when `useFocusSessions` is called', () => {
      it('should return a `api` object with `{ create, finish }`', () => {
        // Arrange
        const params = {}
        const hook = () => useFocusSessions(params)

        // Act
        const { result: hookResult } = renderHook(hook)
        const result = hookResult.current.api
        const expected = { create: 'create', finish: 'finish' }

        // Assert
        expect(result).toStrictEqual(expected)
      })
    })
  })

  describe('#createMutation', () => {
    describe('when `createMutation` is called', () => {
      it('should call `focusSessionsApi.create`', () => {
        // Arange
        const params = { id: 'foo' }

        // Act
        createMutation(params)

        // Assert
        expect(focusSessionsApi.create).toHaveBeenCalledWith({ id: 'foo' })
      })
    })
  })

  describe('#finishMutation', () => {
    describe('when `finishMutation` is called', () => {
      it('should call `focusSessionsApi.finish`', () => {
        // Arange
        const params = { id: 'bar' }

        // Act
        finishMutation(params)

        // Assert
        expect(focusSessionsApi.finish).toHaveBeenCalledWith({ id: 'bar' })
      })
    })
  })
})
