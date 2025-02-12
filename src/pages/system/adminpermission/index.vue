<template>
  <section class="page-container">
    <!-- 工具条 -->
    <el-col :span="24">
      <el-form :inline="true" :model="filters">
        <el-form-item> <el-input v-model="filters.name" placeholder="请输入角色名称"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getAllUserRoleDataByPage('refresh')">查询</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="handleFormVisable('', '', '添加', 'Add')">新增角色</el-button> </el-form-item>
      </el-form>
    </el-col>

    <!-- 列表 -->
    <el-table :data="datas" style="width: 100%" border v-loading="listLoading">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-form v-show="scope.row.children !== null && scope.row.children.length > 0">
            <el-table :data="scope.row.children" style="width: 100%" :show-header="false">
              <el-table-column type="index" align="center" width="50"></el-table-column>
              <el-table-column label="角色 ID" prop="_id" min-width="160" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="角色名称" prop="roleName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="角色备注" prop="remark" min-width="140" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.remark || '--' }}
                </template>
              </el-table-column>
              <el-table-column label="所属父级" prop="belong" min-width="140" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.roleName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="260" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handlePermissionsVisiable(scope.$index, scope.row)">分配权限</el-button>
                  <el-button size="mini" type="warning" @click="handleFormVisable(scope.$index, scope.row, '修改', 'Update')">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleFormVisable(scope.$index, scope.row, '删除', 'Delete')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="角色 ID" prop="_id" min-width="160" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="角色名称" prop="roleName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="角色备注" prop="remark" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="所属父级" prop="belong" min-width="140" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ '顶级角色' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handlePermissionsVisiable(scope.$index, scope.row)">分配权限</el-button>
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
      style="float:right;margin-top: 15px;"
    ></el-pagination>

    <!-- 新增 / 编辑界面 -->
    <el-dialog title="新增 / 编辑" :visible.sync="formVisible" width="600px" @closed="closed" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
        <el-form-item label="父级角色" prop="belong">
          <el-select v-model="form.belong" placeholder="请选择父级角色" style="width:370px;" clearable :disabled="(form.belong === '' && this.Row !== '') || this.dropList.length === 0">
            <el-option v-for="item in dropList" :key="item._id" :label="item.roleName" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName"> <el-input v-model="form.roleName" style="width:370px;"></el-input> </el-form-item>
        <el-form-item label="角色备注" prop="remark"> <el-input v-model="form.remark" style="width:370px;"></el-input> </el-form-item>
        <el-form-item label="查询权限" prop="queryAuthority">
          <el-radio v-model="form.queryAuthority" :label="1">全部</el-radio>
          <el-radio v-model="form.queryAuthority" :label="2">本角色</el-radio>
          <el-radio v-model="form.queryAuthority" :label="3">本人</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限界面 -->
    <el-dialog title="分配权限" :visible.sync="permissionVisible" width="1000px" @closed="permissionClosed" :close-on-click-modal="false">
      <ul class="role-table col-xs-offset-2 col-md-offset-1 col-sm-offset-2">
        <li class="header">
          <div class="left">菜单列表</div>
          <div class="right">功能权限</div>
        </li>
        <div class="vertical-line"></div>
        <li v-for="item in list" :key="item.id">
          <div class="left h40" @click="fold(item)">
            <i :class="{ 'el-icon-caret-right': item.folded, 'el-icon-caret-bottom': !item.folded }" v-cloak v-if="item.children" class="item-icon"></i>
            <el-checkbox @change="checkAllMenu(item)" v-cloak v-if="item.children" :indeterminate="item.isIndeterminate" v-model="item.firstCheckAll"> {{ item.menuName }}</el-checkbox>
          </div>
          <div class="line"></div>
          <ul v-show="item.children && !item.folded">
            <li class="h40" v-for="child in item.children" :key="child.id">
              <div class="left" style="padding-left:50px;">
                <el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checked" @change="handleChildCheckAll($event, item, child)" v-cloak> {{ child.menuName }} </el-checkbox>
              </div>
              <div class="right">
                <el-checkbox-group v-model="child.Operations" @change="handleCheckedOperationChange(item, child)">
                  <el-checkbox v-for="p in child.operation" :label="p" :key="p" v-cloak> {{ p }} </el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="line"></div>
            </li>
          </ul>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click.native="permissionSubmit" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { GetAllUserRole, GetAllUserRoleByPage, UserRoleOperation, GetAllMenu, GetUserPermissionByRoleID, PermissionOperation } from '@/api/system'
export default {
  data() {
    return {
      list: [],
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
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 编辑界面数据
      form: {
        _id: '',
        belong: '',
        roleName: '',
        remark: '',
        queryAuthority: 3 // 查询权限(1全部,2角色,3个人),默认个人
      },
      Title: '',
      Action: '',
      Row: null,
      // 分配权限是否展示
      permissionVisible: false,
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      // 当前选择的角色ID
      currRoleID: '',
      // 当前角色的权限列表
      currRolePermissionList: [],
      currPermissionInfo: null
    }
  },
  mounted() {
    this.getAllUserRoleDataByPage()
  },
  methods: {
    // 获取列表分页数据
    getAllUserRoleDataByPage(refresh) {
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
        RoleName: this.filters.name
      }
      this.listLoading = true
      GetAllUserRoleByPage(params)
        .then(res => {
          this.datas = res.data
          this.total = res.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 显示 新增 / 编辑 界面
    handleFormVisable(index, row, title, action) {
      this.Title = title
      this.Action = action
      this.Row = row
      if (this.Action === 'Delete') {
        this.formSubmit()
      } else {
        let param = {
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid
        }
        GetAllUserRole(param).then(
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
          UserRoleOperation(params).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this.clear()
          })
        })
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$confirm('确认' + this.Title + '吗？', '提示', {}).then(() => {
              this.formLoading = true
              // 设置创建人
              this.$set(this.form, 'Creater', this.$store.state.UserID)
              let params = {
                Dto: Object.assign({}, this.form),
                Action: this.Action
              }
              UserRoleOperation(params).then(res => {
                this.$message({
                  message: res.msg,
                  type: res.success ? 'success' : 'error'
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
          UserRoleOperation(param).then(res => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAllUserRoleDataByPage()
          })
        })
        .catch(() => {})
    },
    // 各种清空
    clear() {
      this.formLoading = false
      this.formVisible = false
      this.getAllUserRoleDataByPage()
      // 清空当前行数据
      this.Row = ''
    },
    // 清空表单数据和表单验证
    closed() {
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.form = { queryAuthority: 3 }
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllUserRoleDataByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllUserRoleDataByPage()
    },
    // 关闭分配权限窗口时
    permissionClosed() {
      this.currRoleID = ''
      this.list = []
      this.currRolePermissionList = []
      this.currPermissionInfo = null
    },
    // 显示分配权限
    handlePermissionsVisiable(index, row) {
      this.currRoleID = row._id
      let p = {
        Creater: this.$store.state.UserID,
        RoleId: this.$store.state.UserRole,
        Cid: this.$store.state._cid,
        Id: this.$store.state.UserRole
      }
      // 先获取所有的菜单
      GetAllMenu(p).then(res => {
        this.list = res.data
        let param = {
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid,
          Id: row._id
        }
        // 获取当前角色的所有菜单
        GetUserPermissionByRoleID(param).then(res => {
          this.currPermissionInfo = res.data
          if (res.data !== null) {
            this.currRolePermissionList = res.data.children
            // 如果当前角色有设置菜单的话
            if (this.currRolePermissionList !== null && this.currRolePermissionList.length !== 0) {
              // 同步去选中
              // 获取第一层菜单 如：系统设置
              this.currRolePermissionList.forEach(k => {
                // 获取子菜单，如：菜单设置等
                k.children.forEach(i => {
                  this.list.forEach(x => {
                    x.children.forEach(y => {
                      // 如果子项中有此项, 则为预选中状态
                      if (i._id === y._id) {
                        // 如果不是则判断
                        let arr = []
                        for (let a = 0; a < i.operations.length; a++) {
                          arr.push(i.operations[a])
                        }
                        this.$set(y, 'Operations', arr)
                        // 如果所有的操作功能都有权限则为选中
                        if (i.operations.length === y.operation.length) {
                          this.$set(y, 'checked', true)
                          this.$set(y, 'isIndeterminate', false)
                        } else if (i.operations.length === 0) {
                          this.$set(y, 'checked', false)
                          this.$set(y, 'isIndeterminate', false)
                        } else {
                          this.$set(y, 'checked', false)
                          this.$set(y, 'isIndeterminate', true)
                        }
                      } else if (typeof y.Operations === 'undefined') {
                        this.$set(y, 'Operations', [])
                      }
                    })
                  })
                })
                this.list.forEach((k, index) => {
                  if (index === 0) {
                    this.$set(k, 'folded', false)
                  } else {
                    this.$set(k, 'folded', true)
                  }
                  // 如果k的所有子项都选中的话，那么选中k
                  if (k.children.find(x => x.checked === false || typeof x.checked === 'undefined') === undefined) {
                    this.$set(k, 'firstCheckAll', true)
                    this.$set(k, 'isIndeterminate', false)
                  } else if (k.children.find(x => x.checked) !== undefined) {
                    this.$set(k, 'firstCheckAll', false)
                    this.$set(k, 'isIndeterminate', true)
                  } else {
                    this.$set(k, 'firstCheckAll', false)
                    this.$set(k, 'isIndeterminate', false)
                  }
                })
              })
            }
          }
          // 打开弹框
          this.permissionVisible = true
        })
      })
    },
    // 提交角色权限
    permissionSubmit: function() {
      let arr = []
      let en = {}
      let child = []
      let item = {}
      this.list.forEach(e => {
        if ((typeof e.firstCheckAll !== 'undefined' && e.firstCheckAll !== false) || (typeof e.isIndeterminate !== 'undefined' && e.isIndeterminate !== false)) {
          en = {}
          child = []
          e.children.forEach(x => {
            item = {}
            if (x.checked || x.isIndeterminate) {
              this.$set(item, 'Operations', x.Operations)
              this.$set(item, 'belong', x.belong)
              this.$set(item, 'createTime', x.createTime)
              this.$set(item, 'deleteTime', x.deleteTime)
              this.$set(item, 'menuIcon', x.menuIcon)
              this.$set(item, 'menuName', x.menuName)
              this.$set(item, 'menuPath', x.menuPath)
              this.$set(item, '_id', x._id)
              this.$set(item, 'isValid', x.isValid)
              child.push(item)
            }
          })
          // console.log(child)
          en['children'] = child
          en['belong'] = e.belong
          en['createTime'] = e.createTime
          en['deleteTime'] = e.deleteTime
          en['isValid'] = e.isValid
          en['menuIcon'] = e.menuIcon
          en['menuName'] = e.menuName
          en['menuPath'] = e.menuPath
          arr.push(en)
        }
      })
      if (arr.length === 0) {
        this.$message({
          message: '请选择菜单!',
          type: 'error'
        })
        return
      }
      let param = {
        RoleID: this.currRoleID,
        Children: arr,
        _id: this.currPermissionInfo === null ? '' : this.currPermissionInfo._id
      }
      let params = {
        Dto: param,
        Action: this.currRolePermissionList !== null && this.currRolePermissionList.length !== 0 ? 'Update' : 'Add'
      }
      PermissionOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.permissionVisible = false
      })
    },
    fold: function(item) {
      if (typeof item.folded === 'undefined') {
        this.$set(item, 'folded', true)
      } else {
        item.folded = !item.folded
      }
    },
    // 点击选中child时
    handleChildCheckAll(event, item, child) {
      let arr = []
      for (let a = 0; a < child.operation.length; a++) {
        arr.push(child.operation[a])
      }
      if (typeof child.Operations === 'undefined') {
        this.$set(child, 'Operations', arr)
      }
      child.Operations = event ? arr : []
      if (typeof second === 'undefined') {
        this.$set(child, 'isIndeterminate', false)
      }
      child.isIndeterminate = false
      if (typeof child.checked === 'undefined') {
        this.$set(child, 'checked', true)
      }
      if (typeof item.isIndeterminate === 'undefined') {
        this.$set(item, 'isIndeterminate', true)
      }
      let n = 0
      for (let a = 0; a < item.children.length; a++) {
        if (item.children[a].checked !== 'undefined' && item.children[a].checked) {
          n++
        }
      }
      if (n === item.children.length) {
        item.isIndeterminate = false
        item.firstCheckAll = true
      } else if (n < item.children.length && n > 0) {
        item.isIndeterminate = true
        item.firstCheckAll = false
      } else if (n <= 0) {
        item.isIndeterminate = false
        item.firstCheckAll = false
      }
    },
    // 单选功能项的时候
    // item 1级菜单
    // child 当前功能项的父二级菜单   ( indeterminate  预选中)
    handleCheckedOperationChange(item, child) {
      // 获取已经选中的功能项
      if (typeof child.Operations === 'undefined') {
        this.$set(child, 'Operations', [])
      }
      let checkedCount = child.Operations.length
      // 如果子菜单没有被选中 则选中
      if (typeof child.checked === 'undefined') {
        this.$set(child, 'checked', false)
      }
      // 如果indeterminate 没有选中，则先添加属性并赋值为false
      if (typeof child.isIndeterminate === 'undefined') {
        this.$set(child, 'isIndeterminate', false)
      }
      // 如果菜单的预选中状态没有打开， 则标识为预选中状态
      if (typeof item.isIndeterminate === 'undefined') {
        this.$set(item, 'isIndeterminate', true)
      }
      // 判断如果当前选中的功能项 > 0 并且 选中项 < 子菜单的功能项 则子菜单为预选中状态
      child.isIndeterminate = checkedCount > 0 && checkedCount < child.operation.length
      // 如果选中项 === 子菜单的功能项，则子菜单为选中状态
      child.checked = checkedCount === child.operation.length
      // 如果选中项 === 0 则，选中状态为false
      if (checkedCount === 0) {
        child.isIndeterminate = false
      }
      if (item.children.filter(x => x.Operations.length > 0).length > 0 && item.children.filter(x => x.Operations.length > 0).length < item.children.length) {
        item.isIndeterminate = true
        item.firstCheckAll = false
        // 这是所有的子项都有选中的
      } else if (item.children.filter(x => x.Operations.length > 0).length === item.children.length) {
        // console.log(item.children.filter(x => x.Operations.length === item.children.find(y => y._id === x._id).operation.length))
        // 判断子项是否全部选中，全选则为对勾，不全选则为预选中
        if (item.children.filter(x => x.Operations.length === item.children.find(y => y._id === x._id).operation.length).length === item.children.length) {
          item.isIndeterminate = false
          item.firstCheckAll = true
        } else {
          item.isIndeterminate = true
          item.firstCheckAll = false
        }
      } else if (item.children.filter(x => x.Operations.length > 0).length === 0) {
        item.isIndeterminate = false
        item.firstCheckAll = false
      }
    },
    // 点击所有
    checkAllMenu: function(item) {
      // 如果没有全选
      if (typeof item.firstCheckAll === 'undefined') {
        this.$set(item, 'firstCheckAll', true)
      }
      for (let a = 0; a < item.children.length; a++) {
        this.checkItemAll(item.firstCheckAll, item.children[a])
      }
      item.isIndeterminate = false
    },
    // 选中每一项菜单及功能项
    checkItemAll: function(flag, item) {
      let arr = []
      for (let a = 0; a < item.operation.length; a++) {
        // 设置菜单功能项选中
        // item.operation[a].checked = flag
        arr.push(item.operation[a])
      }
      if (typeof item.Operations === 'undefined') {
        this.$set(item, 'Operations', arr)
      }
      // 设置菜单的选中项的功能项
      item.Operations = flag ? arr : []
      // 设置菜单选中
      item.checked = flag
    },
    // 1级菜单全选或者全不选
    handleOneCheckAll: function(event, item) {
      let arr = []
      for (let a = 0; a < item.children.length; a++) {
        if (typeof item.children[a].checked === 'undefined') {
          this.$set(item.children[a], 'checked', event)
        }
        item.children[a].operation.forEach(e => {
          this.$set(e, 'checked', event)
        })
        arr.push(item.children[a])
        // this.handleChildCheckAll(event, item, item.children[a])
      }
      // item.checked = true
      item.Operations = event ? arr : []
    }
  }
}
</script>

<style>
.el-table__expanded-cell {
  padding: 0px !important;
}
.role-table {
  border: 1px solid #e0e0e0;
  border-bottom: none;
  padding: 0;
  position: relative;
}

.header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #e7e7e7;
  background: #f8f8f9;
  text-align: center;
}

.vertical-line {
  width: 1px;
  height: 100%;
  background: #ddd;
  position: absolute;
  left: 30%;
  top: 0;
}

.left {
  width: 30%;
  float: left;
  padding-left: 10px;
  user-select: none;
  cursor: pointer;
}

.one {
  padding-left: 20px;
}

.right {
  width: 70%;
  float: left;
  padding-left: 10px;
}

.item-icon {
  margin-left: -5px;
  padding: 5px;
}

.line {
  clear: both;
  width: 100%;
  height: 1px;
  background: #e0e0e0;
}
.h40 {
  height: 39px;
  line-height: 39px;
}
[v-cloak] {
  display: none;
}
</style>
