<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules">
        <div class="form-contain-item">
          <el-form-item prop="userName">
            <div class="form-item-title">用户名<span class="border"></span><span class="EnName">USERNAME</span></div>
            <el-input placeholder="请输入用户名" v-model="form.userName"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <div class="form-item-title">密码<span class="border"></span><span class="EnName">PASSWORD</span></div>
            <el-input placeholder="请输入密码" v-model="form.passWord" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <div class="form-item-title">姓名<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input v-model="form.realName" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="phone">
            <div class="form-item-title">手机号<span class="border"></span><span class="EnName">PHONE</span></div>
            <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="bankCard">
            <div class="form-item-title">银行卡号<span class="border"></span><span class="EnName">BANKCARD</span></div>
            <el-input v-model="form.bankCard" placeholder="请输入银行卡号"></el-input>
          </el-form-item>
          <el-form-item prop="inviteCode">
            <div class="form-item-title">邀请码<span class="border"></span><span class="EnName">INVITECODE</span></div>
            <el-input v-model="form.inviteCode" placeholder="请输入邀请码"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="email">
            <div class="form-item-title">邮箱<span class="border"></span><span class="EnName">EMAIL</span></div>
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">工号<span class="border"></span><span class="EnName">JOBNUMBER</span></div>
            <el-input v-model="form.jobNumber" placeholder="请输入工号"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">在职状态<span class="border"></span><span class="EnName">JOBSTATE</span></div>
            <el-select v-model="form.jobState" placeholder="请选择在职状态">
              <el-option v-for="(item, index) in jobStateList" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">性别<span class="border"></span><span class="EnName">SEX</span></div>
            <el-select v-model="form.sex" placeholder="请选择性别">
              <el-option v-for="(item, index) in sexList" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">生日<span class="border"></span> <span class="EnName">BIRTHDAY</span></div>
            <el-date-picker v-model="form.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">家庭住址<span class="border"></span><span class="EnName">ADDRESS</span></div>
            <el-input v-model="form.address" placeholder="请输入家庭住址" style="width: 420px;"></el-input>
          </el-form-item>
          <el-form-item class="item-middle">
            <div class="form-item-title">账户余额<span class="border"></span><span class="EnName">BALANCE</span></div>
            <el-input-number controls-position="right" v-model="form.notCash" placeholder="请输入账户余额"></el-input-number>
          </el-form-item>
          <el-form-item class="item-middle">
            <div class="form-item-title">已提现金额<span class="border"></span><span class="EnName">WITHDRAWAL</span></div>
            <el-input-number controls-position="right" v-model="form.alreadyCash" placeholder="请输入已提现金额"></el-input-number>
          </el-form-item>
          <el-form-item class="item-middle">
            <div class="form-item-title">积分余额<span class="border"></span><span class="EnName">INTEGRAL</span></div>
            <el-input-number controls-position="right" v-model="form.notIntegral" placeholder="请输入积分余额"></el-input-number>
          </el-form-item>
          <el-form-item class="item-middle">
            <div class="form-item-title">已消耗积分<span class="border"></span><span class="EnName">USEDINTEGRAL</span></div>
            <el-input-number controls-position="right" v-model="form.alreadyIntegral" placeholder="请输入已消耗积分"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">头像<span class="border"></span><span class="EnName">HEADIMAGE</span></div>
            <my-upload :imgs="form.imgs"
                       :limitUploadImgs="1"
                       ref="uploadImg"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('headImg', 1, $event)"
                       @handleUploadImg="handleUploadImg('headImg', 1, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
  </div>
</template>
<script>
import {ChannelOperation, ChannelGetDetailById} from '@/api/system'
import myUpload from '@/components/my-upload'
import {isvalidPhone, isvalidEmail} from '@/filters/validate'
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
var validEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入邮箱'))
  } else if (!isvalidEmail(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}
export default {
  components: {
    myUpload
  },
  data() {
    return {
      // form验证规则
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        passWord: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        phone: [
          {validator: validPhone, trigger: 'blur'}
        ],
        bankCard: [
          {required: true, message: '请输入银行卡号', trigger: 'blur'}
        ],
        inviteCode: [
          {required: true, message: '请输入邀请码', trigger: 'blur'}
        ],
        email: [
          {validator: validEmail, trigger: 'blur'}
        ]
      },
      // 表单数据
      form: {},
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 在职状态列表
      jobStateList: [{label: '在岗', value: '在岗'}, {label: '请假', value: '请假'}, {label: '离职', value: '离职'}],
      // 性别列表
      sexList: [{label: '男', value: 1}, {label: '女', value: 2}],
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
    async init () {
      if (this.$route.query.id !== undefined) {
        // 说明是编辑
        this.operateTitle = '编辑'
        this.operateAction = 1
        let parmas = {
          _id: this.$route.query.id
        }
        this.loading = true
        await ChannelGetDetailById(parmas).then(res => {
            if (res.success) {
              this.loading = false
              this.form = res.data
              // 拼图片的回显列表
              this.form.imgs = []
              if (this.form.headImg !== null && this.form.headImg !== '') {
                this.form.imgs.push({url: this.form.headImg.url ? this.form.headImg.url : ''})
              }
            } else {
                this.$message.error(res.msg)
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
    },
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/channel-list')
    },
    // 提交表单
    formSubmit: function () {
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
            ChannelOperation(params).then(res => {
                this.$message({
                    message: res.msg,
                    type: res.success ? 'success' : 'error'
                })
                this.clear()
            })
          })
        }
      })
    }
  },
  mounted() {
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
              .el-input {
                width: 210px;
              }
            }
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
