<template>
  <div v-if="containerIsShow">
    <el-form>
      <el-form-item> <el-button :loading="submitLoading" type="primary" @click="handlePrepayCardAdd">开通预付卡</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="cardList" border>
      <el-table-column type="index" width="55" align="center"></el-table-column>
      <el-table-column label="预付卡号" prop="cardId" min-width="220" align="center"></el-table-column>
      <el-table-column label="商户系统内部订单号" prop="out_trade_no" min-width="220" align="center"></el-table-column>
      <el-table-column label="备注" prop="description" min-width="180">
        <template slot-scope="scope">{{ scope.row.description || '--' }}</template>
      </el-table-column>
      <el-table-column label="开卡时间" prop="createTime" width="180" align="center"> </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleDetailQuery(scope.row)">信息查询</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-row>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getPrepayCardList, openPrepayCardOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'prepay-card-list') {
        this.getPrepayCardList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      cardList: [],
      listLoading: false,
      submitLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      containerIsShow: true
    }
  },
  mounted() {
    this.getPrepayCardList()
  },
  methods: {
    getPrepayCardList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
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
      getPrepayCardList(params)
        .then(res => {
          this.listLoading = false
          this.cardList = res.data.listData
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 开卡
    handlePrepayCardAdd() {
      this.$confirm('确认开通预付卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            orderid: '',
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          this.submitLoading = true
          openPrepayCardOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.getPrepayCardList()
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {})
    },
    handleDetailQuery(row) {
      this.$router.push({ path: '/prepay-card-detail', query: { cardId: row.cardId, outTradeNo: row.out_trade_no } })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getPrepayCardList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getPrepayCardList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
