/*
 * @file name: 标题插件
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-29 12:33:35
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-29 17:10:17
 */
import CustomBaseTitleProvider from './CustomBaseTitleProvider'

export default function(title) {
  return {
    __init__: ['customBaseTitleProvider'],
    customBaseTitleProvider: ['type', CustomBaseTitleProvider(title)]
  }
}