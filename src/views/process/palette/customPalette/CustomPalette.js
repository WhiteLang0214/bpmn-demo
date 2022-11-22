/*
 * @file name: 自定义工具栏
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-18 14:20:41
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 14:11:14
 */

import {
  assign
} from 'min-dash';
import { getDi } from 'bpmn-js/lib/util/ModelUtil';

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 * 一个调色板，允许您创建BPMN和_自定义元素
 */
export default function PaletteProvider(palette, create, elementFactory,
  spaceTool, lassoTool, handTool,
  globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette', 
  'create', 
  'elementFactory',
  'spaceTool', 
  'lassoTool', 
  'handTool',
  'globalConnect', 
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function (element) { // 此方法和上面案例的一样
  const actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        var di = getDi(shape);
        di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');
    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      imageUrl: options && options.imageUrl,
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createSubprocess(event) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    });

    create.start(event, [subProcess, startEvent], {
      hints: {
        autoSelect: [subProcess]
      }
    });
  }

  function createParticipant(event) {
    create.start(event, elementFactory.createParticipantShape());
  }

  assign(actions, {
    // 'hand-tool': {
    //   group: 'tools',
    //   className: 'bpmn-icon-hand-tool',
    //   title: translate('Activate the hand tool'),
    //   action: {
    //     click: function(event) {
    //       handTool.activateHand(event);
    //     }
    //   }
    // },
    // 'lasso-tool': {
    //   group: 'tools',
    //   className: 'bpmn-icon-lasso-tool',
    //   title: translate('Activate the lasso tool'),
    //   action: {
    //     click: function(event) {
    //       lassoTool.activateSelection(event);
    //     }
    //   }
    // },
    // 'space-tool': {
    //   group: 'tools',
    //   className: 'bpmn-icon-space-tool',
    //   title: translate('Activate the create/remove space tool'),
    //   action: {
    //     click: function(event) {
    //       spaceTool.activateSelection(event);
    //     }
    //   }
    // },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function (event) {
          globalConnect.start(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('开始节点')
    ),
    // 'create.intermediate-event': createAction(
    //   'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
    //   translate('Create Intermediate/Boundary Event')
    // ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('结束节点')
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
      translate('执行网关节点')
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task',
      translate('任务节点')
    ),
    'create.user-task': createAction(
      'bpmn:UserTask', 'activity', '',
      translate('用户任务节点'),
      {
        imageUrl: 'http://testpi.leandc.cn/img/home.7c6af2bf.png'
      }
    ),
    // 'create.data-object': createAction(
    //   'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
    //   translate('Create DataObjectReference')
    // ),
    // 'create.data-store': createAction(
    //   'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
    //   translate('Create DataStoreReference')
    // ),
    // 'create.subprocess-expanded': {
    //   group: 'activity',
    //   className: 'bpmn-icon-subprocess-expanded',
    //   title: translate('Create expanded SubProcess'),
    //   action: {
    //     dragstart: createSubprocess,
    //     click: createSubprocess
    //   }
    // },
    // 'create.participant-expanded': {
    //   group: 'collaboration',
    //   className: 'bpmn-icon-participant',
    //   title: translate('Create Pool/Participant'),
    //   action: {
    //     dragstart: createParticipant,
    //     click: createParticipant
    //   }
    // },
    // 'create.group': createAction(
    //   'bpmn:Group', 'artifact', 'bpmn-icon-group',
    //   translate('Create Group')
    // ),
  });

  return actions;
}