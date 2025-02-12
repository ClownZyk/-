<template>
  <div class="cards-container">
    <div v-if="containerIsShow">
      <!-- 卡券搜索区域 -->
      <el-form :inline="true" :model="searchForm">
        <div class="filter-left">
          <el-form-item> <el-input v-model="searchForm.activityName" placeholder="请输入活动名称"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getCards">搜索</el-button> </el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item> <el-button type="primary" @click="addCards">新增</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 卡券列表区域 -->
      <el-table :data="cardsList" border style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="55"> </el-table-column>
        <el-table-column align="center" prop="activityName" label="活动名称" min-width="240" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="赠送方式" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.welfareType == 1">注册赠送</div>
            <div v-else-if="scope.row.welfareType == 2">零售产品消费满足金额赠送</div>
            <div v-else-if="scope.row.welfareType == 3">购买VIP赠送</div>
            <div v-else-if="scope.row.welfareType == 4">饮品产品消费满足数量赠送</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="赠送类型" width="180">
          <template slot-scope="scope">{{ scope.row.giveType == 1 ? '卡券' : 'VIP会员' }}</template>
        </el-table-column>
        <el-table-column align="center" label="活动时间" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.startTime.split(' ')[0] }}-{{ scope.row.endTime.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="启用状态" width="160">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.display" @change="updateStatus(scope.row, 1)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateCards(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteCards(scope.row, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total" background></el-pagination>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetActivityWelfareByPage, GetWelfarOperation } from '@/api/system'
export default {
  name: 'cards-send',
  watch: {
    $route(to, from) {
      if (to.name === 'cards-send') {
        this.getCards()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      containerIsShow: true,
      searchForm: {
        activityName: ''
      },
      cardsList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getCards()
  },
  methods: {
    // 获取卡券列表
    getCards() {
      let params = {
        ...this.searchForm,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isAsc: true,
        isOrder: true,
        isPage: true,
        cid: this.$store.state._cid,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
      }
      GetActivityWelfareByPage(params).then(
        res => {
          this.cardsList = res.data
          this.total = res.total
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 添加卡券
    addCards() {
      this.$router.push('/cards-send-detail')
    },
    // 修改卡券
    updateCards(row) {
      this.$router.push({
        path: '/cards-send-detail',
        query: { id: row._id }
      })
    },
    // 更新状态
    updateStatus(row, action) {
      this.operation(row, action)
    },
    // 删除卡券
    deleteCards(row, action) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.operation(row, action)
        })
        .catch(() => {})
    },
    operation(row, action) {
      GetWelfarOperation({ dto: Object.assign({}, row), action }).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.getCards()
      })
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getCards()
    },
    handleCurrentChange(newPage) {
      this.pageIndex = newPage
      this.getCards()
    }
  }
}
</script>

<style lang="scss" scoped>
.cards-container {
  padding: 20px 20px 0;
  .el-form {
    display: flex;
    justify-content: space-between;
  }
  .el-table {
    margin-bottom: 15px;
  }
  .el-pagination {
    text-align: right;
  }
}
</style>
