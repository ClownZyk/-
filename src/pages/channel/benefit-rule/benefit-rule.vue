<template>
  <div class="benefit-rule">
    <el-form class="form" ref="form" :model="form" :rules="formRules" v-loading="loading">
      <div class="form-contain-item">
        <el-form-item prop="percentage">
          <div class="form-item-title">分润比例(输入数值，如百分之10，输入10即可)<span class="border"></span><span class="EnName">PERCENTAGE</span></div>
          <el-input v-model="form.percentage" placeholder="请输入分润比例"></el-input>
        </el-form-item>
      </div>
      <div class="form-contain-item">
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="formSubmit">提交</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script type='text/ecmascript-6'>
import { GetRegulationInfo, RegulationOperation } from '@/api/system'
export default {
  name: 'benefit-rule',
  data() {
    return {
      submitLoading: false,
      operateAction: 0,
      loading: false,
      formRules: {
        percentage: [
          {required: true, message: '请输入百分比数值', trigger: 'blur'}
        ]
      },
      form: {
        percentage: 0
      }
    }
  },
  methods: {
    // 提交表单
    formSubmit: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {
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
            RegulationOperation(params).then(res => {
              this.submitLoading = false
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
            }).catch(() => {
              this.submitLoading = false
            })
          })
        }
      })
    },
    async _getList () {
      let params = {
        pageSize: 10,
        pageIndex: 0,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.loading = true
      await GetRegulationInfo(params).then(res => {
        this.loading = false
        if (res.success) {
          if (res.data.length) {
            this.form = res.data[0]
            this.operateAction = 1
          }
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        this.loading = false
        console.log(err)
      })
    }
  },
  mounted() {
    this._getList()
  }
}
</script>

<style lang="scss" scoped>
  .benefit-rule {
    padding: 20px;
    .form {
      /deep/ .el-input {
          width: 400px !important;
      }
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
      }
    }
  }
</style>
