<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-tabs v-loading="detailLoading" v-model="activeName">
      <el-tab-pane label="基本信息" name="first"><product-base-info ref="productBaseInfoRef" :productDetail="productDetail" :categoryList="categoryList" :zoneList="zoneList"></product-base-info></el-tab-pane>
      <el-tab-pane label="内容详情" name="second"><my-editor @input="onEditorChange($event)" :value="productDetail.content"></my-editor></el-tab-pane>
    </el-tabs>
    <div class="submit-btn"><el-button :loading="submitLoading" type="primary" @click="submitTableProductInfo">提交</el-button></div>
  </div>
</template>

<script>
import { GetAllCategory, getTableProductDetail, tableProductOperation } from '@/api/system'
import ProductBaseInfo from './components/product-base-info.vue'
import MyEditor from '@/components/my-editor'

export default {
  components: {
    ProductBaseInfo,
    MyEditor
  },
  data() {
    return {
      activeName: 'first',
      productDetail: {
        categoryId: '',
        productName: '',
        summary: '',
        storage: '',
        content: '',
        imgs: [],
        sku: [],
        sellWell: false,
        isShow: true,
        isNew: false,
        sortNo: 0,
        zoneId: '',
        batching: [],
        drinkLabels: []
      },
      categoryList: [],
      zoneList: [],
      detailLoading: false,
      submitLoading: false
    }
  },
  computed: {
    formState() {
      if (this.$route.query.productId) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getProductCategory()
    if (this.$route.query.productId) {
      this.getTableProductDetail()
    }
  },
  methods: {
    getProductCategory() {
      let params = {
        belongMenu: '/table-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getTableProductDetail() {
      let params = {
        _id: this.$route.query.productId
      }
      this.detailLoading = true
      getTableProductDetail(params)
        .then(res => {
          this.detailLoading = false
          this.productDetail = res.data
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    submitTableProductInfo() {
      this.$refs['productBaseInfoRef'].$refs['productDetailRef'].validate(valid => {
        if (valid) {
          if (!this.productDetail.sku.length) {
            return this.$message.warning('请添加菜品型号信息后再提交！')
          }
          let sku = this.productDetail.sku.find(v => !v.title || !v.barCode)
          if (sku) {
            return this.$message.warning('请填写规格或编码后再提交！')
          }
          let params = {
            dto: {
              ...this.productDetail,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.formState
          }
          this.submitLoading = true
          tableProductOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    onEditorChange(val) {
      this.productDetail.content = val
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-btn {
  margin-top: 15px;
}
</style>
