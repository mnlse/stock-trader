import Vue from 'vue'
import Router from 'vue-router'
import Portfolio from '@/components/LoggedIn/Portfolio'
import StockMarket from '@/components/LoggedIn/StockMarket'
import RegisterForm from '@/components/FrontPage/RegisterForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/registerform',
      name: 'RegisterForm',
      component: RegisterForm
    },

    {
      path: '/portfolio',
      name: 'Portfolio',
      component: Portfolio
    },

    {
      path: '/market',
      name: 'StockMarket',
      component: StockMarket
    }
  ]
})
