// TODO: refactor Request utility an use it here
const jsonFetch = (url, options) =>
  fetch(url, options).then((response) => response.json())

const JSON_SERVER_URL = process.env.JSON_SERVER_URL

export default async function handler(req, res) {
  const url = `${JSON_SERVER_URL}/${req.url.replace('/api/local/', '')}`
  // FIXME: JSON.stringify the body
  const options = {
    method: req.method.toUpperCase(),
    body: req.method !== 'GET' ? req.body : undefined,
  }

  try {
    const jsonServerResponse = await jsonFetch(url, options)
    res.status(200).json(jsonServerResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
