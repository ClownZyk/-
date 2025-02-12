import store from '@/store'
export default {
  data() {
    return {
      refreshTimer: null
    }
  },
  mounted() {
    this.autoRefresh()
  },
  destroyed() {
    this.clearTimer()
  },
  deactivated() {
    this.clearTimer()
  },
  computed: {
    refreshDuration() {
      return store.state.refreshDuration
    },
    isAutoRefresh() {
      return store.state.isAutoRefresh
    }
  },
  watch: {
    refreshDuration() {
      this.autoRefresh()
    },
    isAutoRefresh(newVal) {
      if (!newVal) {
        this.clearTimer()
        return
      }
      this.autoRefresh()
    }
  },
  methods: {
    autoRefresh() {
      if (!this.isAutoRefresh) return
      this.clearTimer()
      if (this.getAndInitPageData) {
        this.refreshTimer = setInterval(this.getAndInitPageData, this.refreshDuration)
      }
    },
    clearTimer() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer)
        this.refreshTimer = null
      }
    }
  }
}