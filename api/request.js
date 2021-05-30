import { apiUrl } from '../config'

class Request {
  constructor(resource) {
    this.resource = resource
  }

  request(resource = this.resource, options = {}) {
    const method = options.method ? options.method.toUpperCase() : 'GET'
    const requestOptions = { ...options, method }

    requestOptions.headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body)
    }

    return fetch(`${apiUrl}/${resource}`, requestOptions).then((data) =>
      data.json()
    )
  }
}

export default Request
