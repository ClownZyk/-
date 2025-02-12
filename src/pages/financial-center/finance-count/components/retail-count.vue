<template>
  <div class="contain-mianer">
    <div class="list-search">
      <div class="home-t">
        <el-form class="filter" ref="form" :model="searchForm" label-width="80px" :inline="true">
          <div class="filter-top">
            <el-form-item> <el-switch v-model="searchForm.isFixedSearch" active-color="#409EFF" inactive-color="#409EFF" active-text="固定时间检索" inactive-text="自定义时间检索"> </el-switch> </el-form-item>
          </div>
          <div class="filter-bottom">
            <div class="filter-bottom-left">
              <div v-if="searchForm.isFixedSearch">
                <el-form-item> <el-button :class="[searchForm.stage === 1 ? 'active' : '']" type="primary" @click="handleFixedSearchCondition(1)">本日</el-button> </el-form-item>
                <el-form-item> <el-button :class="[searchForm.stage === 3 ? 'active' : '']" type="primary" @click="handleFixedSearchCondition(3)">本周</el-button> </el-form-item>
                <el-form-item> <el-button :class="[searchForm.stage === 2 ? 'active' : '']" type="primary" @click="handleFixedSearchCondition(2)">本月</el-button> </el-form-item>
              </div>
              <div v-if="!searchForm.isFixedSearch">
                <el-form-item>
                  <!-- <el-date-picker v-model="searchForm.time" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker> -->
                  <el-date-picker
                    v-model="searchForm.time"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <el-form-item> <el-cascader :options="categoryList" v-model="searchForm.categoryId" :props="{ emitPath: false, checkStrictly: true }" clearable></el-cascader> </el-form-item>
              <el-form-item> <el-input placeholder="请输入商品名称" v-model="searchForm.name" clearable></el-input> </el-form-item>
              <el-form-item> <el-button type="primary" @click="searchCondition()">搜索</el-button> </el-form-item>
            </div>
            <div class="filter-bottom-right">
              <el-form-item> <el-button type="primary" :disabled="contentList.length <= 0" @click="_export">导出</el-button> </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="home-count">
      <div class="home-count-item">
        <div class="conut-l-title"><div>总销售额</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.yzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总成本</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.gzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>总利润</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.lzTotal.toFixed(2) }}</div>
        </div>
      </div>
      <div class="home-count-item">
        <div class="conut-l-title"><div>客单价</div></div>
        <div class="count-l-total">
          <i class="iconfont icon-jinqian"></i>
          <div class="count-value">{{ price.guestPrice ? parseFloat(price.guestPrice).toFixed(2) : '0.00' }}</div>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="home-b">
      <el-table class="home-b-main" :data="contentList" border tooltip-effect="dark" :element-loading-text="text" v-loading="listLoading">
        <el-table-column prop="xl" label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column prop="firstCategoryName" label="一级分类" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="secCategoryName" label="二级分类" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="420" show-overflow-tooltip></el-table-column>
        <el-table-column prop="skuName" label="产品规格" width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.skuName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="barCode" label="产品条码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="count" label="销售数量" align="center" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="retailTotal" label="销售总额/元" align="center" min-width="140"></el-table-column>
        <el-table-column prop="costTotal" label="销售成本总额/元" align="center" min-width="140"></el-table-column>
        <el-table-column prop="profit" label="销售利润/元" sortable align="center" min-width="140"></el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" v-show="this.contentList.length !== 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          background
          style="float:right;margin-top: 10px;"
        ></el-pagination>
      </el-col>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { DataStatistics, GetAllCategory, DataExportExcel } from '@/api/system'
export default {
  data() {
    return {
      price: {
        yzTotal: 0,
        gzTotal: 0,
        lzTotal: 0
      },
      categoryList: [],
      searchForm: {
        isFixedSearch: true,
        name: '',
        categoryId: '',
        time: [],
        stage: 1 // 0输入日期查询,1当天,2当月,3当周
      },
      text: '数据加载中',
      pageSize: 15,
      pageIndex: 1,
      total: 0,
      listLoading: false,
      contentList: [],
      exportList: []
    }
  },
  filters: {
    formatPrice(price) {
      return price && price.toFixed(2)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.GetAllCategory()
      this._cardList()
    },
    // 加载商品分类
    GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(
        res => {
          this.categoryList = res.data
          this.categoryList.unshift({
            value: '',
            label: '所有产品'
          })
        }
      )
    },
    _export() {
      let params = {
        sTime: this.searchForm.time && this.searchForm.time.length > 0 ? this.searchForm.time[0] + '~' + this.searchForm.time[1] : '',
        stage: this.searchForm.stage,
        category: this.searchForm.categoryId,
        productName: this.searchForm.name,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      DataExportExcel(params).then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '零售产品销售数据统计.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
      }
      )
    },
    _cardList() {
      let params = {
        sTime: this.searchForm.time && this.searchForm.time.length > 0 ? this.searchForm.time[0] + '~' + this.searchForm.time[1] : '',
        stage: this.searchForm.stage,
        category: this.searchForm.categoryId,
        productName: this.searchForm.name,
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
      DataStatistics(params).then(res => {
        this.listLoading = false
        this.contentList = res.data
        this.exportList = res.data
        this.total = res.total
        this.price = res
      }
      )
    },
    handleFixedSearchCondition(stage) {
      this.pageIndex = 1
      this.searchForm.stage = stage
      this.searchForm.time = []
      this._cardList()
    },
    searchCondition() {
       this.pageIndex = 1
      if (!this.searchForm.isFixedSearch) {
        this.searchForm.stage = 0
      }
      this._cardList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._cardList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this._cardList()
    }
  }
}
</script>

<style lang="scss" scoped>
.contain-mianer {
  margin-top: 10px;
}
.filter {
  .filter-bottom {
    display: flex;
    justify-content: space-between;
    .filter-bottom-left {
      display: flex;
    }
  }
}
.active {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.home-count {
  width: 100%;
  padding-bottom: 10px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  .home-count-item {
    flex: 0 0 24.5%;
    background-color: #ffffff;
    box-shadow: 0 0 10px #eee;
    padding: 10px;
    max-height: 112.81px;
    .conut-l-title {
      color: #aaaaaa;
      font-size: 14px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
    }
    .count-l-total {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      display: -webkit-flex;
      align-items: baseline;
      border-bottom: 1px solid #e6e5e5;
      div.count-value {
        font-size: 26px;
        font-weight: bold;
        color: #2c2c2c;
      }
      .iconfont {
        margin-right: 10px;
      }
    }
    .count-l-bottom {
      padding: 10px 0;
      font-size: 14px;
      color: #434343;
      border-top: 1px solid #e6e5e5;
    }
    .two-total {
      position: relative;
      .total-count {
        font-weight: normal;
        font-size: 14px;
        position: absolute;
        right: 0;
      }
    }
  }
}
.toolbar {
  position: relative;
  .total {
    position: absolute;
    bottom: 0;
    span {
      margin-right: 15px;
    }
  }
}
</style>
