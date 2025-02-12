<template>
  <div class="zone-container">
    <div class="filter">
      <el-form class="filter-left" :model="searchForm" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.zoneName" placeholder="请输入区名检索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="filter-right">
        <el-button type="primary" @click="addFormShow">新增区域</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table :data="zoneList" border style="width: 100%">
        <el-table-column type="index" label="编号" width="55" align="center"> </el-table-column>
        <el-table-column prop="zoneName" label="区名" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <!-- <el-table-column prop="userName" label="登录账号" min-width="180" align="center" show-overflow-tooltip> </el-table-column> -->
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="editZone(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="removeZone(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog title="分工区域" :visible.sync="isAddFormShow" width="30%">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-row>
          <el-col>
            <el-form-item label="区域名称" prop="zoneName">
              <el-input v-model="addForm.zoneName" placeholder="请输入区域名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="addForm.userName" placeholder="请输入登录账号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="passWord">
              <el-input type="password" v-model="addForm.passWord" placeholder="请输入登录密码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="producer">
              <el-input v-model="addForm.producer" placeholder="请输入负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="addForm.phone" placeholder="请输入负责人电话" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sumbitZone">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDrinkZoneList, DrinkZoneOperation } from '@/api/system'
export default {
  data() {
    return {
      searchForm: {
        zoneName: ''
      },
      zoneList: [],
      addForm: {
        zoneName: '',
        userName: '',
        passWord: '',
        producer: '',
        phone: ''
      },
      operationAction: 0,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      isAddFormShow: false,
      tableLoading: false,
      addFormRules: {
        zoneName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
        // userName: [
        //   { required: true, message: '请输入登录账号', trigger: 'blur' },
        //   { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        // ],
        // passWord: [
        //   { required: true, message: '请输入登录密码', trigger: 'blur' },
        //   { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        // ]
      }
    }
  },
  watch: {
    isAddFormShow(val) {
      if (!val) {
        delete this.addForm._id
        this.$refs.addFormRef.resetFields()
      }
    }
  },
  mounted() {
    this.getZoneList()
  },
  methods: {
    // 获取分工区域
    getZoneList() {
      let params = {
        ...this.searchForm,
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
      getDrinkZoneList(params).then(
        res => {
          if (res.success) {
            this.tableLoading = false
            this.zoneList = res.data
            this.total = res.total
          }
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    addFormShow() {
      this.isAddFormShow = true
      this.operationAction = 0
    },
    // 编辑区域
    editZone(row) {
      this.isAddFormShow = true
      this.$nextTick(() => {
        this.operationAction = 1
        let { zoneName, userName, passWord, producer, phone, _id } = row
        this.addForm = { zoneName, userName, passWord, producer, phone, _id }
      })
    },
    // 提交分工区域
    sumbitZone() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          this.zoneOperation()
        }
      })
    },
    zoneOperation(row) {
      const param = row ? { ...row } : { ...this.addForm }
      let params = {
        dto: {
          ...param,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: this.operationAction
      }
      DrinkZoneOperation(params).then(
        res => {
          if (res.success) {
            this.isAddFormShow = false
            this.$message.success(res.msg)
            this.getZoneList()
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 删除区域
    removeZone(row) {
      this.operationAction = 2
      this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.zoneOperation(row)
        })
        .catch(() => {})
    },
    searchCondition() {
      this.pageIndex = 1
      this.getZoneList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getZoneList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getZoneList()
    }
  }
}
</script>

<style lang="scss" scoped>
.zone-container {
  .filter {
    display: flex;
    justify-content: space-between;
  }
  .table-list {
    .pagination {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
