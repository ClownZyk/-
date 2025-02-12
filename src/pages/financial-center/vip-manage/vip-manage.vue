<template>
  <div class="page-container">
    <el-form class="filters" :model="search" inline>
      <div class="filters-left">
        <el-form-item> <el-input v-model.trim="search.activityName" placeholder="请输入套餐名称" @keyup.enter.native="GetListByPage('refresh')"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="GetListByPage('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="warning" @click="handleVipManageAdd()">新增VIP套餐优惠</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="vipManageList" border>
      <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="title" label="套餐名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="originalPrice" label="原价" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="presentPrice" label="现价" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleVipManageEdit(scope.row, 1)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleVipManageDelete(scope.row, 2, '删除')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
      </el-pagination>
    </el-col>
    <!-- 弹框 -->
    <el-dialog title="VIP套餐优惠" :visible.sync="isFormShow" width="600px" :close-on-click-modal="false">
      <el-form ref="dialogRef" :model="dialog" :rules="formRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="套餐名称" prop="title"> <el-input v-model.trim="dialog.title" placeholder="请输入套餐名称"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户身份类型" prop="identityId">
              <el-select v-model="dialog.identityId" placeholder="请选择用户身份类型" style="width:100%"> <el-option v-for="item in userIndentityList" :key="item._id" :label="item.identityName" :value="item._id"> </el-option> </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="原价" prop="originalPrice"> <el-input-number v-model="dialog.originalPrice" :min="0" :step="0.01" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现价" prop="presentPrice"> <el-input-number v-model="dialog.presentPrice" :min="0" :step="0.01" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="时限（天）" prop="buyDays"> <el-input-number v-model="dialog.buyDays" :min="0" :step="1" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送天数" prop="giveDays"> <el-input-number v-model="dialog.giveDays" :min="0" :step="1" step-strictly :controls="false" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注"> <el-input v-model="dialog.remark" type="textarea" :rows="3"></el-input> </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="isFormShow = false">返回</el-button>
        <el-button type="primary" @click="submitVipManageInfo">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetVIPListByPage, vipOption, GetUserIdentityByPage} from '@/api/system'
export default {
  data () {
    return {
      search: {
        activityName: ''
      },
      dialog: {
        title: '',
        originalPrice: 0,
        presentPrice: 0,
        buyDays: 0,
        giveDays: 0,
        identityId: '',
        remark: ''
      },
      vipManageList: [],
      userIndentityList: [],
      operationAction: 0,
      listLoading: false,
      isFormShow: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      formRules: {
        title: [{ required: true, message: '请填写套餐名称', trigger: 'blur' }],
        buyDays: [{ required: true, message: '请填写套餐时限', trigger: 'change' }],
        originalPrice: [{ required: true, message: '请填写套餐原价', trigger: 'change' }],
        presentPrice: [{ required: true, message: '请填写套餐现价', trigger: 'change' }],
        identityId: [{ required: true, message: '请选择用户身份类型', trigger: 'change' }]
      }
    }
  },
  watch: {
    isFormShow(val) {
      if (val) {
        delete this.dialog._id
        this.$refs['dialogRef'].resetFields()
      }
    }
  },
  mounted() {
    this.GetListByPage()
    this.getUserIndentityList()
  },
  methods: {
    GetListByPage (refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
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
      GetVIPListByPage(params).then(res => {
        this.listLoading = false
        this.vipManageList = res.data
        this.total = res.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 获取用户身份列表
    getUserIndentityList() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      GetUserIdentityByPage(params).then(
        res => {
          this.userIndentityList = res.data
        }
      )
    },
    handleVipManageAdd() {
      this.operationAction = 0
      this.isFormShow = true
    },
    handleVipManageEdit(row) {
      this.operationAction = 1
      this.isFormShow = true
      this.$nextTick(() => {
        let {title, originalPrice, presentPrice, buyDays, giveDays, identityId, remark, _id} = row
        this.dialog = {
          title,
          originalPrice,
          presentPrice,
          buyDays,
          giveDays,
          identityId,
          remark,
          _id
        }
      })
    },
    handleVipManageDelete(row) {
      this.operationAction = 2
      this.$confirm('是否删除该Vip套餐优惠?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.vipManageOperation(row)
      }).catch(() => {})
    },
    submitVipManageInfo() {
      this.$refs['dialogRef'].validate((valid) => {
        if (valid) {
          this.vipManageOperation()
        }
      })
    },
    vipManageOperation(row) {
      const publicParam = row ? {...row} : {...this.dialog}
      let params = {
          dto: {
            ...publicParam,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          },
          action: this.operationAction
      }
      vipOption(params).then(res => {
        this.$message.success(res.msg)
        this.isFormShow = false
        this.GetListByPage()
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped></style>
