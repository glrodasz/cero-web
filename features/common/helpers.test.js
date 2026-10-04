import { DEMO_USER } from './auth'
import { getGreeting } from './helpers'

describe('[ features / common / helpers ]', () => {
  describe('#getGreeting', () => {
    describe('when the user has a name', () => {
      it('should greet them by it', () => {
        // Arrange
        const user = { sub: 'auth0|ana', name: 'Ana' }

        // Act
        const result = getGreeting('Hola', user)
        const expected = 'Hola, Ana'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when the user is the demo user', () => {
      it('should leave the name out', () => {
        // Act
        const result = getGreeting('Hola', DEMO_USER)
        const expected = 'Hola'

        // Assert
        expect(result).toBe(expected)
      })
    })

    describe('when there is no name to show', () => {
      it.each([[undefined], [{ sub: 'auth0|nameless' }]])(
        'should leave the name out for %p',
        (user) => {
          // Act
          const result = getGreeting('Buenos días', user)
          const expected = 'Buenos días'

          // Assert
          expect(result).toBe(expected)
        }
      )
    })
  })
})
