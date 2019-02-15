import Vue from 'vue'
import Router from 'vue-router'

//照片下载那一套
// import LoadIng from '@/components/LoadIng'
import PageTwo from '@/components/PageTwo'
import start from '@/components/start'
Vue.use(Router)
export default new Router({
  routes: [
    // {
    //   path: '/loading',
    //   component: LoadIng
    // },
    {
      path: '/pagetwo',
      component: PageTwo
      // component: resolve => require(['../components/PageTwo.vue'], resolve)
    },
    {
      path: '/start',
      component: start
      // component: resolve => require(['../components/PageTwo.vue'], resolve)
    },
  ]

})
