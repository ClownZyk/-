<template>
  <div class="order">
    <el-table :data="tableData3" border style="width: 100%" v-loading="loading">
      <el-table-column prop="cardId" label="CardId" align="center"  min-width="240"></el-table-column>
      <el-table-column prop="name" label="卡券名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="积分类型" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="兑换开始时间"  align="center" min-width="140">
        <template slot-scope="scope">{{scope.row.effectStartDate.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column label="兑换截止时间"  align="center" min-width="140">
        <template slot-scope="scope">{{scope.row.effectEndDate.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column prop="resoure" label="核销状态"  align="center" min-width="100">
        <template slot-scope="scope">{{scope.row.isUsed === false ? '未核销' : '已核销'}}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="this.cardsList.length !== 0 "
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {userCardsList} from '@/api/system'
  export default {
    data() {
      return {
        cardsList: [],
        tableData3: [
          {cardId: '123234', name: '积分兑换vip', type: '实物', state: '已送达', isUsed: true, effectStartDate: '2019/02/12 12:23', effectEndDate: '2019/02/18 12:23'}
        ],
        pageIndex: 1,
        pageSize: 10,
        total: null,
        loading: false
      }
    },
    methods: {
      init() {
        if (this.$route.query.id !== undefined) {
          let parmas = {
            customerId: this.$route.query.id,
            cardType: 0,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            isPage: true,
            isOrder: true,
            isAsc: true,
            creater: this.$store.state.UserID,
            roleid: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          userCardsList(parmas).then(res => {
            this.loading = true
            if (res.success) {
              this.loading = false
              this.cardsList = res.data
              this.total = res.total
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.setData()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.setData()
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
<style lang="scss" scoped>
  .order{
    .pagination{
      float: right;
      margin-top: 10px;
    }
  }
</style>
