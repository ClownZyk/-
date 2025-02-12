<template>
  <div class="record-container">
    <el-table :data="sendRecordList" style="width: 100%">
      <el-table-column label="赠券编号" align="center" prop="orderId"></el-table-column>
      <el-table-column label="赠券时间" prop="createTime" align="center"> </el-table-column>
      <el-table-column label="赠券详情" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleSendCardDetail(scope.row.giveResult)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
    <el-dialog :visible.sync="isDetailShow" title="赠券详情" width="1000px" @closed="isDetailShow = false">
      <el-table :data="listData" tooltip-effect="dark" style="width: 100%" border>
        <el-table-column align="center" prop="title" label="领取卡券标题"></el-table-column>
        <el-table-column align="center" label="领取会员名称" prop="userName"></el-table-column>
        <el-table-column align="center" label="领取会员手机号" prop="phone"></el-table-column>
        <el-table-column align="center" prop="giveRemark" label="领取状态"></el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 15, 20, 30]"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes,prev, pager, next"
          background
          style="float:right;padding-top:15px;"
        >
        </el-pagination>
      </el-col>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    sendRecordList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      sendCardList: [],
      listData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      isDetailShow: false
    }
  },
  created() {},
  methods: {
    handleSendCardDetail(row) {
      this.isDetailShow = true
      this.sendCardList = row
      this.getSendCardByPage()
    },
    getSendCardByPage() {
      this.listData = JSON.parse(JSON.stringify(this.sendCardList)).splice((this.pageIndex - 1) * this.pageSize, this.pageSize)
      this.total = this.sendCardList.length
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSendCardByPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getSendCardByPage()
    }
  }
}
</script>

<style lang="scss" scoped></style>
