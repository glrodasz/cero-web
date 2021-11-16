import Request from './request'

class FocusSession extends Request {
  create() {
    return this.fetch('focus-sessions', {
      method: 'post',
      body: { status: 'active' },
    })
  }

  finish({ id }) {
    // FIXME: return this.fetch(`focus-sessions/${id}/finish`, {
    return this.fetch(`focus-sessions/${id}`, {
      method: 'patch',
      body: { status: 'finished' },
    })
  }

  getActives() {
    // FIXME: return this.fetch('focus-sessions/active')
    return this.fetch('focus-sessions?status=active')
  }
}

export default FocusSession
