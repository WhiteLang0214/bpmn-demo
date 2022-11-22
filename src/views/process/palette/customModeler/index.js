/*
 * @file name: 导出自定义工具栏类
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-18 15:48:18
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-18 17:14:23
 */
import Modeler from 'bpmn-js/lib/Modeler'
import inherits from 'inherits-browser';
import CustomModule from '../customPalette/index'

export default function CustomModeler(options) {
    Modeler.call(this, options)
    this._customElements = []
}
inherits(CustomModeler, Modeler)
CustomModeler.prototype._modules = [].concat(
    Modeler.prototype._modules,
    CustomModeler.prototype._modules, [
        CustomModule
    ]
)