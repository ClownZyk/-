<template>
  <el-dialog :visible.sync="isShow" title="兑换券选择器" width="1000px" @closed="closed">
    <!-- 搜索部分 -->
    <el-form class="filters" ref="searchForm" :model="search" :inline="true">
      <div class="filters-left">
        <el-form-item>
          <el-input v-model="search.title" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          <el-button type="primary" @click="GetListByPage">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" @current-change="selectCurrentRow" v-loading="listLoading">
      <el-table-column align="center" prop="title" label="卡券标题" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="subTitle" label="副标题" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="库存" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="开始时间" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.startTime.split(' ')[0] }}</template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.endTime.split(' ')[0] }}</template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="160"></el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {GiftCardList} from '@/api/system'
// import {formatDate} from '@/components/js/data'
export default {
  name: 'exchangeCardSelect',
  props: {
    isShowCardSelect: Boolean,
    selectedList: Array
  },
  watch: {
    isShowCardSelect: function (newValue, oldValue) {
      this.isShow = newValue
    },
    searchCondition: {
      handler: function (newValue, oldValue) {
        if (newValue !== oldValue) {
        this.GetListByPage()
        }
      },
      deep: true
    }
  },
  data () {
    return {
      isShow: false,
      productList: [],
      listLoading: false,
      // 查询条件
      search: {
        // 名称
        title: ''
      },
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  methods: {
    selectCurrentRow (val) {
        this.$confirm('确认选择 (' + val.title + ') 吗？', '提示', {}).then(() => {
          this.$emit('saveSelected', val)
          this.closed()
        }, () => {
          this.$refs.listTable.setCurrentRow()
        })
    },
    // 关闭弹窗
    closed () {
      this.handleCurrentChange(1)
      this.$emit('handleCardSelect', false)
    },
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
        title: this.search.title,
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
      // let _baseUrl = this.searchCondition ? GetAllCardList : GiftCardList
      await GiftCardList(params).then(res => {
        this.listLoading = false
        this.productList = res.data
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
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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
</style>
