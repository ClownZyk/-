<template>
  <div class="feie-print-container">
    <el-form class="filters" :inline="true">
      <el-form-item>
        <el-button type="success" @click="addPrint">新增打印机</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col>
        <el-alert title="提示" type="warning" description="飞鹅标签打印机适用于 零售、饮品；上传的logo图片必须是bmp格式，命名为logo，图片大小不能超过10kb" show-icon :closable="false"> </el-alert>
      </el-col>
    </el-row>

    <!-- 打印机列表 -->
    <el-table class="table-list" v-loading="listLoading" :data="printList" border>
      <el-table-column align="center" label="编号" width="55" type="index"></el-table-column>
      <el-table-column align="center" prop="printerName" label="打印机名称" show-overflow-tooltip width="250"></el-table-column>
      <el-table-column align="center" label="应用范围" show-overflow-tooltip width="240">
        <template slot-scope="scope">
          <div>{{ scope.row.printRange | manageRangeFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="user" label="后台管理账号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="ukey" label="注册账号生成的ukey" width="300" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="sn" label="打印机编号" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="printerStatus" label="是否在线" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="操作" width="260" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="10">
              <el-upload
                ref="uploadLogo"
                class="upload-demo"
                action=""
                :http-request="uploadLogo"
                :data="uploadData"
                accept="image/bmp"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :limit="1"
                :file-list="fileList"
                :show-file-list="false"
              >
                <el-button size="mini" type="primary" @click="setPrintLogo(scope.row)">logo设置</el-button>
              </el-upload>
            </el-col>
            <!-- <el-col :span="8"> </el-col> -->
            <el-col :span="12">
              <el-button type="warning" size="mini" @click="editPrint(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="removePrint(scope.row)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next" background style="float:right">
      </el-pagination>
    </el-col>

    <!-- 新增打印机表单弹框 -->
    <el-dialog title="新增打印设备" :visible.sync="printAddDialogVisible" width="750px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="printAddFormRef" :model="printAddForm" :rules="printAddFormRules" label-width="130px" size="mini">
        <el-form-item label="打印机名称" prop="printerName">
          <el-input placeholder="请输入打印机名称" v-model.trim="printAddForm.printerName"></el-input>
        </el-form-item>
        <el-form-item label="后台账号名" prop="user">
          <el-input placeholder="请输入登录管理后台的账号名" v-model.trim="printAddForm.user"></el-input>
        </el-form-item>
        <el-form-item label="生成的ukey" prop="ukey">
          <el-input placeholder="请输入注册账号生成的ukey" v-model.trim="printAddForm.ukey"></el-input>
        </el-form-item>
        <el-form-item label="打印机编号" prop="sn">
          <el-input placeholder="请输入打印机编号" v-model.trim="printAddForm.sn"></el-input>
        </el-form-item>
        <el-form-item label="应用范围" prop="printRange">
          <el-checkbox-group v-model="printAddForm.printRange">
            <el-checkbox v-for="(item, index) in useRange" :key="index" :label="item.value" border>{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="addPrintOperation">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getFeiePrinterList, feiePrinterOperation, setFeiePrinterLogo } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      printAddForm: {
        printerName: '',
        user: '',
        ukey: '',
        sn: '',
        printRange: []
      },
      printList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      printAddFormRules: {
        printerName: [{ required: true, message: '请填写打印机名称', trigger: 'blur' }],
        user: [{ required: true, message: '请填写登录管理后台的账号名', trigger: 'blur' }],
        ukey: [{ required: true, message: '请填写注册账号生成的ukey', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写打印机编号', trigger: 'blur' }],
        printRange: [{ type: 'array', required: true, message: '请至少选择一个应用范围', trigger: 'change' }]
      },
      listLoading: false,
      printAddDialogVisible: false,
      // logo上传参数
      uploadData: {},
      uploadSize: 0.01 * 1024 * 1024,
      fileList: [],
      operationAction: 0,
      useRange: [
        { value: 1, label: '云极小超零售' },
        { value: 3, label: '云极咖啡饮品' }
      ]
    }
  },
  watch: {
    printAddDialogVisible(val) {
      if (!val) {
        delete this.printAddForm._id
        this.$refs.printAddFormRef.resetFields()
      }
    }
  },
  created() {
    this.getFeiePrintList()
  },
  methods: {
    // 获取打印机列表
    getFeiePrintList() {
      let params = {
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
      getFeiePrinterList(params)
        .then(res => {
          this.listLoading = false
          this.printList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 新增打印设备
    addPrint() {
      this.printAddDialogVisible = true
      this.operationAction = 0
    },
    // 修改打印设备
    editPrint(row) {
      this.printAddDialogVisible = true
      this.operationAction = 1
      this.$nextTick(() => {
        let { printerName, user, ukey, sn, printRange, _id } = row
        this.printAddForm = {
          printerName,
          user,
          ukey,
          sn,
          printRange,
          _id
        }
      })
    },
    // 打印设备操作
    addPrintOperation() {
      this.$refs.printAddFormRef.validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.printAddForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operationAction
          }
          feiePrinterOperation(params).then(res => {
            if (res.success) {
              this.printAddDialogVisible = false
              this.$message.success(res.msg)
              this.getFeiePrintList()
            }
          })
        }
      })
    },
    // 删除打印机
    removePrint(row) {
      this.$confirm('删除后打印机将无法正常工作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: {
              ...row,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: 2
          }
          feiePrinterOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getFeiePrintList()
          })
        })
        .catch()
    },
    setPrintLogo(row) {
      let { user, ukey, sn } = row
      this.uploadData = { user, ukey, sn }
    },
    beforeUpload(file) {
      let types = ['image/bmp']
      let pname = 'logo'
      if (file.size > this.uploadSize) {
        this.$message.warning('图片大小不要超过10kb！')
        return false
      }
      if (file.name.split('.')[0] !== pname) {
        this.$message.warning('图片命名只能是logo！')
        return false
      }
      if (!types.includes(file.type)) {
        this.$message.warning('图片格式只能是bmp格式！')
        return false
      }
    },
    handleExceed() {
      this.$message.warning('最多上传1张图片')
    },
    uploadLogo(param) {
      let file = param.file
      let formData = new FormData()
      formData.append('file', file)
      formData.append('user', this.uploadData.user)
      formData.append('ukey', this.uploadData.ukey)
      formData.append('sn', this.uploadData.sn)
      setFeiePrinterLogo(formData).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.$refs.uploadLogo.clearFiles()
          }
        },
        err => {
          console.log(err.msg)
          this.$refs.uploadLogo.clearFiles()
        }
      )
    },
    handleRemove(file, fileList) {
      this.$refs.uploadLogo.clearFiles()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getFeiePrintList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getFeiePrintList()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  margin: 15px 0;
}
</style>
