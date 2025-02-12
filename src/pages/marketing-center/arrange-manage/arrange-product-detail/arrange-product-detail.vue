<template>
  <div class="product-detail">
    <div class="top-btns">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="info" @click="cancelSubmit">取消</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><base-info ref="baseInfoRef"></base-info></el-tab-pane>
      <el-tab-pane label="内容详情" name="second"><content-info></content-info></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import contentInfo from './components/content-info'
export default {
  name: 'product-detail',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    baseInfo,
    contentInfo
  },
  methods: {
    // 提交
    submit () {
      this.$refs.baseInfoRef.formSubmit()
    },
    // 取消
    cancelSubmit () {
      this.$confirm('确认取消吗？未保存的数据将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-detail {
    /*position: relative;*/
  }
  .top-btns {
    /*position: absolute;*/
    /*right: 15px;*/
    /*top: -5px;*/
    /*z-index: 2;*/
  }
</style>
