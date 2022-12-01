/*
 * @file name: 执行监听器
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-23 14:37:55
 * @LastEditors: langxue
 * @LastEditTime: 2022-12-01 14:16:17
 */
const propertiesPanel = require('@bpmn-io/properties-panel');
// const ModelingUtil = require('bpmn-js/lib/features/modeling/util/ModelingUtil');
import { is } from 'bpmn-js/lib/util/ModelUtil'

import {
  getListenersContainer,
  getExtensionElementsList,
  getListenerLabel,
  ExecutionListener,
  removeListenerFactory,
  addExecutionListenerFactory } from './utils'

const LOW_PRIORITY = 500;
const CAMUNDA_PLATFORM_GROUPS = [
  ExecutionListenerGroup
];

const LISTENER_ALLOWED_TYPES = [
  // 'bpmn:Activity',
  // 'bpmn:Event',
  // 'bpmn:Gateway',
  // 'bpmn:SequenceFlow',
  // 'bpmn:Process',
  // 'bpmn:Participant'
  'bpmn:UserTask'
];

export function ExecutionListenerGroup(element, injector) {
  const translate = injector.get('translate');
  const group = {
    label: translate('执行监听器'),
    id: 'CamundaPlatform__ExecutionListener',
    component: propertiesPanel.ListGroup,
    ...ExecutionListenerProps({
      element,
      injector
    })
  };

  if (group.items) {
    return group;
  }

  return null;
}

function ExecutionListenerProps({
  element,
  injector
}) {
  // 原来的代码 先注释
  // if (!ModelingUtil.isAny(element, LISTENER_ALLOWED_TYPES)) {
  //   return;
  // }

  const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');

  // if (ModelUtil.is(element, 'bpmn:Participant') && !element.businessObject.processRef) {
  //   return;
  // }

  // 改造的代码 只对 UserTask 节点开放
  if (!is(element, 'bpmn:UserTask')) {
    return;
  }

  const businessObject = getListenersContainer(element);
  const listeners = getExtensionElementsList(businessObject, 'camunda:ExecutionListener');
  return {
    items: listeners.map((listener, index) => {
      const id = `${element.id}-executionListener-${index}`; // @TODO(barmac): Find a way to pass translate for internationalized label.

      return {
        id,
        label: getListenerLabel(listener),
        entries: ExecutionListener({
          idPrefix: id,
          element,
          listener
        }),
        remove: removeListenerFactory({
          element,
          listener,
          commandStack
        })
      };
    }),
    add: addExecutionListenerFactory({
      bpmnFactory,
      commandStack,
      element
    })
  };
}

export default class ExecutionListenerProvider {
  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
    this._injector = injector;
  }

  getGroups(element) {
    return (groups) => {
      // (1) add Camunda Platform specific groups
      // 添加Camunda平台的特定群组 用户任务节点 只显示表单组
      groups = groups.concat(this._getGroups(element)); // (2) update existing groups with Camunda Platform specific properties

      // updateGeneralGroup(groups, element);
      // updateErrorGroup(groups, element);
      // updateEscalationGroup(groups, element);
      // updateMultiInstanceGroup(groups, element);
      // updateTimerGroup(groups, element); // (3) move groups given specific priorities

      // moveImplementationGroup(groups);

      return groups
    }
  }

  _getGroups(element) {
    const groups = CAMUNDA_PLATFORM_GROUPS.map(createGroup => createGroup(element, this._injector)); // contract: if a group returns null, it should not be displayed at all

    return groups.filter(group => group !== null);
  }
}

ExecutionListenerProvider.$inject = [ 'propertiesPanel', 'injector'];