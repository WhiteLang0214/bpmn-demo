import DealTypePropertiesProvider from './DealTypePropertiesProvider'

export default function (onClick) {
  return {
    __init__: ['dealTypePropertiesProvider'],
    dealTypePropertiesProvider: ['type', DealTypePropertiesProvider(onClick)]
  }
}
