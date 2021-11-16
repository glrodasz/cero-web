import Request from './request'

class Task extends Request {
  getAll() {
    // TODO: Implement a sort param, and remove the hardcoded
    // FIXME: return this.fetch()
    return this.fetch('tasks?_sort=priority&_order=asc')
  }

  getById({ id }) {
    return this.fetch(`tasks/${id}`)
  }

  create({ description, priority }) {
    return this.fetch('tasks', {
      method: 'post',
      body: { description, priority, status: 'in-progress' },
    })
  }

  updatePriorities({ tasks }) {
    return Promise.all(
      tasks.map(({ id, priority, status }) =>
        this.fetch(`tasks/${id}`, {
          method: 'patch',
          body: { priority, status },
        })
      )
    )
  }

  delete({ id }) {
    return this.fetch(`tasks/${id}`, { method: 'delete' })
  }
}

export default Task
