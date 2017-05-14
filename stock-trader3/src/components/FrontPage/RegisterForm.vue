<template>
  <div class="fp-form register">
    <h4>New to StockTrader? Register here:</h4>
    <form>
      <div class="form-group">
        <div class="input-group">
          <input type="text" class="form-control" id="register-user" 
            placeholder="Username" v-model="username">
          <div class="input-group-addon" v-if="username">
            <span class="glyphicon glyphicon-ok-circle input-ok" v-show="correctUsername === true"></span>
            <span class="glyphicon glyphicon-remove-circle input-nok" v-show="correctUsername === false"></span>
            <span class="glyphicon glyphicon-refresh" v-show="correctUsername === null"></span>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="email" class="form-control" id="register-user" 
             placeholder="Email" v-model="email">
          <div class="input-group-addon" v-if="email">
            <span class="glyphicon glyphicon-ok-circle input-ok" v-show="correctEmail === true"></span>
            <span class="glyphicon glyphicon-remove-circle input-nok" v-show="correctEmail === false"></span>
            <span class="glyphicon glyphicon-refresh" v-show="correctEmail === null"></span>
            <!-- null = waiting for server response -->
          </div>
        </div>
      </div>
      <div class="form-group form-group-pwd">
        <div class="input-group">
          <input type="password" class="form-control" id="register-password" 
            placeholder="Password" v-model="password" v-on:focus="clickedPwdForm = true">
          <div class="input-group-addon" v-if="password">
            <span class="glyphicon glyphicon-ok-circle input-ok" v-show="correctPassword.overall"></span>
            <span class="glyphicon glyphicon-remove-circle input-nok" v-show="!correctPassword.overall"></span>
          </div>
          <div class="input-group-addon generate-pwd" @click="generatePwd()">Generate</div>
        </div>
        <div class="generatedPwdAndValidations">
          <div v-if="clickedPwdForm" class="generated-pwd-cont">
            <span class="generated-pwd" 
                 :class="{ 'generated-pwd-ok': generatedPwdMatchesInput }">{{ generatedPwd }}</span>
            <span class="generated-pwd-helper" v-if="displayPwdHelper">Will turn green if rewritten correctly.</span>
          </div>
          <table v-show="clickedPwdForm" class="registerPwdCheck">
            <thead>
              <th class="desc"></th>
              <th class="checkIcon"></th>
            </thead>
            <tbody>
              <col width="60px">
              <col width="10px">
              <tr>
              <td colspan="2">
                Password Requirements:
              </td>
              </tr>
              <tr>
              <td>
                1 uppercase letter (A-Z)
              </td>
              <td>
                <span class="glyphicon glyphicon-ok-circle input-ok" v-if="correctPassword.uppercase === true"></span>
                <span class="glyphicon glyphicon-remove-circle input-nok" v-else></span>
              </td>
              </tr>
              <tr>
              <td>
                1 lowercase letter (a-z)
              </td>
              <td>
                <span class="glyphicon glyphicon-ok-circle input-ok" v-if="correctPassword.lowercase === true"></span>
                <span class="glyphicon glyphicon-remove-circle input-nok" v-else></span>
              </td>
              </tr>
              <tr>
              <td>
                1 number (0-9)
              </td>
              <td>
                <span class="glyphicon glyphicon-ok-circle input-ok" v-if="correctPassword.number === true"></span>
                <span class="glyphicon glyphicon-remove-circle input-nok" v-else></span>
              </td>
              </tr>
              <tr>
              <td>
                from 7 to 30 characters
              </td>
              <td>
                <span class="glyphicon glyphicon-ok-circle input-ok" v-if="correctPassword.pwdlength === true"></span>
                <span class="glyphicon glyphicon-remove-circle input-nok" v-else></span>
              </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" @click="attemptRegister">Register</button>
    </form>
  </div>
</template>

<script>
import { validateInput } from '@/components/helpers/validateInput.js'
import { serverUrl } from '../../config.js'
console.log(validateInput)
var $ = require('jquery')
var generatePassword = require('password-generator')
export default {
  data () {
    return {
      username: null,
      correctUsername: false,
      email: null,
      correctEmail: false,
      password: null,
      correctPassword: {
        overall: false,
        uppercase: false,
        lowercase: false,
        digit: false
      },
      clickedPwdForm: false,
      generatedPwd: null,
      generatedPwdMatchesInput: false
    }
  },
  computed: {
    displayPwdHelper () {
      return (this.generatedPwd !== null && this.generatedPwdMatchesInput === false)
    }
  },
  methods: {
    validateInput,
    generatePwd () {
      var valid = false
      var pwd
      do {
        pwd = generatePassword(7, false)
        this.validateInput('password', pwd, function (resp) { valid = resp })
      } while (valid.overall === false)
      this.generatedPwd = pwd
      this.checkIfMatchesGenerated()
      this.clickedPwdForm = true
    },
    checkIfMatchesGenerated () {
      if (this.password === this.generatedPwd) {
        this.generatedPwdMatchesInput = true
      } else {
        this.generatedPwdMatchesInput = false
      }
    },
    attemptRegister () {
      if (!this.correctEmail || !this.correctUsername || !this.correctPassword) {
        return false
      } else {
        var data = {
          username: this.username,
          password: this.password,
          password_confirmation: this.password,
          email: this.email
        }
        $.ajax({
          url: serverUrl + '/users',
          method: 'POST',
          data: data,
          success (data) {
            console.log('yay')
            console.log(data)
          },
          error (data) {
            console.log(data)
          }
        })
      }
    }
  },
  watch: {
    'username': function (val) {
      var _v = this
      validateInput('username', val, function (resp) { _v.correctUsername = resp })
    },
    'password': function (val) {
      var _v = this
      validateInput('password', val, function (resp) { _v.correctPassword = resp })
      this.checkIfMatchesGenerated()
    },
    'email': function (val) {
      var _v = this
      validateInput('email', val, function (resp) { _v.correctEmail = resp })
    },
    'correctEmail': function (val) {
      console.log('UPDATED ' + val)
    }
  }
}
</script>

<style lang="scss">
.generated-pwd-ok {
  color: green;
}
</style>
