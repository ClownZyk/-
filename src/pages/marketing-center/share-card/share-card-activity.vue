<template>
  <div class="share-container">
    <div v-if="containerIsShow">
      <el-form class="filter" :model="searchForm" inline>
        <div class="filter-left">
          <el-form-item> <el-input type="text" v-model="searchForm.title" placeholder="请输入活动名称检索" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item> <el-button type="primary" @click="addShareActivity">活动添加</el-button> </el-form-item>
        </div>
      </el-form>
      <div class="table-list">
        <el-table v-loading="listLoading" :data="activityList" border>
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column label="活动名称" prop="title" min-width="220" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动时间" min-width="280" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.startTime }} - {{ scope.row.endTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="活动状态" min-width="160" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isOpen" @change="updateState(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="goToDetail(scope.row)">详情</el-button>
              <el-button size="mini" type="danger" @click="removeActivity(scope.row)">删除</el-button>
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
          style="text-align: right;margin-top: 15px"
        >
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getShareCardActivity, shareCardActivityOpertaion } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'share-card') {
        this.getShareActivity()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        title: ''
      },
      activityList: [],
      operateAction: 1,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      containerIsShow: true
    }
  },
  mounted() {
    this.getShareActivity()
  },
  methods: {
    getShareActivity() {
      let params = {
        ...this.searchForm,
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
      getShareCardActivity(params)
        .then(res => {
          this.listLoading = false
          this.activityList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    updateState(row) {
      this.operateAction = 1
      this.activityOperation(row)
    },
    removeActivity(row) {
      this.operateAction = 2
      this.$confirm('确定删除此卡券分享活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.activityOperation(row)
        })
        .catch(() => {})
    },
    activityOperation(row) {
      let params = {
        dto: { ...row },
        action: this.operateAction
      }
      shareCardActivityOpertaion(params).then(res => {
        this.$message.success(res.msg)
        this.getShareActivity()
      })
    },
    addShareActivity() {
      this.$router.push('/share-card-detail')
    },
    goToDetail(row) {
      this.$router.push({
        path: '/share-card-detail',
        query: {
          id: row._id
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getShareActivity()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShareActivity()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShareActivity()
    }
  }
}
</script>

<style lang="scss" scoped>
.share-container {
  padding: 20px;
  .filter {
    display: flex;
    justify-content: space-between;
  }
}
</style>
