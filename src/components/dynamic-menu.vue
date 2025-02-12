<template>
  <div class="menu-container">
    <template v-for="(v, i) in menuList">
      <el-submenu :index="v.name" v-if="v.children && v.children.length > 0 && !v.meta.hideChildren" v-show="!v.meta.hidden" :key="i">
        <template slot="title">
          <i class="iconfont" :class="v.meta.icon"></i> <span>{{ v.meta.name }}</span>
        </template>
        <el-menu-item-group> <my-nav :menuList="v.children"></my-nav> </el-menu-item-group>
      </el-submenu>
      <el-menu-item :key="i" :index="v.name" @click="gotoRoute(v.path)" v-else v-show="!v.meta.hidden">
        <i class="iconfont" :class="v.meta.icon"></i> <span slot="title">{{ v.meta.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'my-nav',
  props: {
    menuList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {
    // console.log(this.menuList)
  },
  methods: {
    gotoRoute(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0;
}
</style>
