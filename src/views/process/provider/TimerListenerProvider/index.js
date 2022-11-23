/*
 * @file name: 任务监听器
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-22 16:35:09
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 17:07:25
 */

import TimerListenerProvider from './TimerListenerProvider.js'

export default {
  timerListenerProvider: ['type', TimerListenerProvider],
  __init__: ['timerListenerProvider']
}