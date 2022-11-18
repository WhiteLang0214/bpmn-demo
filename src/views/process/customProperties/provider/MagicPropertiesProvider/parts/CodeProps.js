/*
 * @file name: 编码表单
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-17 17:05:18
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-17 17:11:00
 */
import { TextFieldEntry } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

function CodeProps(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => element.businessObject.extFormUrl || '';
  const setValue = value => modeling.updateProperties(element, {
    extFormUrl: value
  })

  return TextFieldEntry({
    id,
    element,
    description: translate('输入编码'),
    label: translate('编码'),
    getValue,
    setValue,
    debounce
  })
}

export default function(element) {
  return {
    id: 'code',
    element,
    component: CodeProps
  }
}