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
          <el-form-item prop="sortNo">
            <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
            <el-input-number placeholder="排序号" controls-position="right" v-model="form.sortNo" :min="99"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="visitCount" class="item-middle">
            <div class="form-item-title">总访问人数<span class="border"></span><span class="EnName">VISITCOUNT</span></div>
            <el-input-number placeholder="总访问人数" controls-position="right" v-model="form.visitCount"></el-input-number>
          </el-form-item>
          <el-form-item prop="joinCount" class="item-middle">
            <div class="form-item-title">总参与人数<span class="border"></span><span class="EnName">JOINCOUNT</span></div>
            <el-input-number placeholder="总参与人数" controls-position="right" v-model="form.joinCount"></el-input-number>
          </el-form-item>
          <el-form-item prop="voteCount" class="item-middle">
            <div class="form-item-title">总票数<span class="border"></span><span class="EnName">VOTECOUNT</span></div>
            <el-input-number placeholder="总票数" controls-position="right" v-model="form.voteCount"></el-input-number>
          </el-form-item>
          <el-form-item prop="voteLimit" class="item-middle">
            <div class="form-item-title">每人限制投票数<span class="border"></span><span class="EnName">VOTELIMIT</span></div>
            <el-input-number placeholder="每人限制投票数" controls-position="right" v-model="form.voteLimit"></el-input-number>
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
import {VoteActivityOperation, VoteActivityGetDetails} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
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
        voteLimit: [
          {required: true, message: '请输入限制投票数', trigger: 'blur'}
        ]
      },
      // 表单数据
      form: {},
      // 是否禁用form
      formDisabled: false,
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0
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
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/vote-list')
    },
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            let params = {
                Dto: Object.assign({}, this.form),
                Action: this.operateAction
            }
            VoteActivityOperation(params).then(res => {
                this.$message({
                    message: res.msg,
                    type: res.success ? 'success' : 'error'
                })
                this.clear()
            }).catch(() => {
              this.submitLoading = false
              this.disabledSubmit = false
            })
          })
        }
      })
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
        let parmas = {
          _id: this.$route.query.id
        }
        await VoteActivityGetDetails(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.mainImgs = []
              if (this.form.mainImg !== null && this.form.mainImg.url !== '') {
                  this.form.mainImgs.push({url: this.form.mainImg.url})
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
</style>
