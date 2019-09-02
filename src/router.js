import Vue from 'vue'
import Router from 'vue-router'
import NewsPersonSpeechExtraction from './views/NewsPersonSpeechExtraction.vue'

Vue.use(Router)

export default new Router({
  // 路由模式：hash(默认)，history模式
  mode: 'history',
  // 修改路由高亮样式，默认值为'router-link-active'
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewsPersonSpeechExtraction
    }
  ]
})
