<template>
  <div class="container-fluid">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapsable" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="navbar-header">
          <span class="navbar-brand"><router-link :to="{ name: 'StockMarket' }">StockTrader</router-link></span>
        </div>

        <div class="collapse navbar-collapse" id="nav-collapsable">
          <ul class="nav navbar-nav">
            <router-link :to="{ name: 'StockMarket' }" active-class="active" tag="li"><a href="#">Stock Market</a></router-link>
            <router-link :to="{ name: 'Portfolio' }" active-class="active" tag="li"><a href="#">Portfolio</a></router-link>
            <li><a href="#">Next Turn</a></li>
          <router-link :to="{ name: 'Stats' }" active-class="active" tag="li"><a href="#">Stats</a></router-link>
          </ul>
          <mn-search></mn-search>
          <ul class="nav navbar-nav navbar-right">
            <li @click="signOut()"><a href="#">Sign Out</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Search from './Search.vue'
import { EventBus } from '../EventBus.js'
import { deleteCookie } from '@/components/helpers/cookies.js'
export default {
  components: {
    mnSearch: Search
  },
  methods: {
    signOut () {
      deleteCookie('username')
      deleteCookie('token')
      EventBus.$emit('signedOutEvent')
    }
  }
}
</script>

<style lang="scss">
.navbar-nav {
  li {
    z-index: 2;
  }
}

.navbar-brand {
  z-index: 2;
  a {
  z-index: 2;
  }
}

/* .navbar-center {
  width: 100%;
  float: none;
  position: absolute;
  z-index: 0;
  display: block;
  text-align: center;
  .form-group {
    width: 30%;
    input {
      width: 100%;
    }
  }
} */
</style>
