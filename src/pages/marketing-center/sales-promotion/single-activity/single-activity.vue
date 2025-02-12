<template>
  <div class="groupon-container">
    <div class="groupon-list" v-if="containerIsShow1">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <!--
          <div class="filters-left">
            <el-form-item>
              <el-input v-model="search.activityName" placeholder="输入名称检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            </el-form-item>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </div>
        -->
        <div class="filters-right">
          <el-form-item>
            <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
            <el-button type="primary" @click="handleCategroyDialogOpen">分类折扣</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="grouponList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="title" label="活动名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条码" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="discountRule[0].price" label="产品价格" width="240" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reserveName" align="center" label="开启状态" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.display" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          >
          </el-pagination>
        </el-col>
      </div>

      <!-- 分类折扣弹框区 -->
      <el-dialog title="分类折扣" :visible.sync="isCategroyDialogVisible" width="450px" @closed="isCategroyDialogVisible = false">
        <el-form ref="categroyDialogFormRef" :model="categroyDialogForm" :rules="categroyDialogFormRules" label-width="80px">
          <el-form-item label="分类名称" prop="categoryId"> <el-cascader v-model="categoryIds" :options="categoryList" clearable :props="categroyProps" placeholder="请选择产品分类（二级）"></el-cascader> </el-form-item>
          <el-form-item label="分类折扣" prop="discount"> <el-input-number v-model="categroyDialogForm.discount" :min="0" :max="100"></el-input-number> </el-form-item>
        </el-form>

        <div slot="footer" style="text-align:center"><el-button type="primary" @click.native="handleCategroyDiscount">提交</el-button></div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetProduct, PActivityOperation, GetAllCategory, categroyDiscountOperation} from '@/api/system'
export default {
  name: 'groupon-list',
  watch: {
    '$route' (to, from) {
      if (to.name === 'single-activity') {
        this.GetListByPage()
        this.containerIsShow1 = true
      } else {
        this.containerIsShow1 = false
      }
    },
    isCategroyDialogVisible(val) {
      if (!val) {
         this.$refs['categroyDialogFormRef'].resetFields()
         this.categoryIds = []
      }
    }
  },
  data () {
    return {
      // 控制列表显示还是字内容显示
      containerIsShow1: true,
      // 查询条件
      search: {
        // 名称
      },
      // 列表
      grouponList: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      // 多选删除的数据列表
      checkedDatas: [],
      categoryList: [],
      // 分类折扣表单数据
      categroyDialogForm: {
        categoryId: '',
        discount: 0
      },
      categroyDialogFormRules: {
        categoryId: [
            { required: true, message: '请选择产品二级分类', trigger: 'blur' }
          ],
        discount: [
            { required: true, message: '请填写分类折扣', trigger: 'blur' }
          ]
      },
      categoryIds: [],
      categroyProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        children: 'children',
        value: 'value',
        label: 'label'
        // emitPath: false
      },
      isCategroyDialogVisible: false
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    // 加载商品分类
    async GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.categoryList.unshift({
              value: '',
              label: '所有产品'
            })
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    handleCategroyDialogOpen() {
        this.isCategroyDialogVisible = true
        this.GetAllCategory()
    },
    handleCategroyDiscount() {
         if (this.categoryIds.length <= 1) {
            this.$message.warning('请选择二级产品分类！')
            return false
         }
         this.isCategroyDialogVisible = false
         let params = {
           promotionId: this.$route.query.id,
           categoryId: this.categoryIds[this.categoryIds.length - 1],
           discount: this.categroyDialogForm.discount,
           creater: this.$store.state.UserID,
           roleId: this.$store.state.UserRole,
           cid: this.$store.state._cid
         }
        categroyDiscountOperation(params).then(res => {
          this.$message({
            message: res.msg,
            type: res.success ? 'success' : 'error'
          })
          this.GetListByPage()
        })
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push({
            path: '/single-activity-detail',
            query: {promotionId: this.$route.query.id, action: action}
          })
          break
        case '编辑': // 编辑
          this.$router.push({
            path: '/single-activity-detail',
            query: {id: row._id, promotionId: this.$route.query.id, action: action}
            })
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.$router.push({
            path: '/single-activity-detail',
            query: {id: row._id, operate: 'view', promotionId: this.$route.query.id}
          })
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      PActivityOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
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
      if (!this.search.activityTimeArr) {
        this.search.activityTimeArr = []
      }
      let params = {
        promotionId: this.$route.query.id,
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
      await GetProduct(params).then(res => {
        this.listLoading = false
        this.grouponList = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
