<template>
  <div>
    <el-form>
      <el-form-item> <el-button type="warning" @click="handleSiteGrouponAdminAdd">新增拼团管理人员</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="authorityList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="姓名" prop="" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName || '--' }}</template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.phone || '--' }}</template>
      </el-table-column>
      <el-table-column label="管理角色" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.groupRole === 1" style="color:#E6A23C">团长</div>
          <div v-else style="color:#67C23A">管理员</div>
        </template>
      </el-table-column>
      <el-table-column label="管理状态" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.isUse" style="color:#67C23A">启用</div>
          <div v-else style="color:#F56C6C">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleSiteGrouponAdminEdit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[25, 35, 45, 55]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    >
    </el-pagination>

    <el-dialog title="站点拼团管理人员" :visible.sync="isSiteGrouponAdminShow" width="550px" @close="isSiteGrouponAdminShow = false" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
        <el-form-item> <el-button size="small" type="warning" @click="handleScrmSelect(true)">人员选择</el-button> </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName"> <el-input type="text" v-model.trim="addForm.userName" placeholder="姓名" :disabled="!addForm.userId"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone"> <el-input type="text" v-model.trim="addForm.phone" placeholder="手机号" :disabled="!addForm.userId"></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="管理角色" prop="groupRole">
              <el-radio-group size="medium" v-model="addForm.groupRole">
                <el-radio-button :label="1">团长</el-radio-button>
                <el-radio-button :label="2">管理员</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理状态" prop="isUse">
              <el-radio-group size="medium" v-model="addForm.isUse">
                <el-radio-button :label="true">启用</el-radio-button>
                <el-radio-button :label="false">禁用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitSiteGrouponAdminInfo">确 定</el-button> </span>
    </el-dialog>

    <scrm-select-radio :isShowScrmSelect="isShowScrmSelect" @handleScrmSelect="handleScrmSelect" @saveScrmSelected="saveScrmSelected"></scrm-select-radio>
  </div>
</template>

<script>
import { getGrouponAdminList, setGrouponAdmin, updateGrouponAdminInfo } from '@/api/system'
import ScrmSelectRadio from '@/components/scrm-select-radio'

export default {
  props: {
    queryCid: {
      type: String,
      default: ''
    }
  },
  components: {
    ScrmSelectRadio
  },
  data() {
    return {
      authorityList: [],
      addForm: {
        groupRole: 1,
        userName: '',
        phone: '',
        isUse: true
      },
      addFormState: 0,
      listLoading: false,
      submitLoading: false,
      isShowScrmSelect: false,
      isSiteGrouponAdminShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        groupRole: [{ required: true, message: '请选择管理角色', trigger: 'change' }],
        isUse: [{ required: true, message: '请选择管理状态', trigger: 'change' }]
      }
    }
  },
  watch: {
    isSiteGrouponAdminShow(val) {
      if (!val) {
        delete this.addForm.userId
        delete this.addForm.cid
        this.$refs['addFormRef'].resetFields()
      }
    }
  },
  mounted() {
    this.getGrouponManageSetting()
  },
  methods: {
    getGrouponManageSetting() {
      let params = {
        userId: '',
        cid: this.queryCid
      }
      this.listLoading = true
      getGrouponAdminList(params)
        .then(res => {
          this.listLoading = false
          this.authorityList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleSiteGrouponAdminAdd() {
      this.addFormState = 0
      this.isSiteGrouponAdminShow = true
    },
    handleScrmSelect(flag) {
      this.isShowScrmSelect = flag
    },
    saveScrmSelected(row) {
      this.addForm.userId = row._id
      this.addForm.userName = row.nickName || row.realName
      this.addForm.phone = row.phone
    },
    submitSiteGrouponAdminInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (!this.addForm.userId) {
            return this.$message.warning('请先选择人员信息！')
          }
          this.SiteGrouponAdminOperation()
        }
      })
    },
    handleSiteGrouponAdminEdit(row) {
      this.addFormState = 1
      this.isSiteGrouponAdminShow = true
      this.$nextTick(() => {
        let { userId, cid, groupRole, userName, phone, isUse } = row
        this.addForm = {
          userId,
          cid,
          groupRole,
          userName,
          phone,
          isUse
        }
      })
    },
    SiteGrouponAdminOperation() {
      let params = {
        userId: this.addForm.userId,
        cid: this.queryCid,
        groupRole: this.addForm.groupRole,
        userNmae: this.addForm.userName,
        phone: this.addForm.phone,
        isUse: this.addForm.isUse
      }
      this.submitLoading = true
      let GrouponAdmin = this.addFormState === 0 ? setGrouponAdmin : updateGrouponAdminInfo
      GrouponAdmin(params)
        .then(res => {
          this.isSiteGrouponAdminShow = false
          this.submitLoading = false
          this.$message.success(res.msg)
          this.getGrouponManageSetting()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGrouponManageSetting()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getGrouponManageSetting()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
