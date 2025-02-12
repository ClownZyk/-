<template>
  <el-dialog :visible.sync="isShow" title="人员选择" width="1000px" @closed="closed">
    <el-form size="small" :model="filterParam" :inline="true">
      <el-form-item label="姓名"> <el-input v-model.trim="filterParam.name" width="160" placeholder="请输入真实姓名或昵称" clearable></el-input> </el-form-item>
      <el-form-item label="手机号"> <el-input v-model.trim="filterParam.tel" width="160" placeholder="请输入手机号" clearable></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="getScrmList('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <div class="alert"><el-alert title="若要开启系统管理权限，前往菜单‘SCRM管理—>会员信息’进行配置" type="warning" show-icon :closable="false"> </el-alert></div>
    <el-table size="small" v-loading="listLoading" :data="vipList" border>
      <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
      <el-table-column prop="" label="姓名" align="center" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.nickName || '--' }}</template>
      </el-table-column>
      <el-table-column prop="" label="电话" min-width="130" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.phone || '--' }}</template>
      </el-table-column>
      <el-table-column label="售卖机管理员" align="center" min-width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.operator" style="color:#67C23A">是</div>
          <div v-else style="color:#909399">否</div>
        </template>
      </el-table-column>
      <el-table-column label="系统管理员" align="center" min-width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.systemAdmin" style="color:#67C23A">是</div>
          <div v-else style="color:#909399">否</div>
        </template>
      </el-table-column>
      <el-table-column label="拼团管理员" align="center" min-width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.groupAdmin" style="color:#67C23A">是</div>
          <div v-else style="color:#909399">否</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="selectTableRow(scope.row)">选择此人员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        size="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin:10px 0;"
      >
      </el-pagination>
    </el-col>
    <div slot="footer"></div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { UserCRMList } from '@/api/system'
export default {
  name: 'product-select-radio',
  props: {
    isShowScrmSelect: Boolean
  },
  watch: {
    isShowScrmSelect: function (newValue, oldValue) {
      this.isShow = newValue
    }
  },
  data () {
    return {
      filterParam: {
        name: '',
        tel: '',
        pay1: 0,
        pay2: 100,
        isVip: '',
        operator: false
      },
      vipList: [],
      isShow: false,
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.getScrmList()
  },
  methods: {
    getScrmList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let parmas = {
        status: 0,
        identityid: this.filterParam.isVip,
        nickName: this.filterParam.name,
        Phone: this.filterParam.tel,
        operator: this.filterParam.operator,
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
      UserCRMList(parmas)
        .then(res => {
          this.listLoading = false
          this.vipList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    selectTableRow (row) {
      if (row) {
        this.$confirm('确认选择此人员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('saveScrmSelected', row)
          this.closed()
        })
      }
    },
    closed () {
      this.$emit('handleScrmSelect', false)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getScrmList()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getScrmList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
