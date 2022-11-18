// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import { is } from 'bpmn-js/lib/util/ModelUtil'
import DealTypeProp from './parts/DealTypeProp'

const LOW_PRIORITY = 500

/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */

export default function (onClick) {
  function DealTypePropertiesProvider (propertiesPanel, translate) {
    // Create the custom magic group
    function createGroup (element) {
      const group = {
        id: 'deal-type',
        label: translate('处理类型'),
        entries: [DealTypeProp(element, onClick)]
      }

      return group
    }

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function (element) {
      /**
       * We return a middleware that modifies
       * the existing groups.
       *
       * @param {Object[]} groups
       *
       * @return {Object[]} modified groups
       */
      return function (groups) {
        // Add group
        if (is(element, 'bpmn:UserTask')) {
          groups.push(createGroup(element))
        }

        return groups
      }
    }

    // registration ////////

    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after
    // the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this)
  }
  DealTypePropertiesProvider.$inject = ['propertiesPanel', 'translate']

  return DealTypePropertiesProvider
}
