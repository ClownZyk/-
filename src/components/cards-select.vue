<template>
  <el-dialog :visible.sync="isShow" title="卡券选择器" width="1000px" @closed="closed" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form size="small" ref="cardSearchFormRef" :model="searchForm" :inline="true">
      <el-form-item label="卡券类型" prop="cardType">
        <el-select v-model="searchForm.type" placeholder="请选择卡券类型" style="width: 200px;" clearable>
          <el-option v-for="item in cardTypeList" :key="item.value" :value="item.value" :label="item.label">{{ item.label }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡券名称" prop="title"> <el-input v-model.trim="searchForm.title" width="160" placeholder="请输入卡券名称" clearable></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      <el-form-item> <el-button type="warning" @click="saveCardSelected">保存</el-button> </el-form-item>
    </el-form>
    <el-table size="small" ref="listTable" :data="cardList" border @selection-change="selectCardTableRow" row-key="_id" v-loading="listLoading" style="margin-bottom:10px;">
      <el-table-column align="center" type="selection" reserve-selection width="50"></el-table-column>
      <el-table-column align="center" label="编号" width="59" type="index"></el-table-column>
      <el-table-column align="center" prop="title" label="卡券名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="库存" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="useLimit" label="使用上限" width="120"></el-table-column>
      <el-table-column align="center" prop="getLimit" label="领取上限" width="120"></el-table-column>
      <el-table-column align="center" label="领取时间" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.startTime.split(' ')[0] }} - {{ scope.row.endTime.split(' ')[0] }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        background
        small
        style="float:right;margin-top:15px;"
      >
      </el-pagination>
    </el-col>
    <span slot="footer"> </span>
  </el-dialog>
</template>

<script>
import { getAllCards } from '@/api/system'

export default {
  props: {
    isShowCardSelect: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      searchForm: {
        type: null,
        title: ''
      },
      cardList: [],
      selectedCard: [],
      isShow: false,
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      cardTypeList: [{ value: 0, label: '兑换券' }, { value: 1, label: '代金券' }, { value: 2, label: '折扣券' }, { value: 3, label: '大小券' }]
    }
  },
  watch: {
    isShowCardSelect(newValue) {
      this.isShow = newValue
    }
  },
  mounted() {
    this.getAllCardList()
  },
  methods: {
    getAllCardList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        cid: this.$store.state._cid,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getAllCards(params).then(
        res => {
          this.listLoading = false
          this.cardList = res.data
          this.total = res.total
        },
        () => {
          this.listLoading = false
        }
      )
    },
    selectCardTableRow(val) {
      this.selectedCard = JSON.parse(JSON.stringify(val))
    },
    saveCardSelected() {
      if (this.selectedCard.length > 0) {
        this.$emit('savedCard', this.selectedCard, this.type)
        this.closed()
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    closed() {
      this.$emit('handleDialog', false, this.type)
      this.$refs['listTable'].clearSelection()
    },
    searchCondition() {
      this.pageIndex = 1
      this.getAllCardList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllCardList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllCardList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
