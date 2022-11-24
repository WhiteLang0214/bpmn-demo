/*
 * @file name: 文本输入办理人
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-24 10:18:31
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-24 11:06:56
 */

import { is } from 'bpmn-js/lib/util/ModelUtil'
import { Group } from '@bpmn-io/properties-panel';
import { TextFieldEntry, isTextFieldEntryEdited } from'@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'

const LOW_PRIORITY = 500;

function TransavtorProps(props) {
  const { element, id } = props;
  const translate = useService('translate');
  const modeling = useService('modeling');
  const debounce = useService('debounceInput');

  return TextFieldEntry({
    element,
    id,
    label: translate(''),
    debounce,
    setValue: value => {
      modeling.updateProperties(element, {
        transavtor_value: value
      })
    },
    getValue: element => {
      return element.businessObject.transavtor_value
    }
  })
}

export default class TransavtorInputProvider {
  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
    this._injector = injector;
  }

  getGroups(element) {
    return (groups) => {
      groups = groups.concat(this._getGroups(element, this._injector))
      return groups
    }
  }

  _getGroups(element, injector) {
    
    if (!is(element, 'bpmn:UserTask')) {
      return [];
    }

    const translate = injector.get('translate');

    return [
      {
        id: 'customProvider_transavtor',
        label: translate('办理人'),
        component: Group,
        entries: [
          {
            id: 'transavtor_value',
            component: TransavtorProps,
            isEdited: isTextFieldEntryEdited
          }
        ]
      }
    ]
  }

}

TransavtorInputProvider.$inject = [ 'propertiesPanel', 'injector'];