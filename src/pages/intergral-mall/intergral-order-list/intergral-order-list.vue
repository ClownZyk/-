<template>
  <div class="list-container">
    <!-- 搜索部分 -->
    <div class="contain-mianer" v-if="containerIsShow">
      <div class="list-search">
        <div class="home-t">
          <el-form :model="search" label-width="100px" :inline="true">
            <el-form-item label="买家手机号"> <el-input v-model.trim="search.phone" placeholder="请输入手机号" clearable></el-input> </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="search.orderStatus">
                <el-option v-for="item in stateList" :key="item.value" :value="item.id" :label="item.value">{{ item.value }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <div class="home-b">
        <el-table class="home-b-main" :data="contentList" border tooltip-effect="dark" v-loading="listLoading">
          <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column label="订单编号" prop="orderId" align="center" width="220" show-overflow-tooltip></el-table-column>
          <el-table-column label="买家姓名" prop="customer.userName" align="center" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column label="买家手机号" prop="customer.phone" align="center" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column label="支付状态" prop="payStatus.payState" align="center" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.payStatus.payState | payStateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" align="center" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.orderStatus | orderPresentStateFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column label="积分类型" align="center" min-width="140">
            <template slot-scope="scope">{{ scope.row.orderType === 1 ? '实物' : '虚拟商品' }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="160" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="warning" @click="detailClick(scope.row._id, '修改')">查看</el-button> -->
              <el-button size="mini" type="warning" @click="detailClick(scope.row._id, '编辑')">查看</el-button>
              <el-button size="mini" type="danger" @click="CMSContent(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :total="total" layout="total, prev, pager, next" background style="float:right;"></el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { IntegralOrderList, IntegralOrderOperation } from '@/api/system'
import MyEditor from '../../../components/my-editor'
import Filter from '@/components/js/Filters'
export default {
  mixins: [Filter],
  watch: {
    $route(to, from) {
      if (to.name === 'intergral-order-list') {
        this.setData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // stateList: [
      //   // ok：支付成功，cancel：取消支付，prepay：待支付（下单时状态）,fail:支付失败,error:错误订单
      //   { id: '', value: '所有' },
      //   { id: 'ok', value: '支付成功' },
      //   { id: 'cancel', value: '取消支付' },
      //   { id: 'prepay', value: '待支付' },
      //   { id: 'fail', value: '支付失败' },
      //   { id: 'error', value: '错误订单' }
      // ],
      stateList: [{ id: 0, value: '全部' }, { id: 1, value: '订单失败' }, { id: 2, value: '卡劵已领取' }, { id: 3, value: '待发货' }, { id: 4, value: '配送中' }, { id: 5, value: '已完成' }],
      dialogImageUrl: '',
      dialogVisible: false,
      tableInputWidth: 200, // 统一宽度
      inputWidth: 'width: 290px;',
      inputWidth1: 'width: 272px;',
      labelWidth: '60px',
      labelWidth1: '78px', // SEO的label
      search: {
        // 搜索的表单提交
        // payStatus: '',
        phone: '',
        orderStatus: 0
      },
      dialog: {}, // 表单
      contentList: [], // 表格列表
      total: 0, // 分页总数
      pageIndex: 1, // 当前页码
      pageSize: 15, // 每页条数
      editDialog: false, // 弹框显示
      selectTableList: [], // 被选中的table列表
      isShowDialogFooter: true, // 是否显示提交按钮
      Row: {}, // 表单提交数据
      Action: null, // 增删改查状态
      Title: '', // 操作文字状态
      cateID: '',
      listLoading: false // 控制loading是否显示
    }
  },
  methods: {
    detailClick(id, txt) {
      this.$router.push({
        path: '/intergral-order-detail',
        query: { id: id, txt: txt }
      })
    },
    setData() {
      let params = {
        orderId: '',
        phone: this.search.phone,
        orderStatus: this.search.orderStatus,
        // payState: this.search.payStatus,
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
      IntegralOrderList(params).then(
        res => {
          // List内容列表
          if (res.success) {
            this.contentList = res.data
            this.total = res.total
            this.listLoading = false
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 搜索
    searchCondition: function() {
      this.setData()
    },
    // 删除
    CMSContent: function(list, title, action) {
      this.$confirm('确定删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            Dto: list,
            Action: action
          }
          IntegralOrderOperation(params).then(
            res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.setData()
              } else this.$message.error(res.msg)
            },
            err => {
              this.$message.error(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.setData()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.setData()
    }
  },
  mounted() {
    this.setData()
  },
  components: {
    MyEditor
  }
}
</script>

<style scoped lang="scss">
.list-container {
  padding: 0 20px;
  .contain-mianer {
    .home-b {
      padding: 10px 0;
      .home-b-main {
        margin-bottom: 15px;
      }
    }
  }
}
.table-row {
  height: 10px !important;
}
.editor-container {
  height: 500px;
}
.form-container {
  min-height: 500px;
}
.home-t {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 0;
  border-bottom: 1px solid #e6e5e5;
}
.dialog-line {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
</style>
