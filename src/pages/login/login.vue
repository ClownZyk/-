<template>
  <div class="clearfix" id="login_wrap" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="login-container">
      <div class="login-left-bg" :style="{ backgroundImage: 'url(' + loginLeft + ')' }"></div>
      <div class="login-form">
        <div class="login-logo"><img :src="loginLogo" alt="logo" /></div>
        <label class="login-account">
          <span class="input-icon"> <i class="iconfont icon-zhanghao"></i> </span> <input id="name" type="text" placeholder="请输入账号" name="account" v-model.trim="UserName" />
        </label>
        <label class="login-account" for="password">
          <span class="input-icon"> <i class="iconfont icon-password"></i> </span> <input id="password" type="password" placeholder="请输入密码" name="password" v-model.trim="PassWord" @keyup.enter="login" />
        </label>
        <div class="login-btn-container"><div class="login-btn" @click="login">登录</div></div>
      </div>
    </div>
    <div class="login-footer">
      <a style="color:#666" target="_blank" rel="noopener" href="https://beian.miit.gov.cn/">{{ AppConfig.FILINGNUM }}</a>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/permission'
import AppConfig from '@/components/js/gem'

export default {
  data() {
    return {
      AppConfig: AppConfig,
      bg: require('../../assets/image/login.png'),
      loginLeft: require('../../assets/image/login-left.png'),
      loginLogo: require('../../assets/image/login-logo.png'),
      UserName: '',
      PassWord: ''
    }
  },
  methods: {
    login() {
      let param = {
        UserName: this.UserName,
        PassWord: this.PassWord
      }
      login(param).then(res => {
        this.$store.commit('LOGIN_IN', res.data)
        this.$router.replace('/home')
      })
      // try {
      // } catch (e) {
      //   console.log(e)
      // }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_mixin.scss';
.title {
  text-align: center;
  font-size: 22px;
  padding-top: 100px;
  color: #ffffff;
}
#login_wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @include bg-style;
  .login-container {
    position: absolute;
    left: 50%;
    width: 980px;
    margin-left: -490px;
    top: 20%;
    height: 560px;
    display: flex;
    box-shadow: 0 0 16px #7366b2;
    border-radius: 12px;
    overflow: hidden;
    .login-left-bg {
      width: 50%;
      height: 100%;
      @include bg-style;
    }
    .login-form {
      width: 50%;
      height: 100%;
      background-color: #ffffff;
      .login-logo {
        text-align: center;
        padding: 40px 40px 30px;
        img {
          width: 60%;
        }
      }
      .login-title {
        font-size: 28px;
        text-align: center;
      }
      .login-account {
        border-bottom: 1px solid #dddddd;
        width: 80%;
        margin: 0 auto;
        padding: 16px 0;
        display: block;
        input {
          border: none;
          background-color: transparent;
          width: 70%;
          font-size: 14px;
          height: 30px;
          text-indent: 15px;
        }
        .input-icon {
          font-size: 24px;
          margin-right: 16px;
        }
      }
      .login-btn-container {
        margin-top: 60px;
      }
      .login-btn {
        width: 50%;
        margin: 0 auto;
        color: #ffffff;
        background-color: #409EFF;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
}
.login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
