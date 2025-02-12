<template>
  <el-dialog width="1200px" title="基础产品库" top="5vh" :visible.sync="visible" append-to-body @close="visible = false" :close-on-click-modal="false">
    <el-alert title="基础产品库选择注意事项" type="warning" show-icon :closable="false">
      <div>合集产品是指该系列不同口味的产品，若存在合集产品，优先选择合集产品上架</div>
      <div>如基础产品库中不存在v6产品库中的产品，请将该产品作为 ‘新品’ 进行申请，第三方审核通过后再进行产品绑定</div>
    </el-alert>
    <el-form style="margin-top: 12px;" :inline="true" @submit.native.prevent="onSearch">
      <el-form-item label="产品名称">
        <el-input v-model="filterParam.name" placeholder="请输入产品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="产品条码">
        <el-input v-model="filterParam.barCode" placeholder="请输入产品条码" clearable></el-input>
      </el-form-item>
      <el-button type="primary" native-type="submit" icon="el-icon-search">查询</el-button>
    </el-form>
    <el-table v-loading="tableLoading" :data="dataList" border :max-height="500">
      <el-table-column align="center" label="产品图片" width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image v-if="scope.row.imgUrl" style="width: 35px; height: 35px" :src="scope.row.imgUrl" fit="fill"></el-image>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="产品名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="产品类型" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.collType === 1" style="color:#909399">单品</div>
          <div v-else-if="scope.row.collType === 2" style="color:#E6A23C">合集</div>
          <div></div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="itemCode" label="产品编码" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="qrCodes" label="产品条码" min-width="160" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="selectTableRow(scope.row)">选择此产品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParam.pageIndex"
        :page-size="pageParam.pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="listTotal"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>
<script>
import { getJTBaseProduct } from '@/api/system'
export default {
  data() {
    return {
      visible: false,
      filterParam: {
        name: '',
        barCode: ''
      },
      pageParam: {
        pageSize: 10,
        pageIndex: 1
      },
      dataList: [],
      listTotal: 0,
      tableLoading: false
    }
  },
  methods: {
    show(refresh = false) {
      this.visible = true
      if (refresh) {
        this.reset()
      }
      if (this.dataList.length === 0) {
        this.getDataList()
      }
    },
    onSearch() {
      this.pageParam.pageIndex = 1
      this.getDataList()
    },
    getDataList() {
      let params = {
        ...this.filterParam,
        ...this.pageParam,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getJTBaseProduct(params)
        .then(res => {
          this.tableLoading = false
          this.dataList = res.data.listData
          this.listTotal = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    reset() {
      this.filterParam = {
        name: '',
        barCode: ''
      }
      this.pageParam = {
        pageSize: 10,
        pageIndex: 1
      }
      this.dataList = []
    },
    handleSizeChange(val) {
      this.pageParam.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.pageParam.pageIndex = val
      this.getDataList()
    },
    selectTableRow(row) {
      this.$emit('select', row)
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss"></style>
