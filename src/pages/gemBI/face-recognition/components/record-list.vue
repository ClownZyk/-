<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="采集时间">
        <el-date-picker
          v-model="timeFrame"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="search">搜索</el-button>
    </el-form>
    <el-table class="table-main" ref="recordList" :data="recordList" border>
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="编号" width="80"></el-table-column>
      <el-table-column
        align="center"
        prop="productCode"
        label="画像"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div
            class="image-face"
            v-if="scope.row.faceImage"
            :style="{'backgroundImage': 'url('+scope.row.faceImage.url+')'}"
          ></div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="productCode"
        label="底图"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div
            class="image-face"
            v-if="scope.row.userimage"
            :style="{'backgroundImage': 'url('+scope.row.userimage.url+')'}"
          >
            <div class="image-bigger"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="similar"
        label="相似度"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="distinguish"
        label="来源"
        min-width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="时间"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作"
        min-width="160"
        show-overflow-tooltip
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.userId"
            type="warning"
            size="mini"
            @click="_detail(scope.row.userId)"
            style="background: #FFC835;border-color: #FFC835;"
          >查看用户详情</el-button>
          <el-button v-else type="info" size="mini">暂无用户信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      background
      v-show="total !== 0"
      style="float:right;margin-top: 10px;"
    ></el-pagination>
  </div>
</template>

<script>
import { GetFaceRecord } from '@/api/system'
import { formatDate } from '@/components/js/data'
export default {
  data() {
    return {
      recordList: [],
      pageSize: 10,
      pageIndex: 1,
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.init()
    },
    search() {
      this.pageIndex = 1
      this.init()
    },
    init() {
      let params = {
        seTime: `${this.timeFrame[0]}~${this.timeFrame[1]}`,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetFaceRecord(params).then(res => {
        if (res.success) {
          this.recordList = res.data
          this.total = res.total
        } else this.$message.success(res.msg)
      })
    },
    _detail(id) {
      this.$router.push({
        path: '/scrm-detail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.image-face {
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
}
</style>
