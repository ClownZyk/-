<template>
  <div class="page-container">
    <el-form class="filters" :model="filterParam" inline>
      <div class="filters-left">
        <el-form-item>
          <el-select v-model="filterParam.cid" placeholder="请选择门店"> <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filterParam.role" placeholder="请选择角色">
            <el-option label="全部" :value="0"> </el-option>
            <el-option label="投资者" :value="1"> </el-option>
            <el-option label="运营者" :value="2"> </el-option>
            <el-option label="管理者" :value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item> <el-input v-model.trim="filterParam.name" placeholder="请输入姓名" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="GetListByPage('refresh')">搜索</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="monthRecordsData" border>
      <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="remark" label="标题" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="name" label="分润人" width="250" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="profitMoney" width="120" label="分润金额" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="percent" width="120" label="分润比例" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="allTotalAmount" width="120" label="零售总额" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="是否已读" width="100">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.readstatus">已确认</el-tag>
          <el-tag type="warning" size="small" v-else>待确认</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否确认" width="100">
        <template slot-scope="scope">
          <el-tag type="success" size="small" v-if="scope.row.confirmstatus">已确认</el-tag>
          <el-tag type="warning" size="small" v-else>待确认</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleViewReportDetail(scope.row)">查看</el-button>
          <el-button type="danger" size="mini" :disabled="scope.row.isPush" @click="handleReportPush(scope.row)">{{ scope.row.isPush ? '已推送' : '推送' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
      </el-pagination>
    </el-col>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {AllotGetUserDropDownList, getMonthReportList, pushMonthReport} from '@/api/system'
export default {
  data () {
    return {
      filterParam: {
        name: '',
        cid: '',
        role: 0 // 全部：0；投资者：1，运营者：2，经营者：3
      },
      shopList: [],
      monthRecordsData: [],
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.getAllShop()
    this.GetListByPage()
  },
  methods: {
    getAllShop() {
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      AllotGetUserDropDownList(params).then(res => {
        if (res.success) {
          this.shopList = res.data
        }
      })
    },
    GetListByPage (refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid,
        ...this.filterParam
      }
      this.listLoading = true
      getMonthReportList(params).then(res => {
        this.listLoading = false
        this.monthRecordsData = res.data.listData
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleViewReportDetail(row) {
      this.$router.push({
        path: '/month-report-check/' + row._id
      })
    },
    handleReportPush(row) {
      this.$confirm('是否确认推送此分润信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          _id: row._id
        }
        pushMonthReport(param).then(() => {
          this.$message.success('推送成功')
          this.GetListByPage()
        })
        // this.vipManageOperation(row)
      }).catch(() => {})
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped></style>
