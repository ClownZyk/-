<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form class="filter" :model="searchForm" inline>
        <div class="filter-left">
          <el-form-item> <el-input type="text" v-model.trim="searchForm.partnerName" placeholder="请输入合伙人姓名检索" clearable></el-input> </el-form-item>
          <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item><el-button type="primary" @click="handlePartnerAdd">合伙人添加</el-button></el-form-item>
        </div>
      </el-form>
      <div class="table-list">
        <el-table v-loading="listLoading" :data="partnerList" style="width: 100%" border>
          <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="partnerName" label="合伙人姓名" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="合伙人登录名" width="200" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="参股门店" min-width="500">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.shops" :key="index">{{ item.companyName + (index + 1 === scope.row.shops.length ? '' : '、') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="handleUpdatePartner(scope.row)">查看</el-button>
              <el-button size="mini" type="primary" @click="handleResetPwd(scope.row)">重置密码</el-button>
              <el-button size="mini" type="danger" @click="handleRemovePartner(scope.row)">删除</el-button>
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
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getPartnerList, partnerOperation, partnerPwdUpdate } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'partner-list') {
        this.getPartnerList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        partnerName: ''
      },
      partnerList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      listLoading: false,
      containerIsShow: true
    }
  },
  mounted() {
    this.getPartnerList()
  },
  methods: {
    getPartnerList() {
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
      getPartnerList(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.partnerList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 合伙人添加
    handlePartnerAdd() {
      this.$router.push({
        path: '/partner-detail'
      })
    },
    handleUpdatePartner(row) {
      this.$router.push({
        path: '/partner-detail',
        query: {
          partnerId: row._id
        }
      })
    },
    handleRemovePartner(row) {
      this.$confirm('此操作将永久删除该合伙人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          partnerOperation(params).then(res => {
            if (res.success) {
              this.getPartnerList()
            }
          })
        })
        .catch(() => {})
    },
    // 重置密码
    handleResetPwd(row) {
      this.$prompt('请输入重置后的密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        inputPattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        inputErrorMessage: '密码至少6个字符，包含字母和数字，不能包含特殊字符'
      })
        .then(({ value }) => {
          partnerPwdUpdate({
            _id: row._id,
            newPassword: value
          }).then(res => {
            if (res.success) {
              this.$message.success('密码重置成功')
              this.getPartnerList()
            }
          })
        })
        .catch(() => {})
    },
    searchCondition() {
      this.pageIndex = 1
      this.getPartnerList()
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
.filter {
  display: flex;
  justify-content: space-between;
}
</style>
