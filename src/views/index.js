
import HtProcess from './process/processComponent.vue'

const components = [
  {name: "HtProcess", component: HtProcess}
]

const HtComponent = {
  install(app) {
    components.forEach(item => {
      app.component(item.name, item.component)
    })
  }
}

export default HtComponent