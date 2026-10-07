import { TASK_SECTIONS } from './constants'

export const getTaskSections = (tasks = []) =>
  TASK_SECTIONS.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.status === section.status),
  }))
