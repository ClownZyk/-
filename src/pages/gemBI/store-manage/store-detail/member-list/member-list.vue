<template>
  <div class="member-list">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="`${$route.query.companyName}-会员消费统计信息`"> </el-page-header></div>
    <el-form class="filters" :model="searchForm" :inline="true">
      <div>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.filterTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="_getMemberList">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="primary" @click="_export" :disabled="!listData.length">导出</el-button> </el-form-item>
      </div>
    </el-form>
    <!-- 数据统计列表区 -->
    <el-table :data="listData" style="width: 100%" :default-sort="{ prop: 'payTotal', order: 'descending' }" border>
      <el-table-column align="center" type="index" label="编号" width="80"> </el-table-column>
      <el-table-column align="center" prop="realName" label="会员姓名" width="220" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" prop="sex" label="性别" width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.sex | sexType }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="phone" label="手机号" width="180"> </el-table-column>
      <el-table-column align="center" prop="count" label="订单数" sortable width="165"> </el-table-column>
      <el-table-column align="center" prop="payTotal" label="消费额" sortable width="165"> </el-table-column>
      <el-table-column align="center" prop="memberDiscountTotal" label="会员优惠额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="promotionTotal" label="组合活动优惠额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="onePromotionTotal" label="单品活动优惠额" sortable width="180"> </el-table-column>
      <el-table-column align="center" prop="cardTotal" label="卡券优惠额" sortable width="180"> </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top: 15px;text-align: right;"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getWeekStartDateAndEndDateRange, getMonthStartDateAndDateRange, getDataString } from '@/filters/filters'
import { getUserConsumeStatistics, userConsumeStatisticsExportExcel } from '@/api/system'
export default {
  data() {
    return {
      searchForm: {
        filterTime: [getDataString(new Date(), 'yyyy-MM-dd 00:00:00'), getDataString(new Date(), 'yyyy-MM-dd 23:59:59')]
      },
      listData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              let time = getWeekStartDateAndEndDateRange()
              picker.$emit('pick', time)
            }
          },
          {
            text: '本月',
            onClick(picker) {
              let time = getMonthStartDateAndDateRange()
              picker.$emit('pick', time)
            }
          }
        ]
      },
      pageSize: 10,
      pageIndex: 1,
      total: 0
    }
  },
  created() {
    this._getMemberList()
  },
  methods: {
    _getMemberList() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$route.query.cid,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getUserConsumeStatistics(params)
        .then(res => {
          if (res.success) {
            this.listData = res.data
            this.total = res.total
          }
        })
        .catch(() => {})
    },
    _export() {
      let time = this.searchForm.filterTime && this.searchForm.filterTime.length > 0 ? this.searchForm.filterTime[0] + '~' + this.searchForm.filterTime[1] : ''
      let params = {
        sTime: time,
        stage: 0,
        queryCid: this.$route.query.cid,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      userConsumeStatisticsExportExcel(params)
        .then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '用户消费数据统计.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._getMemberList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this._getMemberList()
    }
  },
  filters: {
    sexType(val) {
      switch (val) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_element-reset.scss';

.member-list {
  height: 100vh;
  .filters {
    display: flex;
    justify-content: space-between;
  }
  /deep/ .el-table__body-wrapper {
    td {
      border-bottom: 1px solid #ebeef5;
      padding: 12px 0;
    }

    th.is-leaf {
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
