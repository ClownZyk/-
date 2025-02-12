<template>
  <div class="order">
    <div class="main-list" v-if="containerIsShow">
      <el-form ref="form" inline :model="form" label-width="80px">
        <el-form-item label="订单编号">
          <el-input v-model="form.id" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="form.payState"  placeholder="请选择支付状态" style="width: 150px;">
            <el-option v-for="item in stateList" :key="item.value" :value="item.id" :label="item.value">{{item.value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取餐状态">
          <el-select v-model="form.orderStatus"  placeholder="请选择取餐状态" style="width: 150px;">
            <el-option v-for="item in paystateList" :key="item.value" :value="item.id" :label="item.value">{{item.value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="买家电话" label-width="200"><el-input v-model="form.phone" placeholder="请输入买家电话" clearable></el-input></el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="timeFrame"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form>
      <el-table :data="tableData3" border class="order-table" @selection-change="selectTableRow">
        <el-table-column type="selection" width="55" :align="align"></el-table-column>
        <el-table-column label="编号" type="index" :align="align" width="80"></el-table-column>
        <el-table-column prop="orderid" label="订单编号" :align="align" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="买家姓名" :align="align" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column prop="userphone" label="手机号" :align="align" width="140"></el-table-column>
        <el-table-column prop="pdtstate" label="产品类型" min-width="120" :align="align"></el-table-column>
        <el-table-column prop="pdtname" label="产品名称" min-width="180" :align="align">
          <template slot-scope="scope"><div v-html="scope.row.pdtname"></div></template>
        </el-table-column>
        <el-table-column prop="pdtprice" label="产品价格"  min-width="80" :align="align" show-overflow-tooltip>
          <template slot-scope="scope"><div v-html="scope.row.pdtprice"></div></template>
        </el-table-column>
        <el-table-column prop="pdtcount" label="产品数量"  min-width="80" :align="align" show-overflow-tooltip>
          <template slot-scope="scope"><div v-html="scope.row.pdtcount"></div></template>
        </el-table-column>
        <el-table-column prop="buytotal" label="订单金额"  min-width="80" :align="align" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderstate" label="订单状态"  min-width="120" :align="align" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="订单时间" :align="align" width="180"></el-table-column>
        <el-table-column label="操作" min-width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="CMSContent(scope.row, scope.row._id, null)">查看</el-button>
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
    </div>
    <router-view v-else/>
  </div>
</template>

<script>
  import { GetVShopFoodOrder, OrderOperation } from '@/api/system'
  import {formatDate} from '@/components/js/data'
  export default {
    name: 'orders-list',
    data() {
      return {
        containerIsShow: true,
        align: 'center',
        form: {
          id: '',
          phone: '',
          payState: '',
          orderStatus: ''
        },
        timeFrame: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
        tableData3: [],
        status: '',
        selectTableList: [], // 被选择的列表
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        paystateList: [
          {id: '', value: '所有'},
          {id: '待取货', value: '待取货'},
          {id: '已取货', value: '已取货'}
        ],
        stateList: [
          // ok：支付成功，cancel：取消支付，prepay：待支付（下单时状态）,fail:支付失败,error:错误订单
          {id: '', value: '所有'},
          {id: 'ok', value: '支付成功'},
          {id: 'fail', value: '支付失败'}
        ]
      }
    },
    methods: {
      // 表格选中状态
      selectTableRow: function(val) {
        this.selectTableList = val
      },
      search() {
        this.pageIndex = 1
        this.init()
      }, // 搜索
      init() {
        let parmas = {
          sTime: this.timeFrame ? `${this.timeFrame[0]}~${this.timeFrame[1]}` : '',
          orderid: this.form.id,
          buyPhone: this.form.phone,
          payState: this.form.payState, // 支付状态
          orderStatus: this.form.orderStatus, // 取餐状态
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        GetVShopFoodOrder(parmas).then(res => {
          if (res.success) {
            this.tableData3 = res.data
            this.total = res.total
          } else this.$message.err(res.msg)
        }, err => { this.$message.err(err.msg) })
      },
      CMSContent(dto, orderId, action) {
        if (action === 2) {
          this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let parmas = {
              dto: dto,
              action: action
            }
            OrderOperation(parmas).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.init()
              } else this.$message.err(res.msg)
            }, err => { this.$message.err(err.msg) })
          }).catch(() => {})
        } else {
          this.$router.push({
            path: '/meal-order-detail',
            query: {id: orderId}
          })
        }
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
      $route(to, from) {
        if (to.name === 'meal-order-list') {
          this.init()
          this.containerIsShow = true
        } else {
          this.containerIsShow = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .order{
    padding: 20px;
    .main-list{
      .order-table{
        margin: 10px 0;
      }
    }
  }
</style>
