<template>
  <div class="in-stock-container">
    <div class="in-stock">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.barCode" placeholder="请输入产品条形码检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-input v-model="search.oddNumbers" placeholder="请输入采购单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="oddNumbers" label="采购单号" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barcode" label="产品条形码" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="180" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="supName" label="供应商" min-width="160" show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="costPrice" label="供货价" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="enterCount" label="本次入库数量" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="notEnterCount" label="未入库数量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="totalCount" label="总供货量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="入库时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="160" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="1000px" @closed="closed">
        <el-form :model="form" label-width="100px" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="采购单号" prop="oddNumbers">
            <el-input v-model="form.oddNumbers" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品条形码" prop="barcode">
            <el-input v-model="form.barcode" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="supName">
            <el-input v-model="form.supName" disabled></el-input>
          </el-form-item>
          <el-form-item label="供货价" prop="costPrice">
            <el-input v-model="form.costPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库时间" prop="createTime">
            <el-input v-model="form.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="本次入库数量" prop="enterCount">
            <el-input v-model="form.enterCount" disabled></el-input>
          </el-form-item>
          <el-form-item label="未入库数量" prop="notEnterCount">
            <el-input v-model="form.notEnterCount" disabled></el-input>
          </el-form-item>
          <el-form-item label="总供货量" prop="totalCount">
            <el-input v-model="form.totalCount" disabled></el-input>
          </el-form-item>
          <div>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="4" v-model="form.remark" class="item-long" disabled></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetGetwStateTrueByPage} from '@/api/system'
export default {
  name: 'supply-in-stock',
  data () {
    return {
      // 查询条件
      search: {
        barCode: '',
        oddNumbers: ''
      },
      formDisabled: false,
      formV: false,
      form: {},
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 关闭form
    closed () {
      this.formV = false
      this.formDisabled = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 查
    operateFunc (row) {
      this.formDisabled = true
      this.formV = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        barCode: this.search.barCode,
        oddNumbers: this.search.oddNumbers,
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
      await GetGetwStateTrueByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
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
  .in-stock-container {
    padding: 20px;
  }
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
    .el-date-editor {
      width: 202px;
    }
  }
</style>
