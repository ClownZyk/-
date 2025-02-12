<template>
  <aside class="aside__top">
    <span class="iconfont icon-nav toggleNavCollapse" :class="{ active: isSidebarNavCollapse }" @click="toggleNavCollapse"> </span>
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
        <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
        <el-breadcrumb-item v-for="(route, i) in crumbList" :key="route.name" :to="{ name: route.name }" v-if="route.name != 'home'" :class="{ 'is-last-link': i == crumbList.length - 1 }"> {{ route.meta.name }} </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="aside__top--right">
      <div class="shop-name" v-if="$store.state.organizationName">{{ $store.state.organizationName }}</div>
      <!-- 通知中心 -->
      <div class="header-notice" @mouseenter="getNoticeMail">
        <el-badge :value="unReadNoticeNum" :max="99" :hidden="unReadNoticeNum === 0">
          <el-popover v-model="isPopoverShow" placement="bottom" width="500" trigger="click">
            <gem-notice ref="noticeRef" :isPopoverShow.sync="isPopoverShow" :unReadNoticeNum.sync="unReadNoticeNum"></gem-notice>
            <i slot="reference" class="el-icon-bell icon-notice"></i>
          </el-popover>
        </el-badge>
      </div>
      <div class="user-msg">
        <img class="user-img" :src="require('@/assets/image/a.png')" alt="" /> <span class="user-name">{{ $store.state.UserName }}</span>
        <!--
          <el-dropdown trigger="click" placement="top">
              <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        -->
        <el-dropdown @command="handleHeaderCommand">
          <span class="el-dropdown-link"> <i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>个人中心</el-dropdown-item> -->
            <el-dropdown-item command="resetPwd">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="quit-system" @click="loginOut"><span class="iconfont icon-tuichu"></span><span class="tuichu">退出登录</span></div>
    </div>
  </aside>
</template>

<script>
import { sysUserResetPwd } from '@/api/system'
import { mapState } from 'vuex'
import GemNotice from './gem-notice.vue'

export default {
  components: { GemNotice },
  data() {
    return {
      unReadNoticeNum: 0,
      isPopoverShow: false,
      passwordReg: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    }
  },
  computed: {
    ...mapState(['isSidebarNavCollapse', 'crumbList'])
  },
  methods: {
    toggleNavCollapse() {
      this.$store.commit('toggleNavCollapse')
    },
    // 鼠标悬停获取通知消息
    getNoticeMail() {
      this.$refs['noticeRef'].getNoticeList('refresh')
    },
    handleHeaderCommand(command) {
      if (command === 'resetPwd') {
        this.retsetPwd()
      }
    },
    retsetPwd() {
      this.$prompt('请输入重置后的密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputPattern: this.passwordReg,
        inputErrorMessage: '密码至少6个字符，包含字母和数字，不能包含特殊字符'
      })
        .then(({ value }) => {
          let params = {
            _id: this.$store.state.UserID,
            passWord: value
          }
          sysUserResetPwd(params).then(() => {
            this.$message.success('密码重置成功！')
            this.loginOut()
          })
        })
        .catch(() => {})
    },
    loginOut() {
      this.$store.commit('LOGIN_OUT')
      /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.aside__top {
  border-bottom: 1px solid #e5e5e5;
  height: 50px;
  line-height: 50px;
  position: fixed;
  left: 200px;
  top: 0;
  right: 0;
  background: #fff;
  z-index: 1000;
  transition: left 0.25s;
  .toggleNavCollapse {
    display: inline-block;
    margin-left: 8px;
    padding: 0 10px;
    font-size: 26px;
    vertical-align: middle;
    color: #333;
    cursor: pointer;
    transition: all 0.5s;
    &.active {
      transform: rotate(90deg);
    }
  }

  .aside__top--right {
    position: absolute;
    right: 10px;
    top: -1px;
    bottom: 0px;
    .shop-name {
      font-weight: 600;
      color: #409eff;
    }
    .header-notice {
      .icon-notice {
        font-size: 24px;
        font-weight: 700;
      }
    }
    > div {
      position: relative;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      margin-left: 10px;
      padding: 0 15px;
      cursor: pointer;
      &:hover::after {
        transform-origin: 0 0;
        transform: scaleX(1);
      }
      &:first-child:before {
        border: none;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #ef4747;
        transform: scaleX(0);
        transform-origin: right 0;
        transition: transform 0.5s;
      }
      &::before {
        content: '';
        position: absolute;
        height: 20px;
        top: 50%;
        left: -8px;
        margin-top: -10px;
        border-left: 1px solid #ccc;
      }
      &.email {
        i {
          position: absolute;
          left: 18px;
          top: -12px;
          border-radius: 20px;
          background: red;
          color: #fff;
          text-align: center;
          font-size: 12px;
          line-height: 1.5;
          min-width: 20px;
          min-height: 20px;
        }
      }
      &.user-msg {
        .user-img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .user-name {
          color: #758eb5;
          padding: 0 4px;
        }
      }
      .iconfont {
        position: relative;
        font-size: 24px;
        color: #758eb5;
      }
    }
  }
}
.quit-system {
  .tuichu {
    color: #758eb5;
    margin-left: 3px;
    vertical-align: top;
  }
}
.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.6s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
