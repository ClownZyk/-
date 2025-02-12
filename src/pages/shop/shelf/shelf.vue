<template>
  <div class="shelf-container">
    <div class="shelf" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <!-- <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入货架名检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div> -->
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
          <!-- <el-button type="danger" @click="operateDeleteMany">批量删除</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="goodsShelvesNum" label="货架编号" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="goodsShelvesName" label="货架名称" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="warehouseName" label="所属仓库" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <el-button type="primary" size="mini" @click="handleProduct(scope.row)">产品信息</el-button>
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
      <el-dialog title="货架维护" :visible.sync="formV" width="510px" @closed="closed">
        <el-form :model="form"
                  class="mag-dialog-row"
                  :rules="formRules"
                  ref="form"
                  :inline="true"
                  :disabled="formDisabled">
          <el-form-item prop="goodsShelvesNum">
            <div class="form-item-title">货架编号<span class="border"></span><span class="EnName">serial</span></div>
            <el-input class="form-item-input" v-model="form.goodsShelvesNum"></el-input>
          </el-form-item>
          <el-form-item prop="goodsShelvesName">
            <div class="form-item-title">货架名称<span class="border"></span><span class="EnName">shelfname</span></div>
            <el-input class="form-item-input" v-model="form.goodsShelvesName"></el-input>
          </el-form-item>
          <el-form-item prop="warehouseName">
            <div class="form-item-title">所属仓库<span class="border"></span><span class="EnName">storehouse</span></div>
            <el-input class="form-item-input" v-model="form.warehouseName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {ShelfList, ShelfOperation} from '@/api/system'
export default {
  name: 'shelf',
  watch: {
    $route(to, from) {
      if (to.name === 'shelf') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      containerIsShow: true,
      // 查询条件
      search: {
        productName: ''
      },
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        goodsShelvesNum: [
          {required: true, message: '请输入货架编号', trigger: 'blur'}
        ],
        goodsShelvesName: [
          {required: true, message: '请输入货架名称', trigger: 'blur'}
        ],
        warehouseName: [
          {required: true, message: '请输入所属仓库', trigger: 'blur'}
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
    // 维护货架的产品
    handleProduct (row) {
      this.$router.push({
        path: '/shelf-detail',
        query: {
          id: row._id,
          name: row.goodsShelvesName
        }
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
        dto: Object.assign({}, item),
        action: this.operateAction
      }
      ShelfOperation(params).then(res => {
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
      await ShelfList(params).then(res => {
        this.listLoading = false
        if (res.success) {
          this.list = res.data
          this.total = res.total
        } else {
          this.$message.warning(res.msg)
        }
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
  .shelf-container {
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
