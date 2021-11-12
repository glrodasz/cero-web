import Request from './request'

class FocusSession extends Request {
  create() {
    return this.request('focus-sessions', {
      method: 'post',
      body: { status: 'active' },
    })
  }

  finish({ id }) {
    return this.request(`focus-sessions/${id}`, {
      method: 'patch',
      body: { status: 'finished' },
    })
  }

  getActives() {
    // FIXME: return this.request('focus-sessions/active')
    return this.request('focus-sessions?status=active')
  }
}

export default FocusSession
