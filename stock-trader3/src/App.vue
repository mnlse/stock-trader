<template>
  <div id="app">
    <transition mode="out-in" enter-active-class="fadeInPage"
     :leave-active-class="computedLeaveClass">
      <div class="logged" key="logged" v-if="signedIn">
        <mn-logged-in></mn-logged-in>
      </div>
      <div class="fp" key="fp" v-else>
        <mn-front-page></mn-front-page>
      </div>
    </transition>
  </div>
</template>

<script src='../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'> </script>

<script>
import FrontPage from './components/FrontPage/FrontPage.vue'
import LoggedIn from './components/LoggedIn/LoggedIn.vue'

import { EventBus } from './components/EventBus.js'
import { getCookie } from '@/components/helpers/cookies.js'

export default {
  name: 'app',
  components: {
    mnFrontPage: FrontPage,
    mnLoggedIn: LoggedIn
  },

  data () {
    return {
      signedIn: null
    }
  },
  computed: {
    computedLeaveClass () {
      if (this.notLoggedIn) return 'fadeOutPageLong'
      else return 'fadeOutPage'
      // transitioning from logged in page to front page takes longer to load (values reversed)
    }
  },
  methods: {
    checkSignedIn () {
      var username = getCookie('username')
      var token = getCookie('token')
      return username !== '' && token !== ''
    }
  },
  mounted () {
    var _v = this
    EventBus.$on('signedInEvent', function () {
      _v.signedIn = true
    })
    EventBus.$on('signedOutEvent', function () {
      _v.signedIn = false
    })
  }
}
</script>

<style lang="scss">
$icon-font-path: "../node_modules/bootstrap-sass/assets/fonts/bootstrap/";
@import '../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss';
#app {
  position: relative;
}

.logged {
  float: left;
  transform: translateX(0vw);
  -webkit-backface-visibility: hidden;
  width: 100%;
  transform-style: preserve-3d;
}

@keyframes fadeInPage {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOutPage {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.fadeOutPage {
  animation: fadeOutPage 0.3s;
}
.fadeOutPageLong {
  animation: fadeOutPage 0.6s;
}
.fadeInPage {
  animation: fadeInPage 0.6s;
}

</style>
