import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'vue-g2'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
require('echarts-wordcloud')
Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
