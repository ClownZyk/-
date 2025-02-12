<template>
  <div class="container">
    <div class="list" v-if="containerIsShow">
      <el-form class="filter" :model="searchForm" inline>
        <div class="filter-left">
          <el-form-item> <el-input type="text" v-model.trim="searchForm.phone" placeholder="请输入员工电话检索" clearable></el-input> </el-form-item>
          <el-form-item v-show="isManage">
            <el-select v-model="searchForm.belongCid" placeholder="请选择员工所属门店"> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
          </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item><el-button type="primary" @click="handleStaffAdd">员工添加</el-button></el-form-item>
        </div>
      </el-form>
      <div class="table-list">
        <el-table v-loading="listLoading" :data="dataList" style="width: 100%" border>
          <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="realName" label="员工姓名" min-width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="员工电话" min-width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="number" label="工号" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="post" label="职位" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="belongName" label="所属门店" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="员工等级" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.grade || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="integral" label="员工积分" min-width="100" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="操作" width="250" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="gotoTaskDetail(scope.row)">员工详情</el-button>
              <el-button size="mini" type="danger" @click="handleRemoveStaff(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px;text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <!-- 员工添加弹框 -->
      <staff-info :isStaffShow.sync="isStaffShow" :detailForm="addForm" @staffOperation="staffOperation"></staff-info>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getAllStore, getWorkerList, workerOperation } from '@/api/system'
import StaffInfo from './components/staff-info.vue'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'staff-list') {
        this.getStaffList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    StaffInfo
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      searchForm: {
        phone: '',
        belongCid: this.$store.state._cid
      },
      shopList: [],
      dataList: [],
      addForm: {
        faceImage: null,
        realName: '',
        phone: '',
        post: '',
        grade: '',
        medal: [],
        labels: [],
        address: '',
        belongCid: '',
        belongName: '',
        integral: 0,
        isLookUp: false
      },
      addFormState: 0,
      containerIsShow: true,
      listLoading: false,
      isStaffShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getAllShop()
    this.getStaffList()
  },
  methods: {
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
    getStaffList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getWorkerList(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.dataList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 员工添加
    handleStaffAdd() {
      this.addFormState = 0
      this.isStaffShow = true
      this.$nextTick(() => {
        if (!this.isManage) {
          this.addForm.belongCid = this.$store.state._cid
          this.addForm.belongName = this.shopList.find(item => item.cid === this.$store.state._cid).companyName
        }
      })
    },
    // 删除员工
    handleRemoveStaff(row) {
      this.addFormState = 2
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.staffOperation(row)
        })
        .catch(() => {})
    },
    staffOperation(row) {
      const publicParams = row ? { ...row } : { ...this.addForm }
      let params = {
        dto: {
          ...publicParams,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        },
        action: this.addFormState
      }
      // console.log(params)
      workerOperation(params).then(res => {
        if (res.success) {
          this.isStaffShow = false
          this.$message.success(res.msg)
          this.getStaffList()
        }
      })
    },
    // 查看员工任务
    gotoTaskDetail(row) {
      this.$router.push({
        path: '/staff-task',
        query: {
          id: row._id
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getStaffList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getStaffList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getStaffList()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .filter {
    display: flex;
    justify-content: space-between;
  }
}
</style>
