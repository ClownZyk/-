<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form class="filters" :model="filterParam" inline>
        <div>
          <el-form-item label="内容编码"><el-input type="text" v-model.trim="filterParam.onlyCode" placeholder="请输入内容编码检索"></el-input></el-form-item>
          <el-form-item> <el-button type="primary" @click="getAdvertTvList('refresh')">搜索</el-button> </el-form-item>
        </div>
        <div>
          <el-form-item> <el-button type="warning" @click="handleAdvertTvAdd">新增内容</el-button> </el-form-item>
        </div>
      </el-form>

      <el-table v-loading="listLoading" :data="advertTvList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="内容编码" prop="onlyCode" min-width="160" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="内容标题" prop="title" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="绑定电视编码" prop="tvCode" min-width="240" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.tvCode || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleAdvertTvEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleAdvertTvDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="text-align:right;margin-top:15px"
      >
      </el-pagination>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getAdvertTvList, advertTvOperation } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'advert-tv-list') {
        this.getAdvertTvList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      filterParam: {
        onlyCode: ''
      },
      advertTvList: [],
      listLoading: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getAdvertTvList()
  },
  methods: {
    getAdvertTvList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
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
      this.listLoading = true
      getAdvertTvList(params)
        .then(res => {
          this.listLoading = false
          this.advertTvList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleAdvertTvAdd() {
      this.$router.push('/advert-tv-detail')
    },
    handleAdvertTvEdit(row) {
      this.$router.push({ path: '/advert-tv-detail', query: { id: row._id } })
    },
    handleAdvertTvDelete(row) {
      this.$confirm('确定删除此电视广告内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          advertTvOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getAdvertTvList()
          })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAdvertTvList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAdvertTvList()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
</style>
