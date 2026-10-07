import Request from './request'

class FocusSession extends Request {
  create() {
    return this.fetch('focus-sessions', {
      method: 'post',
    })
  }

  finish({ feedback } = {}) {
    return this.fetch(`focus-sessions/finish`, {
      method: 'patch',
      body: { feedback },
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
