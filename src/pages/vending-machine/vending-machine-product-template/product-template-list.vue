<template>
  <div v-if="containerIsShow">
    <el-form>
      <el-form-item> <el-button type="primary" @click="handleTemplateCateAdd()">新增模板</el-button></el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="templateList" border>
      <el-table-column type="index" width="80" align="center"></el-table-column>
      <el-table-column prop="categoryName" label="模板名称" min-width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="380" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleTemplateProduct(scope.row)">产品添加</el-button>
          <el-button size="mini" type="success" @click="handleMachineTemplateMultiplex(scope.row)">售卖柜复用</el-button>
          <el-button size="mini" type="warning" @click="handleTemplateCateUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="handleTemplateCateDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="addFormState === 0 ? '新增模板' : '编辑模板'" :visible.sync="addCateFormVisible" width="500px" :close-on-click-modal="false">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
        <el-form-item label="模板名称" prop="categoryName"> <el-input v-model="addForm.categoryName" placeholder="请输入模板名称" /> </el-form-item>
      </el-form>
      <div slot="footer"><el-button :loading="submitLoading" type="primary" @click="submitTemplateInfo">确 定</el-button></div>
    </el-dialog>

    <!-- 售卖机列表选择弹框 -->
    <el-dialog title="售卖机选择" :visible.sync="isVendingMachineSelectShow" width="900px" :close-on-click-modal="false">
      <div v-loading="tableLoading">
        <el-row>
          <!--
            <el-checkbox-group v-model="checkedMachines">
              <el-checkbox v-for="(item, index) in machineList" :label="item.vUnionCode" :key="index" border :disabled="!item.code">{{ item.name || '暂未绑定售卖柜' }}({{ item.vUnionCode }})</el-checkbox>
            </el-checkbox-group>
          -->
          <el-radio-group v-model="checkedMachines" @input="checkedMachinesChange">
            <el-radio v-for="(item, index) in machineList" :label="item.vUnionCode" :key="index" border :disabled="!item.code">{{ item.name || '暂未绑定售卖柜' }}({{ item.vUnionCode }})</el-radio>
          </el-radio-group>
        </el-row>
        <el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 25, 35, 45]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
            style="margin-top:15px;text-align:right"
          >
          </el-pagination>
        </el-row>
      </div>
      <span slot="footer"> <el-button :loading="syncLoading" type="primary" @click="submitSelectMachineInfo" :disabled="checkedMachines.length <= 0">确 定</el-button> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { GetListByPage, Operation, getShopBindVendingMachine, productAyncDeviceOperation } from '@/api/system'

export default {
  data() {
    return {
      templateList: [],
      listLoading: false,
      addForm: {
        sortNo: 99,
        isShow: true,
        url: '',
        img: null
      },
      addFormState: 0,
      checkedMachineInfo: {},
      syncLoading: false,
      submitLoading: false,
      tableLoading: false,
      addCateFormVisible: false,
      templateId: '',
      machineList: [],
      checkedMachines: '',
      isVendingMachineSelectShow: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        categoryName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'product-template-list') {
        this.getProductTemplateList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    addCateFormVisible(val) {
      if (!val) {
        this.addForm = {
          sortNo: 99,
          isShow: true,
          url: '',
          img: null
        }
      }
    },
    isVendingMachineSelectShow(val) {
      if (!val) {
        this.checkedMachines = ''
        this.templateId = ''
        this.checkedMachineInfo = {}
      }
    }
  },
  mounted() {
    this.getProductTemplateList()
  },
  methods: {
    getProductTemplateList() {
      let params = {
        belongMenu: '/machine-template',
        categoryName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      GetListByPage(params)
        .then(res => {
          this.listLoading = false
          this.templateList = res.data
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleTemplateCateAdd() {
      this.addCateFormVisible = true
      this.addFormState = 0
    },
    handleTemplateCateUpdate(row) {
      this.addCateFormVisible = true
      this.addFormState = 1
      let { categoryName, code, isShow, _id, sortNo, belongMenu, belong, img } = row
      this.addForm = {
        categoryName,
        code,
        isShow,
        _id,
        sortNo,
        belongMenu,
        belong,
        img
      }
    },
    handleTemplateCateDelete(row) {
      this.addFormState = 2
      this.$confirm('确定删除此模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleTemplateOperation(row)
        })
        .catch(() => {})
    },
    submitTemplateInfo() {
      this.$refs['addForm'].validate(val => {
        if (val) {
          this.handleTemplateOperation()
        }
      })
    },
    handleTemplateOperation(row) {
      const publicParam = row ? { ...row } : { ...this.addForm }
      const param = {
        dto: {
          ...publicParam,
          belongMenu: '/machine-template',
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: this.addFormState
      }
      Operation(param).then(res => {
        this.$message.success(res.msg)
        this.addCateFormVisible = false
        this.getProductTemplateList()
      })
    },
    handleTemplateProduct(row) {
      this.$router.push({ path: '/product-template-detail', query: { templateId: row._id } })
    },
    // 售卖柜复用
    handleMachineTemplateMultiplex(row) {
      this.isVendingMachineSelectShow = true
      this.templateId = row._id
      this.getShopBindVendingMachine()
    },
    getShopBindVendingMachine() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getShopBindVendingMachine(params)
        .then(res => {
          this.tableLoading = false
          this.machineList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    checkedMachinesChange(val) {
      this.checkedMachineInfo = this.machineList.find(item => item.vUnionCode === val)
    },
    submitSelectMachineInfo() {
      this.$confirm('确认复用模板产品到已选售卖机?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            vUnionCode: [this.checkedMachineInfo.vUnionCode],
            itemCode: [],
            categoryId: this.templateId,
            cid: this.checkedMachineInfo.cid
          }
          this.syncLoading = true
          productAyncDeviceOperation(params)
            .then(res => {
              this.syncLoading = false
              this.isVendingMachineSelectShow = false
              this.$message.success(res.msg)
              this.getProductTemplate()
            })
            .catch(() => {
              this.syncLoading = false
            })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShopBindVendingMachine()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShopBindVendingMachine()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  .el-radio {
    width: 260px !important;
    margin-right: 15px !important;
    margin-bottom: 15px !important;
  }
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: unset;
  }
}
</style>
