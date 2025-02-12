<template>
  <div class="mission-rules-container">
    <div class="mission-rules">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left"></div>
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
          <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="name" label="规则名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="mainRule" label="所属类别" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              {{mainRuleTxt(scope.row.mainRule)}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="number" label="数量" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isUse" label="是否启用" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isUse" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sortNo" label="排序号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
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
        <el-form :model="form" label-width="80px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name" class="item-long"></el-input>
          </el-form-item>
          <el-form-item label="所属类别" prop="mainRule">
              <el-select v-model="form.mainRule" clearable>
                <el-option v-for="(item, index) in mainRuleList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input-number controls-position="right" v-model="form.number"></el-input-number>
          </el-form-item>
          <el-form-item label="排序号" prop="sortNo">
            <el-input-number controls-position="right" v-model="form.sortNo" placeholder="最小值为99" :min="99"></el-input-number>
          </el-form-item>
          <el-form-item label="是否启用" prop="isUse">
              <el-switch v-model="form.isUse"></el-switch>
          </el-form-item>
          <el-form-item label="规则描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" class="item-long"></el-input>
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
import {MedalRuleGetListByPage, MedalRuleOperation} from '@/api/system'
export default {
  name: 'mission-rules',
  computed: {
    mainRuleTxt: function() {
      return function(mainRule) {
        switch (mainRule) {
          case 0:
            return '其他'
          case 1:
            return 'VIP会员勋章'
          case 2:
            return '购物达人'
          case 3:
            return '积分大人'
          case 4:
            return '阅读'
          case 5:
            return '签到'
          default:
            return ''
        }
      }
    }
  },
  data () {
    return {
      mainRuleList: [
        {value: 0, label: '其他'},
        {value: 1, label: 'VIP会员勋章'},
        {value: 2, label: '购物达人'},
        {value: 3, label: '积分大人'},
        {value: 4, label: '阅读'},
        {value: 5, label: '签到'}
      ],
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        name: [
          {required: true, message: '请输入规则名称', trigger: 'blur'}
        ]
      },
      // 活动报名列表
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
      MedalRuleOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
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
      console.log('pageSize 改变')
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      console.log('currentPage 改变')
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
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
      await MedalRuleGetListByPage(params).then(res => {
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
  .mission-rules-container {
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
