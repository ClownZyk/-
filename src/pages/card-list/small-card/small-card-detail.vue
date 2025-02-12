<template>
  <div class="exchange-detail">
    <div class="top-btns">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="info" @click="cancelSubmit">取消</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"> <base-info :form="form" ref="baseInfoRef" :checkedShopList="checkedShopList" @getSelectType="getSelectType" @selctValShop="selctValShop"></base-info> </el-tab-pane>
      <el-tab-pane label="包含产品信息" name="second"> <product-info :includeProd.sync="includeProd" :includeCategory.sync="includeCategory"></product-info> </el-tab-pane>
      <el-tab-pane label="排除产品信息" name="third"> <exclude-product-info :excludeProd.sync="excludeProd" :excludeCategory.sync="excludeCategory"></exclude-product-info> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import productInfo from './components/product-info'
import excludeProductInfo from './components/exclude-product-info'
import { formatDate } from '@/components/js/data'
import { smallCardDetail, smallCardOperation } from '@/api/system'
export default {
  name: 'exchange-detail',
  components: {
    baseInfo,
    productInfo,
    excludeProductInfo
  },
  data() {
    return {
      activeName: 'first',
      form: {
        limit: 2,
        isMultiple: false,
        isShop: false,
        partShop: [],
        useRange: [3],
        title: '',
        subTitle: '',
        imgUrl: '',
        description: '',
        quantity: 1,
        getLimit: 0,
        useLimit: 0,
        userTime: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
        startTime: formatDate(new Date(), 'yyyy/MM/dd'),
        endTime: formatDate(new Date(), 'yyyy/MM/dd'),
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid,
        dateInfo: {
          dateType: 2,
          fixedBeginTerm: 0,
          fixedTerm: 1
        }
      },
      // 包含的产品和分类
      includeProd: [],
      includeCategory: [],
      // 排除的产品和分类
      excludeProd: [],
      excludeCategory: [],
      checkedShopList: [],
      operateAction: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.$route.query.id !== undefined) {
        this.operateAction = 1
        let params = {
          _id: this.$route.query.id
        }
        smallCardDetail(params).then(
          res => {
            if (res.success) {
              this.form = res.data
              this.includeProd = res.data.includeProd || []
              this.includeCategory = res.data.includeCategory || []
              this.excludeProd = res.data.excludeProd || []
              this.excludeCategory = res.data.excludeCategory || []
              this.form.imgUrls = []
              if (res.data.imgUrl !== null) {
                this.form.imgUrls.push({ url: res.data.imgUrl })
                this.form.imgUrl = { url: res.data.imgUrl }
              }
              if (res.data.dateInfo.dateType === 1) {
                let timearange = [res.data.dateInfo.beginTimeStamp, res.data.dateInfo.endTimeStamp]
                this.form.userTime = timearange
              }
              this.checkedShopList = res.data.partShop.map(item => {
                return item.shopCid
              })
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      }
    },
    getSelectType(val, list) {
      this.checkedShopList = val ? list : []
    },
    selctValShop(value, shopList) {
      this.checkedShopList = value
      this.form.partShop = shopList.filter(a => {
        return this.checkedShopList.some(f => f === a.shopCid)
      })
    },
    // 提交
    submit() {
      if (!this.form.isShop && this.checkedShopList.length <= 0) {
        this.$message.warning('请选择该卡劵适用的店铺信息！')
        return false
      }
      if (this.includeCategory.length <= 0 && this.includeProd.length < this.form.limit) {
        return this.$message.warning('请添加卡券包含的分类或产品！')
      }
      if (this.includeProd.length > this.form.limit) {
        return this.$message.warning('添加的产品数量多于设置的产品数量限制！')
      }
      if (!this.form.imgUrl || !this.form.imgUrl.url) {
        this.$message.warning('请上传图片！')
        return false
      }
      this.$refs.baseInfoRef.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.form.dateInfo.dateType === 1) {
              this.form.dateInfo.beginTimeStamp = this.form.userTime[0]
              this.form.dateInfo.endTimeStamp = this.form.userTime[1]
            }
            this.form = {
              ...this.form,
              imgUrl: this.form.imgUrl.url ? this.form.imgUrl.url : this.form.imgUrl,
              includeProd: this.includeProd,
              includeCategory: this.includeCategory,
              excludeProd: this.excludeProd,
              excludeCategory: this.excludeCategory
            }
            let params = {
              dto: Object.assign({}, this.form),
              action: this.operateAction
            }
            // console.log(params)
            smallCardOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.$router.push('/small-card')
            })
          })
        }
      })
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

<style lang="scss" scoped>
.exchange-detail {
  position: relative;
}
.top-btns {
  position: absolute;
  right: 15px;
  top: -5px;
  z-index: 2;
}
</style>
