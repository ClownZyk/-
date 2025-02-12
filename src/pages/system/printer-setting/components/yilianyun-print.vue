<template>
  <div class="vote-list-container">
    <!--搜索部分-->
    <el-form class="filters" ref="searchForm" :inline="true">
      <el-form-item>
        <el-button type="success" @click="addPrint">新增打印机</el-button>
      </el-form-item>
    </el-form>
    <div class="tips" style="font-size: 14px;color: #E6A23C"><strong>注：易联云不干胶适用于 零售、饮品，易联云小票适用于零售、餐食、饮品</strong></div>
    <!-- 列表部分 -->
    <div class="list-table">
      <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" v-loading="listLoading">
        <el-table-column align="center" label="编号" width="55" type="index"></el-table-column>
        <el-table-column align="center" prop="printerName" label="打印机名称" show-overflow-tooltip width="250"></el-table-column>
        <el-table-column align="center" label="应用范围" show-overflow-tooltip min-width="250">
          <template slot-scope="scope">
            <div>{{ scope.row.printRange | manageRangeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="clientId" label="应用ID" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column align="center" prop="clientSecret" label="应用密钥" min-width="280" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="machine_Code" label="设备终端号" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column align="center" prop="msign" label="终端密钥" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column align="center" prop="printerStatus" label="是否在线" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column align="center" label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editPrint(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="operateFunc(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listFilterParam.pageIndex"
          :page-size="listFilterParam.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;"
        >
        </el-pagination>
      </el-col>
    </div>
    <el-dialog title="新增打印设备" :visible.sync="rechargeCardAddDialogVisible" width="750px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="rechargeCardForm" :model="rechargeCardForm" :rules="rechargeCardFormRules" label-width="130px" size="mini">
        <el-form-item>
          <el-button :loading="appInfoLoading" type="primary" @click="getApplicationInfo">获取应用信息</el-button>
        </el-form-item>
        <el-form-item label="打印机名称" prop="printerName">
          <el-input placeholder="请输入打印机名称" v-model.trim="rechargeCardForm.printerName"></el-input>
        </el-form-item>
        <el-form-item label="应用ID" prop="clientId">
          <el-select v-if="applicationList.length > 0" v-model="rechargeCardForm.clientId" placeholder="请选择应用Id" @change="applicationChange" style="width: 100%">
            <el-option v-for="item in applicationList" :key="item._id" :label="item.clientId" :value="item.clientId"> </el-option>
          </el-select>
          <el-input v-else placeholder="请输入应用ID" v-model.trim="rechargeCardForm.clientId"></el-input>
        </el-form-item>
        <el-form-item label="应用密钥" prop="clientSecret">
          <el-input placeholder="请输入应用密钥" v-model.trim="rechargeCardForm.clientSecret"></el-input>
        </el-form-item>
        <el-form-item label="设备终端号" prop="machine_Code">
          <el-input placeholder="请输入设备终端号" v-model.trim="rechargeCardForm.machine_Code"></el-input>
        </el-form-item>
        <el-form-item label="终端密钥" prop="msign">
          <el-input placeholder="请输入终端密钥" v-model.trim="rechargeCardForm.msign"></el-input>
        </el-form-item>
        <el-form-item label="应用范围" prop="printRange">
          <el-checkbox-group v-model="rechargeCardForm.printRange">
            <el-checkbox v-for="(item, index) in manageRange" :key="index" :label="item.value" border>{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="_sureCreatCards">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {queryPrinterList, printerOperation, getPrintClient} from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  name: 'recharge-card-list',
  mixins: [Filters],
  watch: {
    'rechargeCardForm.expirationTimeRange'(newVal) {
      if (!newVal || newVal.length <= 0) {
        newVal = ['', '']
      }
      this.rechargeCardForm.expirationStart = newVal[0]
      this.rechargeCardForm.expirationEnd = newVal[1]
    },
    rechargeCardAddDialogVisible(v) {
      if (!v) {
        delete this.rechargeCardForm._id
        this.$refs.rechargeCardForm.resetFields()
        this.applicationList = []
      }
    }
  },
  data () {
    return {
      applicationList: [],
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      rechargeCardAddDialogVisible: false,
      rechargeCardForm: {
        printerName: '',
        clientId: '',
        clientSecret: '',
        machine_Code: '',
        msign: '',
        phone: '',
        printRange: []
      },
      rechargeCardFormRules: {
        printerName: [{ required: true, message: '请填写打印机名称', trigger: 'blur' }],
        clientId: [{ required: true, message: '请填写应用ID', trigger: 'blur' }],
        clientSecret: [{ required: true, message: '请填写应用秘钥', trigger: 'blur' }],
        machine_Code: [{ required: true, message: '请填写设备终端号', trigger: 'blur' }],
        msign: [{ required: true, message: '请填写终端密钥', trigger: 'blur' }],
        printRange: [{ type: 'array', required: true, message: '请至少选择一个应用范围', trigger: 'change' }]
      },
      listFilterParam: {
        printerName: '',
        clientId: '',
        clientSecret: '',
        machine_Code: '',
        msign: '',
        pageSize: 10,
        pageIndex: 1,
        isPage: true
      },
      operationAction: 0,
      appInfoLoading: false
    }
  },
  methods: {
    addPrint() {
      this.rechargeCardAddDialogVisible = true
      this.operationAction = 0
    },
    editPrint(row) {
      this.rechargeCardAddDialogVisible = true
      this.operationAction = 1
      this.$nextTick(() => {
        // eslint-disable-next-line camelcase
        let { printerName, clientId, clientSecret, machine_Code, msign, phone, printRange, _id } = row
        this.rechargeCardForm = {
          printerName,
          clientId,
          clientSecret,
          machine_Code,
          msign,
          phone,
          printRange,
          _id
        }
      })
    },
    _sureCreatCards() {
      this.$refs.rechargeCardForm.validate(valid => {
        if (valid) {
          let param = {
            dto: {
              ...this.rechargeCardForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operationAction
          }
          // console.log(param)
          printerOperation(param).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.rechargeCardAddDialogVisible = false
              this.GetListByPage()
            }
          })
        }
      })
    },
    operateFunc(item) {
      this.$confirm('删除后打印机将无法正常工作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            dto: {
              ...item,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: 2
          }
          printerOperation(param).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.GetListByPage()
          })
        }).catch()
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.listFilterParam.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.listFilterParam.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        ...this.listFilterParam,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await queryPrinterList(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      })
    },
    // 获取应用信息
    getApplicationInfo() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.appInfoLoading = true
      getPrintClient(params).then(res => {
        if (res.success) {
          this.appInfoLoading = false
          this.applicationList = res.data
        }
      }, () => {
          this.appInfoLoading = false
      })
    },
    // 应用Id选择改变
    applicationChange(val) {
      let client = this.applicationList.find(item => item.clientId === val)
      this.rechargeCardForm.clientSecret = client.clientSecret
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.list-table {
  color: #666666;
  .table-main {
    text-align: center;
    margin: 15px 0;
  }
}
</style>
