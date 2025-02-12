<template>
  <div class="vote-list-container">
    <div class="vote-list" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item  label="">
            <el-input v-model="search.activityName" placeholder="请输入美食名称" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="_option(0, '', 'first')">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="typeName" label="美食类别" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="singleTime" label="排单时间" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="singleName" label="排单人姓名" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="130" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="440" fixed="right">
            <template slot-scope="scope">
              <!--<el-button type="warning" size="mini" @click="_option(4, scope.row_id)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>-->
              <el-button type="primary" size="mini" @click="_option(1, scope.row._id, 'first')">修改排单</el-button>
              <el-button type="primary" size="mini" @click="_option(1, scope.row._id, 'second')">修改产品</el-button>
              <el-button type="primary" size="mini" @click="_reqaireShow(scope.row)">菜单复用</el-button>
              <el-button type="danger" size="mini" @click="delectRow(scope.row, 2, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 25]"
                         :total="total"
                         v-show="list.length !== 0"
                         layout="total, sizes, prev, pager, next"
                         background
                         style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <el-dialog
        title="菜单复用"
        :visible.sync="changeShow"
        width="600px">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="singleTime"
          class="form-item-placehoder"></el-date-picker>
        <span slot="footer" class="dialog-footer">
    <el-button @click="changeShow = false">取 消</el-button>
    <el-button type="primary" @click="_reqaire">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from '@/components/my-upload'
  import {formatDate} from '@/components/js/data'
  import {GetDailyArrange, DailyAryOperation, CopyCreate} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        containerIsShow: true,
        changeShow: false, // 菜单复用弹框
        // 查询条件
        search: {
          activityName: '',
          timeRange: []
        },
        Row: {},
        singleTime: formatDate(new Date(), 'yyyy-MM-dd'),
        // 列表
        list: [],
        // 控制loading是否显示
        listLoading: false,
        // 分页相关
        total: 0,
        Dto: {},
        pageIndex: 1,
        pageSize: 10
      }
    },
    filters: {
      formatTime(time) {
        return time && time.split(' ')[0]
      }
    },
    methods: {
      // 增改跳转
      _option(action, id, tab) {
        this.$router.push({
          path: tab === 'first' ? '/meal-day-detail' : '/meal-day-product-detail',
          query: {
              action: action,
              id: id,
              tab: tab
            }
        })
      },
      _reqaireShow(row) {
          this.changeShow = true
          this.Row = row
      },
      _reqaire() {
        let params = {
          arrangeid: this.Row._id,
          singleTime: this.singleTime,
          typeid: this.Row.typeid,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        CopyCreate(params).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.changeShow = false
            this.GetListByPage()
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      opreation(dto, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Action === 0 ? this.Txt = '新增' : this.Txt = '编辑'
            if (this.Action === 0) {
              dto.creater = this.$store.state.UserID
              dto.roleId = this.$store.state.UserRole
              dto.cid = this.$store.state._cid
            }
            this.edit(dto, this.Action, this.Txt)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 删除
      delectRow(dto, action, txt) {
        if (action === 1) {
          this.changeShow = true
          this.Dto = dto
          console.log(dto)
        } else {
          this.edit(dto, action, txt)
        }
      },
      // 编辑
      edit(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (action === 0) {
            this.Dto.singleTime = this.singleTime
          }
          let params = {
            dto: dto,
            action: action
          }
          // console.log(params)
          DailyAryOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.GetListByPage()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
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
      timeChange() {
          console.log(this.search.timeRange)
      },
      // 套餐列表
      async GetListByPage () {
        let params = {
          // sTime: this.search.timeRange[0] + '~' + this.search.timeRange[1],
          sTime: '2019-01-01~2030-01-01',
          typeid: '',
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
        await GetDailyArrange(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    },
    components: {
      myUpload
    },
    mounted() {
      this.GetListByPage()
    },
    watch: {
      $route(to, from) {
          if (to.name === 'meal-day-list') {
            this.GetListByPage()
            this.containerIsShow = true
          } else {
            this.containerIsShow = false
          }
        }
    }
  }
</script>

<style lang="scss" scoped>
  .vote-list{
    padding: 15px;
  }
  .vote-list-container {
    padding: 20px;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
  /*弹框*/
  /deep/.form{
    .form-row{
      display: flex;
      display: -webkit-flex;
      .el-form-item{
        flex: 0 0 33.33%;
        .el-form-item__content{
          margin-left: 0 !important;
        }
        .form-item-title {
          font-weight: bolder;
          font-size: 16px;
          position: relative;
          .border {
            width: 1px;
            height: 16px;
            position: absolute;
            background-color: #000000;
            display: inline-block;
            top: 10px;
            margin-left: 8px;
          }
          .EnName {
            font-weight: normal;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            margin-left: 17px;
            text-transform: uppercase;
          }
        }
        .form-input {
          width: 70%;
        }
      }
      .form-flex-all{
        flex: 0 0 100%;
        .form-input{
          width: 100%;
        }
      }
    }
  }
</style>
