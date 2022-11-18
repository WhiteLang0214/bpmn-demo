/*
 * @file name: 名称表单
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-17 17:05:18
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-17 17:16:01
 */
import { TextFieldEntry } from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";

function NameProps(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => element.businessObject.generalName || '';
  const setValue = value => modeling.updateProperties(element, {
    generalName: value
  })

  return TextFieldEntry({
    id,
    element,
    description: translate('输入名称'),
    label: translate('名称'),
    getValue,
    setValue,
    debounce
  })
}

export default function(element) {
  return {
    id: 'name',
    element,
    component: NameProps
  }
}