<template>
  <div class="print-container">
    <el-form class="filters" ref="searchForm" :inline="true">
      <el-form-item>
        <el-button type="success" @click="addPrint">新增打印机</el-button>
      </el-form-item>
    </el-form>
    <div class="tips" style="font-size: 14px;color: #E6A23C"><strong>注：芯烨云标签打印机适用于 餐食、饮品</strong></div>
    <div class="table-list">
      <el-table class="table-main" ref="listTable" :data="printList" border tooltip-effect="dark" v-loading="listLoading">
        <el-table-column align="center" label="编号" width="55" type="index"></el-table-column>
        <el-table-column align="center" prop="printerName" label="打印机名称" show-overflow-tooltip width="250"></el-table-column>
        <el-table-column align="center" label="应用范围" show-overflow-tooltip width="240">
          <template slot-scope="scope">
            <div>{{ scope.row.printRange | manageRangeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="餐食所属区域" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.zoneName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="useR_NAME" label="开发者账号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="useR_KEY" label="开发者密钥" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="oK_PRINTER_SN" label="设备编号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="printerStatus" label="是否在线" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="操作" width="160" show-overflow-tooltip fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="editPrint(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="removePrint(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
      >
      </el-pagination>
    </div>

    <el-dialog title="新增打印设备" :visible.sync="addPrintDialogShow" width="750px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="130px" size="mini">
        <el-form-item label="打印机名称" prop="printerName">
          <el-input placeholder="请输入打印机名称" v-model.trim="addForm.printerName"></el-input>
        </el-form-item>
        <el-form-item label="开发者账号" prop="useR_NAME">
          <el-input placeholder="请输入开发者账号" v-model.trim="addForm.useR_NAME"></el-input>
        </el-form-item>
        <el-form-item label="开发者密钥" prop="useR_KEY">
          <el-input placeholder="请输入开发者密钥" v-model.trim="addForm.useR_KEY"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="oK_PRINTER_SN">
          <el-input placeholder="请输入设备编号" v-model.trim="addForm.oK_PRINTER_SN"></el-input>
        </el-form-item>
        <el-form-item label="应用范围" prop="printRange">
          <el-checkbox-group v-model="addForm.printRange">
            <el-checkbox v-for="(item, index) in manageRange.slice(1)" :key="index" :label="item.value" border>{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="餐食区域" prop="zoneId" v-show="addForm.printRange.includes(2)">
          <el-select v-model="addForm.zoneId" placeholder="请选择设备所属区域" @change="zoneChange" style="width: 100%">
            <el-option v-for="item in zoneList" :key="item._id" :label="item.zoneName" :value="item._id"> </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="submitPrintInfo">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMakeZoneList, getXinyePrint, xinyePrintOperation } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      printList: [],
      zoneList: [],
      addForm: {
        printerName: '',
        useR_NAME: '',
        useR_KEY: '',
        oK_PRINTER_SN: '',
        printRange: [],
        zoneId: '',
        zoneName: ''
      },
      operationAction: 0,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      listLoading: false,
      addPrintDialogShow: false,
      addFormRules: {
        printerName: [{ required: true, message: '请填写打印机名称', trigger: 'blur' }],
        useR_NAME: [{ required: true, message: '请填写开发者账号', trigger: 'blur' }],
        useR_KEY: [{ required: true, message: '请填写开发者密钥', trigger: 'blur' }],
        oK_PRINTER_SN: [{ required: true, message: '请填写设备编号', trigger: 'blur' }],
        printRange: [{ type: 'array', required: true, message: '请至少选择一个应用范围', trigger: 'change' }]
        // zoneId: [{ required: true, message: '请选择设备所属区域', trigger: 'change' }]
      }
    }
  },
  watch: {
    addPrintDialogShow(val) {
      if (!val) {
        delete this.addForm._id
        this.$refs.addFormRef.resetFields()
        this.addForm.zoneName = ''
      }
    }
  },
  mounted() {
    this.getZoneList()
    this.getPrintList()
  },
  methods: {
    // 获取区域列表
    getZoneList() {
      let params = {
        zoneName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getMakeZoneList(params).then(res => {
        if (res.success) {
          this.zoneList = res.data
        }
      })
    },
    // 获取打印机列表
    getPrintList() {
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
      getXinyePrint(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.printList = res.data
            this.total = res.total
          }
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 区域选择改变
    zoneChange(val) {
      let zone = this.zoneList.find(item => item._id === val)
      this.addForm.zoneName = zone ? zone.zoneName : ''
    },
    // 添加打印机
    addPrint() {
      this.addPrintDialogShow = true
      this.operationAction = 0
    },
    // 提交打印机信息
    submitPrintInfo() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          if (this.addForm.printRange.includes(2) && !this.addForm.zoneId) {
            this.$message.warning('请选择餐食对应区域！')
            return false
          }
          let param = {
            dto: {
              ...this.addForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operationAction
          }
          xinyePrintOperation(param).then(res => {
            if (res.success) {
              this.addPrintDialogShow = false
              this.$message.success(res.msg)
              this.getPrintList()
            }
          })
        }
      })
    },
    // 修改打印机
    editPrint(row) {
      this.addPrintDialogShow = true
      this.operationAction = 1
      this.$nextTick(() => {
        // eslint-disable-next-line camelcase
        let { printerName, useR_NAME, useR_KEY, oK_PRINTER_SN, printRange, zoneId, zoneName, _id } = row
        this.addForm = {
          printerName,
          useR_NAME,
          useR_KEY,
          oK_PRINTER_SN,
          printRange,
          zoneId,
          zoneName,
          _id
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
          let param = {
            dto: {
              ...row,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: 2
          }
          xinyePrintOperation(param).then(res => {
            this.$message.success(res.msg)
            this.getPrintList()
          })
        })
        .catch()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getPrintList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getPrintList()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  margin: 15px 0;
}
.pagination {
  text-align: right;
  margin-top: 15px;
}
</style>
