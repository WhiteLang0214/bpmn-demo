import {SelectEntry, TextFieldEntry} from '@bpmn-io/properties-panel'
import {useService} from 'bpmn-js-properties-panel'
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';

function DealTypeProp (onClick) {
  return function (props) {
    const {
      id,
      element
    } = props
    const modeling = useService('modeling')
    // eslint-disable-next-line no-unused-vars
    const handleClick = () => {
      if (onClick) {
        onClick(element, modeling)
      }
    }
    const translate = useService('translate')

    const debounce = useService('debounceInput')

    const getValue = () => {
      return element.businessObject.user_type || ''
    }

    const setValue = (value) => modeling.updateProperties(element, {
      user_type: value
    })
    const getOptions = () => {
      return [
        { label: '事项审批', value: 'approve' },
        { label: '数据录入', value: 'data_input' },
      ];
    }

    return SelectEntry({
      id,
      element,
      description: translate('事项审批可以拒绝,数据录入只能通过'),
      label: translate('选择类型'),
      getValue,
      setValue,
      debounce,
      getOptions: getOptions
    })
  }
}

// eslint-disable-next-line no-unused-vars
export default function (element, onClick) {
  return {
    id: 'DealType',
    element,
    component: DealTypeProp(onClick)
  }
}
