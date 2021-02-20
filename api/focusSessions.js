import Request from './request'

class FocusSession extends Request {
  create() {
    return this.request('focus-sessions', {
      method: 'post',
    })
  }

  getActives() {
    return this.request('focus-sessions?state=active')
  }
}

export default FocusSession
