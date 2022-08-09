import Request from './request'

class Task extends Request {
  getAll() {
    return this.fetch()
  }

  getById({ id }) {
    return id && this.fetch(`tasks/${id}`)
  }

  create({ description }) {
    return this.fetch('tasks', {
      method: 'post',
      body: { description },
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

  update({ id, task }) {
    return this.fetch(`tasks/${id}`, { method: 'patch', body: task })
  }
}

export default Task
