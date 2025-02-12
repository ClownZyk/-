<template>
  <div class="recharge-card-container">
    <div class="recharge-card">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.title" placeholder="用名称检索或激活或导出" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-input v-model="search.cardNumber" placeholder="请输入卡号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
            <el-button type="primary" @click="handleActiveCard">激活卡券</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="exportExcel">导出</el-button>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="title" label="名称" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cardNumber" label="充值卡号" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cash" label="充值卡金额" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="expirationStart" label="生效日期" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.expirationStart ? scope.row.expirationStart.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="expirationEnd" label="失效日期" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.expirationEnd ? scope.row.expirationEnd.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="state" label="激活状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isActive" @change="handleSingleActiveCard(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="使用状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.state" style="color: #13CE66;">已使用</span>
              <span v-else style="color: #FF4949;">未使用</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="名称" prop="title">
            <el-input v-model="form.title" class="item-long"></el-input>
          </el-form-item>
          <el-form-item label="卡券数量" prop="count" v-show="operateAction === 0">
            <el-input-number :controls="false" v-model="form.count" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="充值卡金额" prop="cash">
            <el-input-number :controls="false" v-model="form.cash" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="生效日期" prop="expirationStart">
            <el-date-picker
              v-model="form.expirationStart"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期" prop="expirationEnd">
            <el-date-picker
              v-model="form.expirationEnd"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {RechargeCardGetList, RechargeCardOperation, RechargeCardExcel, RechargeCardActive, RechargeCardSingleActive} from '@/api/system'

export default {
  name: 'recharge-card',
  data () {
    return {
      // 查询条件
      search: {
        title: '',
        cardNumber: ''
      },
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        title: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        count: [
          {required: true, message: '请输入卡券数量', trigger: 'blur'}
        ],
        cash: [
          {required: true, message: '请输入充值卡金额', trigger: 'blur'}
        ],
        expirationStart: [
          {required: true, message: '请选择生效日期', trigger: 'change'}
        ],
        expirationEnd: [
          {required: true, message: '请选择失效日期', trigger: 'change'}
        ]
      },
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      operateTitle: '',
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 单张激活
    handleSingleActiveCard (item) {
      let params = Object.assign({}, item)
      params.creater = this.$store.state.UserID
      params.roleId = this.$store.state.UserRole
      params.cid = this.$store.state._cid
      RechargeCardSingleActive(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 激活卡券
    handleActiveCard () {
      if (!this.search.title) {
        this.$message({
          message: '请输入卡券名称！',
          type: 'warning'
        })
        return false
      }
      let params = {
        title: this.search.title,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      RechargeCardActive(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    exportExcel: function() {
      if (!this.search.title) {
        this.$message({
          message: '请输入卡券名称！',
          type: 'warning'
        })
        return false
      }
      if (!this.form.timeFrame) {
        this.form.timeFrame = []
      }
      let parmas = {
        title: this.search.title,
        cardNumber: this.search.cardNumber,
        pageSize: 0,
        pageIndex: 0,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      RechargeCardExcel(parmas).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = '充值卡.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob, {type: 'application/vnd.ms-excel'})
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.form.state = false // 默认未使用
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
      this.formDisabled = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateTitle = title
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.form = JSON.parse(JSON.stringify(row))
          this.form.count = 0
          this.formV = true
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.formDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      RechargeCardOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
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
        title: this.search.title,
        cardNumber: this.search.cardNumber,
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
      await RechargeCardGetList(params).then(res => {
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
  .recharge-card-container {
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
