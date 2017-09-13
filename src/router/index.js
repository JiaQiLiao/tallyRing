import Vue from 'vue'
import Router from 'vue-router'
// import tallyhome from '@/components/tallyhome'
// import hotweek from '@/components/hotweek'
// import financetalk from '@/components/financetalk'
// import topicdetial from '@/components/topicdetial'
// import articledetial from '@/components/articledetial'
// import message from '@/components/message' 

Vue.use(Router)

// export default new Router({
//   routes: [    
//     {
//       path: '/',
//       name: 'tallyhome',
//       component: tallyhome
//     },
//     {
//       path: '/hotweek',
//       name: 'hotweek',
//       component: hotweek
//     },
//     {
//       path: '/financetalk',
//       name: 'financetalk',
//       component: financetalk
//     },
//     {
//       path: '/topicdetial',
//       name: 'topicdetial',
//       component: topicdetial
//     },
//     {
//       path: '/articledetial',
//       name: 'articledetial',
//       component: articledetial
//     },
//     {
//       path: '/message',
//       name: 'message',
//       component: message
//     }
//   ]
// })
//按需加载路由，减少首次加载首页的文件过大
const routes = [
   {
    path:'/',
    component:resolve => require(['@/components/tallyhome.vue'],resolve),
    meta:{keepAlive:true}
   },
   {
     path: '/hotweek',     
     component: resolve => require(['@/components/hotweek.vue'],resolve),
     meta:{keepAlive:true}
   },
   {
     path: '/financetalk',    
     component: resolve => require(['@/components/financetalk.vue'],resolve),
     meta:{keepAlive:true}
   },
   {
     path: '/smartliving',    
     component: resolve => require(['@/components/smartliving.vue'],resolve),
     meta:{keepAlive:true}
   },
   {
     path: '/firstlook',    
     component: resolve => require(['@/components/firstlook.vue'],resolve),
     meta:{keepAlive:true}
   },
   {
     path: '/topicdetial',     
     component: resolve => require(['@/components/topicdetial.vue'],resolve),
     meta:{keepAlive:false}
   },
   {
     path: '/articledetial',     
     component: resolve => require(['@/components/articledetial.vue'],resolve),
     meta:{keepAlive:false}
   },
   {
     path: '/message',     
     component: resolve => require(['@/components/message.vue'],resolve),
     meta:{keepAlive:false}
   }

]
const router = new Router({//vue中监听的是body的scroll值，而本项目中需要监听的是mescroll的scroll值，所以这里不生效
  // mode:"history",
  routes,
  // scrollBehavior (to, from, savedPosition) {
  //   // if (savedPosition) {
  //   //   return savedPosition
  //   // } else {
  //     console.log('位置呢：',to,from,savedPosition,'dd')
  //   //   return { x: 0, y: 500 }
  //   // }
  //  }
  }) 
  
export default router; 
