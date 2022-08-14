import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// import './assets/font_3558591_kka4xq44abm/iconfont.css'

import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment'
import VueMoment from 'vue-moment'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'moment/locale/zh-cn'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(VueMoment, { moment })

Vue.use(VueQuillEditor)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = sessionStorage.getItem("token")
  return config

})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
