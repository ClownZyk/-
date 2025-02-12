<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="oddNumbers" class="item-long">
            <div class="form-item-title">供货单号<span class="border"></span><span class="EnName">ODDNUMBERS</span></div>
            <el-input placeholder="请输入供货单号" v-model="form.oddNumbers"></el-input>
          </el-form-item>
          <el-form-item prop="sortNo">
            <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
            <el-input-number placeholder="排序号" controls-position="right" v-model="form.sortNo" :min="99"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="orderName" class="item-middle">
            <div class="form-item-title">下单人姓名<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="下单人姓名" v-model="form.orderName"></el-input>
          </el-form-item>
          <el-form-item prop="ordermony">
            <div class="form-item-title">下单总金额<span class="border"></span><span class="EnName">ORDERMONY</span></div>
            <el-input-number placeholder="下单总金额" controls-position="right" v-model="form.ordermony"></el-input-number>
          </el-form-item>
          <el-form-item prop="orderTime">
            <div class="form-item-title">下单时间<span class="border"></span><span class="EnName">ORDERTIME</span></div>
            <el-date-picker v-model="form.orderTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="remark" class="item-long">
            <div class="form-item-title">备注<span class="border"></span><span class="EnName">REMARK</span></div>
            <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">主图<span class="border"></span><span class="EnName">ORDERIMAGE</span></div>
            <my-upload :imgs="form.orderimages"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('orderimage', 1, $event)"
                       @handleUploadImg="handleUploadImg('orderimage', 1, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import {getGoodsForV6ByOrderNum} from '@/api/systemForV8'
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
  },
  data () {
    return {
      // 表单数据
      form: {
        orderTime: new Date()
      },
      // 是否禁用form
      formDisabled: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0,
      commonParam: {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
    }
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
    },
    // 删除图片
    handleRemoveImg (txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
      }
    },
    // 图片上传成功回调
    handleUploadImg (txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    async init () {
      if (this.$route.query.id !== undefined) {
        if (this.$route.query.operate !== undefined && this.$route.query.operate === 'view') {
          // 说明是查看
          this.formDisabled = true
          this.disabledSubmit = true
        }
        // 说明是编辑
        this.operateTitle = '编辑'
        this.operateAction = 1
        let params = {
          oddNumbers: this.$route.query.oddNumbers,
          ...this.commonParam
        }
        await getGoodsForV6ByOrderNum(params).then(res => {
            if (res.success) {
              this.form = res.data.orderInfo
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.orderimages = []
              if (this.form.orderimage !== null && this.form.orderimage.url !== '') {
                  this.form.orderimages.push({url: this.form.orderimage.url})
              }
            } else {
                this.$message.error(res.msg)
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
      this.loading = false
    }
  },
  mounted () {
    this.init()
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
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
  .tableContact {
    width: 800px;
    margin: 10px 0 20px 20px;
  }
</style>
