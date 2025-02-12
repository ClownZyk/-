<template>
  <div id="app"><router-view /></div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  mounted() {
    window.addEventListener('load', e => this.getLoadHandler(e))
  },
  methods: {
    ...mapMutations(['_getTokenTimer']),
    getLoadHandler(e) {
      if (this.$store.state.UserTokenExpires) {
        console.log('刷新')
        let time = new Date(this.$store.state.UserTokenExpires).getTime() - 1 * 60 * 1000 - new Date().getTime()
        this._getTokenTimer(this.$store.state, time)
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  > div {
    height: 100%;
  }
}
</style>
