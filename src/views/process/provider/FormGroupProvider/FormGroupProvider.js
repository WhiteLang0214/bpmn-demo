/*
 * @file name: 
 * @Descripttion: 
 * @version: 
 * @Author: langxue
 * @Date: 2022-11-22 14:40:03
 * @LastEditors: langxue
 * @LastEditTime: 2022-11-22 16:43:39
 */

const minDash = require('min-dash');
const propertiesPanel = require('@bpmn-io/properties-panel');
import { useService } from 'bpmn-js-properties-panel'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

const LOW_PRIORITY = 500;
const CAMUNDA_PLATFORM_GROUPS = [
  // HistoryCleanupGroup, 
  // TasklistGroup, 
  // CandidateStarterGroup, 
  // ImplementationGroup, 
  // ExternalTaskGroup, 
  // ProcessVariablesGroup, 
  // ErrorsGroup, 
  // UserAssignmentGroup, 
  FormGroup, 
  // FormDataGroup, 
  // TaskListenerGroup, 
  // StartInitiatorGroup, 
  // ScriptGroup, 
  // ConditionGroup, 
  // CallActivityGroup, 
  // AsynchronousContinuationsGroup, 
  // JobExecutionGroup, 
  // InMappingPropagationGroup, 
  // InMappingGroup, 
  // InputGroup, 
  // ConnectorInputGroup, 
  // OutMappingPropagationGroup, 
  // OutMappingGroup, 
  // OutputGroup, 
  // ConnectorOutputGroup, 
  // ExecutionListenerGroup, 
  // ExtensionPropertiesGroup, 
  // FieldInjectionGroup, 
  // BusinessKeyGroup
];

const FORM_KEY_PROPS = {
  'camunda:formRef': undefined,
  'camunda:formRefBinding': undefined,
  'camunda:formRefVersion': undefined
};

const FORM_REF_PROPS = {
  'camunda:formKey': undefined
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

// form表单组
function FormGroup(element, injector) {
  const translate = injector.get('translate');
  const group = {
    label: translate('表单组'),
    id: 'CamundaPlatform__Form',
    component: propertiesPanel.Group,
    entries: [...FormProps({
      element
    })]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}


function isFormSupported(element) {
  return is(element, 'bpmn:StartEvent') && !is(element.parent, 'bpmn:SubProcess') || is(element, 'bpmn:UserTask');
}

function getFormType(element) {
  const businessObject = getBusinessObject(element);

  if (minDash.isDefined(businessObject.get('camunda:formKey'))) {
    return 'formKey';
  } else if (minDash.isDefined(businessObject.get('camunda:formRef'))) {
    return 'formRef';
  }
}

function getFormRefBinding(element) {
  const businessObject = getBusinessObject(element);
  return businessObject.get('camunda:formRefBinding') || 'latest';
}

function FormTypeProps(props) {
  return [{
    id: 'formType',
    component: FormType,
    isEdited: propertiesPanel.isSelectEntryEdited
  }];
}

function FormType(props) {
  const {
    element
  } = props;
  const translate = useService('translate');
  const bpmnFactory = useService('bpmnFactory');
  const businessObject = getBusinessObject(element);
  const commandStack = useService('commandStack');
  let extensionElements = businessObject.get('extensionElements');

  const getValue = () => {
    if (minDash.isDefined(businessObject.get('camunda:formKey'))) {
      return 'formKey';
    } else if (minDash.isDefined(businessObject.get('camunda:formRef'))) {
      return 'formRef';
    } else if (getFormData(element)) {
      return 'formData';
    }

    return '';
  };

  const setValue = value => {
    const commands = removePropertiesCommands(element);

    if (value === 'formData') {
      // (1) ensure extension elements
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
      } // (2) create camunda:FormData


      const parent = extensionElements;
      const formData = createElement('camunda:FormData', {
        fields: []
      }, parent, bpmnFactory);
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [...extensionElements.get('values'), formData]
          }
        }
      });
    } else if (value === 'formKey') {
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            'camunda:formKey': ''
          }
        }
      });
    } else if (value === 'formRef') {
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            'camunda:formRef': ''
          }
        }
      });
    }

    commandStack.execute('properties-panel.multi-command-executor', commands);
  };

  const getOptions = () => {
    return [{
      value: '',
      label: translate('<none>')
    }, {
      value: 'formRef',
      label: translate('Camunda Forms')
    }, {
      value: 'formKey',
      label: translate('Embedded or External Task Forms')
    }, {
      value: 'formData',
      label: translate('Generated Task Forms')
    }];
  };

  return propertiesPanel.SelectEntry({
    element,
    id: 'formType',
    label: translate('Type'),
    getValue,
    setValue,
    getOptions
  });
}

function getFormData(element) {
  const bo = getBusinessObject(element);
  return getExtensionElementsList(bo, 'camunda:FormData')[0];
}

function removePropertiesCommands(element, commandStack) {
  const businessObject = getBusinessObject(element);
  const extensionElements = businessObject.get('extensionElements');
  const commands = []; // (1) reset formKey and formRef

  commands.push({
    cmd: 'element.updateModdleProperties',
    context: {
      element,
      moddleElement: businessObject,
      properties: { ...FORM_KEY_PROPS,
        ...FORM_REF_PROPS
      }
    }
  }); // (2) remove formData if defined

  if (extensionElements && getFormData(element)) {
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: extensionElements,
        properties: {
          values: minDash.without(extensionElements.get('values'), getFormData(element))
        }
      }
    });
  }

  return commands;
}

function getExtensionElementsList(businessObject, type = undefined) {
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

function FormProps(props) {
  const {
    element
  } = props;

  if (!isFormSupported(element)) {
    return [];
  }

  const formType = getFormType(element),
        bindingType = getFormRefBinding(element); // (1) display form type select

  const entries = [...FormTypeProps()]; // (2) display form properties based on type

  if (formType === 'formKey') {
    entries.push({
      id: 'formKey',
      component: FormKey,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    });
  } else if (formType === 'formRef') {
    entries.push({
      id: 'formRef',
      component: FormRef,
      isEdited: propertiesPanel.isTextFieldEntryEdited
    }, {
      id: 'formRefBinding',
      component: Binding$1,
      isEdited: propertiesPanel.isSelectEntryEdited
    });

    if (bindingType === 'version') {
      entries.push({
        id: 'formRefVersion',
        component: Version$1,
        isEdited: propertiesPanel.isTextFieldEntryEdited
      });
    }
  }

  return entries;
}

function FormKey(props) {
  const {
    element
  } = props;
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');
  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formKey');
  };

  const setValue = value => {
    modeling.updateProperties(element, {
      'camunda:formKey': value
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: 'formKey',
    label: translate('Form key'),
    getValue,
    setValue,
    debounce
  });
}

function FormRef(props) {
  const {
    element
  } = props;
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');
  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formRef');
  };

  const setValue = value => {
    modeling.updateProperties(element, {
      'camunda:formRef': value
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: 'formRef',
    label: translate('Form reference'),
    getValue,
    setValue,
    debounce
  });
}

function Binding$1(props) {
  const {
    element
  } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');

  const getValue = () => {
    return getFormRefBinding(element);
  };

  const setValue = value => {
    modeling.updateProperties(element, {
      'camunda:formRefBinding': value
    });
  }; // Note: default is "latest",
  // cf. https://docs.camunda.org/manual/develop/reference/bpmn20/custom-extensions/extension-attributes/#formrefbinding


  const getOptions = () => {
    const options = [{
      value: 'deployment',
      label: translate('deployment')
    }, {
      value: 'latest',
      label: translate('latest')
    }, {
      value: 'version',
      label: translate('version')
    }];
    return options;
  };

  return propertiesPanel.SelectEntry({
    element,
    id: 'formRefBinding',
    label: translate('Binding'),
    getValue,
    setValue,
    getOptions
  });
}

function Version$1(props) {
  const {
    element
  } = props;
  const debounce = useService('debounceInput');
  const modeling = useService('modeling');
  const translate = useService('translate');
  const businessObject = getBusinessObject(element);

  const getValue = () => {
    return businessObject.get('camunda:formRefVersion');
  };

  const setValue = value => {
    modeling.updateProperties(element, {
      'camunda:formRefVersion': value
    });
  };

  return propertiesPanel.TextFieldEntry({
    element,
    id: 'formRefVersion',
    label: translate('Version'),
    getValue,
    setValue,
    debounce
  });
}

class FormGruopProvider {
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

FormGruopProvider.$inject = [ 'propertiesPanel', 'injector'];

export default FormGruopProvider;