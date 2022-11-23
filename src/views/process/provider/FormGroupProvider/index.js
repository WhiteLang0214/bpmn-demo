/*
 * @file name: 按照规范导出自定义属性
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-22 14:38:20
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 16:11:17
 */

import FormGruopProvider from './FormGroupProvider.js'

export default {
  __init__: ['camundaPlatformPropertiesProvider'], // 这个名称覆盖了原有的表单
  camundaPlatformPropertiesProvider: ['type', FormGruopProvider]
}