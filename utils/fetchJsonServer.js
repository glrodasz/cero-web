import Request from '../api/request'
const JSON_SERVER_URL = process.env.JSON_SERVER_URL

const fetchJsonServer = async ({ resource, url, options, res }) => {
  try {
    const request = new Request(resource, JSON_SERVER_URL)
    const jsonServerResponse = await request.fetch(url, options)
    return res
      ? res.status(200).json(jsonServerResponse)
      : Promise.resolve(jsonServerResponse)
  } catch (error) {
    return res
      ? res.status(500).json({ error: error.message })
      : Promise.reject(error)
  }
}

export default fetchJsonServer
