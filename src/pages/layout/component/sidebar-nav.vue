<template>
  <div>
    <router-link tag="div" to="/home" class="logo-container">
      <img src="../../../assets/image/logo.png" alt="">
    </router-link>
    <el-menu
      :collapse="isSidebarNavCollapse"
      background-color="#304156"
      text-color="#eee"
      active-text-color="#4dbcff"
      :default-active="currentMenu"
    >
      <dynamic-menu :menuList="sidebarMenu"></dynamic-menu>
    </el-menu>
  </div>
</template>

<script>
  import DynamicMenu from '@/components/dynamic-menu'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        isCollapse: true
      }
    },
    computed: {
      ...mapState(['isSidebarNavCollapse']),
      ...mapState('permission', ['sidebarMenu', 'currentMenu'])
    },
    create() {
      // console.log(this.sidebarMenu)
    },
    methods: {},
    components: {
      DynamicMenu
    }
  }
</script>
<style lang="scss" scoped>
  .logo-container {
    padding: 10px;
    cursor: pointer;
    img {
      display: block;
      max-width: 100%;
    }
  }
</style>
