<template>
  <div class="discount-detail">
    <div class="top-btns">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="info" @click="cancelSubmit">取消</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"> <base-info :form="form" ref="baseInfoRef" :checkedShopList="checkedShopList" @getSelectType="getSelectType" @selctValShop="selctValShop"></base-info> </el-tab-pane>
      <el-tab-pane label="包含产品信息" name="second">
        <product-info
          :useRange="form.useRange"
          :retailCategoryList="retailCategoryList"
          :mealCategoryList="mealCategoryList"
          :drinkCategoryList="drinkCategoryList"
          :includeProd.sync="includeProd"
          :includeCategory.sync="includeCategory"
        ></product-info>
      </el-tab-pane>
      <el-tab-pane label="排除产品信息" name="third">
        <exclude-product-info
          :useRange="form.useRange"
          :retailCategoryList="retailCategoryList"
          :mealCategoryList="mealCategoryList"
          :drinkCategoryList="drinkCategoryList"
          :excludeProd.sync="excludeProd"
          :excludeCategory.sync="excludeCategory"
        ></exclude-product-info>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import productInfo from './components/product-info'
import excludeProductInfo from './components/exclude-product-info'
import { formatDate } from '@/components/js/data'
import { DiscountCardDetail, DiscountCardOperation, GetListByPage } from '@/api/system'
import { getCategoryForV6 } from '@/api/systemForV8'

export default {
  name: 'discount-detail',
  components: {
    baseInfo,
    productInfo,
    excludeProductInfo
  },
  data() {
    return {
      activeName: 'first',
      retailCategoryList: [],
      mealCategoryList: [],
      drinkCategoryList: [],
      form: {
        isMultiple: false,
        isShop: false,
        partShop: [],
        useRange: [1, 2, 3, 4],
        discount: 0, // 折扣券专用，表示打折额度（百分比）。填30就是七折。
        max: 0, // 最高优惠多少，0：不设上限。
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
    this.GetAllCategory()
    this.GetAllMealCategory()
    this.GetAllDrinkCategory()
  },
  methods: {
    init() {
      if (this.$route.query.id !== undefined) {
        this.operateAction = 1
        let params = {
          _id: this.$route.query.id
        }
        DiscountCardDetail(params).then(
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
    // 商品分类
    GetAllCategory() {
      let params = {
        belongMenu: '',
        categoryName: '',
        belong: '',
        cid: this.$store.state.retailWarehouseId,
        whCid: this.$store.state.retailWarehouseId
      }
      getCategoryForV6(params).then(
        res => {
          if (res.success) {
            this.retailCategoryList = res.data.map(item => {
              return {
                name: item.categoryName,
                unionCode: item.unionCode,
                children: item.children.map(child => {
                  return {
                    name: child.categoryName,
                    unionCode: child.unionCode
                  }
                })
              }
            })
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 餐食分类
    GetAllMealCategory() {
      let params = {
        belongMenu: '/homemade-product-category',
        categoryName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(res => {
        if (res.success) {
          this.mealCategoryList = res.data.map(item => {
            return {
              unionCode: item.unionCode,
              name: item.categoryName
            }
          })
        }
      })
    },

    // 饮品分类
    GetAllDrinkCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        categoryName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(res => {
        if (res.success) {
          this.drinkCategoryList = res.data.map(item => {
            return {
              unionCode: item.unionCode,
              name: item.categoryName
            }
          })
        }
      })
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
      if (!this.form.imgUrl || !this.form.imgUrl.url) {
        this.$message.warning('请上传图片')
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
              Dto: Object.assign({}, this.form),
              Action: this.operateAction
            }
            DiscountCardOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.$router.push('/discount-card')
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
.discount-detail {
  position: relative;
}
.top-btns {
  position: absolute;
  right: 15px;
  top: -5px;
  z-index: 2;
}
</style>
