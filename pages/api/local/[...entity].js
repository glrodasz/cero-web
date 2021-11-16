import Request from '../../../api/request'

const JSON_SERVER_URL = process.env.JSON_SERVER_URL
const API_BASENAME = '/api/local/'

export default async function handler(req, res) {
  const [resource] = req.query.entity
  const request = new Request(resource, JSON_SERVER_URL)

  const url = `${req.url.replace(API_BASENAME, '')}`

  const options = {
    method: req.method.toUpperCase(),
    body: req.method !== 'GET' ? req.body : undefined,
  }

  try {
    const jsonServerResponse = await request.fetch(url, options)
    res.status(200).json(jsonServerResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
