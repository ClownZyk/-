<template>
  <div class="oldman-sales-container">
    <div class="oldman-sales">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" label="年龄区间" show-overflow-tooltip min-width="180">
            <template slot-scope="scope">
              {{scope.row.startAge + '岁' + (scope.row.endAge === 10000 ? '以上' : (' - '+scope.row.endAge+'岁'))}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="disCount" label="折扣" show-overflow-tooltip min-width="180">
            <template slot-scope="scope">
              {{scope.row.disCount + '%'}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button> -->
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
          <el-form-item label="年龄区间" prop="ages" class="item-long">
            <el-select v-model="form.ages" placeholder="请选择">
              <el-option
                v-for="item in ageList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="折扣" prop="disCount">
            <el-input-number :controls="false" v-model="form.disCount" placeholder="请输入折扣" :min="0"></el-input-number>
            <span class="form-item-tip">(如：5折，输入50即可)</span>
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
import {OldManList, OldManOperation} from '@/api/system'
export default {
  name: 'oldman-sales',
  data () {
    return {
      ageList: [
        { label: '65-74', value: 1 },
        { label: '75-84', value: 2 },
        { label: '85以上', value: 3 }
      ],
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        ages: [
          {required: true, message: '请选择年龄区间', trigger: 'change'}
        ],
        disCount: [
          {required: true, message: '请输入折扣', trigger: 'blur'}
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
            if (this.form.ages === 1) {
              this.form.startAge = 65
              this.form.endAge = 74
            } else if (this.form.ages === 2) {
              this.form.startAge = 75
              this.form.endAge = 84
            } else if (this.form.ages === 3) {
              this.form.startAge = 85
              this.form.endAge = 10000
            }
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
          this.formatData()
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
    // 格式化数据
    formatData () {
      this.form.ages = 0
      if (this.form.startAge === 65) {
        this.form.ages = 1
      } else if (this.form.startAge === 75) {
        this.form.ages = 2
      } else if (this.form.startAge === 85) {
        this.form.ages = 3
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      OldManOperation(params).then(res => {
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
      await OldManList(params).then(res => {
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
  .oldman-sales-container {
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
    .form-item-tip {
      color: #f56c6c;
      margin-left: 10px;
    }
  }
</style>
