/*
 * @file name: 标题插件
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-29 12:33:35
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-29 17:58:23
 */

import { jsx } from '@bpmn-io/properties-panel/preact/jsx-runtime/dist/jsxRuntime.mjs'

export default function (translate, title = '常规配置') {
  return {
    id: 'customProvider_driver_container',
    component: () => {
      return jsx('div', {
        class: 'customProvider-driver-header',
        id: 'customProvider-driver',
        children: translate(title),
        title: translate(title)
      })
    }
  }
}