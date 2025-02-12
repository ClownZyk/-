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
      <!-- <el-form-item> <el-button type="primary" @click="save">保存</el-button> </el-form-item> -->
    </el-form>
    <!-- @selection-change="selectTableRow" -->
    <!-- :row-key="getRowKeys" -->
    <el-table class="table-main" ref="listTable" :data="productList" border tooltip-effect="dark" highlight-current-row @current-change="selectTableRow" v-loading="listLoading">
      <!-- <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column> -->
      <el-table-column align="center" prop="title" label="卡券标题" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="subTitle" label="副标题" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quantity" label="库存" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.createTime.split(' ')[0] }}</template>
      </el-table-column>
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
import {GiftCardList, GetAllCardList} from '@/api/system'
import {formatDate} from '@/components/js/data'
export default {
  name: 'exchangeCardSelect',
  props: {
    isShowCardSelect: Boolean,
    searchCondition: {
      type: Object,
      default() {
        return {
          startTime: formatDate(new Date(), 'yyyy/MM/dd'),
          endTime: formatDate(new Date(), 'yyyy/MM/dd')
        }
      }
    },
    selectedList: Array
  },
  watch: {
    isShowCardSelect: function (newValue, oldValue) {
      this.isShow = newValue
    },
    // 监听已选中的数组，如果有新的过来，更新回显已勾选的数据
    // selectedList: {
    //   handler: function (newValue, oldValue) {
    //     this.returnViewSelected(newValue)
    //   },
    //   deep: true
    // },
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
      pageSize: 10,
      // 新的已选中数据
      newSelectedList: []
    }
  },
  methods: {
    // 回显已勾选数据对钩
    returnViewSelected (newValue) {
      this.$nextTick(() => {
        newValue.forEach(v => {
          this.productList.forEach(y => {
            if (v.cardId === y.cardId) {
              if (this.$refs !== undefined) {
                this.$refs.listTable.toggleRowSelection(y, true)
              }
            }
          })
        })
      })
    },
    // 保存选中数据
    // save () {
    //   let that = this
    //   if (that.newSelectedList.length > 0) {
    //     that.$confirm('确认保存已选中的数据吗？', '提示', {}).then(() => {
    //       that.$emit('saveSelected', that.newSelectedList)
    //     })
    //   } else {
    //     that.$message({
    //       message: '至少选中一条数据',
    //       type: 'warning'
    //     })
    //   }
    // },
    // 关闭弹窗
    closed () {
      // this.handleCurrentChange(1)
      // this.$refs.listTable.clearSelection()
      this.$emit('handleCardSelect', false)
    },
    getRowKeys (row) {
      return row.cardId
    },
    // 选中数据
    selectTableRow (row) {
      // this.newSelectedList = row
      let that = this
      if (row) {
        that.$confirm('确认选择 (' + row.title + ') 吗？', '提示', {}).then(() => {
          this.$emit('saveSelected', row)
          that.closed()
        }, () => {
          this.$refs.listTable.setCurrentRow()
        })
      }
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
        title: this.search.title,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        // startTime: this.searchCondition.startTime,
        // endTime: this.searchCondition.endTime,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      let _baseUrl = this.searchCondition ? GetAllCardList : GiftCardList
      await _baseUrl(params).then(res => {
        this.listLoading = false
        this.productList = res.data
        this.total = res.total
        // if (Object.keys(this.$refs).length > 0) {
        //   this.returnViewSelected(this.selectedList)
        // }
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
