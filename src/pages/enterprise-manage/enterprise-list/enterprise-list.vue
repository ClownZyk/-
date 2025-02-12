<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <div class="list-search">
        <el-form ref="searchFormRef" :model="searchForm" :inline="true">
          <el-form-item> <el-input v-model="searchForm.name" placeholder="请输入企业名称" clearable></el-input> </el-form-item>
          <el-form-item> <el-input v-model="searchForm.contactname" placeholder="请输入企业联系人姓名" clearable></el-input> </el-form-item>
          <el-form-item> <el-input v-model="searchForm.phone" placeholder="请输入企业电话" clearable></el-input> </el-form-item>
          <el-form-item> <el-input v-model="searchForm.code" placeholder="请输入企业邀请码" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getEnterpriseList('refresh')">搜索</el-button> </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="listLoading" :data="enterpriseList" border>
        <el-table-column prop="name" label="企业名称" align="center" width="250"> </el-table-column>
        <el-table-column prop="contactname" label="企业联系人" align="center" width="150"> </el-table-column>
        <el-table-column prop="phone" label="企业电话" align="center" width="150"> </el-table-column>
        <el-table-column prop="code" label="企业邀请码" align="center" width="250"> </el-table-column>
        <el-table-column prop="beginTime" label="企业会员开始时间" align="center" width="200">
          <template slot-scope="scope">
            <div>{{ scope.row.beginTime.split(' ')[0] }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="企业会员截止时间" align="center" width="200">
          <template slot-scope="scope">
            <div>{{ scope.row.endTime.split(' ')[0] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="200" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="warning" @click="editBtn(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="deleteBtn(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[15, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getEnterpriseList, enterpriseOperation } from '@/api/system'

export default {
  name: 'enterprise-list',
  watch: {
    $route(to, from) {
      if (to.name === 'enterprise-list') {
        this.getEnterpriseList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        name: '',
        addr: '',
        code: '',
        phone: '',
        contactname: ''
      },
      enterpriseList: [],
      listLoading: false,
      operateAction: 0,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      containerIsShow: true
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    getEnterpriseList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
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
      getEnterpriseList(params)
        .then(res => {
          this.listLoading = false
          this.enterpriseList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    editBtn(row) {
      this.$store.commit('setEnterpriseInfo', row)
      this.$router.push({
        path: '/enterprise-detail'
      })
    },
    deleteBtn(row) {
      this.operateAction = 2
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: {
              ...row,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operateAction
          }
          enterpriseOperation(params).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this.getEnterpriseList()
          })
        })
        .catch(() => {})
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getEnterpriseList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getEnterpriseList()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
