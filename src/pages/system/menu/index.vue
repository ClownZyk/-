<template>
  <section class="page-container">
    <!-- 工具条 -->
    <el-col :span="24">
      <el-form :inline="true" :model="filters">
        <el-form-item> <el-input v-model.trim="filters.name" placeholder="请输入菜单名称检索" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" v-on:click="getAllMenuDataByPage('refresh')">查询</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="handleFormVisable('', '', '添加', 'Add')">新增菜单</el-button> </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表 -->
    <el-table :data="datas" style="width: 100%" border v-loading="listLoading">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-form v-show="scope.row.children !== null && scope.row.children.length > 0">
            <el-table :data="scope.row.children" style="width: 100%" :show-header="false">
              <el-table-column type="编号" align="center" width="50"></el-table-column>
              <el-table-column label="菜单 ID" prop="_id" min-width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="菜单名称" prop="menuName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="菜单路由" prop="menuPath" min-width="140" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="所属父级" prop="belong" min-width="140" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.menuName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="warning" @click="handleFormVisable(scope.$index, scope.row, '修改', 'Update')">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleFormVisable(scope.$index, scope.row, '删除', 'Delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="菜单 ID" prop="_id" min-width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="菜单名称" prop="menuName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="菜单路由" prop="menuPath" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属父级" prop="belong" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ '顶级菜单' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleFormVisable(scope.$index, scope.row, '修改', 'Update')">修改</el-button>
          <el-button size="mini" type="danger" @click="handleFormVisable(scope.$index, scope.row, '删除', 'Delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 工具条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      background
      :total="total"
      style="float:right;margin-top: 15px"
    ></el-pagination>

    <!-- 新增 / 编辑界面 -->
    <el-dialog title="新增 / 编辑" :visible.sync="formVisible" width="600px" @closed="closed" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
        <el-form-item label="父级菜单" prop="belong">
          <el-select v-model="form.belong" placeholder="请选择父级菜单" style="width:370px;" clearable :disabled="form.belong === '' && this.Row !== ''">
            <el-option v-for="(item, index) in dropList" :key="index" :label="item.menuName" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName"> <el-input v-model="form.menuName" style="width:370px;"></el-input> </el-form-item>
        <el-form-item label="菜单路由" prop="menuPath"> <el-input v-model="form.menuPath" style="width:370px;"></el-input> </el-form-item>
        <el-form-item label="菜单图标" prop="operation" v-show="form != {} && form.belong !== ''">
          <el-checkbox-group v-model="form.operation">
            <el-checkbox-button v-for="(item, index) in operationList" :label="item.value" :key="index">{{ item.label }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { GetAllMenu, GetAllMenuByPage, MenuOperation } from '@/api/system'
export default {
  data() {
    return {
      filters: {
        name: ''
      },
      dropList: [],
      datas: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      IsPage: true,
      IsOrder: true,
      IsAsc: true,
      listLoading: false,
      // 列表选中列
      sels: [],
      // 编辑界面是否显示
      formVisible: false,
      formLoading: false,
      formRules: {
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        menuPath: [{ required: true, message: '请输入菜单路由', trigger: 'blur' }]
      },
      // 编辑界面数据
      form: {
        _id: '',
        belong: '',
        menuName: '',
        menuPath: '',
        menuIcon: '',
        operation: ['select']
      },
      Title: '',
      Action: '',
      Row: null,
      // 操作权限
      operationList: [{ label: '增加', value: 'insert' }, { label: '删除', value: 'delete' }, { label: '修改', value: 'update' }, { label: '查询', value: 'select' }, { label: '导入', value: 'import' }, { label: '导出', value: 'export' }]
    }
  },
  mounted() {
    this.getAllMenuDataByPage()
  },
  methods: {
    // 获取列表分页数据
    getAllMenuDataByPage(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        PageSize: this.pageSize,
        PageIndex: this.pageIndex,
        IsAsc: this.IsAsc,
        IsPage: this.IsPage,
        IsOrder: this.IsOrder,
        Creater: this.$store.state.UserID,
        RoleId: this.$store.state.UserRole,
        Cid: this.$store.state._cid,
        MenuName: this.filters.name
      }
      this.listLoading = true
      GetAllMenuByPage(params).then(
        res => {
          this.datas = res.data
          this.total = res.total
          this.listLoading = false
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 显示 新增 / 编辑 界面
    handleFormVisable(index, row, title, action) {
      this.Action = action
      this.Row = row
      if (this.Action === 'Delete') {
        this.formSubmit()
      } else {
        let p = {
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid,
          Id: this.$store.state.UserRole
        }
        GetAllMenu(p).then(
          res => {
            this.dropList = res.data
            this.formVisible = true
            if (row !== '') {
              this.form = Object.assign({}, row)
              if (row.belong === '000000000000000000000000') {
                this.form.belong = ''
              }
            }
          },
          () => {
            this.$message({
              message: '发生未知错误, 请稍后重试!',
              type: 'error'
            })
          }
        )
      }
    },
    // 新增 / 编辑 / 删除
    formSubmit() {
      if (this.Action === 'Delete') {
        this.$confirm('确认' + this.Title + '吗？', '提示', {}).then(() => {
          this.formLoading = true
          let params = {}
          params = {
            Dto: this.Row,
            Action: this.Action
          }
          MenuOperation(params).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.clear()
          })
        })
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('确认' + this.Title + '吗？', '提示', {}).then(() => {
              this.formLoading = true
              let params = {}
              params = {
                Dto: Object.assign({}, this.form),
                Action: this.Action
              }
              MenuOperation(params).then(res => {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.clear()
              })
            })
          }
        })
      }
    },
    // 批量删除
    RemoveMany() {
      var ids = this.sels.map(item => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          let param = { ids: ids }
          MenuOperation(param).then(res => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAllMenuDataByPage()
          })
        })
        .catch(() => {})
    },
    // 各种清空
    clear() {
      this.formLoading = false
      this.formVisible = false
      this.getAllMenuDataByPage()
      // 清空当前行数据
      this.Row = ''
    },
    // 清空表单数据和表单验证
    closed() {
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.form = {
        _id: '',
        belong: '',
        menuName: '',
        menuPath: '',
        menuIcon: '',
        operation: ['select']
      }
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllMenuDataByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllMenuDataByPage()
    }
  }
}
</script>

<style>
.el-table__expanded-cell {
  padding: 0px !important;
}
</style>
