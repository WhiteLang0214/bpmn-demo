/*
 * @file name: 任务监听器
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-22 16:36:18
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 17:14:46
 */
const propertiesPanel = require('@bpmn-io/properties-panel');
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

import {
  getTimerEventDefinition,
  getTimerDefinitionType,
  isTimerSupported,
  isTimerSupportedOnListener$1, 
  getId$1,
  TimerEventDefinitionType$2,
  TimerEventDefinitionValue$2 } from './utils'


const LOW_PRIORITY = 500;


function TimerGroup(element, injector) {
  const translate = injector.get('translate');
  const group = {
    label: translate('Timer'),
    id: 'timer',
    component: propertiesPanel.Group,
    entries: [...TimerProps$2({
      element
    })]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}

function TimerProps$2(props) {
  const {
    element,
    listener,
    idPrefix
  } = props;
  let {
    timerEventDefinition
  } = props;

  if (!timerEventDefinition) {
    const businessObject = getBusinessObject(element);
    timerEventDefinition = getTimerEventDefinition(businessObject);
  }

  const timerEventDefinitionType = getTimerDefinitionType(timerEventDefinition); // (1) Only show for supported elements

  if (!isTimerSupported(element) && !isTimerSupportedOnListener$1(listener)) {
    return [];
  } // (2) Provide entries, have a value only if selection was made


  const entries = [];
  entries.push({
    id: getId$1(idPrefix, 'timerEventDefinitionType'),
    component: TimerEventDefinitionType$2,
    isEdited: propertiesPanel.isSelectEntryEdited,
    timerEventDefinition,
    timerEventDefinitionType
  });

  if (timerEventDefinitionType) {
    entries.push({
      id: getId$1(idPrefix, 'timerEventDefinitionValue'),
      component: TimerEventDefinitionValue$2,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      timerEventDefinition,
      timerEventDefinitionType
    });
  }

  return entries;
}

class TimerListenerProvider {
  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
    this._injector = injector;
  }


  getGroups(element) {
    return groups => {
      groups = groups.concat(this._getGroups(element))
      return groups
    }
  }

  _getGroups(element) {
    const groups = TimerGroup(element, this._injector) || []; // contract: if a group returns null, it should not be displayed at all

    return groups.filter(group => group !== null);
  }
}

TimerListenerProvider.$inject = [ 'propertiesPanel', 'injector'];

export default TimerListenerProvider;