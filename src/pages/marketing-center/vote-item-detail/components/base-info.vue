<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="serialNumber">
            <div class="form-item-title">编号<span class="border"></span><span class="EnName">SERIALNUMBER</span></div>
            <el-input placeholder="请输入编号" v-model="form.serialNumber"></el-input>
          </el-form-item>
          <el-form-item prop="name" class="item-long">
            <div class="form-item-title">名称<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="请输入名称" v-model="form.name"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="voteCount">
            <div class="form-item-title">投票数<span class="border"></span><span class="EnName">VOTECOUNT</span></div>
            <el-input-number placeholder="投票数" controls-position="right" v-model="form.voteCount"></el-input-number>
          </el-form-item>
          <el-form-item prop="viewCount">
            <div class="form-item-title">浏览量<span class="border"></span><span class="EnName">VIEWCOUNT</span></div>
            <el-input-number placeholder="浏览量" controls-position="right" v-model="form.viewCount"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="introduce" class="item-long">
            <div class="form-item-title">简介<span class="border"></span><span class="EnName">INTRODUCE</span></div>
            <el-input type="textarea" :rows="4" v-model="form.introduce" placeholder="请输入简介"></el-input>
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
      rules: {
        serialNumber: [
          {required: true, message: '请输入编号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
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
