<template>
  <div class="fp-form login">
    <form>
      <span>Please enter the email address that was used when creating the account. Further instructions will be sent there.</span>
      <div class="form-group">
        <input type="text" class="form-control" id="forgotEmail" placeholder="Email associated with account">
      </div>
      <div class="btn-group">
        <button type="submit" class="btn btn-success" @click="recoverSeq">Recover</button>
        <button type="submit" class="btn btn-primary" @click="backToLogin">Back to Login</button>
      </div>
      <span class="recover-email-success" v-if="emailOk">Email has been sent.</span>
      <span class="recover-email-fail" v-if="emailNok">Failed to sent recovery email.</span>
    </form>
  </div>
</template>

<script>
  import { serverUrl } from '../../config.js'
  var $ = require('jquery')
  export default {
    data () {
      return {
        emailOk: false,
        emailNok: false
      }
    },
    methods: {
      backToLogin () {
        this.$emit('showLoginEvent')
      },
      recoverSeq () {
        console.log('recover')
        $.ajax({
          url: serverUrl + '/recoverEmail',
          method: 'POST',
          success (data) {
            console.log(data)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.recover-email-success {
  color: green;
}
.fp-form {
}
form {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  span {
    display: block;
    margin-bottom: 1em;
  }
}
</style>
