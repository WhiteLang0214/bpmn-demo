import BuildDemo from './index';

function install(app) {
  app.component('BuildDemo', BuildDemo)
}

export default {
  install,
  BuildDemo
}