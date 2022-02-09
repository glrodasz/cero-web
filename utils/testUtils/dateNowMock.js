const dateNowMock = () =>
  jest.fn(() => new Date('1970-01-01T02:00:00.000Z').getTime())

export default dateNowMock
