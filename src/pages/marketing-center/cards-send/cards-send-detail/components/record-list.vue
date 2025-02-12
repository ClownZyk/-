<template>
  <div class="record-container">
    <el-form ref="form" :model="recordForm" label-width="55px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="手机号"> <el-input v-model.trim="recordForm.userPhone" placeholder="请输入领取人手机号"></el-input> </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item> <el-button type="primary" @click="getRecordList">搜索</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 领取列表区域 -->
    <el-table :data="recordList" border style="width: 100%">
      <el-table-column align="center" type="index" label="编号" width="55"> </el-table-column>
      <el-table-column align="center" prop="userName" label="领取人姓名"> </el-table-column>
      <el-table-column align="center" prop="userPhone" label="领取人手机号"> </el-table-column>
      <el-table-column align="center" prop="activityName" label="卡券名称"> </el-table-column>
      <el-table-column align="center" prop="createTime" label="订单时间"> </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total" background></el-pagination>
  </div>
</template>

<script>
import { GetWelfareRecordByPage } from '@/api/system'
export default {
  name: 'recordList',
  data() {
    return {
      recordForm: {
        userPhone: ''
      },
      recordList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getRecordList()
  },
  methods: {
    async getRecordList() {
      let params = {
        activityId: this.$route.query.id || '',
        userPhone: this.recordForm.userPhone,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isAsc: true,
        isOrder: true,
        isPage: true,
        welfareType: this.$route.query.welfareType || 0,
        giveType: this.$route.query.giveType || 0,
        userId: this.$store.state.UserID,
        cid: this.$store.state._cid,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
      }
      const data = await GetWelfareRecordByPage(params)
      // console.log(data)
      this.recordList = data.data
      this.total = data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getRecordList()
    },
    handleCurrentChange(newPage) {
      this.pageIndex = newPage
      this.getRecordList()
    }
  }
}
</script>

<style lang="scss" scoped>
.record-container {
  .el-pagination {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
