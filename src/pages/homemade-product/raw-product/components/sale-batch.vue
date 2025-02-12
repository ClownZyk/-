<template>
  <div class="table-list">
    <el-table v-loading="listLoading" :data="batchList" border size="mini">
      <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
      <el-table-column prop="batchNo" label="批次号" align="center" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="signForTime" label="上架时间" align="center" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="productionDate" label="生产日期" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.productionDate | filterTime }}</template>
      </el-table-column>
      <el-table-column prop="expirationTime" label="保质期" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.expirationTime | filterTime }}</template>
      </el-table-column>
      <el-table-column prop="totalCount" label="总库存" align="center" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sold" label="销量" align="center" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="surplus" label="余量" align="center" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="scrap" label="报损数量" align="center" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sold" label="临期码" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="!scope.row.promotionBarcode[0].batchBarCode">--</div>
          <div v-else v-for="(item, index) in scope.row.promotionBarcode" :key="index">{{ item.batchBarCode + (index + 1 !== scope.row.promotionBarcode.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sold" label="临期价" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="!scope.row.promotionBarcode[0].batchBarCode">--</div>
          <div v-else v-for="(item, index) in scope.row.promotionBarcode" :key="index">{{ item.price + (index + 1 !== scope.row.promotionBarcode.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="setTemPrice(scope.row)"> 设置临期价</el-button>
          <el-button type="warning" size="mini" @click="toLoss(scope.row)">报损</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :page-sizes="[10, 15, 20, 25]"
      :total="total"
      layout="total, sizes, prev, pager, next"
      background
      style="float:right;margin-top: 10px;"
    ></el-pagination>

    <!-- 临期设置 -->
    <el-dialog title="临期设置" :visible.sync="temPriceDailog" width="800px">
      <el-form>
        <div v-for="item in selectRow.promotionBarcode" :key="item.barcode" class="temPrice_item">
          <el-form-item label="型号"> <el-input class="temPrice_input" disabled v-model="item.title"></el-input> </el-form-item>
          <el-form-item label="普通条码"> <el-input class="temPrice_input" disabled v-model="item.barcode"></el-input> </el-form-item>
          <el-form-item label="临期码"> <el-input class="temPrice_input" disabled v-model="item.batchBarCode"></el-input> </el-form-item>
          <el-form-item label="临期价"> <el-input-number class="temPrice_input" controls-position="right" :precision="2" v-model="item.price" label="临期价"></el-input-number> </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="temPriceDailog = false">取 消</el-button>
        <el-button type="primary" @click="editBatch">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHomemadeBatchList, homemadeBatchOperation, homemadeBatchScrap } from '@/api/system.js'
import Filter from '@/components/js/Filters'

export default {
  mixins: [Filter],
  data() {
    return {
      batchList: [],
      selectRow: {},
      temPriceDailog: false,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      listLoading: false
    }
  },
  created() {
    this.getSalesBatch()
  },
  methods: {
    // 获取产品销售批次
    getSalesBatch() {
      let parmas = {
        uniqueCode: this.$route.query.uniqueCode,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getHomemadeBatchList(parmas).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.batchList = res.data
            this.total = res.total
          }
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 设置临期价
    setTemPrice(row) {
      this.selectRow = row
      this.temPriceDailog = true
    },
    editBatch() {
      this.$confirm('确认编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          uniqueCode: this.uniqueCode,
          batchNo: this.selectRow.batchNo,
          promotionBarcode: this.selectRow.promotionBarcode.map(item => {
            return {
              barcode: item.barcode,
              price: item.price
            }
          }),
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        homemadeBatchOperation(parmas).then(
          res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.temPriceDailog = false
              this.getSalesBatch()
            }
          },
          err => {
            console.log(err.msg)
          }
        )
      })
    },
    // 报损
    toLoss(row) {
      this.$confirm('确认将该批次报损么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parmas = {
            uniqueCode: this.uniqueCode,
            batchNo: row.batchNo,
            creater: this.$store.state.UserID,
            roleid: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          homemadeBatchScrap(parmas).then(
            res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.getSalesBatch()
              }
            },
            err => {
              console.log(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSalesBatch()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getSalesBatch()
    }
  }
}
</script>

<style lang="scss" scoped>
.temPrice_item {
  display: flex;
  display: -webkit-flex;
  .temPrice_input {
    width: 160px;
    margin-right: 15px;
  }
}
</style>
