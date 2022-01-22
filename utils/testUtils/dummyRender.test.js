import { dummyRender } from './dummyRender'

describe('[ utils / testUtils / dummyRender ]', () => {
  describe('when the component is childless', () => {
    it('should render without children', () => {
      // Arrange
      const name = 'Childless'
      const props = { foo: 'bar', foobar: true }

      // Act
      const result = dummyRender(name)(props)
      const expected = '\n[Childless {"foo":"bar","foobar":true} /]'

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('when the component has children', () => {
    it('should render with children', () => {
      // Arrange
      const name = 'WithChildren'
      const props = { foo: 'bar', children: 'children' }

      // Act
      const result = dummyRender(name)(props)
      const expected = '\n[WithChildren {"foo":"bar"}]children[/WithChildren]'

      // Assert
      expect(result).toBe(expected)
    })
  })
})
