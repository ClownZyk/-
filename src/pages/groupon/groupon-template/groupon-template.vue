<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div>
          <el-form-item label="团购名称"> <el-input v-model="filterParam.activityName" placeholder="输入团购名称检索" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="warning" @click="handleGrouponAdd">新增团购模板</el-button> </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table v-loading="listLoading" :data="grouponList" border>
          <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="activityName" label="团购名称" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productName" label="团购商品" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleGrouponEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleGrouponDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getGrouponTemplateList, grouponTemplateOperation} from '@/api/system'

export default {
  watch: {
    '$route' (to, from) {
      if (to.name === 'groupon-template') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      filterParam: {
        activityName: ''
      },
      grouponList: [],
      operateAction: 0,
      checkedDatas: [],
      listLoading: false,
      containerIsShow: true,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage () {
      let params = {
        activityName: this.filterParam.activityName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getGrouponTemplateList(params).then(res => {
        this.listLoading = false
        this.grouponList = res.data
        this.total = res.total
      }, () => {
        this.listLoading = false
      })
    },
    handleGrouponAdd() {
      this.$router.push('/groupon-template-detail')
    },
    handleGrouponEdit(row) {
      this.operateAction = 1
      this.$router.push({path: '/groupon-template-detail', query: {id: row._id}})
    },
    handleGrouponDelete(row) {
      this.operateAction = 2
      this.$confirm('确定删除此拼团信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.handleGrouponOeration(row)
      }).catch(() => {})
    },
    handleGrouponOeration(row) {
      let params = {
        Dto: Object.assign({}, row),
        Action: this.operateAction
      }
      grouponTemplateOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
