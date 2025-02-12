<template>
  <div>
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="区域名称"> <el-input v-model.trim="filterParam.title" placeholder="请输入区域名称搜索" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getTableAreaList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="warning" @click="handleOrderTableAreaAdd">新增区域</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="areaList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="区域名称" prop="title" min-width="160"></el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleOrderTableAreaEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleOrderTableAreaDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background>
      </el-pagination>
    </el-row>

    <el-dialog :title="`区域${formState === 0 ? '新增' : '修改'}`" :visible.sync="isTableAreaFormShow" width="500px" :close-on-click-modal="false">
      <el-form ref="tableAreaFormRef" :model="tableAreaForm" :rules="tableAreaFormRules" label-width="100px" label-position="right">
        <el-form-item label="区域名称：" prop="title"> <el-input type="text" v-model.trim="tableAreaForm.title" placeholder="请输入区域名称"></el-input> </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isTableAreaFormShow = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitTableAreaFormInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDiningAreaList, diningAreaOperation } from '@/api/system'

export default {
  watch: {
    isTableAreaFormShow(val) {
      if (!val) {
        delete this.tableAreaForm._id
        this.$refs['tableAreaFormRef'].resetFields()
      }
    }
  },
  data() {
    return {
      filterParam: {
        title: ''
      },
      areaList: [],
      listLoading: false,
      tableAreaForm: {
        title: ''
      },
      formState: 0,
      isTableAreaFormShow: false,
      submitLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableAreaFormRules: {
        title: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getTableAreaList()
  },
  methods: {
    getTableAreaList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
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
      getDiningAreaList(params)
        .then(res => {
          this.listLoading = false
          this.areaList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleOrderTableAreaAdd() {
      this.formState = 0
      this.isTableAreaFormShow = true
    },
    handleOrderTableAreaEdit(row) {
      this.formState = 1
      this.isTableAreaFormShow = true
      this.$nextTick(() => {
        let { title, _id } = row
        this.tableAreaForm = {
          title,
          _id
        }
      })
    },
    handleOrderTableAreaDelete(row) {
      this.formState = 2
      this.$confirm('此操作将永久删除该区域信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.handleTableAreaOperation(row)
        })
        .catch(() => {})
    },
    submitTableAreaFormInfo() {
      this.$refs['tableAreaFormRef'].validate(valid => {
        if (valid) {
          this.handleTableAreaOperation()
        }
      })
    },
    handleTableAreaOperation(row) {
      let publicParam = row ? { ...row } : { ...this.tableAreaForm }
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
      diningAreaOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isTableAreaFormShow = false
          this.$message.success(res.msg)
          this.getTableAreaList()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableAreaList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTableAreaList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
