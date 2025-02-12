<template>
  <div class="expiring-container">
    <div class="expiring">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.oddNumbers" placeholder="请输入采购单号检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.barcode" placeholder="请输入产品条码检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.productName" placeholder="请输入产品名称检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.days" :controls="false" class="filters-search filters-search-num" @keyup.enter.native="GetListByPage"></el-input>天内到期
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.handleState" placeholder="请选择处理状态检索">
              <el-option
                v-for="item in handleStateList"
                :key="item.value"
                :label="item.label"
                :value="item.value">{{item.label}}</el-option>
            </el-select>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="oddNumbers" label="采购单号" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barcode" label="产品条形码" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="procount" label="产品数量" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPrice" label="供货价" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="handleState" label="处理状态" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.handleState === 0" style="color: red;">未处理</div>
              <div v-else-if="scope.row.handleState === 1" style="color: #13CE66;">已处理</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="datetime" label="生产日期" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.datetime ? scope.row.datetime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="expirationTime" label="过期时间" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.expirationTime ? scope.row.expirationTime.split(' ')[0] : ''}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="shelfLife" label="保质期时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="shelfState" label="保质期类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.shelfState === 1 ? '年' : scope.row.shelfState === 2 ? '月' : scope.row.shelfState === 3 ? '日' : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="处理备注" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="200" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="operateFunc(scope.row)">临期产品处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="720px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true">
          <el-form-item label="处理备注" prop="remark">
            <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入处理方式..."  class="item-long"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetPeriodTimeByPage, UpdatePeriodTimeStatues} from '@/api/system'
export default {
  name: 'supply-expiring',
  data () {
    return {
      handleStateList: [
        { value: 0, label: '全部' },
        { value: 1, label: '已处理' },
        { value: 2, label: '未处理' }
      ],
      // 查询条件
      search: {
        oddNumbers: '',
        barcode: '',
        productName: '',
        handleState: 0,
        days: ''
      },
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        remark: [
          {required: true, message: '请输入处理方式', trigger: 'blur'}
        ]
      },
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            this.form.handleState = 1 // 状态：已处理
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.operateAxios(this.form)
          }).then(() => {
            this.closed()
          })
        }
      })
    },
    // 关闭form
    closed () {
      this.formV = false
      this.submitLoading = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 处理
    operateFunc (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.formV = true
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = Object.assign({}, item)
      UpdatePeriodTimeStatues(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      if (this.search.days !== '' && !/^\d+$/.exec(this.search.days)) {
        this.$message({
          message: '请输入合法天数',
          type: 'warning'
        })
        this.search.days = ''
        return false
      }
      let params = {
        days: this.search.days,
        oddNumbers: this.search.oddNumbers,
        barCode: this.search.barcode,
        productName: this.search.productName,
        handleState: this.search.handleState,
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
      await GetPeriodTimeByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
  .expiring-container {
    padding: 20px;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filters-left {
      .filters-search {
        display: inline-block;
        width: 200px;
      }
      .filters-search-num {
        width: 80px;
        margin: 0 5px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
  .form {
    .item-long {
      width: 492px;
    }
    .el-date-editor {
      width: 202px;
    }
  }
</style>
