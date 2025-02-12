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
    <el-table class="table-main" ref="listTable" :data="listTable" border>
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
            @click="_clickImg, img = scope.row.faceImage.url"
            v-if="scope.row.faceImage"
            :style="{'backgroundImage': 'url('+scope.row.faceImage.url+')'}"
          ></div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="faceAge"
        label="年龄"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="faceName"
        label="姓名"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.faceName || '暂无'}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="faceSex"
        label="性别"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="faceCount"
        label="采集次数"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="首次采集时间"
        min-width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作"
        min-width="140"
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
    <div></div>
  </div>
</template>

<script>
import { GetFaceLibrary } from '@/api/system'
import { formatDate } from '@/components/js/data'
export default {
  data() {
    return {
      listTable: [],
      timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      pageSize: 10,
      pageIndex: 1,
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    _clickImg(e) {
      console.log(e)
    },
    search() {
      this.pageIndex = 1
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
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
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetFaceLibrary(params).then(res => {
        if (res.success) {
          this.listTable = res.data
          this.total = res.total
        } else this.$message.success(res.msg)
      })
    },
    _detail(id) {
      if (id === null) {
      } else {
        this.$router.push({
          path: '/scrm-detail',
          query: {
            id: id
          }
        })
      }
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
.imgBigger {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
