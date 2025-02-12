<template>
  <div class="order">
    <router-view/>
    <div class="main">
      <el-form ref="form" inline :model="form" label-width="80px">
        <el-form-item label="">
          <el-input v-model="form.id" placeholder="请输入检索内容"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="warning" @click="_option({}, 0)">新增</el-button>
      </el-form>
      <el-table :data="tableData3" border class="order-table">
        <el-table-column label="编号" type="index" :align="align" width="80"></el-table-column>
        <el-table-column prop="payment" label="最低消费金额" :align="align" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="integrals" label="可抵用积分" :align="align" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="订单时间" :align="align" width="130">
          <template slot-scope="scope">
            {{scope.row.createTime.split(' ')[0]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="_option(scope.row, 1)">编辑</el-button>
            <el-button size="mini" type="danger" @click="CMSContent(scope.row, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData3.length !== 0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
        layout="total, prev, pager, next"
        :total="total"
        style="float:right;"></el-pagination>
      <el-dialog title="积分使用规则" :visible.sync="dialogFormVisible">
        <el-form :model="dialog" class="msg-dialog">
          <div class="mag-dialog-row">
            <el-form-item>
              <div class="form-item-title">最低消费金额<span class="border"></span> <span class="EnName">MONEY</span></div>
              <el-input-number :min="0" v-model="dialog.payment" controls-position="right"></el-input-number>
            </el-form-item>
            <el-form-item  prop="phone">
              <div class="form-item-title">可抵用积分<span class="border"></span> <span class="EnName">INTERGRAL</span></div>
              <el-input-number :min="0" v-model="dialog.integrals" controls-position="right"></el-input-number>
            </el-form-item>
            <!--<el-form-item prop="birthday">-->
              <!--<div class="form-item-title">生日<span class="border"></span> <span class="EnName">BIRTH</span></div>-->
              <!--<el-date-picker  style="width: 100%;" v-model="dialog.birthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>-->
            <!--</el-form-item>-->
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="CMSContent(dialog, null, '')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // OrderBatchExcel, PrintOrder, OrderExport OrderBatchExcel
  import { GetIntegralRule, IntergralOption } from '@/api/system'
  export default {
    name: 'orders-list',
    data() {
      return {
        align: 'center',
        form: {},
        dialog: {},
        total: 0,
        tableData3: [],
        pageIndex: 1,
        pageSize: 10,
        option: null,
        txt: '',
        dialogFormVisible: false
      }
    },
    methods: {
      search: function() { this.init() }, // 搜索
      init: function() {
        let parmas = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        GetIntegralRule(parmas).then(res => {
          if (res.success) {
            this.tableData3 = res.data
            this.total = res.total
          } else this.$message.err(res.msg)
        }, err => { this.$message.err(err.msg) })
      },
      _option(dto, option) {
        this.dialogFormVisible = true
        this.option = option
        if (option === 1) {
          this.dialog = dto
        }
      },
      CMSContent(dto, action) {
        let _dto = {
          payment: dto.payment,
          integrals: dto.integrals,
          _id: dto._id,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        let parmas = {
          dto: _dto,
          action: action === null ? this.option : 2
        }
        console.log(action)
        action !== null ? this.txt = '删除' : this.option === 0 ? this.txt = '新增' : this.txt = '修改'
          this.$confirm('是否' + this.txt + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            IntergralOption(parmas).then(res => {
              if (res.success) {
                this.dialogFormVisible = false
                this.$message.success(res.msg)
                this.init()
              } else this.$message.err(res.msg)
            }, err => { this.$message.err(err.msg) })
          }).catch(() => {})
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.init()
      }
    },
    mounted() {
      this.init()
    },
   watch: {
     dialogFormVisible: {
       handler(newName, oldName) {
         if (newName === false) {
           this.dialog = {}
         }
       }
     }
   }
  }
</script>

<style scoped lang="scss">
  .order{
    padding: 20px;
    /*position: fixed;*/
    /*width: calc(100% - 200px);*/
    /*.main{*/
      /*.order-table{*/
        /*margin: 10px 0;*/
      /*}*/
    /*}*/
  }
  .msg-dialog{
    .mag-dialog-row{
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      .el-form-item{
        flex: 0 0 33%;
        padding-right: 20px;
        &:nth-child(3n) {
          padding-right: 0;
          padding-left: 20px;
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
          }
        }
      }
    }

  }
</style>
