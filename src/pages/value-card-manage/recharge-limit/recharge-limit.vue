<template>
  <div class="vote-list-container">
    <div class="vote-list">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <el-form-item> <el-button type="primary" @click="opneEdilog(null, 0)" v-permission="['/recharge-limit:insert']">新增</el-button> </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="recharge" label="充值金额" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="giving" label="赠送金额" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)" v-permission="['/recharge-limit:update']">编辑</el-button>
              <el-button type="danger" size="mini" @click="delectRow(scope.row, 2, '删除')" v-permission="['/recharge-limit:delete']">删除</el-button>
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
          >
          </el-pagination>
        </el-col>
      </div>
      <!-- 弹框 -->
      <el-dialog :visible.sync="isFormShow" width="600px" custom-class="form-dialog" title="优惠">
        <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm" class="form">
          <div class="form-row">
            <el-form-item prop="recharge">
              <div class="form-item-title">充值金额<span class="border"></span> <span class="EnName">recharge</span></div>
              <el-input-number class="form-input" :min="0" controls-position="right" v-model="dialog.recharge"></el-input-number>
            </el-form-item>
            <el-form-item prop="giving">
              <div class="form-item-title">赠送金额<span class="border"></span> <span class="EnName">giving</span></div>
              <el-input-number class="form-input" :min="0" :max="dialog.recharge" controls-position="right" v-model="dialog.giving"></el-input-number>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="isFormShow = false">返回</el-button>
          <el-button type="primary" @click="opreation(dialog, 'ruleForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getValueCardRechargeLimitList, valueCardRechargeLimitOperation} from '@/api/system'
export default {
  name: 'vote-list',
  data () {
    return {
      list: [],
      dialog: {
        recharge: 0,
        giving: 0,
        cards: []
      },
      Action: 0,
      Dto: {},
      Txt: '',
      listLoading: false,
      isFormShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      formRules: {
        recharge: [
          { required: true, message: '请填写充值金额', trigger: 'change' }
        ],
        giving: [
          { required: true, message: '请填写赠送金额', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    isFormShow(val) {
      if (!val) {
        this.dialog = {
          recharge: 0,
          giving: 0,
          cards: []
        }
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage () {
      let params = {
        activityName: '',
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getValueCardRechargeLimitList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 新增
    opneEdilog(dto, action) {
      this.isFormShow = true
      this.Action = action
      if (dto) {
        this.dialog = dto
      }
    },
    opreation(dto, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.Action === 0 ? this.Txt = '新增' : this.Txt = '编辑'
          if (this.Action === 0) {
            dto.createTime = new Date()
            dto.deleteTime = new Date()
            dto.Creater = this.$store.state.UserID
            dto.RoleId = this.$store.state.UserRole
            dto.Cid = this.$store.state._cid
          }
          this.edit(dto, this.Action, this.Txt)
        } else {
          console.log('error submit!!')
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
      }).then(() => {
        let params = {
          dto: dto,
          action: action
        }
        valueCardRechargeLimitOperation(params).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.isFormShow = false
            this.GetListByPage()
          }
        })
      }).catch(() => {})
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.vote-list-container {
  padding: 20px;
}
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
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
    }
  }
}
</style>
