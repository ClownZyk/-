<template>
  <el-dialog :visible.sync="isShow" title="饮品原料产品选择" width="1000px" @closed="closed" :close-on-click-modal="false">
    <el-form size="mini" :model="filterParam" ref="filterParamRef" :inline="true">
      <el-form-item><el-input v-model.trim="filterParam.productName" placeholder="请输入原料名称检索" clearable></el-input></el-form-item>
      <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="cateProps" placeholder="请选择产品分类" clearable></el-cascader> </el-form-item>
      <el-form-item><el-button type="primary" @click="searchCondition">搜索</el-button></el-form-item>
    </el-form>
    <!-- 列表区域 -->
    <div class="table-list">
      <el-table size="mini" v-loading="tableLoading" :data="productList" border style="width: 100%">
        <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="160" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="产品条码" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="主单位" prop="unitName" min-width="150" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="stock" label="库存" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.stock }}({{ scope.row.unitName }})</div>
          </template>
        </el-table-column>
        <!--
          <el-table-column label="供货价" min-width="120" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.costPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
            </template>
          </el-table-column>
        -->
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="getRawCost(scope.row)">选择此原料产品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        size="mini"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top: 10px;text-align:right"
      >
      </el-pagination>
    </div>
    <div v-if="selectInfo.uniqueCode" class="select-info">
      <el-divider>选中原料信息</el-divider>
      <el-form size="mini" ref="selectInfoRef" :model="selectInfo" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称"> <el-input type="text" v-model.trim="selectInfo.name" placeholder="产品名称" disabled></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="成本价"> <el-input-number v-model="selectInfo.singalCost" :controls="false" :step="0.01" step-strictly :min="0" disabled style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`货损数量（${selectInfo.unitName}）`"> <el-input-number v-model="selectInfo.count" :controls="false" :step="0.01" step-strictly :min="0" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总成本价"> <el-input-number v-model="selectInfo.cost" :controls="false" :step="0.01" step-strictly :min="0" disabled style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注"> <el-input type="textarea" v-model="selectInfo.remark" :rows="2" placeholder="请输入原料报损备注"></el-input> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveSelectedInfo">确定并提交</el-button> </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { getDrinkRawProduct, GetAllCategory, getFoodDrinkCost } from '@/api/system'

export default {
  props: {
    isShowDrinkRawSelect: {
      type: Boolean,
      default: false
    },
    dateTime: {
      type: String,
      default: ''
    }
  },
  watch: {
    isShowDrinkRawSelect(val) {
      this.isShow = val
      if (!val) {
        this.selectInfo = {}
      }
    },
    'selectInfo.count'(val) {
      this.selectInfo.cost = Math.round(val * this.selectInfo.singalCost * 100) / 100
    }
  },
  data() {
    return {
      filterParam: {
        productName: '',
        categoryId: ''
      },
      categoryList: [],
      productList: [],
      selectInfo: {},
      tableLoading: false,
      isShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    this.getRawProductCategory()
    this.getRawList()
  },
  methods: {
    getRawProductCategory() {
      let params = {
        belongMenu: '/raw-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
      })
    },
    getRawList() {
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getDrinkRawProduct(params)
        .then(res => {
          this.tableLoading = false
          this.productList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    getRawCost(row) {
      let params = {
        uniqueCode: row.uniqueCode,
        cid: row.cid
      }
      getFoodDrinkCost(params)
        .then(res => {
          this.selectInfo = {
            uniqueCode: row.uniqueCode,
            name: row.productName,
            unitName: row.unitName,
            count: 0,
            singalCost: res.data,
            cost: res.data * this.selectInfo.count,
            remark: '',
            type: 2,
            date: this.dateTime.replace(/\//g, '')
          }
        })
        .catch(() => {
          this.selectInfo.singalCost = 0
          this.selectInfo.cost = 0
        })
    },
    saveSelectedInfo() {
      this.$emit('saveDrinkSelected', this.selectInfo)
      // this.closed()
    },
    searchCondition() {
      this.pageIndex = 1
      this.getRawList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getRawList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRawList()
    },
    closed() {
      this.$emit('handleDrinkRawSelect', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
