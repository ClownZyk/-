<template>
  <div class="card-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="赠送详情" name="1"> <send-detail></send-detail> </el-tab-pane>
      <el-tab-pane label="赠送记录" name="2">
        <send-list :sendRecordList="sendRecordList">
          <el-col :span="24">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 15, 20, 30]"
              :current-page="filterParam.pageIndex"
              :page-size="filterParam.pageSize"
              :total="total"
              layout="total, sizes,prev, pager, next"
              background
              style="float:right;padding-top:15px;"
            >
            </el-pagination>
          </el-col>
        </send-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import sendDetail from './components/send-detail'
import sendList from './components/send-list'
import { getAllGiveCardsRecords } from '@/api/system'
export default {
  data() {
    return {
      activeName: '1',
      sendRecordList: [],
      total: 0,
      filterParam: {
        pageIndex: 1,
        pageSize: 10,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
    }
  },
  components: {
    sendDetail,
    sendList
  },
  methods: {
    handleClick() {
      if (this.activeName === '2') {
        this.getSendRecordList()
      }
    },
    getSendRecordList() {
      let params = {
        phone: '',
        cardId: '',
        ...this.filterParam
      }
      getAllGiveCardsRecords(params)
        .then(res => {
          if (res.success) {
            this.sendRecordList = res.data
            this.total = res.total
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    handleSizeChange(val) {
      this.filterParam.pageSize = val
      this.getSendRecordList()
    },
    handleCurrentChange(val) {
      this.filterParam.pageIndex = val
      this.getSendRecordList()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 15px 20px;
}
</style>
