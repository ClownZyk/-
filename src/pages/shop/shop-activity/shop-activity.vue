<template>
  <div class="product-container">
    <div class="shop-activity" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <!-- <el-button type="primary" @click="addCategory">新增活动分类</el-button> -->
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增活动</el-button>
          <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="活动名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isEnabled" label="是否启用" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isEnabled" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序号" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="450" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="handleProductSelectView(true, scope.row)">查看活动商品</el-button>
              <el-button type="primary" size="mini" @click="handleProductSelect(true, scope.row)">选择活动商品</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
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
    </div>
    <router-view v-else></router-view>
    <!-- 活动维护form -->
    <el-dialog :visible.sync="formV" width="700px" @closed="closed">
      <el-form :model="form" label-width="80px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" class="item-long"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input-number controls-position="right" v-model="form.sort" placeholder="最小值为99" :min="99"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
            <el-switch v-model="form.isEnabled"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="closed">返回</el-button>
        <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled">提交</el-button>
      </div>
    </el-dialog>
    <!-- 商品选择器 -->
    <product-select :isShowProductSelect="isShowProductSelect"
                    :selectedList="selectedList"
                    @handleProductSelect="handleProductSelect"
                    @saveSelected="saveSelected"></product-select>
    <!-- 已选择商品查看 -->
    <product-select-view :isShowProductSelectView="isShowProductSelectView"
                         :selectedListView="selectedListView"
                         :selectedListViewLoading="selectedListViewLoading"
                         @handleProductSelectView="handleProductSelectView"></product-select-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {ProductPromotionGetListByPage, ProductPromotionOperation, ProductPromotionGetDetailById} from '@/api/system'
import productSelect from '@/components/product-select.vue'
import productSelectView from '@/components/product-select-view.vue'
export default {
  name: 'shop-activity',
  components: {
    productSelect,
    productSelectView
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'shop-activity') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      // form相关
      form: {
        sort: 99,
        products: []
      },
      formV: false,
      submitLoading: false,
      formDisabled: false,
      formRules: {
        name: [
          {required: true, message: '请输入标签名称', trigger: 'blur'}
        ]
      },
      // 是否打开产品选择器
      isShowProductSelect: false,
      isShowProductSelectView: false,
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // 查询条件
      search: {
        name: ''
      },
      // 列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      operateTitle: '',
      // 多选删除的数据列表
      checkedDatas: [],
      // 已选的商品数据列表
      selectedList: [],
      selectedListView: [],
      selectedListViewLoading: false
    }
  },
  methods: {
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            // let activityIds = this.form.activityIds
            // if (activityIds.length > 0) {
            //   this.form.activityId = activityIds[activityIds.length - 1]
            // }
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
      this.formDisabled = false
      this.form = {
        sort: 99,
        products: []
      }
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 保存选中数据
    saveSelected (newSelectedList) {
      this.form.products = JSON.parse(JSON.stringify(newSelectedList))
      this.operateAction = 1
      this.$set(this.form, 'creater', this.$store.state.UserID)
      this.$set(this.form, 'roleid', this.$store.state.UserRole)
      this.$set(this.form, 'cid', this.$store.state._cid)
      this.operateAxios(this.form)
      this.handleProductSelect(false)
    },
    // 打开或关闭产品选择器
    handleProductSelect (flag, row) {
      if (flag) {
        // 打开产品选择器，保存当前操作的行id
        this.form = JSON.parse(JSON.stringify(row))
        this.selectedList = row.products
      } else {
        // 关闭产品选择器，初始化数据
        this.form = {
          sort: 99,
          products: []
        }
        this.selectedList = []
      }
      this.isShowProductSelect = flag
    },
    // 打开或关闭已选择产品弹框
    handleProductSelectView (flag, row) {
      if (flag) {
        // 打开，加载数据
        let params = {
          _id: row._id
        }
        this.selectedListViewLoading = true
        ProductPromotionGetDetailById(params).then(res => {
          this.selectedListViewLoading = false
          this.selectedListView = res.data.products ? res.data.products : []
        }, err => {
          console.log(err)
        })
      } else {
        // 关闭，初始化数据
        this.selectedListView = []
      }
      this.isShowProductSelectView = flag
    },
    // 新增分类
    addCategory () {
      this.$router.push('/shop-activity-category')
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateTitle = title
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.form = JSON.parse(JSON.stringify(row))
          this.formV = true
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
          this.formDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      ProductPromotionOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      console.log('pageSize 改变')
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      console.log('currentPage 改变')
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载活动分类
    // async GetAllCategory () {
    //   let params = {
    //     belongMenu: '/shop-activity-category',
    //     isPage: false,
    //     isOrder: true,
    //     isAsc: true,
    //     creater: this.$store.state.UserID,
    //     roleId: this.$store.state.UserRole,
    //     cid: this.$store.state._cid
    //   }
    //   await GetAllCategory(params).then(res => {
    //     if (res.success) {
    //       this.categoryList = res.data
    //       this.categoryList.unshift({
    //         value: '',
    //         label: '所有活动'
    //       })
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   }, err => {
    //     console.log(err)
    //   })
    // },
    // 加载数据
    async GetListByPage () {
      let params = {
        name: this.search.name,
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
      await ProductPromotionGetListByPage(params).then(res => {
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
    // this.GetAllCategory()
  }
}
</script>

<style lang="scss" scoped>
  .product-container {
    position: relative;
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
      width: 533px;
    }
  }
</style>
