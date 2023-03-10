import Request from './request'

class FocusSession extends Request {
  create() {
    return this.fetch('focus-sessions', {
      method: 'post',
    })
  }

  finish() {
    return this.fetch(`focus-sessions/finish`, {
      method: 'patch',
    })
  }

  getActive() {
    return this.fetch('focus-sessions/active')
  }

  pause({ time } = {}) {
    return this.fetch(`focus-sessions/pause`, {
      method: 'patch',
      body: { time },
    })
  }

  resume() {
    return this.fetch(`focus-sessions/resume`, {
      method: 'patch',
    })
  }
}

export default FocusSession
