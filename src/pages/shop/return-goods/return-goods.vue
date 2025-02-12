<template>
  <div class="return-container">
    <div class="return-goods" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-select v-model="search.state"  placeholder="请选择退款单状态">
              <el-option v-for="(item, index) in stateList" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.oriOrderid" placeholder="请输入原订单号" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.mobile" placeholder="请输入原订单收件人手机号" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入原订单收件人" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <!-- <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button> -->
          <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="receiverInfo.name" label="原订单收件人名称" width="300" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="orderId" label="订单号" width="250" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="refund_fee" label="退款金额" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="createTime" label="退款日期" width="250" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="refund_desc" label="退款说明" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="state" label="退款状态" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.state === 1" style="color: #e6b321;">待审核</div>
              <div v-else-if="scope.row.state === 2"  style="color: #13CE66;">已同意退款</div>
              <div v-else-if="scope.row.state === 3" style="color: #FF4949;">已拒绝退款</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)" :disabled="scope.row.state===2">审核</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {RefoundGetListByPage, RefoundOperation} from '@/api/system'
export default {
  name: 'return-goods',
  watch: {
    '$route' (to, from) {
      if (to.name === 'return-goods') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      stateList: [
        { value: 0, label: '全部' },
        { value: 1, label: '待审核' },
        { value: 2, label: '已同意退款' },
        { value: 3, label: '已拒绝退款' }
      ],
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        // 原收件人
        name: '',
        mobile: '',
        // 订单号
        oriOrderid: '',
        state: 0
      },
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        // case '添加':
        //   this.$router.push('/return-goods-detail')
        //   break
        case '编辑': // 编辑
          this.$router.push({path: '/return-goods-detail', query: {id: row._id}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        // case '编辑开关': // 更新开关
        //   this.operateAxios(row)
        //   break
        case '查看': // 查看
          this.$router.push({path: '/return-goods-detail', query: {id: row._id, operate: 'view'}})
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        // Dto: Object.assign({}, item),
        Dto: {
          _id: item._id
        },
        Action: this.operateAction
      }
      RefoundOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
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
    // 加载数据
    async GetListByPage () {
      let params = {
        name: this.search.name,
        mobile: this.search.mobile,
        state: this.search.state,
        oriOrderid: this.search.oriOrderid,
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
      await RefoundGetListByPage(params).then(res => {
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
  .return-container {
    position: relative;
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
</style>
