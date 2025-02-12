<template>
  <div class="base-info">
    <div class="page-contain">
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px" label-position="top" class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="title" class="item-long">
            <div class="form-item-title">卡劵标题<span class="border"></span><span class="EnName">TITLE</span></div>
            <el-input v-model="form.title" placeholder="请输入卡劵标题"></el-input>
          </el-form-item>
          <el-form-item prop="subTitle" class="item-long">
            <div class="form-item-title">副标题<span class="border"></span><span class="EnName">SUB TITLE</span></div>
            <el-input v-model="form.subTitle" placeholder="请输入副标题"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="quantity">
            <div class="form-item-title">库存数量<span class="border"></span><span class="EnName">STOCK</span></div>
            <el-input-number controls-position="right" :precision="0" v-model="form.quantity" :min="1" placeholder="库存数量" class="item-middle"></el-input-number>
          </el-form-item>
          <el-form-item prop="getLimit">
            <div class="form-item-title">领取数量限制(0为无限制)<span class="border"></span><span class="EnName">UPPER LIMIT</span></div>
            <el-input-number controls-position="right" :precision="0" v-model="form.getLimit" :min="0" placeholder="领取数量限制" class="item-middle"></el-input-number>
          </el-form-item>
          <el-form-item prop="useLimit">
            <div class="form-item-title">使用数量限制(0为无限制)<span class="border"></span><span class="EnName">USE LIMIT</span></div>
            <el-input-number controls-position="right" :precision="0" v-model="form.useLimit" :min="0" placeholder="使用数量限制" class="item-middle"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="leastCost">
            <div class="form-item-title">起用金额(0: 无门槛起用)<span class="border"></span><span class="EnName">LEASTCOST</span></div>
            <el-input-number controls-position="right" :precision="0" v-model="form.leastCost" :min="0" placeholder="起用金额" class="item-middle"></el-input-number>
          </el-form-item>
          <el-form-item prop="reduceCost">
            <div class="form-item-title">减免金额<span class="border"></span><span class="EnName">REDUCECOST</span></div>
            <el-input-number controls-position="right" :precision="0" v-model="form.reduceCost" :min="0" placeholder="减免金额" class="item-middle"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="startTime">
            <div class="form-item-title">领取开始时间<span class="border"></span><span class="EnName">START TIME</span></div>
            <el-date-picker type="date" placeholder="选择日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" v-model="form.startTime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <div class="form-item-title">领取截止时间<span class="border"></span><span class="EnName">END TIME</span></div>
            <el-date-picker type="date" placeholder="选择日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" v-model="form.endTime"></el-date-picker>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="isMultiple">
            <div class="form-item-title">是否叠加使用<span class="border"></span><span class="EnName">ISMULTIPLE</span></div>
            <el-switch v-model="form.isMultiple" active-color="#409EFF" inactive-color="#909399"> </el-switch>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="description" class="item-long">
            <div class="form-item-title">使用说明<span class="border"></span> <span class="EnName">USE LIMIT</span></div>
            <el-input type="textarea" :rows="4" v-model="form.description" :min="1" placeholder="请输入使用说明"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="description" style="width: 100%;">
            <div class="form-item-title">适用店铺<span class="border"></span> <span class="EnName">SHOP</span></div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllShops" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedShops" @change="handleCheckedCitiesChange">
              <el-checkbox class="checkbox" v-for="item in shopList" :label="item.shopCid" :key="item.shopCid" border>{{ item.shopName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">适用范围<span class="border"></span> <span class="EnName">USERANGE</span></div>
            <el-checkbox-group v-model="form.useRange">
              <el-checkbox v-for="(item, index) in manageRange" :key="index" :label="item.value" border>{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="dateInfo.dateType">
            <div class="form-item-title">有效期<span class="border"></span> <span class="EnName">LIFETIME</span></div>
            <el-radio-group v-model="form.dateInfo.dateType">
              <el-radio :label="1">固定日期</el-radio>
              <el-radio :label="2">领取后</el-radio>
            </el-radio-group>
            <div>
              <el-date-picker v-show="form.dateInfo.dateType === 1" v-model="form.userTime" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
              <div v-show="form.dateInfo.dateType === 2" class="use-type">
                <div class="use-txt">
                  <el-input-number controls-position="right" size="mini" :precision="0" :min="0" class="use-input" v-model="form.dateInfo.fixedBeginTerm"></el-input-number><span class="use-span">天生效(0马上生效)，有效期为</span>
                  <el-input-number controls-position="right" size="mini" :precision="0" :min="0" class="use-input" v-model="form.dateInfo.fixedTerm"></el-input-number><span class="use-span">天</span>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="imgUrls">
            <div class="form-item-title">主图<span class="tip">（只能上传jpg、jpeg、png格式的图片，且不超过60kb）</span><span class="border"></span><span class="EnName">IMAGE</span></div>
            <my-upload :imgs="form.imgUrls" :limitUploadImgs="1" :uploadSize="0.06" @handleRemoveImg="handleRemoveImg('imgUrl', 1, $event)" @handleUploadImg="handleUploadImg('imgUrl', 1, $event)"> </my-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import myUpload from '@/components/my-upload'
import { GetAllShop } from '@/api/system'
import Filters from '@/components/js/Filters'
export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  props: {
    form: Object,
    checkedShopList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    checkedShopList: {
      handler(val) {
        this.checkedShops = val
      },
      immediate: true
    }
  },
  computed: {
    checkAllShops: {
      get() {
        if (this.shopList.length <= 0) {
          return false
        }
        return this.checkedShopList.length === this.shopList.length
      },
      set() {}
    },
    isIndeterminate() {
      return this.checkedShopList.length > 0 && this.checkedShopList.length < this.shopList.length
    }
  },
  data() {
    return {
      checkedShops: [],
      shopList: [],
      AllShopList: [],
      // 是否禁用form
      formDisabled: false,
      // form验证规则
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        description: [{ required: true, message: '请输入使用说明', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._getShopList()
    })
  },
  methods: {
    _getShopList() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      let isManage = localStorage.getItem('creater') === this.$store.state._cid
      GetAllShop(params).then(res => {
        if (res.success) {
          this.shopList = isManage
            ? res.data
            : res.data.filter(item => {
                return item.shopCid === this.$store.state._cid
              })
        } else this.$message.error(res.msg)
      })
    },
    handleCheckAllChange(val) {
      this.$emit(
        'selctValShop',
        val
          ? this.shopList.map(shop => {
              return shop.shopCid
            })
          : [],
        this.shopList
      )
    },
    handleCheckedCitiesChange(value) {
      this.$emit('selctValShop', value, this.shopList)
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
              .tip{
                font-size: 12px;
                color: #E6A23C;
              }
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
          width: 290px;
        }
        .use-type {
          display: inline-block;
          .use-txt {
            .use-span {
              margin: 0 10px;
            }
            .use-input {
              width: 100px;
            }
          }
        }
      }
    }
  }
}
.submit-btn {
  margin-left: 20px;
}
.checkbox{
  width: 260px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: unset;
}
</style>
