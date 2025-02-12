<template>
<div>
  <div class="vote-list-container" v-if="containerIsShow">
    <div class="vote-list" >
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item  label="">
            <el-input v-model="search.activityName" placeholder="请输入美食名称" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="_option(0, undefined)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="prodName" label="美食名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="美食条形码" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.msku.length === 0 ? '无' : scope.row.msku[0].barCode}}</template>
          </el-table-column>
           <el-table-column align="center" prop="costPrice" label="成本价" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.msku.length === 0 ? '0' : scope.row.msku[0].costPrice}}</template>
          </el-table-column>
          <el-table-column align="center" prop="price" label="原价" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.msku.length === 0 ? '0' : scope.row.msku[0].price}}</template>
          </el-table-column>
          <el-table-column align="center" prop="vipPrice" label="会员价" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.msku.length === 0 ? '0' : scope.row.msku[0].vipPrice}}</template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="240" fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="_option(4, scope.row._id)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>
              <el-button type="primary" size="mini" @click="_option(1, scope.row._id)">编辑</el-button>
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
    </div>
  </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from '@/components/my-upload'
  import {GetMealsProduct, MProdOperation} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        containerIsShow: true,
        Action: 0, // 编辑
        Dto: {},
        Txt: '',
        formRules: {
          // name: [
          //   { required: true, message: '请填写套餐名称', trigger: 'blur' }
          // ],
          // oriprice: [
          //   { required: true, message: '请填写套餐原价', trigger: 'blur' }
          // ],
          // nowprice: [
          //   { required: true, message: '请填写套餐现价', trigger: 'blur' }
          // ]
        },
        search: { // 查询条件
          activityName: ''
        },
        list: [], // 列表
        listLoading: false, // 控制loading是否显示
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      _option(action, id) {
        this.$router.push({
          path: '/meal-list-detail',
          query: {
            id: id,
            action: action
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
          // console.log(dto)
          let params = {
            dto: dto,
            action: action
          }
          MProdOperation(params).then(res => {
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
      // 套餐列表
      async GetListByPage () {
        let params = {
          name: this.search.activityName,
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
        await GetMealsProduct(params).then(res => {
          if (res.success) {
            this.listLoading = false
            this.list = res.data
            this.total = res.total
          } else this.$message.error(res.msg)
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    },
    watch: {
      $route(to, from) {
          if (to.name === 'meal-list') {
            this.GetListByPage()
            this.containerIsShow = true
          } else {
            this.containerIsShow = false
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
  .vote-list{
    padding: 15px;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background-color: #ffffff;
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
