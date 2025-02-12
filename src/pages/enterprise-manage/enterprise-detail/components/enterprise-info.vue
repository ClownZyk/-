<template>
  <div class="enterprise-info">
    <el-form :model="enterpriseForm" :rules="enterpriseFormRules" ref="enterpriseFormRef" label-width="80px" label-position="top" class="form-contain">
      <el-form-item prop="name">
        <div class="form-item-title">企业名称 <span class="border"></span> <span class="EnName">name</span></div>
        <el-input placeholder="请输入企业名称" v-model="enterpriseForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-item-title">企业详细地址 <span class="border"></span> <span class="EnName">address</span></div>
        <el-input placeholder="请输入企业地址" v-model="enterpriseForm.addr"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-item-title">身份规则 <span class="border"></span> <span class="EnName">identity</span></div>
        <el-select v-model="enterpriseForm.identityid" placeholder="请选择企业身份规则" disabled> <el-option v-for="item in identRuleList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <div class="row-line">
        <el-form-item prop="contactname">
          <div class="form-item-title">企业联系人 <span class="border"></span> <span class="EnName">contactname</span></div>
          <el-input placeholder="请输入企业联系人" v-model="enterpriseForm.contactname"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <div class="form-item-title">企业电话 <span class="border"></span> <span class="EnName">phone</span></div>
          <el-input placeholder="请输入企业电话" v-model="enterpriseForm.phone"></el-input>
        </el-form-item>
      </div>
      <div class="row-line">
        <el-form-item prop="code" v-show="enterpriseForm.code">
          <div class="form-item-title">企业邀请码 <span class="border"></span> <span class="EnName">code</span></div>
          <el-input type="text" v-model="enterpriseForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">企业会员时间 <span class="border"></span> <span class="EnName">TIME</span></div>
          <el-date-picker v-model="beginAndEndTime" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="截止时间" :default-time="['00:00:00', '23:59:59']" format="yyyy/MM/dd" value-format="yyyy/MM/dd">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item>
        <div class="form-item-title">企业邀请码图片 <span class="border"></span> <span class="EnName">codeImg</span></div>
        <el-image class="code-image" :src="enterpriseForm.codeImg" fit="fill"></el-image>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="_operateSumbit('enterpriseFormRef')">修改</el-button> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { GetUserIdentityByPage, enterpriseOperation } from '@/api/system'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['enterpriseInfo'])
  },
  data() {
    return {
      enterpriseForm: {
        name: '',
        addr: '',
        code: '',
        phone: '',
        contactname: '',
        beginTime: '',
        endTime: '',
        identityid: ''
      },
      beginAndEndTime: '',
      identRuleList: [],
      enterpriseFormRules: {
        name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        contactname: [{ required: true, message: '请输入企业联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入企业电话', trigger: 'blur' }],
        code: [{ required: true, message: '请输入企业邀请码', trigger: 'blur' }],
        identityid: [{ required: true, message: '请选择企业身份规则', trigger: 'change' }]
      }
    }
  },
  created() {
    this._initData()
  },
  methods: {
    _initData() {
      this._getRuleList()
      this.handleEnterpriseFormData()
    },
    // 规则
    _getRuleList() {
      let params = {
        pageSize: 15,
        pageIndex: 1,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      GetUserIdentityByPage(params).then(
        res => {
          if (res.success) {
            this.identRuleList = res.data.map(item => {
              return {
                value: item._id,
                label: `${item.identityName}(${item.ratio.ratioName})`
              }
            })
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },

    // 数据回填
    handleEnterpriseFormData() {
      this.enterpriseForm = this.enterpriseInfo
      this.beginAndEndTime = [this.enterpriseInfo.beginTime.split(' ')[0], this.enterpriseInfo.endTime.split(' ')[0]]
      this.enterpriseForm.codeImgs = []
      if (this.enterpriseInfo.codeImg) {
        this.enterpriseForm.codeImgs.push({ url: this.enterpriseInfo.codeImg })
      }
    },
    _operateSumbit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.beginAndEndTime) {
            let params = {
              dto: {
                ...this.enterpriseForm,
                beginTime: this.beginAndEndTime[0],
                endTime: this.beginAndEndTime[1],
                creater: this.$store.state.UserID,
                roleId: this.$store.state.UserRole,
                cid: this.$store.state._cid
              },
              action: 1
            }
            enterpriseOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.$router.back()
            })
          } else {
            this.$message({
              message: '请选择企业会员开始截止时间！',
              type: 'warning'
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-contain {
  width: 50%;
  .el-form-item {
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
          text-transform: uppercase;
          span {
            font-size: #f2f2f2;
          }
        }
      }
    }
  }
}
.row-line {
  display: flex;
  .el-form-item {
    flex: 1;
    padding-right: 5%;
    &:last-child {
      padding-right: 0;
    }
  }
}
.code-image {
  width: 146px;
  height: 146px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
}
</style>
