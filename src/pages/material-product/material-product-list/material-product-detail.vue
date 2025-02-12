<template>
  <div v-loading="detailLoading">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <div class="top-btns">
      <el-button type="primary" @click="submitMaterialProductInfo">提交</el-button>
      <el-button type="info" @click="cancelSubmit">取消</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"> <base-info ref="baseInfoRef" :productDetail="productDetail"></base-info> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import { getMaterialProductDetail } from '@/api/system'

export default {
  name: 'material-product-detail',
  components: { baseInfo },
  data() {
    return {
      activeName: 'first',
      productDetail: {
        categoryId: '',
        categoryName: '',
        productName: '',
        sortNo: 99,
        mainImg: null,
        mainImgs: [],
        imgs: [],
        sku: [],
        unitName: '',
        stock: 0
      },
      detailLoading: false
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getMaterialProductDetail()
    }
  },
  methods: {
    getMaterialProductDetail() {
      let parmas = {
        _id: this.$route.query.id
      }
      this.detailLoading = true
      getMaterialProductDetail(parmas)
        .then(res => {
          this.detailLoading = false
          this.productDetail = res.data
          // 将已上传图片，存到一个新数组放在该条数据内
          this.productDetail.mainImgs = []
          if (this.productDetail.mainImg && this.productDetail.mainImg.url) {
            this.productDetail.mainImgs.push({ url: this.productDetail.mainImg.url })
          }
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    submitMaterialProductInfo() {
      this.$refs.baseInfoRef.formSubmit()
    },
    // 取消
    cancelSubmit() {
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

<style lang="scss" scoped></style>
