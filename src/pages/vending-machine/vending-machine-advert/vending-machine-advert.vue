<template>
  <div>
    <div v-if="containerIsShow">
      <el-form>
        <el-form-item> <el-button type="warning" @click="addAdvert">新增广告</el-button> </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="advertList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="广告名称" prop="name" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="商业类型" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.businessType === 1" style="color:#67C23A">公益</div>
            <div v-else-if="scope.row.businessType === 2" style="color:#E6A23C">商业</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="updateAdvert(scope.row)">修改</el-button>
            <el-button size="mini" type="success" @click="machineBindAdvert(scope.row)">设备关联</el-button>
            <el-button size="mini" type="danger" @click="deleteAdvert(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getVendingMachineAdvert, deleteVendingMachineAdvert } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'vending-machine-advert') {
        this.getVendingMachineAdvert()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      advertList: [],
      listLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getVendingMachineAdvert()
  },
  methods: {
    getVendingMachineAdvert() {
      let params = {
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.listLoading = true
      getVendingMachineAdvert(params)
        .then(res => {
          this.listLoading = false
          this.advertList = res.data.listData || []
          this.total = res.listData.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    addAdvert() {
      this.$router.push('/vending-machine-advert-detail')
    },
    updateAdvert(row) {
      this.$router.push({ path: '/vending-machine-advert-detail', query: { id: row.id } })
    },
    machineBindAdvert(row) {
      this.$router.push({ path: '/machine-advert-bind', query: { id: row.id } })
    },
    deleteAdvert(row) {
      this.$confirm('此操作将永久删除该广告信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteVendingMachineAdvert({ id: row.id }).then(res => {
            this.$message.success(res.msg)
            this.getVendingMachineAdvert()
          })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getVendingMachineAdvert()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getVendingMachineAdvert()
    }
  }
}
</script>

<style lang="scss" scoped></style>
