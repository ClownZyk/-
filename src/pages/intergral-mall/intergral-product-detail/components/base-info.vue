<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px" label-position="top" class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="productType">
            <div class="form-item-title">产品种类<span class="border"></span><span class="EnName">PRODUCTTYPE</span></div>
            <el-select v-model="form.productType" @change="handleChangeType" placeholder="请选择"> <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          </el-form-item>
          <el-form-item class="item-long" v-if="form.productType === 1">
            <div class="form-item-title">选择商品<span class="border"></span><span class="EnName">GOOD</span></div>
            <el-button type="primary" plain @click="handleProductSelect(true)">{{ this.form.sku[0] ? '零售商品' : '点击选择零售商品' }}</el-button>
            <el-button type="primary" plain @click="handleDrinkDialog(true)">{{ this.form.sku[0] ? '饮品商品' : '点击选择饮品商品' }}</el-button>
          </el-form-item>
          <el-form-item class="item-long" v-else-if="form.productType === 2">
            <div class="form-item-title">选择卡券<span class="border"></span><span class="EnName">CARD</span></div>
            <el-button type="primary" plain @click="handleCardSelect(true)">{{ this.form.sku[0] ? this.form.sku[0].title : '点击选择兑换券' }}</el-button>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="productName" class="item-long">
            <div class="form-item-title">产品名称<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="请输入产品名称" v-model="form.productName"></el-input>
          </el-form-item>
          <el-form-item prop="sortNo">
            <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
            <el-input-number controls-position="right" v-model="form.sortNo" placeholder="最小值为99" :min="99"></el-input-number>
          </el-form-item>
          <el-form-item prop="isShow">
            <div class="form-item-title">上下架<span class="border"></span><span class="EnName">ISSHOW</span></div>
            <el-switch v-model="form.isShow"></el-switch>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="summary" class="item-long">
            <div class="form-item-title">简介<span class="border"></span><span class="EnName">SUMMARY</span></div>
            <el-input v-model="form.summary" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">主图<span class="border"></span><span class="EnName">MAINIMG</span></div>
            <my-upload :imgs="form.mainImgs" :limitUploadImgs="1" @handleDisabledSubmit="handleDisabledSubmit" @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)" @handleUploadImg="handleUploadImg('mainImg', 1, $event)"> </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表 -->
      <el-table class="table" ref="tablePrice" :data="form.sku" border style="width:1021px">
        <el-table-column align="center" prop="title" :label="form.productType === 1 ? '型号' : '名称'" width="200"></el-table-column>
        <el-table-column align="center" prop="cardId" label="条形码" v-if="form.productType === 1" width="160"></el-table-column>
        <el-table-column align="center" prop="integral" label="兑换所需积分" width="180">
          <template slot-scope="scope">
            <el-input-number
              placeholder="兑换所需积分"
              size="mini"
              :controls="false"
              @change="priceInputChange($event, scope.row)"
              :min="0"
              :step="1"
              step-strictly
              v-model="scope.row.integral"
              :disabled="inputNumberDisabled"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="兑换所需金额" width="180">
          <template slot-scope="scope">
            <el-input-number
              placeholder="兑换所需金额"
              size="mini"
              :controls="false"
              @change="priceInputChange($event, scope.row)"
              :min="0"
              :step="0.01"
              step-strictly
              v-model="scope.row.price"
              :disabled="inputNumberDisabled"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stock" label="库存" width="180">
          <template slot-scope="scope">
            <el-input-number placeholder="库存" size="mini" :controls="false" :min="0" :step="1" step-strictly v-model="scope.row.stock" :disabled="inputNumberDisabled"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleRemoveProduct(scope.row)" :disabled="form.sku.length === 1 || inputNumberDisabled">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
    <!-- 零售商品选择器 -->
    <product-select-radio :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></product-select-radio>
    <!-- 饮品产品选择器 -->
    <drink-product-select-radio :isDrinkProductShow="isDrinkProductShow" @handleDrinkDialog="handleDrinkDialog" @savedDrinkData="savedDrinkData"></drink-product-select-radio>
    <!-- 兑换券选择器 -->
    <exchange-card-select :isShowCardSelect="isShowCardSelect" @handleCardSelect="handleCardSelect" @saveSelected="saveSelectedVirtual"></exchange-card-select>
  </div>
</template>
<script>
import exchangeCardSelect from '@/components/exchange-card-select.vue'
import productSelectRadio from '@/components/product-select-radio.vue'
import drinkProductSelectRadio from '@/components/drink-product-select-radio.vue'
import myUpload from '@/components/my-upload'
export default {
  components: {
    exchangeCardSelect,
    productSelectRadio,
    drinkProductSelectRadio,
    myUpload
  },
  props: {
    form: Object,
    formDisabled: {
      type: Boolean,
      default: false
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabledSubmit: {
      type: Boolean,
      default: false
    },
    operateTitle: {
      type: String,
      default: ''
    },
    operateAction: {
      type: Number,
      default: 0
    },
    inputNumberDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productTypeList: [{ label: '实物', value: 1 }, { label: '虚拟物品', value: 2 }],
      // 是否打开选择器
      isShowProductSelect: false,
      isDrinkProductShow: false,
      isShowCardSelect: false,
      selectedList: [],
      rules: {
        productType: [{ required: true, message: '请选择产品种类', trigger: 'change' }],
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit(val) {
      this.$emit('handleDisabledSubmit', val)
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 改变产品种类
    handleChangeType() {
      this.form.sku = []
    },
    // -------产品选择器相关事件-------
    // 打开或关闭选择器
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中的商品
    saveSelected(selectRow) {
      this.form.sku = []
      let list = selectRow.sku.map(v => {
        v.price = 0
        v.integral = 0
        v.cardId = v.barCode
        v.productId = selectRow._id
        v.productName = selectRow.productName
        // v.title = v.unitName
        return v
      })
      this.form.sku = JSON.parse(JSON.stringify(list))
      this.form.productName = selectRow.productName
      this.form.mainImg = selectRow.mainImg
      this.form.mainImgs = [
        {
          name: '',
          url: selectRow.mainImg.url
        }
      ]
    },

    handleRemoveProduct(row) {
      this.$confirm('确定刪除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.form.sku = this.form.sku.filter(item => {
            return item.barCode !== row.barCode
          })
        })
        .catch(() => {})
    },
    // 饮品产品选择处理
    handleDrinkDialog(flag) {
      this.isDrinkProductShow = flag
    },
    savedDrinkData(selectRow) {
      this.form.sku = []
      let list = selectRow.sku.map(v => {
        v.price = 0
        v.integral = 0
        v.cardId = v.barCode
        v.productId = selectRow._id
        v.productName = selectRow.productName
        return v
      })
      this.form.sku = JSON.parse(JSON.stringify(list))
      this.form.productName = selectRow.productName
      this.form.mainImg = selectRow.imgs && selectRow.imgs.length > 0 ? selectRow.imgs[0] : null
      this.form.mainImgs = selectRow.imgs && selectRow.imgs.length > 0 ? selectRow.imgs : []
    },
    // -------虚拟选择器相关事件-------
    // 打开或关闭选择器
    handleCardSelect(flag) {
      this.isShowCardSelect = flag
    },
    // 保存选中的商品
    saveSelectedVirtual(selectRow) {
      let list = []
      let obj = {
        title: selectRow.title,
        cardId: selectRow._id,
        stock: selectRow.quantity,
        integral: 0,
        price: 0,
        img: {
          url: selectRow.imgUrl,
          thumUrl: '',
          absoluteUrl: ''
        }
      }
      list.push(obj)
      this.form.sku = JSON.parse(JSON.stringify(list))
      this.form.productName = selectRow.title
      this.form.mainImg = {
        url: selectRow.imgUrl,
        thumUrl: '',
        absoluteUrl: ''
      }
      this.form.mainImgs = [
        {
          name: '',
          url: selectRow.imgUrl
        }
      ]
      // this.handleCardSelect(false)
    },
    // 拼团输入框值改变时，限定值不能为空
    priceInputChange(e, row) {
      this.$nextTick(() => {
        if (e === undefined) {
          row.price = 0
        }
      })
    },
    formSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.sku.length <= 0) {
            this.$message({
              message: '请选择要兑换的产品',
              type: 'warning'
            })
            return false
          }
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('formSubmit')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.base-info {
  width: 100%;
  .page-contain {
    width: 100%;
    background-color: #ffffff;
    .form-contain {
      .form-contain-item {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        .el-form-item {
          margin-left: 20px;
          .el-form-item__content {
            .form-item-title {
              font-weight: bolder;
              font-size: 16px;
              position: relative;
              .border {
                width: 1px;
                height: 16px;
                position: absolute;
                background-color: #000000;
                display: inline-block;
                top: 10px;
                margin-left: 8px;
              }
              .EnName {
                font-weight: normal;
                font-size: 14px;
                position: absolute;
                bottom: 0;
                margin-left: 17px;
              }
            }
          }
        }
        .item-long {
          width: 440px;
        }
        .item-middle {
          width: 210px;
        }
        .item-short {
          width: 100px;
        }
      }
    }
  }
}
.submit-btn {
  margin-left: 20px;
}
.table {
  width: 800px;
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>
