<template>
  <div class="withdraw-container">
    <div class="withdraw">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-select v-model="search.type" placeholder="选择审核状态检索">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="organizationName" label="店名" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="申请人" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amount" label="提现金额" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="提现原因" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="申请时间" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime.split(' ')[0]}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核状态" width="180">
            <template slot-scope="scope">
              <div v-if="!scope.row.status" style="color: #67C23A;">已审核</div>
              <div v-else style="color: #EF4747;">待审核</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row)" :disabled="!scope.row.status">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="670px" @closed="closed">
        <el-form :model="form" label-width="80px" ref="form" class="form" :inline="true">
          <el-form-item label="店名" prop="organizationName">
            <el-input v-model="form.organizationName" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="申请人" prop="name">
            <el-input v-model="form.name" class="item-long" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="提现金额" prop="amount">
            <el-input v-model="form.amount" class="item-long" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="申请时间" prop="createTime">
            <el-input v-model="form.createTime" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="提现原因" prop="remark">
            <el-input v-model="form.remark" type="textarea" class="item-long" :disabled="formDisabled"></el-input>
          </el-form-item>
          <el-form-item label="审核状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {WithdrawList, WithdrawAudit} from '@/api/system'
export default {
  name: 'withdraw',
  data () {
    return {
      typeList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已审核', value: 2 }
      ],
      statusList: [
        { label: '待审核', value: true },
        { label: '已审核', value: false }
      ],
      // 查询条件
      search: {
        type: 0
      },
      formDisabled: true,
      submitLoading: false,
      formV: false,
      form: {},
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    operateFunc (row) {
      this.formV = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.operateAxios(this.form)
          }).then(() => {
            this.closed()
          })
        }
      })
    },
    // 关闭form
    closed () {
      this.formV = false
      this.submitLoading = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: 1
      }
      WithdrawAudit(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        type: this.search.type,
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
      await WithdrawList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
  .withdraw-container {
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
  .form {
    .item-long {
      width: 492px;
    }
  }
</style>
