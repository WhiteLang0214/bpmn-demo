const propertiesPanel = require('@bpmn-io/properties-panel');
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { 
  getListenersContainer,
  getExtensionElementsList,
  getListenerLabel,
  EventType,
  ListenerId,
  ListenerType,
  ImplementationDetails,
  EventTypeDetails,
  Fields,
  addTaskListenerFactory,
  removeListenerFactory } from './utils'

const LOW_PRIORITY = 500;
const CAMUNDA_PLATFORM_GROUPS = [
  TaskListenerGroup
];

// 创建 任务监听器 显示的属性列表
function TaskListenerGroup(element, injector) {
  const translate = injector.get('translate');
  const group = {
    label: translate('任务监听器'),
    id: 'CamundaPlatform__TaskListener',
    component: propertiesPanel.ListGroup,
    ...TaskListenerProps({
      element,
      injector
    })
  };

  if (group.items) {
    return group;
  }

  return null;
}

function TaskListener(props) {
  const {
    idPrefix,
    element,
    listener
  } = props;
  return [{
    id: `${idPrefix}-eventType`,
    component: EventType,
    listener
  }, {
    id: `${idPrefix}-listenerId`,
    component: ListenerId,
    listener
  }, {
    id: `${idPrefix}-listenerType`,
    component: ListenerType,
    listener
  }, ...ImplementationDetails({
    idPrefix,
    element,
    listener
  }), ...EventTypeDetails({
    idPrefix,
    element,
    listener
  }), {
    id: `${idPrefix}-fields`,
    component: Fields,
    listener
  }];
}

// 任务监听器的属性
function TaskListenerProps({
  element,
  injector
}) {
  // 只给 UserTask 节点开通该属性
  if (!is(element, 'bpmn:UserTask')) {
    return;
  }

  const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');
  const businessObject = getListenersContainer(element);
  const listeners = getExtensionElementsList(businessObject, 'camunda:TaskListener');
 
  return {
    items: listeners.map((listener, index) => {
      const id = `${element.id}-taskListener-${index}`; // @TODO(barmac): Find a way to pass translate for internationalized label.

      return {
        id,
        label: getListenerLabel(listener),
        entries: TaskListener({
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
    // 创建添加按钮 并且绑定事件
    add: addTaskListenerFactory({
      bpmnFactory,
      commandStack,
      element
    })
  };
}

class TaskListenerProvider {
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
TaskListenerProvider.$inject = [ 'propertiesPanel', 'injector'];

export default TaskListenerProvider