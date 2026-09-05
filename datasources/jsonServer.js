import Request from '../api/request'

// Local development: `.env.development` sets `JSON_SERVER_URL`, so every
// `/api/local` handler proxies straight through to `json-server` (`db.json`,
// port 3001) with no other code path involved.
const fetchFromJsonServer = ({ resource, url, options }) =>
  new Request(resource, process.env.JSON_SERVER_URL).fetch(url, options)

export default fetchFromJsonServer
