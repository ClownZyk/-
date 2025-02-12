<template>
  <div class="details">
    <el-form :model="detail" :rules="rules" class="msg-dialog" ref="detail">
      <div class="mag-dialog-row">
        <el-form-item style="flex: 0 0 100%;" prop="title">
          <div class="form-item-title">活动名称<span class="border"></span> <span class="EnName">title</span></div>
          <el-input v-model="detail.title" placeholder="请输入活动名称(不得超过10个字符)"></el-input>
        </el-form-item>
      </div>
      <!--
        <div class="mag-dialog-row">
          <el-form-item style="flex: 0 0 100%;">
            <div class="form-item-title">活动简介<span class="border"></span> <span class="EnName">summary</span></div>
            <el-input type="textarea" :rows="2" v-model="detail.summary" placeholder="请输入活动简介"></el-input>
          </el-form-item>
        </div>
      -->
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
          <div class="form-item-title">产品名称<span class="border"></span> <span class="EnName">productname</span></div>
          <div>
            <el-input class="mag-input" v-model="detail.productName" clearable :disabled="true"></el-input>
            <el-button type="primary" @click="handleProductSelect(true)" :disabled="$route.query.action === 1 ? true : false">选择商品</el-button>
          </div>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">
            优惠条件<span class="border"></span> <span class="EnName">condition</span>
            <el-button type="primary" size="mini" style="margin-left: 160px;" @click="_addDiscount" v-if="detail.productId">添加</el-button>
          </div>
          <div class="discount-list">
            <el-table :data="detail.discountRule" border>
              <el-table-column align="center" type="index" label="第几件" width="120"></el-table-column>
              <el-table-column align="center" prop="price" label="商品原价" width="120"></el-table-column>
              <el-table-column align="center" type="index" label="折扣（%）" width="140">
                <template slot-scope="scope">
                  <el-input-number :min="0" :max="100" controls-position="right" size="mini" style="width: 100px;" v-model="scope.row.discount"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="center" type="index" label="折后价" width="120">
                <template slot-scope="scope">
                  {{ (detail.price * (scope.row.discount / 100)).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column align="center" type="index" label="优惠金额" width="120">
                <template slot-scope="scope">
                  {{ (detail.price * ((100 - scope.row.discount) / 100)).toFixed(2) }}
                </template>
              </el-table-column>
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
import { PActivityOperation, ProductDetails } from '@/api/system'
import myUpload from '@/components/my-upload'
import productSelectRadio from '@/components/product-select-radio'
export default {
  data() {
    return {
      isShowProductSelect: false, // 是否打开选择器
      selectedList: [],
      detail: {
        title: '',
        prodImage: [{ url: '' }],
        sortNo: 99,
        remarks: '',
        productId: '',
        productName: '',
        barCode: '',
        display: true,
        price: 100,
        discountRule: [],
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      rules: {
        title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 1, max: 10, message: '不得超过10个字符', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.$route.query.id !== undefined) {
      this._detail()
    }
  },
  methods: {
    _detail() {
      let params = {
        _id: this.$route.query.id
      }
      ProductDetails(params).then(
        res => {
          if (res.success) {
            this.detail = res.data
            this.detail.price = this.detail.discountRule[0].price
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
      this.detail.discountRule = []
      this.detail = {
        ...this.detail,
        productId: selectRow._id,
        productName: selectRow.productName,
        barCode: selectRow.sku[0].barCode,
        price: selectRow.sku[0].price
      }
    },
    _addDiscount() {
      this.detail.discountRule.push({
        discount: 100,
        dtPrice: null,
        amount: null,
        price: this.detail.price
      })
    },
    _submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._option(this.$route.query.action)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 增删改
    _option(action) {
      if (this.detail.discountRule.length <= 0) {
        this.$message.warning('请添加优惠条件')
        return false
      }
      this.detail.discountRule = this.detail.discountRule.map((item, index) => {
        return {
          no: index + 1,
          price: item.price,
          discount: item.discount,
          dtPrice: (this.detail.price * (item.discount / 100)).toFixed(2), // 优惠折扣价
          amount: (this.detail.price * ((100 - item.discount) / 100)).toFixed(2) // 优惠价格
        }
      })
      this.detail.promotionId = this.$route.query.promotionId
      let params = {
        dto: this.detail,
        action: this.$route.query.action
      }
      PActivityOperation(params).then(
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
    _delect(index) {
      this.detail.discountRule.splice(index, 1)
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
