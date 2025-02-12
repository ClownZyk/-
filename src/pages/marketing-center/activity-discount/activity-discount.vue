<template>
  <div class="vote-list-container">
    <div class="vote-list" >
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item  label="">
            <el-input v-model="search.activityName" placeholder="请输入套餐名称" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="opneEdilog({}, 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="title" label="套餐名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="originalPrice" label="原价" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="presentPrice" label="现价" min-width="350" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <!--<el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>-->
              <el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)">编辑</el-button>
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
      <!--弹框-->
      <el-dialog :visible.sync="isFormShow" width="600px" custom-class="form-dialog" title="优惠">
        <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm" class="form">
          <div class="form-row">
            <el-form-item  prop="name">
              <div class="form-item-title">活动标题<span class="border"></span> <span class="EnName">title</span></div>
              <el-input class="form-input" v-model="dialog.title"></el-input>
            </el-form-item>
            <el-form-item  prop="name">
              <div class="form-item-title">活动简介<span class="border"></span> <span class="EnName">title</span></div>
              <el-input class="form-input" v-model="dialog.summary"></el-input>
            </el-form-item>
            <el-form-item  prop="days">
              <div class="form-item-title">时限（天）<span class="border"></span> <span class="EnName">day</span></div>
              <el-input-number class="form-input" :min="0" controls-position="right" v-model="dialog.buytype"></el-input-number>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item  prop="oriprice">
              <div class="form-item-title">原价<span class="border"></span> <span class="EnName">oriprice</span></div>
              <el-input class="form-input" v-model="dialog.originalPrice"></el-input>
            </el-form-item>
            <el-form-item prop="nowprice">
              <div class="form-item-title">现价<span class="border"></span> <span class="EnName">nowprice</span></div>
              <el-input class="form-input" v-model="dialog.presentPrice"></el-input>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item>
              <div class="form-item-title">赠送天数<span class="border"></span> <span class="EnName">oriprice</span></div>
              <el-input-number class="form-input" v-model="dialog.giveDays"  :min="0" controls-position="right"></el-input-number>
            </el-form-item>
          </div>
          <div class="form-row" style="flex: 0 0 100%;">
            <el-form-item class="form-flex-all">
              <div class="form-item-title">备注<span class="border"></span> <span class="EnName">title</span></div>
              <el-input type="textarea" class="form-input" :rows="3"  v-model="dialog.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="isFormShow = false">返回</el-button>
          <el-button type="primary" @click="opreation(dialog, 'ruleForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {GetVIPListByPage, vipOption} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        isFormShow: false, // 弹框显示状态
        dialog: { // 弹框数据
          buyDays: 0,
          giveDays: 0
        },
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
        // 查询条件
        search: {
          // 活动名称
          activityName: ''
        },
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
      opneEdilog(dto, action) {
        this.isFormShow = true
        this.Action = action
        this.dialog = dto
      },
      opreation(dto, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.Action === 0 ? this.Txt = '新增' : this.Txt = '编辑'
            if (this.Action === 0) {
              // dto.createTime = new Date()
              // dto.deleteTime = new Date()
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
          vipOption(params).then(res => {
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
        await GetVIPListByPage(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
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
        flex: 0 0 50%;
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
