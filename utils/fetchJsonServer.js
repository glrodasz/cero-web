import Request from '../api/request'
const JSON_SERVER_URL = process.env.JSON_SERVER_URL

const fetchJsonServer = async ({ resource, url, options, res, singular }) => {
  try {
    const request = new Request(resource, JSON_SERVER_URL)
    let result = await request.fetch(url, options)

    if (singular && Array.isArray(result)) {
      result = result[0]
    }

    return res ? res.status(200).json(result) : Promise.resolve(result)
  } catch (error) {
    return res
      ? res.status(500).json({ error: error.message })
      : Promise.reject(error)
  }
}

export default fetchJsonServer
