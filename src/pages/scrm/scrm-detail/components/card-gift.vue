<template>
  <div class="order">
    <el-table :data="cardsList" border style="width: 100%" v-loading="loading">
      <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
      <el-table-column prop="cardId" label="CardId" align="center"  min-width="240"></el-table-column>
      <el-table-column prop="tel" label="卡券名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="兑换开始时间"  align="center" min-width="140">
        <template slot-scope="scope">{{scope.row.effectStartDate.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column label="兑换截止时间"  align="center" min-width="140">
        <template slot-scope="scope">{{scope.row.effectEndDate.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column prop="effectEndDate" label="卡劵使用时间"  align="center" min-width="140">
        <template slot-scope="scope">{{scope.row.useTime === '0001/01/01 00:00:00' ? '未使用' : scope.row.useTime.split(' ')[0]}}</template>
      </el-table-column>
      <el-table-column prop="resoure" label="核销状态"  align="center" min-width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.isUsed === false" style="color: #FF4949;">未核销</div>
          <div v-else style="color: #13CE66;">已核销</div>
        </template>
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
          {orderId: '兑换券', name: '5ca1e8f0c3a8da8774ef8f20', tel: '咖啡兑换券', total: '2019-02-12', resoure: '已核销', pay: '是', addr: '江苏南京建邺测试', status: '是'},
          {orderId: '满减券', name: '5caaed0ac3a8d87fdc0c36b0', tel: '早餐满10减2券', total: '2019-06-24', resoure: '未核销', pay: '否', addr: '江苏南京建邺测试', status: '否'}
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
