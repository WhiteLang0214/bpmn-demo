/*
 * @file name: 执行监听器
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-23 14:37:50
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-23 14:54:37
 */
import ExecutionListenerProvider from './ExecutionListenerProvider.js'

export default {
  __init__: ['executionListenerProvider'],
  executionListenerProvider: ['type', ExecutionListenerProvider]
}