<template>
  <div class="details">
    <el-form :model="detail" :rules="rules" class="msg-dialog" ref="detail">
      <div class="mag-dialog-row">
        <el-form-item style="flex: 0 0 100%;" prop="setMealName">
          <div class="form-item-title">套餐名称<span class="border"></span> <span class="EnName">title</span></div>
          <el-input v-model="detail.setMealName" placeholder="请输入套餐名称(最多10个字符)"></el-input>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item prop="setPrice">
          <div class="form-item-title">套餐价格<span class="border"></span> <span class="EnName">Price</span></div>
          <el-input-number :min="0" controls-position="right" class="mag-input" v-model="detail.setPrice"></el-input-number>
        </el-form-item>
        <el-form-item prop="number">
          <div class="form-item-title">选购数量限制<span class="border"></span> <span class="EnName">Number</span></div>
          <el-input-number :min="1" controls-position="right" class="mag-input" v-model="detail.number" step-strictly :step="1"></el-input-number>
        </el-form-item>
        <el-form-item prop="number">
          <div class="form-item-title">选购种类限制（0为无限制）<span class="border"></span> <span class="EnName">TypeNumber</span></div>
          <el-input-number :min="0" controls-position="right" class="mag-input" v-model="detail.typeNumber" step-strictly :step="1"></el-input-number>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">sort</span></div>
          <el-input-number :min="99" controls-position="right" class="mag-input" v-model="detail.sortNo" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">启用状态<span class="border"></span> <span class="EnName">state</span></div>
          <el-switch v-model="detail.display" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">
            套餐产品<span class="border"></span> <span class="EnName">condition</span>
            <el-button type="primary" size="mini" style="margin-left: 160px;" @click="handleProductSelect(true)">添加</el-button>
          </div>
          <div class="discount-list">
            <el-table :data="detail.chooseProduct" border>
              <el-table-column align="center" type="index" label="件数" width="120"></el-table-column>
              <el-table-column align="center" prop="productName" label="商品名称" width="120"></el-table-column>
              <el-table-column align="center" prop="barCode" label="商品条码" width="140"></el-table-column>
              <el-table-column align="center" prop="price" label="商品价格" width="140"></el-table-column>
              <!--
                <el-table-column align="center" prop="count" label="数量" width="140">
                  <template slot-scope="scope">
                    <el-input-number :min="1" controls-position="right" size="mini" style="width: 100px;" v-model="scope.row.count"></el-input-number>
                  </template>
                </el-table-column>
              -->
              <el-table-column align="center" type="index" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="_delect(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">活动主图<span class="border"></span> <span class="EnName">mainimg</span></div>
          <!-- <div class="item-detail item-img" :style="{'backgroundImage':  'url('+ detail.mainImg.url +')'}" v-if="isShow"></div> -->
          <my-upload :imgs="detail.prodImage" :limitUploadImgs="3" ref="uploadImg" @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)" @handleUploadImg="handleUploadImg('prodImage', 3, $event)"> </my-upload>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" @click="_submit('detail')">提交</el-button>
    <!-- 商品选择器 -->
    <product-select-radio :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></product-select-radio>
  </div>
</template>

<script>
import { ChooseMealOperation, ChooseMealDetails } from '@/api/system'
import myUpload from '@/components/my-upload'
import productSelectRadio from '@/components/product-select-radio'
export default {
  data() {
    return {
      isShowProductSelect: false, // 是否打开选择器
      selectedList: [],
      detail: {
        setMealName: '',
        prodImage: [],
        sortNo: 99,
        display: true,
        number: 1,
        typeNumber: 0,
        // totalPrice: 0, // 零售总计
        setPrice: null, // 组合价
        chooseProduct: [], // 组合产品
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      rules: {
        setMealName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }, { min: 1, max: 10, message: '不得超过10个字符', trigger: 'blur' }],
        setPrice: [{ required: true, message: '请输入套餐价格', trigger: 'blur' }],
        number: [{ required: true, message: '请输入选购数量', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.$route.query.id !== undefined) {
      this._detail()
    }
  },
  watch: {
    // 'detail.chooseProduct': {
    //   handler(v) {
    //     console.log(v)
    //     if (v.length > 0) {
    //       this.detail.number = v.length
    //       this.detail.totalPrice = v
    //         .reduce((preTotal, item) => {
    //           return preTotal + item.price * item.count
    //         }, 0)
    //         .toFixed(2)
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    _detail() {
      let params = {
        _id: this.$route.query.id
      }
      ChooseMealDetails(params).then(
        res => {
          if (res.success) {
            this.detail = res.data
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 打开或关闭选择器
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中的商品
    saveSelected(selectRow) {
      if (this.detail.chooseProduct.length > 0) {
        let _skuId = this.detail.chooseProduct.filter(item => item.barCode === selectRow.sku[0].barCode)
        if (_skuId.length > 0) {
          this.$message.warning('该产品已存在！')
          return false
        }
      }
      let productDetail = {
        uniqueCode: selectRow.uniqueCode,
        productName: selectRow.productName,
        barCode: selectRow.sku[0].barCode,
        price: selectRow.sku[0].price,
        stock: selectRow.stock
        // count: 1
      }
      this.detail.chooseProduct.push(productDetail)
    },
    // 增删改
    _submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._option(this.$route.query.action)
        } else return false
      })
    },
    _delect(index) {
      this.detail.chooseProduct.splice(index, 1)
    },
    // 增删改
    _option(action) {
      if (this.detail.chooseProduct.length <= 0) {
        this.$message.warning('请添加套餐产品')
        return false
      }
      this.detail.chooseProduct = this.detail.chooseProduct.map((item, index) => {
        return {
          no: index + 1,
          ...item
        }
      })
      this.detail.promotionId = this.$route.query.promotionId
      let params = {
        dto: this.detail,
        action: this.$route.query.action
      }
      ChooseMealOperation(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.$router.go(-1)
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 打开或关闭产品选择器
    handleCardSelect(flag) {
      // console.log(flag)
      if (flag) {
        this.selectedList = this.detail.voucher
      } else {
        // 关闭产品选择器，初始化数据
        this.selectedList = []
      }
      this.isShowCardSelect = flag
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.detail[txt] = fileList
      } else {
        this.detail[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.detail[txt]) {
          this.$set(this.detail, txt, [])
        }
        this.detail[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.detail[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  components: {
    myUpload,
    productSelectRadio
  }
}
</script>

<style lang="scss" scoped>
.details {
  height: 100vh;
  overflow-y: scroll;
}

.discount-item {
  margin-top: 10px;
}
</style>
