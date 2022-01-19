import Request from './request'

class FocusSession extends Request {
  create() {
    return this.fetch('focus-sessions', {
      method: 'post',
    })
  }

  finish({ id }) {
    // FIXME: return this.fetch(`focus-sessions/${id}/finish`, {
    return this.fetch(`focus-sessions/${id}`, {
      method: 'patch',
      body: { status: 'finished' },
    })
  }

  getActive() {
    return this.fetch('focus-sessions/active')
  }
}

export default FocusSession
