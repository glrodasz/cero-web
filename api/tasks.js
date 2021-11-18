import Request from './request'

class Task extends Request {
  getAll() {
    return this.fetch()
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

  updateStatus({ id, isChecked }) {
    const status = isChecked ? 'complete' : 'reset'
    return this.fetch(`tasks/${id}/${status}`, { method: 'patch' })
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
