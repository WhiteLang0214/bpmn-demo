
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil.js';
const ModelingUtil = require('bpmn-js/lib/features/modeling/util/ModelingUtil');
const minDash = require('min-dash');
const propertiesPanel = require('@bpmn-io/properties-panel');
const jsxRuntime = require('@bpmn-io/properties-panel/preact/jsx-runtime');
import { useService } from 'bpmn-js-properties-panel'

const EVENT_TO_LABEL = {
  start: 'Start',
  end: 'End',
  take: 'Take',
  create: 'Create',
  assignment: 'Assignment',
  complete: 'Complete',
  delete: 'Delete',
  update: 'Update',
  timeout: 'Timeout'
};

const IMPLEMENTATION_TYPE_TO_LABEL = {
  class: 'Java class',
  expression: 'Expression',
  delegateExpression: 'Delegate expression',
  script: 'Script'
};

const DEFAULT_EVENT_PROPS = {
  'eventDefinitions': undefined,
  'event': undefined
};

const SCRIPT_PROPS = {
  'script': undefined,
  'resource': undefined,
  'scriptFormat': undefined
};
const CLASS_PROPS = {
  'class': undefined
};
const EXPRESSION_PROPS = {
  'expression': undefined
};
const DELEGATE_EXPRESSION_PROPS = {
  'delegateExpression': undefined
};
const DEFAULT_PROPS = { ...SCRIPT_PROPS,
  ...CLASS_PROPS,
  ...EXPRESSION_PROPS,
  ...DELEGATE_EXPRESSION_PROPS
};

const DEFAULT_PROPS$2 = {
  'stringValue': undefined,
  'string': undefined,
  'expression': undefined
};


/**
 * Create a new element and set its parent.
 *
 * @param {String} elementType of the new element
 * @param {Object} properties of the new element in key-value pairs
 * @param {moddle.object} parent of the new element
 * @param {BpmnFactory} factory which creates the new element
 *
 * @returns {djs.model.Base} element which is created
 */

 function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);

  if (parent) {
    element.$parent = parent;
  }

  return element;
}

function getListenerType(listener) {
  return getImplementationType(listener);
}

/**
 * Returns the implementation type of the given element.
 *
 * Possible implementation types are:
 * - dmn
 * - connector
 * - external
 * - class
 * - expression
 * - delegateExpression
 * - script
 * - or undefined, when no matching implementation type is found
 *
 * @param  {djs.model.Base} element
 *
 * @return {String} the implementation type
 */

 function getImplementationType(element) {
  const businessObject = getListenerBusinessObject(element) || getServiceTaskLikeBusinessObject(element);

  if (!businessObject) {
    return;
  }

  if (isDmnCapable(businessObject)) {
    const decisionRef = businessObject.get('camunda:decisionRef');

    if (typeof decisionRef !== 'undefined') {
      return 'dmn';
    }
  }

  if (isServiceTaskLike(businessObject)) {
    const connectors = getExtensionElementsList(businessObject, 'camunda:Connector');

    if (connectors.length) {
      return 'connector';
    }
  }

  if (isExternalCapable(businessObject)) {
    const type = businessObject.get('camunda:type');

    if (type === 'external') {
      return 'external';
    }
  }

  const cls = businessObject.get('camunda:class');

  if (typeof cls !== 'undefined') {
    return 'class';
  }

  const expression = businessObject.get('camunda:expression');

  if (typeof expression !== 'undefined') {
    return 'expression';
  }

  const delegateExpression = businessObject.get('camunda:delegateExpression');

  if (typeof delegateExpression !== 'undefined') {
    return 'delegateExpression';
  }

  const script = businessObject.get('script');

  if (typeof script !== 'undefined') {
    return 'script';
  }
}

function getListenerBusinessObject(businessObject) {
  if (ModelingUtil.isAny(businessObject, ['camunda:ExecutionListener', 'camunda:TaskListener'])) {
    return businessObject;
  }
}

/**
 * getServiceTaskLikeBusinessObject - Get a 'camunda:ServiceTaskLike' business object.
 *
 * If the given element is not a 'camunda:ServiceTaskLike', then 'false'
 * is returned.
 *
 * @param {djs.model.Base} element
 * @return {ModdleElement} the 'camunda:ServiceTaskLike' business object
 */

 function getServiceTaskLikeBusinessObject(element) {
  if (is(element, 'bpmn:IntermediateThrowEvent') || is(element, 'bpmn:EndEvent')) {
    // change business object to 'messageEventDefinition' when
    // the element is a message intermediate throw event or message end event
    // because the camunda extensions (e.g. camunda:class) are in the message
    // event definition tag and not in the intermediate throw event or end event tag
    const messageEventDefinition = getMessageEventDefinition(element);

    if (messageEventDefinition) {
      element = messageEventDefinition;
    }
  }

  return isServiceTaskLike(element) && getBusinessObject(element);
}

/**
 * Returns 'true' if the given element is 'camunda:DmnCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */

 function isDmnCapable(element) {
  return is(element, 'camunda:DmnCapable');
}

/**
 * Check whether an element is camunda:ServiceTaskLike
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */

 function isServiceTaskLike(element) {
  return is(element, 'camunda:ServiceTaskLike');
}

/**
 * Returns 'true' if the given element is 'camunda:ExternalCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */

 function isExternalCapable(element) {
  return is(element, 'camunda:ExternalCapable');
}

function getMessageEventDefinition(element) {
  if (is(element, 'bpmn:ReceiveTask')) {
    return getBusinessObject(element);
  }

  return getEventDefinition$1(element, 'bpmn:MessageEventDefinition');
}

function getEventDefinition$1(element, eventType) {
  const businessObject = getBusinessObject(element);
  const eventDefinitions = businessObject.get('eventDefinitions') || [];
  return minDash.find(eventDefinitions, function (definition) {
    return is(definition, eventType);
  });
}

function EventType({
  id,
  element,
  listener
}) {
  const translate = useService('translate');
  const bpmnFactory = useService('bpmnFactory');
  const commandStack = useService('commandStack');

  function getValue() {
    return listener.get('event');
  }

  function setValue(value) {
    const properties = getDefaultEventTypeProperties(value, bpmnFactory);
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: listener,
      properties
    });
  }

  function getOptions() {
    if (is(listener, 'camunda:TaskListener')) {
      return [{
        value: 'create',
        label: translate('create')
      }, {
        value: 'assignment',
        label: translate('assignment')
      }, {
        value: 'complete',
        label: translate('complete')
      }, {
        value: 'delete',
        label: translate('delete')
      }, {
        value: 'update',
        label: translate('update')
      }, {
        value: 'timeout',
        label: translate('timeout')
      }];
    }

    if (is(element, 'bpmn:SequenceFlow')) {
      return [{
        value: 'take',
        label: translate('take')
      }];
    }

    return [{
      value: 'start',
      label: translate('start')
    }, {
      value: 'end',
      label: translate('end')
    }];
  }

  return jsxRuntime.jsx(propertiesPanel.SelectEntry, {
    id: id,
    label: translate('Event type'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions
  });
}

function getDefaultEventTypeProperties(type, bpmnFactory) {
  switch (type) {
    case 'timeout':
      return { ...DEFAULT_EVENT_PROPS,
        eventDefinitions: [bpmnFactory.create('bpmn:TimerEventDefinition')],
        event: type
      };

    default:
      return { ...DEFAULT_EVENT_PROPS,
        event: type
      };
  }
}

function ListenerType({
  id,
  element,
  listener
}) {
  const modeling = useService('modeling');
  const translate = useService('translate');
  const bpmnFactory = useService('bpmnFactory');

  function getValue() {
    return getListenerType(listener);
  }

  function setValue(value) {
    const properties = getDefaultImplementationProperties(value, bpmnFactory);
    modeling.updateModdleProperties(element, listener, properties);
  }

  function getOptions() {
    return getListenerTypeOptions(translate);
  }

  return jsxRuntime.jsx(propertiesPanel.SelectEntry, {
    id: id,
    label: translate('Listener type'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions
  });
}

function getDefaultImplementationProperties(type, bpmnFactory) {
  switch (type) {
    case 'class':
      return { ...DEFAULT_PROPS,
        'class': ''
      };

    case 'expression':
      return { ...DEFAULT_PROPS,
        'expression': ''
      };

    case 'delegateExpression':
      return { ...DEFAULT_PROPS,
        'delegateExpression': ''
      };

    case 'script':
      return { ...DEFAULT_PROPS,
        'script': bpmnFactory.create('camunda:Script')
      };
  }
}

function getListenerTypeOptions(translate) {
  return Object.entries(IMPLEMENTATION_TYPE_TO_LABEL).map(([value, label]) => ({
    value,
    label: translate(label)
  }));
}

function ImplementationDetails(props) {
  const {
    idPrefix,
    element,
    listener
  } = props;
  const type = getListenerType(listener);

  if (type === 'class') {
    return [{
      id: getPrefixedId(idPrefix, 'javaClass'),
      component: JavaClass,
      businessObject: listener
    }];
  } else if (type === 'expression') {
    return [{
      id: getPrefixedId(idPrefix, 'expression'),
      component: Expression$1,
      businessObject: listener
    }];
  } else if (type === 'delegateExpression') {
    return [{
      id: getPrefixedId(idPrefix, 'delegateExpression'),
      component: DelegateExpression,
      businessObject: listener
    }];
  } else if (type === 'script') {
    return ScriptProps({
      element,
      script: listener.get('script'),
      prefix: idPrefix
    });
  }
}

function getPrefixedId(prefix, id) {
  return `${prefix}-${id}`;
}

function JavaClass(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = 'javaClass'
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return businessObject.get('camunda:class');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        'camunda:class': value
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id,
    label: translate('Java class'),
    getValue,
    setValue,
    debounce
  });
}

function Expression$1(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = 'expression'
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return businessObject.get('camunda:expression');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        'camunda:expression': value
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id,
    label: translate('Expression'),
    getValue,
    setValue,
    debounce
  });
}

function DelegateExpression(props) {
  const {
    element,
    businessObject = getServiceTaskLikeBusinessObject(element),
    id = 'delegateExpression'
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return businessObject.get('camunda:delegateExpression');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        'camunda:delegateExpression': value
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id,
    label: translate('Delegate expression'),
    getValue,
    setValue,
    debounce
  });
}

function ScriptProps(props) {
  const {
    element,
    script,
    prefix
  } = props;
  const entries = [];
  const scriptType = getScriptType(script || element);
  const idPrefix = prefix || ''; // (1) scriptFormat

  entries.push({
    id: idPrefix + 'scriptFormat',
    component: Format,
    isEdited: propertiesPanel.isTextFieldEntryEdited,
    idPrefix,
    script
  }); // (2) type

  entries.push({
    id: idPrefix + 'scriptType',
    component: Type$3,
    isEdited: propertiesPanel.isSelectEntryEdited,
    idPrefix,
    script
  }); // (3) script

  if (scriptType === 'script') {
    entries.push({
      id: idPrefix + 'scriptValue',
      component: Script,
      isEdited: propertiesPanel.isTextAreaEntryEdited,
      idPrefix,
      script
    });
  } // (4) resource


  if (scriptType === 'resource') {
    entries.push({
      id: idPrefix + 'scriptResource',
      component: Resource,
      isEdited: propertiesPanel.isTextFieldEntryEdited,
      idPrefix,
      script
    });
  }

  return entries;
}

function getScriptType(element) {
  const businessObject = getBusinessObject(element);
  const scriptValue = getScriptValue(businessObject);

  if (typeof scriptValue !== 'undefined') {
    return 'script';
  }

  const resource = businessObject.get('camunda:resource');

  if (typeof resource !== 'undefined') {
    return 'resource';
  }
}

function Format(props) {
  const {
    element,
    idPrefix,
    script
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const businessObject = script || getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('scriptFormat');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        scriptFormat: value
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: idPrefix + 'scriptFormat',
    label: translate('Format'),
    getValue,
    setValue,
    debounce
  });
}

function Type$3(props) {
  const {
    element,
    idPrefix,
    script
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const businessObject = script || getBusinessObject(element);
  const scriptProperty = getScriptProperty(businessObject);

  const getValue = () => {
    return getScriptType(businessObject);
  };

  const setValue = value => {
    // reset script properties on type change
    const properties = {
      [scriptProperty]: value === 'script' ? '' : undefined,
      'camunda:resource': value === 'resource' ? '' : undefined
    };
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties
    });
  };

  const getOptions = () => {
    const options = [{
      value: '',
      label: translate('<none>')
    }, {
      value: 'resource',
      label: translate('External resource')
    }, {
      value: 'script',
      label: translate('Inline script')
    }];
    return options;
  };

  return propertiesPanel.SelectEntry({
    element,
    id: idPrefix + 'scriptType',
    label: translate('Type'),
    getValue,
    setValue,
    getOptions
  });
}

function Script(props) {
  const {
    element,
    idPrefix,
    script
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const businessObject = script || getBusinessObject(element);
  const scriptProperty = getScriptProperty(businessObject);

  const getValue = () => {
    return getScriptValue(businessObject);
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        [scriptProperty]: value || ''
      }
    });
  };

  return propertiesPanel.TextAreaEntry({
    element,
    id: idPrefix + 'scriptValue',
    label: translate('Script'),
    getValue,
    setValue,
    debounce,
    monospace: true
  });
}

function Resource(props) {
  const {
    element,
    idPrefix,
    script
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const businessObject = script || getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:resource');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        'camunda:resource': value || ''
      }
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: idPrefix + 'scriptResource',
    label: translate('Resource'),
    getValue,
    setValue,
    debounce
  });
}

function getScriptValue(businessObject) {
  return businessObject.get(getScriptProperty(businessObject));
}

function isScript$2(element) {
  return is(element, 'camunda:Script');
}

function getScriptProperty(businessObject) {
  return isScript$2(businessObject) ? 'value' : 'script';
}

function Fields(props) {
  const {
    id,
    element,
    listener
  } = props;
  const bpmnFactory = useService('bpmnFactory');
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const fields = listener.get('fields');

  function addField() {
    const field = createElement('camunda:Field', {}, listener, bpmnFactory);
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: listener,
      properties: {
        fields: [...listener.get('fields'), field]
      }
    });
  }

  function removeField(field) {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: listener,
      properties: {
        fields: minDash.without(listener.get('fields'), field)
      }
    });
  }

  return jsxRuntime.jsx(propertiesPanel.ListEntry, {
    id: id,
    element: element,
    label: translate('Field injection'),
    items: fields,
    component: Field,
    onAdd: addField,
    onRemove: removeField,
    compareFn: compareName,
    autoFocusEntry: true
  });
}

function Field(props) {
  const {
    element,
    id: idPrefix,
    index,
    item: field,
    open
  } = props;
  const fieldId = `${idPrefix}-field-${index}`;
  return jsxRuntime.jsx(propertiesPanel.CollapsibleEntry, {
    id: fieldId,
    element: element,
    entries: FieldInjection({
      element,
      field,
      idPrefix: fieldId
    }),
    label: field.get('name') || '<empty>',
    open: open
  });
}

function compareName(field, anotherField) {
  const [name = '', anotherName = ''] = [field.name, anotherField.name];
  return name === anotherName ? 0 : name > anotherName ? 1 : -1;
}

function FieldInjection(props) {
  const {
    element,
    idPrefix,
    field
  } = props;
  const entries = [{
    id: idPrefix + '-name',
    component: NameProperty,
    field,
    idPrefix,
    element
  }, {
    id: idPrefix + '-type',
    component: TypeProperty,
    field,
    idPrefix,
    element
  }, {
    id: idPrefix + '-value',
    component: ValueProperty,
    field,
    idPrefix,
    element
  }];
  return entries;
}

function NameProperty(props) {
  const {
    idPrefix,
    element,
    field
  } = props;
  const commandStack = useService('commandStack'),
        translate = useService('translate'),
        debounce = useService('debounceInput');

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: field,
      properties: {
        name: value
      }
    });
  };

  const getValue = field => {
    return field.name;
  };

  return propertiesPanel.TextFieldEntry({
    element: field,
    id: idPrefix + '-name',
    label: translate('Name'),
    getValue,
    setValue,
    debounce
  });
}

function TypeProperty(props) {
  const {
    idPrefix,
    element,
    field
  } = props;
  const commandStack = useService('commandStack'),
        translate = useService('translate');

  const getValue = field => {
    return determineType(field);
  };

  const setValue = value => {
    const properties = Object.assign({}, DEFAULT_PROPS$2);
    properties[value] = '';
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: field,
      properties
    });
  };

  const getOptions = element => {
    const options = [{
      value: 'string',
      label: translate('String')
    }, {
      value: 'expression',
      label: translate('Expression')
    }];
    return options;
  };

  return propertiesPanel.SelectEntry({
    element: field,
    id: idPrefix + '-type',
    label: translate('Type'),
    getValue,
    setValue,
    getOptions
  });
}

function ValueProperty(props) {
  const {
    idPrefix,
    element,
    field
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = value => {
    // (1) determine which type we have set
    const type = determineType(field); // (2) set property accordingly

    const properties = Object.assign({}, DEFAULT_PROPS$2);
    properties[type] = value || ''; // (3) execute the update command

    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: field,
      properties
    });
  };

  const getValue = field => {
    return field.string || field.stringValue || field.expression;
  };

  return propertiesPanel.TextFieldEntry({
    element: field,
    id: idPrefix + '-value',
    label: translate('Value'),
    getValue,
    setValue,
    debounce
  });
}

/**
 * determineType - get the type of a fieldInjection based on the attributes
 * set on it
 *
 * @param  {ModdleElement} field
 * @return {('string'|'expression')}
 */


 function determineType(field) {
  // string is the default type
  return 'string' in field && 'string' || 'expression' in field && 'expression' || 'stringValue' in field && 'string' || 'string';
}

/**
 * Remove one or more extension elements. Remove bpmn:ExtensionElements afterwards if it's empty.
 *
 * @param {ModdleElement} element
 * @param {ModdleElement} businessObject
 * @param {ModdleElement|Array<ModdleElement>} extensionElementsToRemove
 * @param {CommandStack} commandStack
 */

 function removeExtensionElements(element, businessObject, extensionElementsToRemove, commandStack) {
  if (!minDash.isArray(extensionElementsToRemove)) {
    extensionElementsToRemove = [extensionElementsToRemove];
  }

  const extensionElements = businessObject.get('extensionElements'),
        values = extensionElements.get('values').filter(value => !extensionElementsToRemove.includes(value));
  commandStack.execute('element.updateModdleProperties', {
    element,
    moddleElement: extensionElements,
    properties: {
      values
    }
  });
}

function addListenerFactory({
  bpmnFactory,
  commandStack,
  element,
  listenerGroup
}) {
  return function (event) {
    event.stopPropagation();
    const listener = bpmnFactory.create(listenerGroup, {
      event: getDefaultEvent(element, listenerGroup),
      class: ''
    });
    const businessObject = getListenersContainer(element);
    addExtensionElements(element, businessObject, listener, bpmnFactory, commandStack);
  };
}

function getDefaultEvent(element, listenerGroup) {
  if (listenerGroup === 'camunda:TaskListener') return 'create';
  return is(element, 'bpmn:SequenceFlow') ? 'take' : 'start';
}

/**
 * Add one or more extension elements. Create bpmn:ExtensionElements if it doesn't exist.
 *
 * @param {ModdleElement} element
 * @param {ModdleElement} businessObject
 * @param {ModdleElement|Array<ModdleElement>} extensionElementsToAdd
 * @param {CommandStack} commandStack
 */

 function addExtensionElements(element, businessObject, extensionElementToAdd, bpmnFactory, commandStack) {
  const commands = [];
  let extensionElements = businessObject.get('extensionElements'); // (1) create bpmn:ExtensionElements if it doesn't exist

  if (!extensionElements) {
    extensionElements = createElement('bpmn:ExtensionElements', {
      values: []
    }, businessObject, bpmnFactory);
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: businessObject,
        properties: {
          extensionElements
        }
      }
    });
  }

  extensionElementToAdd.$parent = extensionElements; // (2) add extension element to list

  commands.push({
    cmd: 'element.updateModdleProperties',
    context: {
      element,
      moddleElement: extensionElements,
      properties: {
        values: [...extensionElements.get('values'), extensionElementToAdd]
      }
    }
  });
  commandStack.execute('properties-panel.multi-command-executor', commands);
}

export function getListenersContainer(element) {
  const businessObject = getBusinessObject(element);
  return businessObject.get('processRef') || businessObject;
}

/**
 * Get extension elements of business object. Optionally filter by type.
 *
 * @param  {ModdleElement} businessObject
 * @param  {String} [type=undefined]
 * @returns {Array<ModdleElement>}
 */

export function getExtensionElementsList(businessObject, type = undefined) {
  const extensionElements = businessObject.get('extensionElements');

  if (!extensionElements) {
    return [];
  }

  const values = extensionElements.get('values');

  if (!values || !values.length) {
    return [];
  }

  if (type) {
    return values.filter(value => is(value, type));
  }

  return values;
}

/**
 * Get a readable label for a listener.
 *
 * @param {ModdleElement} listener
 * @param {string => string} [translate]
 */


export function getListenerLabel(listener, translate = value => value) {
  const event = listener.get('event');
  const implementationType = getListenerType(listener);
  return `${translate(EVENT_TO_LABEL[event])}: ${translate(IMPLEMENTATION_TYPE_TO_LABEL[implementationType])}`;
}

export function ExecutionListener(props) {
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
    id: `${idPrefix}-listenerType`,
    component: ListenerType,
    listener
  }, ...ImplementationDetails({
    idPrefix,
    element,
    listener
  }), {
    id: `${idPrefix}-fields`,
    component: Fields,
    listener
  }];
}

export function removeListenerFactory({
  element,
  listener,
  commandStack
}) {
  return function removeListener(event) {
    event.stopPropagation();
    removeExtensionElements(element, getListenersContainer(element), listener, commandStack);
  };
}

export function addExecutionListenerFactory(props) {
  return addListenerFactory({ ...props,
    listenerGroup: 'camunda:ExecutionListener'
  });
}