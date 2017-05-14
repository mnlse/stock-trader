<template>
  <div>
    <mn-header></mn-header>
    <router-view></router-view>
    <mn-footer></mn-footer>
  </div>
</template>
<script>
  import Header from './Header.vue'
  import Footer from './Footer.vue'
  import Router from '../../router/index.js'

  import { getCookie } from '@/components/helpers/cookies.js'
  import { EventBus } from '@/components/EventBus.js'

  Router.beforeEach((to, from, next) => {
    if (getCookie('token') === '' || getCookie('username') === '') {
      EventBus.$emit('signedOutEvent')
    } else {
      EventBus.$emit('signedInEvent')
    }
  })

  export default {
    name: 'app',
    components: {
      mnHeader: Header,
      mnFooter: Footer,
      Router
    }
  }
</script>
