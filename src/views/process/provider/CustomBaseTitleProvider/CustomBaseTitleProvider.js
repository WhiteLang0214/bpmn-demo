
import { jsx } from '@bpmn-io/properties-panel/preact/jsx-runtime/dist/jsxRuntime.mjs'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import CustomGeneralcomponent from '../CustomGeneralcomponent'
const LOW_PRIORITY = 500;

/**
 * 
 * @param {*} title 需要展示的标题文本，默认基础配置
 * @returns 
 */
export default function (title = "基础配置") {
  function CustomBaseTitleProvider(propertiesPanel, injector) {

    const translate = injector.get('translate');
  
    const _getGroups = (element) => {

      if (!is(element, 'bpmn:UserTask')) {
        return [];
      }
  
      return [
        {
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
      ]
    }

    this.getGroups = (element) => {
      return (groups) => {
        groups.unshift(CustomGeneralcomponent(translate, '常规配置'))
        groups = groups.concat(_getGroups(element))
        return groups
      }
    }

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
  }

  CustomBaseTitleProvider.$inject = [ 'propertiesPanel', 'injector'];

  return CustomBaseTitleProvider;
}
