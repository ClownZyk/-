<template>
  <div class="vote-list-container">
    <div class="vote-list">
      <!-- 搜索部分 -->
      <el-row :gutter="10">
        <el-col> <el-button type="primary" @click="opneEdilog({}, 0)">新增</el-button> </el-col>
      </el-row>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="identList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="identityName" label="身份名称" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="ratio.ratioName" label="规则名称" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="remark" label="备注" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.remark || '--' }}</template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delectRow(scope.row, 2, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          ></el-pagination>
        </el-col>
      </div>
      <!-- 弹框 -->
      <el-dialog :visible.sync="isFormShow" width="600px" custom-class="form-dialog" title="身份角色">
        <el-form :model="dialog" label-width="100px" :rules="formRules" ref="dialog" class="form">
          <div class="form-row">
            <el-form-item prop="identityName">
              <div class="form-item-title">身份名称 <span class="border"></span> <span class="EnName">IDENTITYNAME</span></div>
              <el-input class="form-input" placeholder="请输入身份名称" v-model="dialog.identityName" controls-position="right" min="1"></el-input>
            </el-form-item>
            <el-form-item prop="identityRoleid">
              <div class="form-item-title">规则选择 <span class="border"></span> <span class="EnName">IDENTITYNAME</span></div>
              <el-select v-model="dialog.identityRoleid" placeholder="请选择"> <el-option v-for="item in identtypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item prop="integrals">
              <div class="form-item-title">备注 <span class="border"></span> <span class="EnName">remark</span></div>
              <el-input class="form-input" type="textarea" :rows="2" v-model="dialog.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="isFormShow = false">返回</el-button>
          <el-button type="primary" @click="opreation(dialog, 'dialog')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { GetUserIdentityByPage, GetIdentityRuleByPage, IdentityOperation } from '@/api/system'
export default {
  name: 'vote-list',
  data() {
    return {
      canEdit: Boolean(localStorage.getItem('cid') === this.$store.state._cid),
      isFormShow: false, // 弹框显示状态
      identFormRules: {
        ratioName: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        discountRatio: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        getPointsTimes: [{ required: true, message: '该值不能为空', trigger: 'blur' }]
      },
      identForm: {
        ratioName: '',
        getPointsTimes: null,
        discountRatio: null,
        remark: '',
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      dialog: {
        // 弹框数据
        identityName: '',
        identityRoleid: '',
        remark: '',
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      Action: 0, // 编辑
      identList: [], // 会员身份管理
      Txt: '',
      formRules: {
        identityName: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        identityRoleid: [{ required: true, message: '请选择规则', trigger: 'change' }]
      },
      identtypeList: [],
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    // 用户身份
    GetListByPage() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      this.listLoading = true
      GetUserIdentityByPage(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.identList = res.data
            this.total = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    // 用户身份修改
    _addUserDiscountRule() {
      this.$refs.identForm.validate(valid => {
        if (valid) {
          let param = {
            dto: this.identForm,
            action: 0
          }
          IdentityOperation(param).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this._getDiscountRuleList()
            this.$refs.identForm.resetFields()
          })
        }
      })
    },
    // 新增
    opneEdilog(dto, action) {
      this.isFormShow = true
      this.Action = action
      this.dialog = dto
    },
    opreation(dto, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.Action === 0 ? (this.Txt = '新增') : (this.Txt = '编辑')
          if (this.Action === 0) {
            // dto.creater = localStorage.getItem('creater')
            // dto.roleId = localStorage.getItem('roleId')
            // dto.cid = localStorage.getItem('cid')
            dto.creater = this.$store.state.UserID
            dto.roleId = this.$store.state.UserID
            dto.cid = this.$store.state.UserID
          }
          this.edit(dto, this.Action, this.Txt)
        } else {
          return false
        }
      })
    },
    // 删除
    delectRow(dto, action, txt) {
      this.edit(dto, action, txt)
    },
    // 编辑
    edit(dto, action, txt) {
      this.$confirm('是否' + txt + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: dto,
            action: action
          }
          IdentityOperation(params).then(
            res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.isFormShow = false
                this.GetListByPage()
              } else this.$message.error(res.msg)
            },
            err => {
              this.$message.error(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 套餐列表
    _getRuleList() {
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      GetIdentityRuleByPage(params).then(
        res => {
          if (res.success) {
            this.identtypeList = res.data.map(item => {
              return {
                value: item._id,
                label: item.ratioName
              }
            })
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    }
  },
  watch: {
    isFormShow: {
      handler(newName, oldName) {
        if (!newName) {
          this.$refs.dialog.resetFields()
          this.GetListByPage()
        }
      }
    }
  },
  mounted() {
    this._getRuleList()
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.vote-list-container {
  padding: 20px;
}
.list-table {
  color: #666666;
  padding: 20px 0;
  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}
/*弹框*/
/deep/.form {
  .form-row {
    display: flex;
    display: -webkit-flex;
    .el-form-item {
      flex: 0 0 50%;
      .el-form-item__content {
        margin-left: 0 !important;
      }
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
        }
      }
      .form-input {
        width: 70%;
      }
    }
    .form-flex-all {
      flex: 0 0 100%;
      .form-input {
        width: 100%;
      }
    }
  }
}
.recharge-label {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
}
</style>
