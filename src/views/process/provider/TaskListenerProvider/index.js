import TaskListenerProvider from './TaskListenerProvider.js'

export default {
  __init__: ['taskListenerProvider'], // 新增任务监听器属性
  taskListenerProvider: ['type', TaskListenerProvider]
}