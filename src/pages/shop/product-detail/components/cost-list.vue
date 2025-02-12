<template>
  <div class="list-container">
    <!--搜索部分-->
    <div class="contain-mianer">
      <!-- <div class="list-search">
        <div class="home-t">
          <el-form ref="form" :model="search" label-width="80px" :inline="true">
            <el-form-item>
              <el-input v-model="search.name" width="160" placeholder="请输入检索内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchCondition">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
      <!--表格-->
      <div class="home-b">
        <el-table class="home-b-main" :data="costList" border v-loading="listLoading" size="mini">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column prop="barcode" label="产品条形码"  align="center" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="costPrice" label="成本价" align="center" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.costPrice && scope.row.costPrice.toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="indate" label="入库日期" align="center" min-width="180" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, prev, pager, next"
                         background
                         style="float:right;margin-top: 15px;"></el-pagination>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
  import {ProductCostGetListByPage} from '@/api/system'
  export default {
    data() {
      return {
        search: {},
        listLoading: false,
        pageIndex: 1,
        pageSize: 10,
        total: 2,
        costList: []
      }
    },
    methods: {
      init () {
        let params = {
          _id: this.$route.query.id,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$route.query.cid
        }
        this.listLoading = true
        ProductCostGetListByPage(params).then(res => { // List内容列表
          if (res.success) {
            this.costList = res.data
            this.total = res.total
            this.listLoading = false
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 搜索
      searchCondition: function() { this.init() },
      handleSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.init()
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped lang="scss">
  .contain-mianer{
    position: relative;
    z-index: 1;
  }
</style>
