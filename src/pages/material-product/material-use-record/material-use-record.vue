<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div>
          <el-form-item> <el-input v-model="filterParam.orderId" placeholder="请输入订单号检索" clearable @keyup.enter.native="getMaterialProductUseRecord('refresh')"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getMaterialProductUseRecord('refresh')">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="warning" @click="handleMaterialUseAdd">耗材领用记录添加</el-button> </el-form-item>
        </div>
      </el-form>
      <el-table v-loading="listLoading" :data="useRecordList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="订单号" prop="orderId" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="领用人姓名" prop="userName" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="领用人电话" prop="userPhone" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="领用耗材产品" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.useProducts" :key="index">{{ item.productName }} x {{ item.count + (index + 1 !== scope.row.useProducts.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="warning" @click="handleMaterialUseEdit(scope.row)">修改</el-button> -->
            <el-button size="mini" type="danger" @click="handleMaterialUseDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getMaterialProductUseRecord, materialProductUseRecordOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'material-use-record') {
        this.getMaterialProductUseRecord()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        orderId: ''
      },
      useRecordList: [],
      listLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getMaterialProductUseRecord()
  },
  methods: {
    getMaterialProductUseRecord(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getMaterialProductUseRecord(params)
        .then(res => {
          this.listLoading = false
          this.useRecordList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleMaterialUseAdd() {
      this.$router.push('/material-use-record-detail')
    },
    handleMaterialUseEdit(row) {
      this.$router.push({ path: '/material-use-record-detail', query: { id: row._id } })
    },
    handleMaterialUseDelete(row) {
      this.$confirm('确认删除此用户领用耗材产品记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          materialProductUseRecordOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getMaterialProductUseRecord()
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
</style>
