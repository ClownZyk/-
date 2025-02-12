<template>
  <div class="vote-list-container">
    <div class="vote-list" >
      <!--搜索部分-->
      <el-form class="filters" :inline="true">
        <!--<div class="filters-left">-->
          <!--<el-form-item  label="">-->
            <!--<el-input v-model="search.activityName" placeholder="请输入套餐名称" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>-->
            <!--<el-button type="primary" @click="GetListByPage">搜索</el-button>-->
          <!--</el-form-item>-->
        <!--</div>-->
        <el-form-item>
          <el-button type="primary" @click="opneEdilog({}, 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="ruleName" label="赠送内容" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="giveIntegral" label="赠送积分" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="开启状态" min-width="200" fixed="right">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isShow" @change="isChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <!--<el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>-->
              <el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)">编辑</el-button>
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
      <!--弹框-->
      <el-dialog :visible.sync="isFormShow" width="600px" custom-class="form-dialog" title="优惠">
        <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm" class="form">
          <div class="form-row">
            <el-form-item  prop="ruleType">
              <div class="form-item-title">赠送类型<span class="border"></span> <span class="EnName">type</span></div>
              <el-select v-model="dialog.ruleType" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="giveIntegral">
              <div class="form-item-title">赠送积分<span class="border"></span> <span class="EnName">intergral</span></div>
              <el-input-number class="form-input" :min="0" controls-position="right" v-model="dialog.giveIntegral"></el-input-number>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item>
              <div class="form-item-title">是否开启<span class="border"></span> <span class="EnName">state</span></div>
              <el-switch v-model="dialog.isShow" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
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
  import {GiveRuleType, GiveRuleQuery, GiveOperation} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        isFormShow: false, // 弹框显示状态
        dialog: { // 弹框数据
          isShow: true
        },
        Action: 0, // 编辑
        Dto: {},
        Txt: '',
        typeList: [],
        formRules: {
          ruleType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          giveIntegral: [
            { required: true, message: '请输入数字', trigger: 'blur' }
          ]
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
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.GetListByPage()
        this._type()
      },
     _type() {
       let params = {
         title: '',
         pageSize: this.pageSize,
         pageIndex: this.pageIndex,
         isPage: true,
         isOrder: true,
         isAsc: true,
         creater: localStorage.getItem('creater'),
         roleId: localStorage.getItem('roleId'),
         cid: localStorage.getItem('cid')
       }
       this.listLoading = true
       GiveRuleType(params).then(res => {
         this.listLoading = false
         this.typeList = res.data
       }, err => {
         console.log(err)
         this.listLoading = false
       })
     },
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
              dto.creater = localStorage.getItem('creater')
              dto.roleId = localStorage.getItem('roleId')
              dto.cid = localStorage.getItem('cid')
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
      isChange(dto) {
        console.log(dto.isShow)
        dto.creater = localStorage.getItem('creater')
        dto.roleId = localStorage.getItem('roleId')
        dto.cid = localStorage.getItem('cid')
        let params = {
          dto: dto,
          action: 1
        }
        GiveOperation(params).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 编辑
      edit(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(dto)
          let params = {
            dto: dto,
            action: action
          }
          console.log(params)
          GiveOperation(params).then(res => {
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
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        }
        this.listLoading = true
        await GiveRuleQuery(params).then(res => {
          this.listLoading = false
          this.list = res.data
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vote-list-container {
    padding: 20px;
  }
  .filters {
    display: flex;
   justify-content: flex-end;
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
