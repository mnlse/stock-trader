<template>
  <div class="fp-cont container-fluid" id="fp-cont">
    <div class="fp-cont-overlay" id="fp-cont-overlay"> <!-- second bg for image rotation -->
    </div>
      <div class="row">
        <div class="hidden-xs hidden-sm col-md-4 col-md-offset-1 fpb-box-cont">
          <transition mode="out-in" name="box" appear>
            <mn-fp-info v-if="toggleBoxes" key="1">{{ box1 }}</mn-fp-info>
            <mn-fp-info v-else key="2">{{ box2 }}</mn-fp-info>
          </transition>
        </div>
        <div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-3">
          <div class="fp-welcome">
            <h1>Welcome to StockTrader.</h1>
          </div>
          <div class="login-box">
            <transition mode="out-in" name="slideInFadeOut" @before-enter="hideChildren" @after-enter="showChildren">
              <mn-forgot-password v-if="showForgotPwd" @showLoginEvent="showForgotPwd = false"></mn-forgot-password>
              <mn-login-form v-else @showForgotPwdEvent="showForgotPwd = true"></mn-login-form>
            </transition>
          </div>
          <mn-register-form></mn-register-form>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import FpInfo from './FpInfoBox'
import ForgotPassword from './ForgotPassword'

import { serverUrl, boxMessagesPath } from '@/config.js'

var $ = require('jquery')

export default {
  components: {
    'mn-login-form': LoginForm,
    'mn-register-form': RegisterForm,
    'mn-fp-info': FpInfo,
    'mn-forgot-password': ForgotPassword
  },
  data () {
    var imgsList = ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
    var currentImg = Math.floor(Math.random() * imgsList.length)
    return {
      bgCont: '#fp-cont',
      bgOverlay: '#fp-cont-overlay',
      imgsList: imgsList,
      currentImg: currentImg,
      bgImgRes: 1,
      res1k: 1500,
      res2k: 2000,
      res3k: 3000,
      res4k: 4000,
      boxMsgs: [],
      box1: null,
      box2: null,
      toggleBoxes: true,
      serverUrl: 'localhost:3000',
      showForgotPwd: false
    }
  },

  methods: {
    rotateBoxes (data) {
      var i1 = 0
      var i2 = 2
      this.box1 = data[i1]
      this.box2 = data[i2]
      var _v = this

      var rotate = function () {
        i1 = (i1 + 1) % data.length
        i2 = (i2 + 1) % data.length
        console.log('rotate', i1, i2)
        _v.box1 = data[i1]
        _v.box2 = data[i2]
        _v.toggleBoxes = !_v.toggleBoxes
      }
      document.mnRotateBoxesInterval = setInterval(rotate, 7000)
    },
    getBoxMsgs () {
      var _v = this
      $.ajax({
        url: serverUrl + boxMessagesPath,
        dataType: 'json',
        success: function (data) {
          _v.rotateBoxes(data)
        },
        error: function (x) {
          console.log('Failed to revtrieve box messages. Error code', x.status)
        }
      })
    },
    hideChildren (el) {
      $(el).children().hide()
    },
    showChildren (el) {
      $(el).children().show()
      $(el).children().css('opacity', 0)
      $(el).children().animate({
        opacity: 1
      }, 230, function () {
        console.log('done')
      })
    },
    loadBgImg (elem, resNum, imgName) {
      var resFolders = {
        1: '1k',
        2: '2k',
        3: '3k',
        4: '4k'
      }
      var bg = 'center/cover url("/static/images/fp-bg/' + resFolders[resNum] + '/' + imgName + '")'
      $(elem).css('background', bg)
    },

    adjustBgImgRes () {
      var width = $(window).width()

      var res3k = this.res3k
      var res2k = this.res2k
      var res1k = this.res1k

      if (width > res3k) {
        this.bgImgRes = 4
      } else if (width > res2k && res3k > width) {
        this.bgImgRes = 3
      } else if (width > res1k && res2k > width) {
        this.bgImgRes = 2
      } else if (res1k > width) {
        this.bgImgRes = 1
      }
    },

    initBg () {
      this.loadBgImg(this.bgCont, this.bgImgRes, this.imgsList[this.currentImg])
      this.loadBgImg(this.bgOverlay, this.bgImgRes, this.imgsList[this.currentImg])
    },

    rotateBgImgs (cb) {
      var bgOverlay = this.bgOverlay
      var bgCont = this.bgCont
      var _v = this
      var imgsList = this.imgsList

      var currentImg = this.currentImg

      var rotate = function () {
        currentImg = (currentImg + 1) % imgsList.length
        _v.loadBgImg(bgOverlay, 1, imgsList[currentImg])
        $(bgOverlay).css('display', 'block')
        $(bgOverlay).animate({
          opacity: '1'
        }, 1000, function () {
          _v.loadBgImg(bgCont, _v.bgImgRes, imgsList[currentImg])
          console.log('background underneath updated')
          $(bgOverlay).css('opacity', 0)
          console.log('overlay hidden')
          $(bgOverlay).hide()
        })
      }
      document.mnRotateBgsInterval = setInterval(rotate, 3000)
    }
  },

  created () {
    window.addEventListener('resize', this.adjustBgImgRes)
  },

  beforeMount () {
    if (document.mnRotateBgsInterval) clearInterval(document.mnRotateBgsInterval)
  },
  mounted () {
    this.adjustBgImgRes()
    this.initBg()
    this.rotateBgImgs()
    this.getBoxMsgs()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.adjustBgImgRes)
    clearInterval(document.mnRotateBgsInterval)
    clearInterval(document.mnRotateBoxesInterval)
  }

}
</script>

<style lang="scss">
   @import url('https://fonts.googleapis.com/css?family=Gudea');
  .fp-cont {
    font-family: 'Gudea', sans-serif;
    color: #1b678e;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    padding: 0;
    .row {
      width: 100%;
      height: 100%;
    }
  }

  .generate-pwd {
    cursor: pointer;
    user-select: none !important;
  }

  table.registerPwdCheck {
    th.desc {
      width: 80%;
    }
    th.checkIcon {
      width: 20%;
    }
    td {
      padding: 0 0.4em;
    }
  }
  .input-ok {
    color: #1f821d;
  }
  .input-nok {
    color: red;
  }
  .input-group {
    width: 100%;
  }

  .form-group-pwd {
    overflow: hidden;
  }
  .generated-pwd-cont {
    width: 40%;
    float: right;
    overflow: hidden;
    .generated-pwd {
      height: 100%;
      font-family: 'Times New Roman';
      color: red;
      font-size: 1.4em;
      letter-spacing: 0.1em;
      user-select: none;
      cursor: default;
    }
    .generated-pwd-ok {
      color: green;
    }
    .generated-pwd-helper {
      display: block;
      opacity: 0.7;
    }
  }

  .fp-cont-overlay {
    display: none;
    opacity: 0;
    margin: 0;
    background-color: white;
    position: absolute;
    width: 100vw;
    height: 100vh;
  }

  div.fp-welcome {
    margin-top: 3vh;
    font-size: 3em;
    text-align: center;
    h1 {
      background-color: rgba(255,255,255,0.6);
      padding: 0.3em;
      border: 1px solid black;
    }
  }

  .login {
    height: 100%;
  }

  .login-box {
    margin-bottom: 1vh;
    height: 33vh;
    width: 100%;
    perspective: 100%;
    -moz-perspective: 1000;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;
    position: relative;
  }

  .fp-form {
    color: black;
    background-color: rgba(255,255,255,0.6);
    padding: 1.3vw 3vw;
    border: 1px solid black;
    margin-top: 0.5vh;
  }

  .fp-register {

  }
  .fp-forgot {
    height: 100%;
  }

  @keyframes slideIn {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
  }
  @keyframes FadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .slideInFadeOut-enter-active {
    animation: 230ms slideIn;
  }
  .slideInFadeOut-leave-active {
    animation: 230ms fadeOut;
  }
</style>
