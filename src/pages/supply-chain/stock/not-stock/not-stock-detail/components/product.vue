<template>
  <div class="product-container">
    <div class="product">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item> <el-input v-model="search.barCode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="GetListByPage">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button :loading="quickSubmitLoading" type="warning" @click="handleQuickWarehouseing" v-show="orderInfo.status === 5">一键入库</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="productName" label="产品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="产品条码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costPrice" label="供货价" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- 总库有供货的产品总库供货价会显示 -->
              <div>{{ scope.row.costPrice }}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalCount" label="供货数量" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="getwState" label="入库状态" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.getwState" style="color: #13CE66;">已入库</div>
              <div v-else style="color: #909399;">未入库</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="fpStatues" label="分配状态" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.fpStatues" style="color: #13CE66;">已分配</div>
              <div v-else style="color: #909399;">未分配</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="230" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)" :disabled="scope.row.getwState">点击入库</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          >
          </el-pagination>
        </el-col> -->
      </div>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="1000px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <div>
            <el-form-item label="产品条形码" prop="barCode"> <el-input v-model="form.barCode" disabled></el-input> </el-form-item>
            <el-form-item label="是否临期提醒" prop="remind"> <el-switch v-model="form.remind" active-color="#13ce66" inactive-color="#ff4949"></el-switch> </el-form-item>
          </div>
          <el-form-item label="产品名称" prop="productName"> <el-input v-model="form.productName" disabled></el-input> </el-form-item>
          <el-form-item label="总库供货价" prop="costPrice"> <el-input-number controls-position="right" v-model="form.costPrice" disabled></el-input-number> </el-form-item>
          <el-form-item label="总供货数量" prop="totalCount"> <el-input-number controls-position="right" v-model="form.totalCount" disabled></el-input-number> </el-form-item>
          <!-- 只有V6向V8下的采购单可能会填写 -->
          <!-- <div class="all-stock-box" v-if="$route.query.orderType === 1"> -->
          <div class="all-stock-box">
            <div class="all-stock-box-tip">总库供货信息</div>
            <div style="margin-top:10px">
              <el-form-item label="供货数量" prop="myDetil.count"> <el-input-number controls-position="right" v-model="form.myDetil.count" disabled></el-input-number> </el-form-item>
              <el-form-item label="已入库数量" prop="myDetil.inCount"> <el-input-number controls-position="right" v-model="form.myDetil.inCount" disabled></el-input-number> </el-form-item>
              <el-form-item label="未入库数量"> <el-input-number controls-position="right" :value="form.myDetil.count - form.myDetil.inCount" disabled></el-input-number> </el-form-item>
              <el-form-item label="本次入库数量" prop="myDetil.thisCount">
                <el-input-number controls-position="right" v-model="form.myDetil.thisCount" :min="0" :max="form.myDetil.count - form.myDetil.inCount" :disabled="form.myDetil.disableIncount"></el-input-number>
              </el-form-item>
              <el-form-item label="生产日期" prop="myDetil.datetime"> <el-date-picker v-model="form.myDetil.datetime" format="yyyy/MM/dd" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"></el-date-picker> </el-form-item>
              <el-form-item label="备注" prop="myDetil.remark"> <el-input placeholder="备注" v-model="form.myDetil.remark"></el-input> </el-form-item>
            </div>
          </div>
          <div class="all-stock-box">
            <div class="all-stock-box-tip">供应商供货信息</div>
            <el-table class="table-supplier" ref="tableSupplier" :data="form.productDetil.supid ? [form.productDetil] : []" border size="mini">
              <el-table-column align="center" prop="supName" label="供应商" min-width="230" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ '云极云仓' + (scope.row.code || '') }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="costPrice" label="供货价" width="100" show-overflow-tooltip> </el-table-column>
              <el-table-column align="center" prop="count" label="供货数量" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="inCount" label="已入库数量" width="100" show-overflow-tooltip> </el-table-column>
              <el-table-column align="center" label="未入库数量" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.count - scope.row.inCount }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="thisCount" label="本次入库数量" width="150">
                <template slot-scope="scope">
                  <el-input-number controls-position="right" placeholder="本次入库数量" size="mini" v-model="scope.row.thisCount" :disabled="scope.row.disableIncount"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="datetime" label="生产日期" width="180">
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.datetime" type="date" size="mini" placeholder="选择日期" format="yyyy/MM/dd" value-format="yyyy/MM/dd"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="remark" label="备注" width="180">
                <template slot-scope="scope">
                  <el-input placeholder="备注" size="mini" v-model="scope.row.remark"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled">提交 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getGoodsForV6ByOrderNum} from '@/api/systemForV8'
import {formatDate} from '@/components/js/data'
import {EnterRecordOperation, EnterRecordOperationSup, totalWarehouseQuick} from '@/api/system'
export default {
  name: 'product',
  data() {
    return {
      // 查询条件
      search: {
        barCode: ''
      },
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {
        productDetil: {},
        myDetil: {
          datetime: formatDate(new Date(), 'yyyy/MM/dd')
        }
      },
      orderInfo: {},
      formRules: {
        barCode: [{
          required: true,
          message: '请输入条形码',
          trigger: 'blur'
        }],
        productName: [{
          required: true,
          message: '产品信息不能为空',
          trigger: 'change'
        }]
      },
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      operateTitle: '',
      // 多选删除的数据列表
      checkedDatas: [],
      quickSubmitLoading: false,
      commonParam: {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
    }
  },
  methods: {
    // 一键入库
    handleQuickWarehouseing() {
       this.$confirm('确定一键入库该采购单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = this.list.map(item => {
            return {
              ...item,
              myDetil: {
                ...item.myDetil,
                thisCount: item.myDetil.count - item.myDetil.inCount,
                datetime: item.myDetil.supid ? formatDate(new Date(), 'yyyy/MM/dd') : item.myDetil.datetime
              },
              productDetil: {
                ...item.productDetil,
                thisCount: item.productDetil.count - item.productDetil.inCount,
                datetime: item.productDetil.supid ? formatDate(new Date(), 'yyyy/MM/dd') : item.productDetil.datetime
              },
              detailedid: this.$route.query.id,
              oddNumbers: this.$route.query.oddNumbers,
              procureType: this.orderInfo.procureType,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
          })
          this.quickSubmitLoading = true
          // 自营采购  一键入库
          totalWarehouseQuick({supplierGoodsDto: params}).then(res => {
            this.quickSubmitLoading = false
            this.$message.success(res.msg)
            this.GetListByPage()
            this.closed()
          }).catch(() => {
            this.quickSubmitLoading = false
          })
        }).catch(() => {})
    },
    // 提交form
    formSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认入库吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.$route.query.id || !this.$route.query.oddNumbers) {
              this.$message({
                message: '无关联采购单',
                type: 'warning'
              })
              return false
            }
            this.form.detailedid = this.$route.query.id
            this.form.oddNumbers = this.$route.query.oddNumbers
            this.form.procureType = this.orderInfo.procureType
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.submitLoading = true
            if (this.$route.query.orderType === 2) {
              // 供应商采购  入库
              this.operateAxiosForSupplier(this.form)
            } else {
              // 自营采购  入库
              this.operateAxios(this.form)
            }
          })
        }
      })
    },
    // 关闭form
    closed() {
      this.formV = false
      this.submitLoading = false
      this.formDisabled = false
      this.form = {
        productDetil: {},
        myDetil: {}
      }
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 增删改查
    operateFunc(row, title, action) {
      this.operateTitle = title
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          if (!row.fpStatues) {
            this.$message({
              message: '该产品未分配供货信息，暂时不能入库！',
              type: 'warning'
            })
            return false
          }
          row.remind = false
          let item = {
            ...row,
            myDetil: {
              ...row.myDetil,
              thisCount: row.myDetil.count - row.myDetil.inCount,
              datetime: row.myDetil.supid ? formatDate(new Date(), 'yyyy/MM/dd') : row.myDetil.datetime
            },
            productDetil: {
              ...row.productDetil,
              thisCount: row.productDetil.count - row.productDetil.inCount,
              datetime: formatDate(new Date(), 'yyyy/MM/dd')
            }
          }
          this.form = JSON.parse(JSON.stringify(item))
          this.formV = true
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.formDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          break
        default:
          return false
      }
    },
    // 操作的后台请求- 供应商采购调用
    operateAxiosForSupplier(item) {
      let params = JSON.parse(JSON.stringify(item))
      // console.log(params)
      EnterRecordOperationSup(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
        this.closed()
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 操作的后台请求
    operateAxios(item) {
      let params = JSON.parse(JSON.stringify(item))
      // console.log(params)
      EnterRecordOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
        this.closed()
      }).catch(() => {
        this.submitLoading = false
      })
    },
    // 选中行
    selectTableRow(row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage() {
      let params = {
        oddNumbers: this.$route.query.oddNumbers,
        ...this.commonParam
      }
      this.listLoading = true
      await getGoodsForV6ByOrderNum(params).then(res => {
        this.listLoading = false
        this.orderInfo = res.data.orderInfo
        this.list = res.data.orderProductInfo
        this.total = res.total
      }, () => {
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .filters-left {
    .filters-search {
      display: inline-block;
      width: 200px;
    }
  }

  .el-form-item {
    margin-bottom: 0;
  }
}

.list-table {
  color: #666666;
  padding: 20px 0;

  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}

.form {
  .item-long {
    width: 492px;
  }

  .el-input-number,
  .el-date-editor {
    width: 202px;
  }

  .all-stock-box {
    border-top: 1px solid #e6e6e6;
    // border-bottom: 1px solid #e6e6e6;
    padding-top: 32px;
    margin-bottom: 15px;
    position: relative;

    .all-stock-box-tip {
      position: absolute;
      left: 0;
      top: 5px;
      font-weight: bolder;
      font-size: 18px;
    }
  }
}

.table-supplier {
  margin-top: 10px;
  .el-input-number {
    width: 110px;
  }

  .el-date-editor.el-input {
    width: 140px;
  }
}
</style>
