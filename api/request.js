import { API_URL } from '../config'

class Request {
  constructor(resource, baseUrl) {
    this.resource = resource
    this.baseUrl = baseUrl
  }

  fetch(resource = this.resource, options = {}) {
    const method = options.method ? options.method.toUpperCase() : 'GET'
    const requestOptions = { ...options, method }

    requestOptions.headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    })

    if (options.body) {
      requestOptions.body = JSON.stringify(options.body)
    }

    const baseUrl = this.baseUrl ?? API_URL

    return fetch(`${baseUrl}/${resource}`, requestOptions).then((data) =>
      data.json()
    )
  }
}

export default Request
