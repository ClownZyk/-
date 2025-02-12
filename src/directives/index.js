import copy from './copy'
import permission from './permission'
// 自定义指令
const directives = {
  copy,
  permission
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}