import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},

{
  path: '/login',
  component: Login
}, {
  path: "/home",
  component: () => import('../components/Home.vue'),
  redirect: '/welcome',
  children: [
    {
      path: '/welcome',
      component: () => import('../components/Welcome.vue')
    }, {
      path: '/users',
      component: () => import('../components/users/User.vue')
    },
    {
      path: "/rights",
      component: () => import('../components/power/Rights.vue')
    },
    {
      path: '/roles',
      component: () => import('../components/power/Roles.vue')
    }, {
      path: '/categories',
      component: () => import('../components/goods/Cate.vue')
    }, {
      path: '/params',
      component: () => import('../components/goods/Params.vue')
    },
    {
      path: '/goods',
      component: () => import('../components/goods/Lists.vue')
    }, {
      path: '/goods/add',
      component: () => import('../components/goods/Add.vue')
    },
    {
      path: '/orders',
      component: () => import('../components/order/Order.vue')
    },
    {
      path: '/reports',
      component: () => import('../components/report/Report.vue')
    }
  ]
}

]

const router = new VueRouter({
  mode: 'hash',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()

  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) next("/login")

  next()


})

export default router
