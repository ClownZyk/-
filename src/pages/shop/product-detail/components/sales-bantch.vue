<template>
  <div class="list-container">
    <!-- 搜索部分 -->
    <div class="contain-mianer">
      <el-table class="home-b-main" :data="batchList" border v-loading="listLoading" size="mini">
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column prop="batchNo" label="批次号" align="center" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signForTime" label="上架时间" align="center" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productionDate" label="生产日期" align="center" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.productionDate }}
          </template>
        </el-table-column>
        <el-table-column prop="expirationTime" label="保质期" align="center" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.expirationTime }}
          </template>
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
        <el-table-column align="center" label="操作" width="500" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleDateUpdate(scope.row)">日期调整</el-button>
            <el-button type="warning" size="mini" @click="setTemPrice(scope.row)"> 设置临期价</el-button>
            <el-button type="primary" size="mini" @click="operateFunc(scope.row)">销量纪录</el-button>
            <el-button type="warning" size="mini" @click="toLoss(scope.row)">报损</el-button>
            <el-button type="primary" size="mini" @click="getLossList(scope.row)">报损纪录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" v-if="total !== 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="batchSearch.pageIndex"
          :page-size="batchSearch.pageSize"
          :page-sizes="[10, 15, 20, 25]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;margin-top: 10px;"
        ></el-pagination>
      </el-col>
    </div>
    <!-- 生产日期，保质期修改 -->
    <el-dialog title="日期调整" :visible.sync="isDateShow" width="400px" :close-on-click-modal="false">
      <el-form ref="dateInfoRef" :model="dateInfo" :rules="dateInfoRules" label-position="top">
        <el-form-item label="生产日期" prop="productionDate">
          <el-date-picker v-model="dateInfo.productionDate" type="date" placeholder="选择生产日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" style="width:100%"> </el-date-picker>
        </el-form-item>
        <el-form-item label="保质期" prop="expirationTime">
          <el-date-picker v-model="dateInfo.expirationTime" type="date" placeholder="选择保质期" format="yyyy/MM/dd" value-format="yyyy/MM/dd" style="width:100%"> </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isDateShow = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitDateInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- // 销售记录 -->
    <el-dialog title="销量纪录" :visible.sync="bantchDialog" width="800px" :close-on-click-modal="false">
      <div class="bantch-list">
        <div class="bantch-item" v-for="(item, index) in selectRow.record" :key="index">
          <div class="bantch-day">第{{ item.day }}天</div>
          <div>{{ item.count }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 报损纪录 -->
    <el-dialog title="报损纪录" :visible.sync="lossListDialog" width="500px" :close-on-click-modal="false">
      <div>
        <el-table :data="selectRow.scrapRecord" border>
          <el-table-column min-width="120" prop="oScrap" label="报损数量" align="center"></el-table-column>
          <el-table-column min-width="160" prop="scrapTime" label="报损日期" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- // 临期设置 -->
    <el-dialog title="临期设置" :visible.sync="temPriceDailog" width="800px" :close-on-click-modal="false">
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
import { GetBatchListByPage, BatchHandle, BatchScrap, BatchTimeScrapOperation } from '@/api/system'
import Filter from '@/components/js/Filters'
export default {
  mixins: [Filter],
  data() {
    return {
      bantchDialog: false,
      lossListDialog: false,
      uniqueCode: this.$route.query.uniqueCode,
      search: {},
      listLoading: false,
      total: 0,
      costList: [],
      batchSearch: {
        pageSize: 15,
        pageIndex: 1
      },
      selectRow: {},
      temPriceDailog: false,
      batchList: [],
      bantchCondition: {
        price: null
      },
      dateInfo: {
        productionDate: '',
        expirationTime: ''
      },
      isDateShow: false,
      submitLoading: false,
      dateInfoRules: {
        productionDate: [{ required: true, message: '请选择生产日期', trigger: 'change' }],
        expirationTime: [{ required: true, message: '请选择保质期', trigger: 'change' }]
      }
    }
  },
  watch: {
    isDateShow(val) {
      if (!val) {
        this.dateInfo = {
          productionDate: '',
          expirationTime: ''
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.batchSearch.pageSize = val
      this.ViewSalesbatch()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.batchSearch.pageIndex = val
      this.ViewSalesbatch()
    },
    operateFunc(row) {
      this.bantchDialog = true
      this.selectRow = row
    },
    // 产品批次列表
    ViewSalesbatch(row) {
      this.selectsku = row
      let parmas = {
        uniqueCode: this.uniqueCode,
        pageSize: this.batchSearch.pageSize,
        pageIndex: this.batchSearch.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      this.loading = true
      this.batchList = []
      GetBatchListByPage(parmas).then(
        res => {
          if (res.success) {
            this.loading = false
            this.batchDialog = true
            this.batchList = res.data.map(item => {
              return {
                ...item,
                productionDate: item.productionDate ? item.productionDate.split(' ')[0] : '--',
                expirationTime: item.expirationTime ? item.expirationTime.split(' ')[0] : '--'
              }
            })
            this.total = res.total
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 多个sku产品打开弹框
    setTemPrice(row) {
      this.selectRow = row
      this.temPriceDailog = true
    },
    toLoss(row) {
      this.$confirm('确认将该批次报损么', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          uniqueCode: this.uniqueCode,
          batchNo: row.batchNo,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$route.query.cid
        }
        BatchScrap(parmas).then(
          res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.ViewSalesbatch()
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      })
    },
    getLossList(row) {
      this.lossListDialog = true
      this.selectRow = row
      // console.log(this.selectRow)
    },
    // 设置临期价
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
          cid: this.$route.query.cid
        }
        BatchHandle(parmas).then(
          res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.temPriceDailog = false
              this.ViewSalesbatch()
            } else {
              this.$message.error(res.msg)
            }
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      })
    },
    // 批次产品设置特殊产品处理（已弃用）
    bantchConfirm(row) {
      this.$confirm('仅可修改一次，确认编辑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          price: row.promotionBarcode.price,
          uniqueCode: this.uniqueCode,
          batchNo: row.batchNo,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$route.query.cid
        }
        BatchHandle(parmas).then(
          res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.ViewSalesbatch()
            } else {
              this.$message.error(res.msg)
            }
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      })
    },
    handleDateUpdate(row) {
      this.isDateShow = true
      this.$nextTick(() => {
        let { batchNo, productionDate, expirationTime } = row
        this.dateInfo = {
          uniqueCode: this.$route.query.uniqueCode,
          batchNo,
          productionDate,
          expirationTime
        }
      })
    },
    // 修改生产日期和保质期信息
    submitDateInfo() {
      this.$refs['dateInfoRef'].validate(valid => {
        if (valid) {
          let params = {
            ...this.dateInfo,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$route.query.cid
          }
          this.submitLoading = true
          BatchTimeScrapOperation(params)
            .then(res => {
              this.submitLoading = false
              this.isDateShow = false
              this.$message.success(res.msg)
              this.ViewSalesbatch()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    }
  },
  mounted() {
    this.ViewSalesbatch()
  }
}
</script>

<style scoped lang="scss">
.contain-mianer {
  position: relative;
  z-index: 1;
}
.bantch-main {
  margin-top: 15px;
  .bantch-msg {
    display: flex;
    display: -webkit-flex;
    div {
      font-size: 15px;
      margin-right: 16px;
    }
  }
  .bantch-form {
    margin-top: 8px;
  }
}

.bantch-list {
  display: flex;
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
  .bantch-item {
    border: 1px solid #ebeef5;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
    .bantch-day {
      font-weight: bold;
      background-color: #f5f7fa;
    }
    :first-child {
      border-bottom: 1px solid #ebeef5;
    }
  }
}
.temPrice_item {
  display: flex;
  display: -webkit-flex;
  .temPrice_input {
    width: 160px;
    margin-right: 15px;
  }
}
</style>
