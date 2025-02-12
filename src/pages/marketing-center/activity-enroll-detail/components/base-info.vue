<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="activityName" class="item-long">
            <div class="form-item-title">活动名称<span class="border"></span><span class="EnName">ACTIVITYNAME</span></div>
            <el-input placeholder="请输入活动名称" v-model="form.activityName"></el-input>
          </el-form-item>
          <el-form-item prop="categoryIds">
            <div class="form-item-title">活动分类<span class="border"></span><span class="EnName">CATEGORY</span></div>
            <el-cascader v-model="form.categoryIds" :options="categoryList" change-on-select expand-trigger="hover"></el-cascader>
          </el-form-item>
          <el-form-item prop="address" class="item-long">
            <div class="form-item-title">活动地址<span class="border"></span><span class="EnName">ADDRESS</span></div>
            <el-input placeholder="请输入活动地址" v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item prop="hotLine">
            <div class="form-item-title">咨询热线<span class="border"></span><span class="EnName">HOTLINE</span></div>
            <el-input placeholder="请输入咨询热线" v-model="form.hotLine"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="money">
            <div class="form-item-title">报名费用<span class="border"></span><span class="EnName">MONEY</span></div>
            <el-input-number placeholder="报名费用" controls-position="right" v-model="form.money" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item prop="coordinatesX">
            <div class="form-item-title">经度<span class="border"></span><span class="EnName">LONGITUDE</span></div>
            <el-input-number placeholder="经度" controls-position="right" v-model="form.coordinatesX"></el-input-number>
          </el-form-item>
          <el-form-item prop="coordinatesY">
            <div class="form-item-title">维度<span class="border"></span><span class="EnName">LATITUDE</span></div>
            <el-input-number placeholder="维度" controls-position="right" v-model="form.coordinatesY"></el-input-number>
          </el-form-item>
          <el-form-item prop="personCount" class="item-middle">
            <div class="form-item-title">已报名人数<span class="border"></span><span class="EnName">PERSONCOUNT</span></div>
            <el-input-number placeholder="已报名人数" controls-position="right" v-model="form.personCount"></el-input-number>
          </el-form-item>
          <el-form-item prop="personLimit" class="item-middle">
            <div class="form-item-title">限制报名人数<span class="border"></span><span class="EnName">PERSONLIMIT</span></div>
            <el-input-number placeholder="限制报名人数" controls-position="right" v-model="form.personLimit"></el-input-number>
          </el-form-item>
          <el-form-item prop="sortNo">
            <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
            <el-input-number placeholder="排序号" controls-position="right" v-model="form.sortNo" :min="99"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="beginTime">
            <div class="form-item-title">开始时间<span class="border"></span><span class="EnName">BEGINTIME</span></div>
            <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择开始时间" :picker-options="pickerOptionsStart"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <div class="form-item-title">结束时间<span class="border"></span><span class="EnName">ENDTIME</span></div>
            <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" :picker-options="pickerOptionsEnd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="stopApply">
            <div class="form-item-title">截止报名时间<span class="border"></span><span class="EnName">STOPAPPLY</span></div>
            <el-date-picker v-model="form.stopApply" type="datetime" placeholder="选择截止报名时间"></el-date-picker>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="introduce" class="item-long">
            <div class="form-item-title">活动简介<span class="border"></span><span class="EnName">INTRODUCE</span></div>
            <el-input type="textarea" :rows="4" v-model="form.introduce" placeholder="请输入活动简介"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">主图<span class="border"></span><span class="EnName">MAINIMAGE</span></div>
            <my-upload :imgs="form.mainImgs"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)"
                       @handleUploadImg="handleUploadImg('mainImg', 1, $event)">
            </my-upload>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">活动图片列表<span class="border"></span><span class="EnName">IMGAGES</span></div>
            <my-upload :imgs="form.imgs"
                       :limitUploadImgs="4"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('imgs', 4, $event)"
                       @handleUploadImg="handleUploadImg('imgs', 4, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
  </div>
</template>
<script>
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
  },
  props: {
    form: Object,
    categoryList: Array,
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
    }
  },
  data () {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endTime = this.form.endTime
          if (endTime) {
            return time.getTime() > new Date(endTime).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginTime = this.form.beginTime
          if (beginTime) {
            return (time.getTime() < new Date(beginTime).getTime())
          }
        }
      },
      rules: {
        activityName: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ],
        categoryIds: [
          {type: 'array', required: true, message: '请选择活动分类', trigger: 'change'}
        ],
        beginTime: [
          {required: true, message: '请选择开始时间', trigger: 'blur'}
        ],
        endTime: [
          {required: true, message: '请选择结束时间', trigger: 'blur'}
        ],
        stopApply: [
          {required: true, message: '请选择截止报名时间', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请选择活动地址', trigger: 'blur'}
        ],
        coordinatesX: [
          {required: true, message: '请输入经度', trigger: 'blur'}
        ],
        coordinatesY: [
          {required: true, message: '请输入维度', trigger: 'blur'}
        ],
        personLimit: [
          {required: true, message: '请输入限制报名人数', trigger: 'blur'}
        ],
        hotLine: [
          {required: true, message: '请输入咨询热线', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.$emit('handleDisabledSubmit', val)
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
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
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
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
</style>
