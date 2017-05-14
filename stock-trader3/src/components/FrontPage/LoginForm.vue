<template>
  <div class="fp-form login">
    <h4>Login:</h4>
      <div class="form-group">
        <div class="input-group">
          <input type="text" class="form-control" id="login-user" 
            placeholder="Username" v-model="username" autofocus>
          <div class="input-group-addon" v-if="username">
            <span class="glyphicon glyphicon-ok-circle input-ok" v-if="correctUsername === true"></span>
            <span class="glyphicon glyphicon-remove-circle input-nok" v-else></span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group login-password">
          <input type="password" class="form-control" 
            placeholder="Password" v-model="password">
            <div class="input-group-addon" v-if="password">
              <span class="glyphicon glyphicon-ok-circle input-idk" v-show="correctPassword === true"></span>
              <span class="glyphicon glyphicon-remove-circle input-nok" v-show="correctPassword === false"></span>
              <span class="glyphicon glyphicon-ok-circle input-ok" v-show="correctPassword === 'serverConfirmedOk'"></span>
            </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" @click="attemptLogin()">Login</button>
      <span class="forgot-pwd" @click="forgotPwd()">Forgot password</span>
    </form>
  </div>
</template>

<script>
import { validateInput } from '@/components/helpers/validateInput.js'
import { serverUrl, signInPath } from '@/config.js'

import { EventBus } from '../EventBus.js'
import { setCookie } from '@/components/helpers/cookies.js'

var $ = require('jquery')
export default {
  data () {
    return {
      username: null,
      correctUsername: false,
      password: null,
      correctPassword: false,
      resp: null
    }
  },
  methods: {
    validateInput,
    forgotPwd () {
      this.$emit('showForgotPwdEvent')
    },
    successfulSignIn (token) {
      var _v = this
      this.correctPassword = 'serverConfirmedOk'
      var emitSignInEvent = () => {
        EventBus.$emit('signedInEvent')
      }
      console.log('a')
      setCookie({ name: 'username', value: _v.username, expireHours: 24 })
      setCookie({ name: 'token', value: token, expireHours: 24 })
      setTimeout(emitSignInEvent, 250)
    },

    failedSignIn () {
      this.correctPassword = false
    },

    attemptLogin () {
      var data = {
        username: this.username,
        password: this.password
      }

      var gotResponse = (token) => {
        (token === null) ? this.failedSignIn() : this.successfulSignIn(token)
      }
      if (!this.correctUsername || !this.correctPassword) {
        return false
      } else {
        $.ajax({
          url: serverUrl + signInPath,
          method: 'POST',
          data: data,
          dataType: 'text',
          success (token) {
            gotResponse(token)
          },
          error (resp) {
            console.log('Authentication error: ' + resp.statusText)
            gotResponse(null)
          }
        })
      }
    }
  },
  watch: {
    'username': function (val) {
      var _v = this
      validateInput('username', val, function (resp) { _v.correctUsername = resp }, { login: true })

      if (this.correctPassword === false) {
        validateInput('password', this.password, function (resp) { _v.correctPassword = resp.overall })
      }
    },
    'password': function (val) {
      var _v = this
      validateInput('password', val, function (resp) { _v.correctPassword = resp.overall })
    }
  }
}

</script>

<style lang="scss" scoped>
  .input-idk {
    color: orange;
  }
  .forgot-pwd {
    cursor: pointer;
  }
</style>
