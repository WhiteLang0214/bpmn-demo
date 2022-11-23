import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { useService } from 'bpmn-js-properties-panel'
const ModelingUtil = require('bpmn-js/lib/features/modeling/util/ModelingUtil');
const minDash = require('min-dash');
const propertiesPanel = require('@bpmn-io/properties-panel');
const jsxRuntime = require('@bpmn-io/properties-panel/preact/jsx-runtime');

export function getTimerEventDefinition(element) {
  return getEventDefinition(element, 'bpmn:TimerEventDefinition');
}

export function getEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);
  const eventDefinitions = businessObject.get('eventDefinitions') || [];
  return minDash.find(eventDefinitions, function (definition) {
    return is(definition, eventType);
  });
}


/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */

export function getTimerDefinitionType(timer) {
  if (!timer) {
    return;
  }

  const timeDate = timer.get('timeDate');

  if (typeof timeDate !== 'undefined') {
    return 'timeDate';
  }

  const timeCycle = timer.get('timeCycle');

  if (typeof timeCycle !== 'undefined') {
    return 'timeCycle';
  }

  const timeDuration = timer.get('timeDuration');

  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
}

export function isTimerSupported(element) {
  return ModelingUtil.isAny(element, ['bpmn:StartEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent']) && !!getTimerEventDefinition(element);
}

export function isTimerSupportedOnListener$1(listener) {
  return listener && is(listener, 'camunda:TaskListener') && getTimerEventDefinition(listener);
}

export function getId$1(idPrefix, id) {
  return idPrefix ? idPrefix + id : id;
}

/**
 * TimerEventDefinitionType - Generic select entry allowing to select a specific
 * timerEventDefintionType. To be used together with timerEventDefinitionValue.
 *
 * @param  {type} props
 * @return {SelectEntry}
 */

export function TimerEventDefinitionType$2(props) {
  const {
    element,
    timerEventDefinition,
    timerEventDefinitionType
  } = props;
  const commandStack = useService('commandStack'),
        bpmnFactory = useService('bpmnFactory'),
        translate = useService('translate');

  const getValue = () => {
    return timerEventDefinitionType || '';
  };

  const setValue = value => {
    // (1) Check if value is different to current type
    if (value === timerEventDefinitionType) {
      return;
    } // (2) Create empty formalExpression element


    const formalExpression = bpmnFactory.create('bpmn:FormalExpression', {
      body: undefined
    });
    formalExpression.$parent = timerEventDefinition; // (3) Set the value for selected timerEventDefinitionType

    const newProps = {
      timeDuration: undefined,
      timeDate: undefined,
      timeCycle: undefined
    };

    if (value !== '') {
      newProps[value] = formalExpression;
    } // (4) Execute businessObject update


    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: timerEventDefinition,
      properties: newProps
    });
  };

  const getOptions = element => {
    return [{
      value: '',
      label: translate('<none>')
    }, {
      value: 'timeDate',
      label: translate('Date')
    }, {
      value: 'timeDuration',
      label: translate('Duration')
    }, {
      value: 'timeCycle',
      label: translate('Cycle')
    }];
  };

  return propertiesPanel.SelectEntry({
    element,
    id: 'timerEventDefinitionType',
    label: translate('Type'),
    getValue,
    setValue,
    getOptions
  });
}

/**
 * TimerEventDefinitionValue - Generic textField entry allowing to specify the
 * timerEventDefintionValue based on the set timerEventDefintionType. To be used
 * together with timerEventDefinitionType.
 *
 * @param  {type} props
 * @return {TextFieldEntry}
 */


export function TimerEventDefinitionValue$2(props) {
  const {
    element,
    timerEventDefinition,
    timerEventDefinitionType
  } = props;
  const commandStack = useService('commandStack'),
        translate = useService('translate'),
        debounce = useService('debounceInput');
  const timerEventFormalExpression = timerEventDefinition.get(timerEventDefinitionType);

  const getValue = () => {
    return timerEventFormalExpression && timerEventFormalExpression.get('body');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: timerEventFormalExpression,
      properties: {
        body: value
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: 'timerEventDefinitionValue',
    label: translate('Value'),
    getValue,
    setValue,
    debounce,
    description: getTimerEventDefinitionValueDescription$2(timerEventDefinitionType, translate)
  });
}

export function getTimerEventDefinitionValueDescription$2(timerDefinitionType, translate) {
  switch (timerDefinitionType) {
    case 'timeDate':
      return jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("p", {
          children: translate('A specific point in time defined as ISO 8601 combined date and time representation.')
        }), jsxRuntime.jsxs("ul", {
          children: [jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "2019-10-01T12:00:00Z"
            }), " - ", translate('UTC time')]
          }), jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "2019-10-02T08:09:40+02:00"
            }), " - ", translate('UTC plus 2 hours zone offset')]
          })]
        }), jsxRuntime.jsx("a", {
          href: "https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-date",
          target: "_blank",
          rel: "noopener",
          children: translate('Documentation: Timer events')
        })]
      });

    case 'timeCycle':
      return jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("p", {
          children: translate('A cycle defined as ISO 8601 repeating intervals format.')
        }), jsxRuntime.jsxs("ul", {
          children: [jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "R5/PT10S"
            }), " - ", translate('every 10 seconds, up to 5 times')]
          }), jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "R/P1D"
            }), " - ", translate('every day, infinitely')]
          })]
        }), jsxRuntime.jsx("a", {
          href: "https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-cycle",
          target: "_blank",
          rel: "noopener",
          children: translate('Documentation: Timer events')
        })]
      });

    case 'timeDuration':
      return jsxRuntime.jsxs("div", {
        children: [jsxRuntime.jsx("p", {
          children: translate('A time duration defined as ISO 8601 durations format.')
        }), jsxRuntime.jsxs("ul", {
          children: [jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "PT15S"
            }), " - ", translate('15 seconds')]
          }), jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "PT1H30M"
            }), " - ", translate('1 hour and 30 minutes')]
          }), jsxRuntime.jsxs("li", {
            children: [jsxRuntime.jsx("code", {
              children: "P14D"
            }), " - ", translate('14 days')]
          })]
        }), jsxRuntime.jsx("a", {
          href: "https://docs.camunda.org/manual/latest/reference/bpmn20/events/timer-events/#time-duration",
          target: "_blank",
          rel: "noopener",
          children: translate('Documentation: Timer events')
        })]
      });
  }
}