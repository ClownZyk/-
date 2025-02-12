<template>
  <div class="page-container">
    <div v-if="parentContainerShow">
      <el-form class="filters" inline>
        <el-form-item> <el-button type="primary" size="medium" @click="goBuildLuckPan">新增大转盘活动</el-button> </el-form-item>
      </el-form>
      <el-table v-loading="isTableLoading" :data="dataList" style="width: 100%" border>
        <el-table-column prop="title" label="活动名称" width="180" align="center"> </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" width="180" align="center"> </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180" align="center"> </el-table-column>
        <el-table-column label="每人抽奖次数" width="180" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.attend ? scope.row.attend + '次' : '无限制' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖品信息" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.jiangPin" :key="item.id">
              <span>{{ item.jiangPinLevel }}</span> <span>（{{ item.jiangPinName }}）</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="小程序地址" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-copy="'../../pages-market/pages/lucky-draw/lucky-draw?zhuanPanId=' + scope.row._id">复制链接</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="onEditBtnClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filterParams.pageIndex"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="filterParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :total="listTotal"
        ></el-pagination>
      </el-col>
    </div>
    <router-view v-else></router-view>
  </div>
</template>
<script>
import { GetZhuanPanByPage } from '@/api/system'
export default {
  data() {
    return {
      parentContainerShow: true,
      listTotal: 0,
      filterParams: {
        pageIndex: 1,
        pageSize: 15,
        title: ''
      },
      isTableLoading: false,
      dataList: []
    }
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'lucky-pan') {
          this.getListData()
          this.parentContainerShow = true
        } else {
          this.parentContainerShow = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    getListData() {
      let param = {
        ...this.filterParams,
        IsAsc: this.IsAsc,
        IsPage: this.IsPage,
        IsOrder: this.IsOrder,
        Creater: this.$store.state.UserID,
        RoleId: this.$store.state.UserRole,
        Cid: this.$store.state._cid
      }
      this.isTableLoading = true
      GetZhuanPanByPage(param).then(res => {
        this.dataList = res.data
        this.listTotal = res.total
        this.isTableLoading = false
      })
    },
    goBuildLuckPan() {
      this.$router.push('/lucky-pan-build')
    },
    onEditBtnClick(item) {
      this.$router.push({
        path: '/lucky-pan-edit',
        query: {
          editId: item._id
        }
      })
    },
    handleSizeChange(pageSize) {
      this.filterParams.pageSize = pageSize
      this.getListData()
    },
    handleCurrentChange(pageIndex) {
      this.filterParams.pageIndex = pageIndex
      this.getListData()
    }
  }
}
</script>
