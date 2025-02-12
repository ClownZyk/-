<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="合伙人详情"> </el-page-header></div>
    <el-form ref="partnerFormRef" :model="partnerForm" :rules="partnerFormRules">
      <el-row>
        <el-col :span="12">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="userName">
                <div class="form-item-title">合伙人登录名</div>
                <el-input placeholder="请输入合伙人登录名" v-model.trim="partnerForm.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="passWord">
                <div class="form-item-title">合伙人登录密码</div>
                <el-input type="passWord" placeholder="请输入合伙人登录密码" v-model.trim="partnerForm.passWord" show-password :disabled="addFormState === 1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="partnerName">
                <div class="form-item-title">合伙人真实姓名</div>
                <el-input placeholder="请输入合伙人真实姓名" v-model.trim="partnerForm.partnerName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 合伙人参股门店信息 -->
          <el-row>
            <el-form-item prop="shops">
              <div class="form-item-title">参股门店信息</div>
              <el-button size="small" type="warning" @click="handleSelectStore" style="margin-bottom: 5px">选择门店</el-button>
              <el-table size="small" :data="partnerForm.shops" border>
                <el-table-column label="门店名称" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>{{ scope.row.companyName }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="money" label="出资金额(元)" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="small" v-model="scope.row.money" :min="0" label="出资金额" :step="0.01" step-strictly controls-position="right"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="percent" label="出资比例" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="small" v-model="scope.row.percent" :min="0" :max="1" label="出资比例" :step="0.01" step-strictly controls-position="right"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="removeStore(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
          <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitPartnerInfo">确定并提交</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 门店选择弹框 -->
    <el-dialog title="门店选择" :visible.sync="isStoreShow" width="650px" @close="isStoreShow = false" :close-on-click-modal="false">
      <el-form size="small" :model="searchForm" inline>
        <el-form-item label="门店名称"> <el-input type="text" v-model.trim="searchForm.companyName" placeholder="请输入门店名称检索" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveStoreInfo">保存</el-button> </el-form-item>
      </el-form>
      <div class="table-list">
        <el-table size="small" ref="multipleTable" v-loading="tableLoading" :data="storeList" row-key="cid" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="60" align="center" reserve-selection></el-table-column>
          <el-table-column prop="companyName" label="门店名称" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px;text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllStore, getPartnerDetail, partnerOperation } from '@/api/system'

export default {
  data() {
    return {
      partnerForm: {
        userName: '',
        passWord: '',
        partnerName: '',
        shops: []
      },
      storeList: [],
      searchForm: {
        companyAddress: '',
        attribute: 0,
        companyName: ''
      },
      isStoreShow: false,
      tableLoading: false,
      submitLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      partnerFormRules: {
        userName: [{ required: true, message: '请输入合伙人登录名', trigger: 'blur' }],
        passWord: [{ required: true, message: '请输入合伙人登录密码', trigger: 'blur' }],
        partnerName: [{ required: true, message: '请输入合伙人真实姓名', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isStoreShow(val) {
      if (!val) {
        this.$refs['multipleTable'].clearSelection()
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.partnerId) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.partnerId) {
      this.getPartnerDetail()
    }
  },
  methods: {
    // 获取合伙人详情
    getPartnerDetail() {
      getPartnerDetail({ _id: this.$route.query.partnerId }).then(res => {
        this.partnerForm = res.data
      })
    },
    // 获取所有门店信息
    getAllStore() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getAllStore(params)
        .then(res => {
          if (res.success) {
            this.tableLoading = false
            this.storeList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 参股门店信息保存
    handleSelectStore() {
      this.isStoreShow = true
      this.getAllStore()
    },
    handleSelectionChange(val) {
      this.selectedList = val.map(item => {
        return {
          companyName: item.companyName,
          cid: item.cid,
          money: 0,
          percent: 0
        }
      })
    },
    saveStoreInfo() {
      if (this.selectedList.length > 0) {
        this.isStoreShow = false
        let npRepeat = this.selectedList.filter(item => {
          return this.partnerForm.shops.every(val => val.cid !== item.cid)
        })
        this.partnerForm.shops.push(...npRepeat)
      } else {
        this.$message.warning('至少选中一条数据！')
      }
    },
    removeStore(index) {
      this.partnerForm.shops.splice(index, 1)
    },
    submitPartnerInfo() {
      this.$refs['partnerFormRef'].validate(valid => {
        if (valid) {
          if (this.partnerForm.shops.length <= 0) {
            return this.$message.warning('请选择合伙人参股门店信息！')
          }
          let params = {
            dto: {
              ...this.partnerForm,
              cid: this.$store.state._cid,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole
            },
            action: this.addFormState
          }
          this.submitLoading = true
          partnerOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getAllStore()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllStore()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllStore()
    }
  }
}
</script>

<style lang="scss" scoped>
.gem-back-header {
  margin-bottom: 10px;
}
.form-item-title {
  font-weight: bolder;
  font-size: 16px;
}
</style>
