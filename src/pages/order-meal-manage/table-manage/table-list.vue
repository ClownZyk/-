<template>
  <div>
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="桌台区域">
          <el-select v-model="filterParam.areaId" placeholder="请选择桌台区域"> <el-option v-for="item in tableAreaList" :key="item._id" :label="item.title" :value="item._id" @change="getOrderTableList('refresh')"> </el-option> </el-select>
        </el-form-item>
        <el-form-item label="桌台名称"> <el-input v-model.trim="filterParam.title" placeholder="请输入桌台名称搜索" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getOrderTableList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="warning" @click="handleOrderTableAdd">新增桌台</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="tableList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="桌台名称" prop="title" min-width="160"></el-table-column>
      <el-table-column label="所属区域" prop="areaName" min-width="160" align="center"></el-table-column>
      <el-table-column label="标准用餐人数" prop="number" min-width="140" align="center"></el-table-column>
      <el-table-column label="数字助记码" prop="shorthandCode" min-width="140" align="center"> </el-table-column>
      <el-table-column label="使用状态" prop="usageStatus" min-width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.usageStatus === 1" style="color:#909399">空闲</div>
          <div v-else-if="scope.row.usageStatus === 2" style="color:#67C23A">待下单</div>
          <div v-else-if="scope.row.usageStatus === 3" style="color:#F56C6C">待结账</div>
          <div v-else-if="scope.row.usageStatus === 4" style="color:#E6A23C">已预结</div>
          <div v-else-if="scope.row.usageStatus === 5" style="color:#409EFF">待清台</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleOrderTablePosterCreate(scope.row)">生成桌码</el-button>
          <el-button size="mini" type="warning" @click="handleOrderTableEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleOrderTableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </el-row>

    <el-dialog :title="`桌台${formState === 0 ? '新增' : '修改'}`" :visible.sync="isTableFormShow" width="500px" :close-on-click-modal="false">
      <el-form ref="tableFormRef" :model="tableForm" :rules="tableFormRules" label-width="100px" label-position="right">
        <el-form-item label="桌台名称：" prop="title"> <el-input type="text" v-model.trim="tableForm.title" placeholder="请输入桌台名称，例如：小桌01"></el-input> </el-form-item>
        <el-form-item label="所属区域：" prop="areaId">
          <el-select v-model="tableForm.areaId" placeholder="请选择桌台所属区域" style="width: 100%"> <el-option v-for="item in tableAreaList" :key="item._id" :label="item.title" :value="item._id"> </el-option> </el-select>
        </el-form-item>
        <el-form-item label="用餐人数：" prop="number">
          <el-input-number v-model.trim="tableForm.number" :controls="false" :min="1" :max="99" :step="1" step-strictly placeholder="请输入1-99的整数" style="width:100%"></el-input-number>
        </el-form-item>
        <el-form-item label="数字助记码：" prop="shorthandCode">
          <el-input-number v-model="tableForm.shorthandCode" :controls="false" :min="0" :max="9999" :step="1" step-strictly placeholder="请输入4位整数以内" style="width:100%"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isTableFormShow = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitTableFormInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDiningAreaList, getDiningTableList, diningTableOperation, createDiningTablePoster } from '@/api/system'

export default {
  watch: {
    isTableFormShow(val) {
      if (!val) {
        this.tableForm = {
          title: '',
          areaId: '',
          number: 1,
          shorthandCode: 0
        }
      }
    }
  },
  data() {
    return {
      filterParam: {
        title: ''
      },
      tableList: [],
      listLoading: false,
      tableAreaList: [],
      tableForm: {
        title: '',
        areaId: '',
        number: 1,
        shorthandCode: 0
      },
      formState: 0,
      isTableFormShow: false,
      submitLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableFormRules: {
        title: [{ required: true, message: '请输入桌台名称', trigger: 'blur' }],
        areaId: [{ required: true, message: '请选择桌台所属区域', trigger: 'change' }],
        number: [{ required: true, message: '请输入标准用餐人数', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getTableAreaList()
    this.getOrderTableList()
  },
  methods: {
    getTableAreaList() {
      let params = {
        title: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getDiningAreaList(params).then(res => {
        this.tableAreaList = res.data
      })
    },
    getOrderTableList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getDiningTableList(params)
        .then(res => {
          this.listLoading = false
          this.tableList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleOrderTableAdd() {
      this.formState = 0
      this.isTableFormShow = true
    },
    handleOrderTableEdit(row) {
      this.formState = 1
      this.isTableFormShow = true
      this.$nextTick(() => {
        this.tableForm = row
      })
    },
    handleOrderTableDelete(row) {
      this.formState = 2
      this.$confirm('此操作将永久删除该桌台信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleTableOperation(row)
        })
        .catch(() => {})
    },
    submitTableFormInfo() {
      this.$refs['tableFormRef'].validate(valid => {
        if (valid) {
          this.handleTableOperation()
        }
      })
    },
    handleTableOperation(row) {
      let publicParam = row ? { ...row } : { ...this.tableForm }
      let params = {
        dto: {
          ...publicParam,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: this.formState
      }
      this.submitLoading = true
      diningTableOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isTableFormShow = false
          this.$message.success(res.msg)
          this.getOrderTableList()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    // 桌码生成
    handleOrderTablePosterCreate(row) {
      let params = {
        tableId: row._id,
        tableName: row.title,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      createDiningTablePoster(params).then(res => {
        window.open(res.data)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getOrderTableList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getOrderTableList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
