import Vue from 'vue'
import Router from 'vue-router'
import NewsPersonSpeechExtraction from './views/NewsPersonSpeechExtraction.vue'
import WordCloud from './components/WordCloud.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: NewsPersonSpeechExtraction
    },
    {
      path: '/wc',
      name: 'wc',
      component: WordCloud
    }
  ]
})
