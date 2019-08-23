import Vue from 'vue'
import Router from 'vue-router'
import NewsPersonSpeechExtraction from './views/NewsPersonSpeechExtraction.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewsPersonSpeechExtraction
    }
  ]
})
