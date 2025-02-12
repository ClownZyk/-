<template>
  <div class="contains">
    <router-view/>
    <div class="contain-mianer">
      <div class="list-search">
        <div class="home-t">
          <el-form ref="form" :model="search" label-width="80px" :inline="true">
            <el-form-item>
              <el-input v-model="search.name" width="160" placeholder="请输入检索内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchCondition">搜索</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
              <el-button type="primary"  @click="_add('', 0)">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--表格-->
      <div class="home-b">
        <el-table class="home-b-main"
                  :data="contentList"
                  border
                  tooltip-effect="dark"
                  v-loading="listLoading">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column prop="title" label="标题" width="420"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="subTitle" label="活动类型" width="120" align="center" show-overflow-tooltip>
             <template slot-scope="scope">购买首单累计</template>
          </el-table-column>
          <el-table-column prop="buyNumber" label="周期首单数" align="center" min-width="140"></el-table-column>
          <el-table-column prop="buyMoney" label="首单满足金额" align="center" min-width="140"></el-table-column>
          <el-table-column label="开始时间" align="center" min-width="140">
            <template slot-scope="scope">{{scope.row.activeStart | formatTime}}</template>
          </el-table-column>
          <el-table-column label="结束时间" align="center" min-width="140">
            <template slot-scope="scope">{{scope.row.activeEnd | formatTime}}</template>
          </el-table-column>
          <el-table-column prop="useLimit" label="是否使用" align="center" min-width="140">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.activestate" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" min-width="140">
            <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="200" fixed="right">
            <template slot-scope="scope">
              <!--<el-button size="mini" type="warning" @click="detailClick(scope.row._id, '修改')">查看</el-button>-->
              <el-button size="mini" type="primary" @click="_add(scope.row._id, 1)">编辑</el-button>
              <el-button size="mini" type="danger" @click="_delete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar" v-show="this.total !== 0">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         :total="total"
                         layout="total, prev, pager, next"
                         background
                         style="float:right;margin-top: 10px;"></el-pagination>
        </el-col>
      </div>
      <!--弹框-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {BuyActivityList, GetBuyActOption} from '@/api/system'
  export default {
    data() {
      return {
        search: {},
        pageSize: 15,
        pageIndex: 1,
        total: 0,
        listLoading: false,
        contentList: []
      }
    },
    filters: {
      formatTime(time) {
        return time && time.split(' ')[0]
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this._cardList()
      },
      _cardList() {
        let params = {
          title: '',
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
        BuyActivityList(params).then(res => {
            if (res.success) {
              this.listLoading = false
              this.contentList = res.data
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
      },
      // 搜索
      searchCondition() {},
      _add(id, action) {
        this.$router.push({
          path: '/remark-detail',
          query: {
            id: id,
            action: action
          }
        })
      },
      _delete(row) {
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          let params = {
            dto: row,
            action: 2
          }
          GetBuyActOption(params).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this._cardList()
              } else this.$message.error(res.msg)
            }, err => {
              this.$message.error(err.msg)
            }
          )
        })
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
.contains{
  padding: 15px;
  .contain-mianer{
    position: fixed;
    z-index: 1;
    width: calc(100% - 240px);
    height: 100vh;
    overflow-y: scroll;
    padding: 0 20px 60px;
    background-color: #ffffff;
}
}
</style>
