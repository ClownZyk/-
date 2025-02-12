<template>
  <div class="product-container">
    <div class="product">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.nameOrCode" placeholder="输入产品名或者条形码检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="handleProductSelect(true)">选择产品</el-button>
          <!-- <el-button type="danger" @click="operateDeleteMany">批量删除</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="categorysName" label="产品类别" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip  min-width="180"></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条形码" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="specift" label="产品单位" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="costPrice" label="供货价" width="100" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column align="center" prop="referPrice" label="市场参考价" width="100" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="shelfLife" label="保质期时间" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="shelfState" label="保质期类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.shelfState === 1 ? '年' : scope.row.shelfState === 2 ? '月' : scope.row.shelfState === 3 ? '日' : ''}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="180" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
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
      <!-- form -->
      <el-dialog :visible.sync="formV" width="1000px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" class="item-long" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品分类" prop="categoryIds">
            <el-cascader v-model="form.categoryIds" :options="categoryList" change-on-select expand-trigger="hover" disabled></el-cascader>
          </el-form-item>
          <el-form-item label="产品品牌" prop="brandId">
            <el-select v-model="form.brandId" filterable disabled>
              <el-option v-for="(item, index) in brandList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品条形码" prop="barCode">
            <el-input v-model="form.barCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品单位" prop="specift">
            <el-input v-model="form.specift" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品产地" prop="placeOrigin">
            <el-input v-model="form.placeOrigin" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品净重" prop="netWeight">
            <el-input v-model="form.netWeight" disabled></el-input>
          </el-form-item>
          <el-form-item label="许可证编号" prop="producer">
            <el-input v-model="form.producer" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品标准号" prop="sweetness">
            <el-input v-model="form.sweetness" disabled></el-input>
          </el-form-item>
          <el-form-item label="保质期" prop="shelfLife">
            <el-input-number controls-position="right" v-model="form.shelfLife" disabled></el-input-number>
          </el-form-item>
          <el-form-item label="保质期类型" prop="shelfState">
            <el-select v-model="form.shelfState" disabled>
              <el-option v-for="(item, index) in shelfList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="市场参考价" prop="referPrice">
            <el-input-number controls-position="right" v-model="form.referPrice" disabled></el-input-number>
          </el-form-item> -->
          <el-form-item label="供货价" prop="costPrice">
            <el-input-number controls-position="right" v-model="form.costPrice" placeholder="供货价"></el-input-number>
          </el-form-item>
          <div>
            <el-form-item label="主图" prop="mainImgs">
              <my-upload :imgs="form.mainImgs"
                        :limitUploadImgs="1"
                        @handleDisabledSubmit="handleDisabledSubmit"
                        @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)"
                        @handleUploadImg="handleUploadImg('mainImg', 1, $event)" disabled>
              </my-upload>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="formDisabled">提交</el-button>
        </div>
      </el-dialog>
      <!-- 商品选择器 -->
      <supplier-product-select :isShowProductSelect="isShowProductSelect"
                    @handleProductSelect="handleProductSelect"
                    @saveSelected="saveSelected"></supplier-product-select>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import supplierProductSelect from '@/components/supplier-product-select.vue'
import myUpload from '@/components/my-upload'
import {SupplierProductGetListByPage, SupplierProductOperation, GetAllCategory, SupplierProductCreateProductList} from '@/api/system'
export default {
  name: 'product',
  components: {
    supplierProductSelect,
    myUpload
  },
  data () {
    return {
      // 是否打开产品选择器
      isShowProductSelect: false,
      // 查询条件
      search: {
        // 名称
        nameOrCode: ''
      },
      // 保质期类型
      shelfList: [
        { value: 1, label: '年' },
        { value: 2, label: '月' },
        { value: 3, label: '日' }
      ],
      categoryList: [],
      brandList: [],
      formDisabled: false,
      submitLoading: false,
      formV: false,
      form: {},
      formRules: {
        brandName: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'}
        ]
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
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
    },
    // 删除图片
    handleRemoveImg (txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
      }
    },
    // 图片上传成功回调
    handleUploadImg (txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 打开或关闭产品选择器
    handleProductSelect (flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中数据
    saveSelected (newSelectedList) {
      if (!this.$route.query.id) {
        this.$message({
          message: '无关联供应商信息',
          type: 'warning'
        })
        return false
      }
      let params = {
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid,
        supid: this.$route.query.id,
        productList: JSON.parse(JSON.stringify(newSelectedList))
      }
      SupplierProductCreateProductList(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        if (res.success) {
          this.handleProductSelect(false)
          this.GetListByPage()
        }
      })
    },
    // // 保存选中的商品
    // saveSelected (selectRow, selectFatherRow) {
    //   // 保存选中的产品信息
    //   if (this.$route.query.id !== undefined) {
    //     this.operateAction = 0
    //     Object.assign(this.form, JSON.parse(JSON.stringify(selectRow)), JSON.parse(JSON.stringify(selectFatherRow)))
    //     this.form.supid = this.$route.query.id
    //     delete this.form._id
    //     this.setCommonParam()
    //     this.operateAxios(this.form)
    //   } else {
    //     this.$message({
    //       message: '无关联供应商信息',
    //       type: 'warning'
    //     })
    //     return false
    //   }
    // },
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
            this.setCommonParam()
            this.operateAxios(this.form)
          }).then(() => {
            this.closed()
          })
        }
      })
    },
    // 设置创建人、角色ID、cid
    setCommonParam () {
      this.$set(this.form, 'creater', this.$store.state.UserID)
      this.$set(this.form, 'roleid', this.$store.state.UserRole)
      this.$set(this.form, 'cid', this.$store.state._cid)
    },
    // 关闭form
    closed () {
      this.formV = false
      this.submitLoading = false
      this.formDisabled = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
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
          this.GetAllCategory()
          this.form = JSON.parse(JSON.stringify(row))
          this.formatData()
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
          this.GetAllCategory()
          this.formDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          this.formatData()
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
      SupplierProductOperation(params).then(res => {
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
    // 格式化数据
    formatData () {
      if (this.form.brandId === '000000000000000000000000') {
        this.form.brandId = ''
      }
      this.form.mainImgs = []
      if (this.form.mainImg !== null && this.form.mainImg.url !== '') {
          this.form.mainImgs.push({url: this.form.mainImg.url})
      }
      // 获取categoryIds
      if (this.categoryList.length > 0 && this.form.categorys) {
        this.form.categoryIds = []
        this.getCategoryIds(this.categoryList, this.form.categorys)
      }
    },
    // 根据categoryId获取categoryIds
    getCategoryIds (list, opt) {
      try {
        this._getCategoryIds(list, opt)
      } catch (e) {
        // console.log(that.form.categoryIds)
      }
    },
    _getCategoryIds (list, opt) {
      let that = this
      list.forEach(val => {
        that.form.categoryIds.push(val.value)
        if (val.value === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw ('break all')
        } else if (val.children && val.children.length > 0) {
          // 判断是否还有子项
          that._getCategoryIds(val.children, opt)
          // 如果子项循环完还是没有跳出循环，删除父级
          that.form.categoryIds.pop()
        } else {
          // 没有子项，直接删除当前节点
          that.form.categoryIds.pop()
        }
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
      let params = {
        supid: this.$route.query.id || '',
        nameOrCode: this.search.nameOrCode,
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
      await SupplierProductGetListByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 加载商品分类
    async GetAllCategory () {
      this.loading = true
      let params = {
        belongMenu: '/supply-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(res => {
        if (res.success) {
          this.categoryList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
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
    .el-select, .el-input-number, .el-cascader {
      width: 202px;
    }
  }
</style>
