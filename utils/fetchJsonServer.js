import Request from '../api/request'
const JSON_SERVER_URL = process.env.JSON_SERVER_URL

const fetchJsonServer = async ({ resource, url, options, res }) => {
  try {
    const request = new Request(resource, JSON_SERVER_URL)
    const jsonServerResponse = await request.fetch(url, options)
    res.status(200).json(jsonServerResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default fetchJsonServer
