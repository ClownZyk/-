<template>
  <div class="data-state">
    <div class="data-item" v-for="(item, index) in listData" :key="index" @click="gotoProductOrder(index)">
      <div class="data-icon"><img :src="item.img" /></div>
      <div class="data-detail">
        <div class="title">{{ item.title }}</div>
        <div class="price">{{ item.price || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    listData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapState(['storeCid'])
  },
  data() {
    return {}
  },
  methods: {
    gotoProductOrder(index) {
      if (index === 1) {
        this.$router.push({
          path: '/shop-orders-list',
          query: { cid: this.$route.query.cid || this.storeCid }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.data-state {
  display: flex;
  flex-wrap: wrap;
  .data-item {
    display: flex;
    flex: 0 0 25%;
    margin-top: 30px;
    .data-icon {
      width: 79px;
      height: 79px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .data-detail {
      padding-top: 5px;
      margin-left: 10px;
      line-height: 1.5;
      font-family: 'MicrosoftYaHei';
      color: rgba(0, 0, 0, 0.85);
      .title {
        font-size: 16px;
        font-weight: 700;
      }
      .price {
        font-size: 26px;
      }
    }
  }
}
</style>
