<template>
  <div class="vote-list-container">
    <div class="vote-list" v-if="containerIsShow">
      <!--搜索部分-->
      <!--<el-form class="filters" ref="searchForm" :model="search" :inline="true">-->
        <!--<div class="filters-left">-->
          <!--<el-form-item  label="">-->
            <!--<el-input v-model="search.activityName" placeholder="请输入" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>-->
            <!--<el-button type="primary" @click="GetListByPage">搜索</el-button>-->
          <!--</el-form-item>-->
        <!--</div>-->
      <!--</el-form>-->
      <div class="orders-count">
        <div>订单总额：200</div>
        <div>订单笔数：5</div>
        <div>客单价：400</div>
      </div>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" :data="lists" border tooltip-effect="dark" v-loading="listLoading">
          <!--<el-table-column align="center" type="selection" width="55"></el-table-column>-->
          <el-table-column align="center" prop="serial" label="订单号" width="120" type="index"></el-table-column>
          <el-table-column align="center" prop="serial" label="用户姓名" width="120" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="用户手机号" min-width="130"  show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="name" label="订单金额" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="pointTime" label="支付方式" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="qcTime" label="订单状态" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="_click(scope.row._id)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>
              <!--<el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)">编辑</el-button>-->
              <!--<el-button type="danger" size="mini" @click="delectRow(scope.row, 2, '删除')">删除</el-button>-->
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
    </div >
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from '@/components/my-upload'
  import {GetMealsType, TypeOperation} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        containerIsShow: true,
        timeRange: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        Action: 0, // 编辑
        Dto: {},
        Txt: '',
        // 查询条件
        search: {
          // 活动名称
          activityName: ''
        },
        lists: [
          {createTime: '2019/01/21 12:13:34', name: '300', pointTime: '现金支付', qcTime: '支付成功'}
        ],
        // 列表
        list: [],
        // 控制loading是否显示
        listLoading: false,
        // 分页相关
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      // 新增
      _click(id) {
        this.$router.push({
          path: '/orders-detail',
          query: {
            id: id
          }
        })
      },
      opreation(dto, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            dto.qcTime = this.timeRange[0] + '-' + this.timeRange[1]
            this.Action === 0 ? this.Txt = '新增' : this.Txt = '编辑'
            this.edit(dto, this.Action, this.Txt)
          } else {
            return false
          }
        })
      },
      // 删除
      delectRow(dto, action, txt) {
        this.edit(dto, action, txt)
      },
      // 编辑
      edit(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            dto: dto,
            action: action
          }
          TypeOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.isFormShow = false
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
      // 套餐列表
      async GetListByPage () {
        let params = {
          name: '',
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
        await GetMealsType(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    },
    watch: {
      '$route' (to, from) {
        console.log(to)
        if (to.name === '/daily-statement') {
          this.GetListByPage()
          this.containerIsShow = true
        } else {
          this.containerIsShow = false
        }
      },
      isFormShow: {
        handler(newName, oldName) {
          if (newName === false) {
            this.GetListByPage()
            this.timeRange = [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
            this.dialog = {
              sortNo: 99,
              display: true,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
          }
        }
      }
    },
    components: {
      myUpload
    },
    mounted() {
      this.GetListByPage()
    }
  }
</script>

<style lang="scss" scoped>
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
  .orders-count{
    display: flex;
    display: -webkit-flex;
    float: right;
    margin-bottom: 10px;
    div {
      margin-left: 15px;
      color: #409EFF;
      font-weight: bold;
    }
  }
</style>
