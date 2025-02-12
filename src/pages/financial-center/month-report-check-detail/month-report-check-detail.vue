<template>
  <div class="child-page-container" v-if="detailData">
    <div class="header-data">
      <div class="data-title">{{ detailData.title }}</div>
      <div class="data-value">分润金额：{{ detailData.profitMoney }}</div>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="差异明细" name="1">
        <div style="margin-bottom: 12px;">
          <el-button type="primary" size="small" @click="addNewDiffItem">新增差异明细</el-button>
          <el-button type="warning" size="small" @click="confirmSaveNewDiffItem">保存差异明细</el-button>
        </div>
        <el-table v-loading="listLoading" :data="formatedDiffs" border>
          <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" label="日期">
            <template slot-scope="scope">
              <div v-if="!scope.row.editable">{{ scope.row.date }}</div>
              <el-date-picker v-model="scope.row.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" size="small" v-else> </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column align="center" label="差异金额">
            <template slot-scope="scope">
              <div v-if="!scope.row.editable">{{ scope.row.money }}</div>
              <el-input-number v-model="scope.row.money" :precision="2" :step="1" size="small" v-else></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注信息">
            <template slot-scope="scope">
              <div v-if="!scope.row.editable">{{ scope.row.remark }}</div>
              <el-input v-model="scope.row.remark" placeholder="请输入备注内容" size="small" v-else></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="每日详细" name="2">
        <el-table v-loading="listLoading" :data="detailData.payInforList" border>
          <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="date" label="日期" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="allTotalAmount" label="销售总额" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="profitMoney" label="分润金额" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script type="text/ecmascript-6">
import {getMonthReportDetail, updateMonthReportDiff} from '@/api/system'
export default {
  data () {
    return {
      activeNames: '1',
      detailData: null,
      listLoading: false,
      formatedDiffs: []
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const param = {
        _id: this.$route.params.reportId
      }
      getMonthReportDetail(param).then(ret => {
        this.detailData = ret.data
        this.formatedDiffs = ret.data.diffs.map(item => {
          return {
            ...item,
            editable: false
          }
        })
      })
    },
    confirmSaveNewDiffItem() {
      this.$confirm('是否确认差异明细修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          diffs: this.formatedDiffs.filter(item => {
            return !!(item.date && item.money !== 0)
          }),
          _id: this.$route.params.reportId
        }
        updateMonthReportDiff(param).then(() => {
          this.$message.success('修改成功')
          this.getDetail()
        })
      }).catch(() => {})
    },
    addNewDiffItem() {
      this.formatedDiffs.push({
        date: '',
        remark: '',
        money: 0,
        editable: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data-title {
  font-size: 22px;
  font-weight: bold;
}

.data-value {
  color: #409eff;
  margin: 10px 0 18px;
}
</style>
