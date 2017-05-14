import { serverUrl } from '../../config.js'
var $ = require('jquery')
function validateInput (type, value, cb, settings) {
  /* eslint-disable no-useless-escape */
  /* password, username, email check */
  /* vueInstance is used to set variables, call functions for async server requests */
  var types = {
    password () {
      var minlength = 7
      var maxlength = 30
      var results = {
        overall: false,
        uppercase: false,
        lowercase: false,
        number: false,
        pwdlength: false
      }
      var re = {
        uppercase: /([A-Z])/g,
        lowercase: /([a-z])/g,
        number: /([\d])/g
      }
      for (let i in re) {
        var match = value.match(re[i])
        if (match !== null) {
          results[i] = true
        }
      }
      if (value.length >= minlength && value.length < maxlength) results.pwdlength = true
      if (results.uppercase === true && results.lowercase === true &&
          results.number === true && results.pwdlength === true) results.overall = true
      cb(results)
    },
    email () {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!re.test(value)) {
        cb(false)
        return false
      } else {
        $.ajax({
          url: serverUrl + '/checkEmail?',
          method: 'GET',
          dataType: 'json',
          data: {
            'email': value
          },
          beforeSend () {
            cb(null)
          },
          success (resp) {
            cb(resp)
          },
          error (resp) {
            console.log('Error getting email validation: ' + resp.responseText)
          }
        })
      }
    },
    username () {
      var re = /[^A-Za-z0-9@]/
      if (re.test(value) || value.length < 3) {
        cb(false)
      } else {
        $.ajax({
          url: serverUrl + '/checkUsername?',
          method: 'GET',
          data: {
            'username': value
          },
          dataType: 'json',
          beforeSend () {
            cb(null)
          },
          success (resp) {
            /* true = doesn't exist */
            cb(resp)
            if (settings.login) {
              cb(!resp)
            }
          },
          error (resp) {
            console.log('Error getting email validation: ' + resp.responseText)
          }
        })
      }
    }
  }
  if (types.hasOwnProperty(type)) {
    return types[type]()
  }
}

export { validateInput }
