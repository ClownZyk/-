<template>
  <div class="page-container">
    <div v-if="containerIsShow">
      <el-form ref="form" :model="search" inline>
        <el-form-item label="姓名"> <el-input v-model="search.name" width="160" placeholder="请输入真实姓名或昵称" clearable></el-input> </el-form-item>
        <el-form-item label="手机号"> <el-input v-model="search.tel" width="160" placeholder="请输入手机号" clearable></el-input> </el-form-item>
        <el-form-item label="会员性质">
          <el-select v-model="search.isVip" placeholder="请选择会员性质" style="width: 200px;">
            <el-option v-for="item in isvipList" :key="item._id" :value="item._id" :label="item.identityName">{{ item.identityName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份状态">
          <el-select v-model="search.operator" placeholder="请选择管理员身份状态" style="width: 200px;">
            <el-option v-for="item in operatorList" :key="item.value" :value="item.value" :label="item.label">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchBtn">搜索</el-button> </el-form-item>
      </el-form>
      <div class="alert">
        <el-alert title="若要开启小程序门店拼团管理权限，中台账号下前往菜单‘GemBI—>门店管理—>拼团管理人员设置’进行人员添加，门店账号下前往‘商城—>商城设置—>拼团管理人员设置’进行人员添加。若要开启小程序中台账号拼团活动发布权限（可选配门店功能），需前往中台账号下的‘商城—>商城设置—>拼团管理人员设置’进行人员添加" type="warning" show-icon :closable="false"> </el-alert>
      </div>
      <el-table :data="vipList" border tooltip-effect="dark" v-loading="loading">
        <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
        <el-table-column label="会员号" align="center" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.memberCard.cardId || '--' }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.nickName || '--' }}</template>
        </el-table-column>
        <el-table-column label="电话" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.phone || '--' }}</template>
        </el-table-column>
        <el-table-column prop="vipCard.identityName" label="会员类型" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="会员等级" min-width="120" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.memberCard.level || 0 }}</template>
        </el-table-column>
        <el-table-column prop="memberCard.accountMoney" label="余额" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memberCard.integral" label="积分" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="售卖机管理员" align="center" min-width="130">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.operator" @change="handleOperatorChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="系统管理员" align="center" min-width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.systemAdmin" @change="handleOperatorChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="拼团管理员" align="center" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.groupAdmin" style="color:#67C23A">是</span> <span v-else style="color:#909399">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="_toDetail(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-col :span="24" class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="total" background> </el-pagination>
      </el-col>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { UserCRMList, UserCRMOperation, GetUserIdentityByPage } from '@/api/system'

export default {
  name: 'scrm-list',
  watch: {
    $route(to, from) {
      if (to.name === 'scrm-list') {
        this.init()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('cid') === this.$store.state._cid,
      search: {
        name: '',
        tel: '',
        pay1: 0,
        pay2: 100,
        isVip: '',
        operator: false
      },
      vipList: [],
      isvipList: [],
      loading: false,
      containerIsShow: true,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      operatorList: [{ value: false, label: '全部状态' }, { value: true, label: '售卖机管理员' }]
    }
  },
  mounted() {
    this.init()
    this.GetIdentityListByPage()
  },
  methods: {
    GetIdentityListByPage() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetUserIdentityByPage(params).then(res => {
        this.isvipList = res.data
        this.isvipList.unshift({
          _id: '',
          identityName: '所有会员性质'
        })
      })
    },
    init() {
      let parmas = {
        status: 0,
        identityid: this.search.isVip,
        nickName: this.search.name,
        Phone: this.search.tel,
        operator: this.search.operator,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.loading = true
      UserCRMList(parmas)
        .then(res => {
          this.loading = false
          this.vipList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleOperatorChange(row) {
      let params = {
        dto: { ...row, sex: row.sex ? row.sex : 1 },
        action: 1
      }
      UserCRMOperation(params).then(res => {
        this.$message.success(res.msg)
        this.init()
      })
    },
    _toDetail(row) {
      this.$router.push({
        path: '/scrm-detail',
        query: {
          id: row._id
        }
      })
    },
    searchBtn() {
      this.pageIndex = 1
      this.init()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
