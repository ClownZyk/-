<template>
  <section class="page-container">
    <div v-if="containerIsShow">
      <!-- 工具条 -->
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-form-item> <el-input v-model="filters.name" placeholder="请输入用户名"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" v-on:click="getAllUserDataByPage('refresh')">查询</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click="handleFormVisable('', '', '添加', 'Add')">新增用户</el-button> </el-form-item>
        </el-form>
      </el-col>

      <!-- 列表 -->
      <el-table :data="datas" style="width: 100%" border v-loading="listLoading">
        <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
        <el-table-column label="用户名" prop="userName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="门店名称" prop="shopName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="门店编码" prop="basicInfor.markCode" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.basicInfor">{{ scope.row.basicInfor.markCode || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="店长" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.basicInfor">{{ scope.row.basicInfor.manager || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="店员绑定" prop="realName" min-width="120" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.realName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" width="150" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.basicInfor"><el-switch v-model="scope.row.basicInfor.isOpen" @change="onHandleStoreOpen(scope.row.basicInfor)"></el-switch></div>
          </template>
        </el-table-column>
        <el-table-column align="right" label="操作" width="350" fixed="right">
          <template slot-scope="scope">
            <el-button v-show="scope.row.basicInfor" size="mini" @click="goToUserStoreDetail(scope.row)">门店修改</el-button>
            <el-button size="mini" type="warning" @click="handleFormVisable(scope.$index, scope.row, '修改', 'Update')">账户修改</el-button>
            <el-button size="mini" type="primary" @click="asyncUserToV8(scope.row)">同步</el-button>
            <el-button size="mini" type="danger" @click="handleFormVisable(scope.$index, scope.row, '删除', 'Delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-form :model="form" label-width="120px" :rules="formRules" ref="form" id="form">
          <el-form-item label="用户名" prop="userName"> <el-input v-model="form.userName" placeholder="请输入用户名" :disabled="currRow !== null && currRow !== ''" style="width:370px;"></el-input> </el-form-item>
          <el-form-item label="密  码" prop="passWord"> <el-input v-model="form.passWord" placeholder="请输入密码" style="width:370px;" type="password" show-password> </el-input> </el-form-item>
          <el-form-item label="联系方式" prop="phone"> <el-input v-model="form.phone" placeholder="请输入联系方式" style="width:370px;"></el-input> </el-form-item>
          <el-form-item label="用户角色" prop="roleID"> <el-cascader :options="userRoleDropList" v-model="form.roleID" :props="props" clearable placeholder="请选择用户角色" style="width:370px;"></el-cascader> </el-form-item>
          <el-form-item label="组织机构代码" prop="organizationCode"> <el-input :disabled="currRow !== null && currRow !== ''" v-model="form.organizationCode" placeholder="请输入组织机构代码" style="width:370px;"></el-input> </el-form-item>
          <el-form-item label="组织机构名称" prop="organizationName"> <el-input :disabled="currRow !== null && currRow !== ''" v-model="form.organizationName" placeholder="请输入组织机构名称" style="width:370px;"></el-input> </el-form-item>
          <el-form-item label="商城名称" prop="shopName"> <el-input :disabled="currRow !== null && currRow !== ''" v-model="form.shopName" placeholder="请输入商城名称" style="width:370px;"></el-input> </el-form-item>
          <el-form-item label="员工绑定" prop="workerId">
            <el-tag v-if="form.realName">{{ form.realName }}</el-tag>
            <el-button size="mini" type="warning" @click="handleWorkerSelectShow">选择员工</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="formVisible = false">取消</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="formLoading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 员工弹框 -->
      <el-dialog title="员工列表" :visible.sync="isWorkerShow" width="900px" @close="isWorkerShow = false" :close-on-click-modal="false">
        <el-form class="filter" :model="searchForm" inline>
          <div class="filter-left">
            <el-form-item> <el-input type="text" v-model.trim="searchForm.phone" placeholder="请输入员工电话检索" clearable></el-input> </el-form-item>
            <el-form-item v-show="isManage">
              <el-select v-model="searchForm.belongCid" placeholder="请选择员工所属门店"> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
            </el-form-item>
            <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
          </div>
        </el-form>
        <div class="table-list">
          <el-table v-loading="workerLoading" :data="workerList" style="width: 100%" border>
            <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
            <el-table-column prop="realName" label="员工姓名" min-width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="员工电话" min-width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="number" label="工号" min-width="100" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="belongName" label="所属门店" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="warning" @click="selectWorker(scope.row)">选择此员工</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 15px;text-align: right"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="pageIndex1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize1"
            layout="total, sizes, prev, pager, next"
            :total="total1"
            background
          >
          </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer"> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </section>
</template>

<script>
import { GetAllUserByPage, UserOperation, GetAllUserOrganizationByLevel, GetAllUserRoleByLevel, SynchronousUser, getIsOpen, getWorkerList, getAllStore } from '@/api/system'
import myUpload from '@/components/my-upload'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  watch: {
    $route(to, from) {
      if (to.name === 'user-list') {
        this.getAllUserDataByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filters: {
        name: ''
      },
      searchForm: {
        phone: '',
        belongCid: this.$store.state._cid
      },
      datas: [],
      workerList: [],
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
        userName: [{ required: true, message: '请输入用户账号!', trigger: 'blur' }, { min: 6, message: '账号长度不得低于6位', trigger: 'blur' }],
        passWord: [{ required: true, message: '请输入用户密码!', trigger: 'blur' }],
        organizationCode: [{ required: true, message: '请输入组织机构代码!', trigger: 'blur' }],
        organizationName: [{ required: true, message: '请输入组织机构名称!', trigger: 'blur' }],
        shopName: [{ required: true, message: '请输入商城名称!', trigger: 'blur' }],
        // organizationID: [
        //     { type: 'array', required: true, message: '请选择用户组织机构!', trigger: 'change' }
        // ],
        roleID: [{ type: 'array', required: true, message: '请选择用户角色!', trigger: 'change' }]
      },
      // 编辑界面数据
      form: {},
      Title: '',
      Action: '',
      // 用户角色下拉列表
      userRoleDropList: [],
      // 组织机构下拉列表
      organizationDropList: [],
      currRow: null,
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: true
      },
      shopList: [],
      isWorkerShow: false,
      workerLoading: false,
      pageIndex1: 1,
      pageSize1: 10,
      total1: 0,
      containerIsShow: true
    }
  },
  mounted() {
    this.getAllUserDataByPage()
  },
  methods: {
    // 获取列表分页数据
    getAllUserDataByPage(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isAsc: this.IsAsc,
        isPage: this.IsPage,
        isOrder: this.IsOrder,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid,
        userName: this.filters.name
      }
      this.listLoading = true
      GetAllUserByPage(params).then(
        res => {
          this.datas = res.data
          this.total = res.total
          this.listLoading = false
        },
        err => {
          this.listLoading = false
          console.log(err)
        }
      )
    },
    // 显示 新增 / 编辑 界面
    handleFormVisable(index, row, title, action) {
      this.Title = title
      this.Action = action
      this.currRow = row
      if (this.Action === 'Delete') {
        this.formSubmit()
      } else {
        let param = {
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid
        }
        let paramForOrg = {
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid
        }
        GetAllUserRoleByLevel(param).then(result => {
          // console.log(result)
          this.userRoleDropList = result.data
          // 如果子项为空，则删除children属性
          this.userRoleDropList.forEach(e => {
            if (e.children.length === 0) {
              delete e['children']
            }
          })
          GetAllUserOrganizationByLevel(paramForOrg).then(
            res => {
              this.organizationDropList = res.data
              // 如果子项为空，则删除children属性
              this.organizationDropList.forEach(o => {
                if (o.children.length === 0) {
                  delete o['children']
                }
              })
              if (row !== '') {
                this.form = Object.assign({}, row)
              }
              this.formVisible = true
            },
            err => {
              console.log(err)
              this.$message({
                message: '发生未知错误, 请稍后重试!',
                type: 'error'
              })
            }
          )
        })
      }
    },
    // 新增 / 编辑 / 删除
    formSubmit() {
      if (this.Action === 'Delete') {
        this.$confirm('确认' + this.Title + '吗？', '提示', {}).then(() => {
          this.formLoading = true
          let params = {}
          params = {
            Dto: this.currRow,
            Action: this.Action
          }
          UserOperation(params)
            .then(res => {
              // console.log(res)
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.clear()
            })
            .catch(() => {
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
              UserOperation(params)
                .then(res => {
                  // console.log(res)
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  })
                  this.clear()
                })
                .catch(() => {
                  this.clear()
                })
            })
          }
        })
      }
    },
    // 修改门店启用状态
    onHandleStoreOpen(row) {
      getIsOpen({ _id: row._id }).then(res => {
        this.$message.success(res.msg)
        this.getAllUserDataByPage()
      })
    },
    // 同步数据到v8
    asyncUserToV8(row) {
      if (!row.organizationID || row.organizationID.length <= 0) {
        this.$message({
          message: '请填写组织机构！',
          type: 'warning'
        })
        return false
      }
      this.$prompt('请填写进货宝小程序邀请码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '非必填项'
        // inputPattern: /\S/,
        // inputErrorMessage: '请填写邀请码'
      })
        .then(value => {
          let params = {
            userName: row.userName,
            organizationID: row.organizationID[row.organizationID.length - 1],
            Creater: row.creater,
            inviteCode: value.value
          }
          SynchronousUser(params).then(
            res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
            },
            err => {
              console.log(err)
            }
          )
        })
        .catch(() => {})
    },
    // 获取所有门店信息
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          if (this.isManage) {
            this.shopList.unshift({
              cid: localStorage.getItem('cid'),
              companyName: '所有门店'
            })
          }
        }
      })
    },
    handleWorkerSelectShow() {
      this.isWorkerShow = true
      this.getAllShop()
      this.getStaffList()
    },
    // 获取员工列表
    getStaffList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex1,
        pageSize: this.pageSize1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.workerLoading = true
      getWorkerList(params)
        .then(res => {
          if (res.success) {
            this.workerLoading = false
            this.workerList = res.data
            this.total1 = res.total
          }
        })
        .catch(() => {
          this.workerLoading = false
        })
    },
    // 选择员工操作
    selectWorker(row) {
      this.form.workerId = row._id
      this.form.realName = row.realName
      this.isWorkerShow = false
    },
    // 删除员工
    removeWorker() {
      this.form.workerId = ''
      this.form.realName = ''
    },
    goToUserStoreDetail(row) {
      this.$router.push({ path: '/user-store-detail', query: { cid: row._id, creater: row.creater, roleId: row.roleID[row.roleID.length - 1] } })
    },
    // 各种清空
    clear() {
      this.formLoading = false
      this.formVisible = false
      this.getAllUserDataByPage()
    },
    // 清空表单数据和表单验证
    closed() {
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.currRow = null
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllUserDataByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllUserDataByPage()
    },
    searchCondition() {
      this.pageIndex1 = 1
      this.getStaffList()
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getStaffList()
    },
    handleCurrentChange1(val) {
      this.pageIndex1 = val
      this.getStaffList()
    }
  }
}
</script>

<style lang="scss">
.form-contain {
  flex: 0 0 50%;
  padding: 0 120px 20px 20px;
  .el-form-item {
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
          text-transform: uppercase;
          span {
            font-size: #f2f2f2;
          }
        }
      }
    }
  }
}
.row-line {
  display: flex;
  .el-form-item {
    flex: 1;
    padding-right: 5%;
    &:last-child {
      padding-right: 0;
    }
  }
}
.toolbar {
  padding: 20px 0;
}
.el-table__expanded-cell {
  padding: 0px !important;
}
.el-cascader-menu {
  width: 370px;
}
</style>
