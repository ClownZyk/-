<template>
  <div class="product-container">
    <div class="product">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <!-- <div class="filters-left">
          <el-form-item>
            <el-input v-model="search.nameOrCode" placeholder="输入产品名或者条形码检索" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div> -->
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
          <!-- <el-table-column align="center" prop="categorysName" label="产品类别" min-width="180" show-overflow-tooltip></el-table-column> -->
          <el-table-column align="center" prop="productName" label="产品名称" show-overflow-tooltip  min-width="250"></el-table-column>
          <el-table-column align="center" prop="title" label="产品型号" show-overflow-tooltip  min-width="200"></el-table-column>
          <el-table-column align="center" prop="barCode" label="产品条形码" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column
            align="center"
            prop="count"
            label="数量"
            min-width="80"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.count" size="mini" style="margin-left: -10px;" @keyup.enter.native="_numModify(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="230" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="120" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <!-- <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button> -->
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
      <!-- 货架相关信息 -->
      <div class="order-info" v-if="$route.query.name">
        <span class="order-info-item">货架名称：{{$route.query.name}}</span>
      </div>
      <!-- form -->
      <!-- <el-dialog :visible.sync="formV" width="1000px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" class="item-long" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品分类" prop="categoryIds">
            <el-cascader v-model="form.categoryIds" :options="categoryList" change-on-select expand-trigger="hover" disabled></el-cascader>
          </el-form-item>
          <el-form-item label="产品条形码" prop="barCode">
            <el-input v-model="form.barCode" disabled></el-input>
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
      </el-dialog> -->
      <!-- 商品选择器 -->
      <supplier-product-select :isShowProductSelect="isShowProductSelect"
                    @handleProductSelect="handleProductSelect"
                    @saveSelected="saveSelected"></supplier-product-select>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import supplierProductSelect from '@/components/supplier-product-select.vue'
// import myUpload from '@/components/my-upload'
import {ShelfProductList, ShelfProductOperation, ShelfProductUpdate} from '@/api/system'
export default {
  name: 'shelf-detail',
  components: {
    supplierProductSelect
    // myUpload
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
      categoryList: [],
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
    // 数量修改
    _numModify(row) {
      this.$confirm('是否修改数量?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.operateAction = 1
        this.operateAxios(row)
      })
    },
    // // 是否禁用提交按钮,与上传相关
    // handleDisabledSubmit (val) {
    //   this.disabledSubmit = val
    // },
    // // 删除图片
    // handleRemoveImg (txt, limitUploadImgs, fileList) {
    //   if (limitUploadImgs > 1) {
    //     this.form[txt] = fileList
    //   } else {
    //     this.form[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
    //   }
    // },
    // // 图片上传成功回调
    // handleUploadImg (txt, limitUploadImgs, imgObj) {
    //   if (limitUploadImgs > 1) {
    //     if (!this.form[txt]) {
    //       this.$set(this.form, txt, [])
    //     }
    //     this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
    //   } else {
    //     this.form[txt] = JSON.parse(JSON.stringify(imgObj))
    //   }
    // },
    // 打开或关闭产品选择器
    handleProductSelect (flag) {
      this.isShowProductSelect = flag
    },
    // 保存选中数据
    saveSelected (newSelectedList) {
      if (!this.$route.query.id) {
        this.$message({
          message: '无关联货架信息',
          type: 'warning'
        })
        return false
      }
      let pList = JSON.parse(JSON.stringify(newSelectedList))
      pList.map(v => {
        v.creater = this.$store.state.UserID
        v.roleId = this.$store.state.UserRole
        v.cid = this.$store.state._cid
        v.goodsShelvesId = this.$route.query.id
        return v
      })
      let params = {
        dto: pList,
        action: 0
      }
      ShelfProductOperation(params).then(res => {
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
    // 提交form
    // formSubmit () {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.$confirm('确认' + this.operateTitle + '吗?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         this.submitLoading = true
    //         this.setCommonParam()
    //         this.operateAxios(this.form)
    //       }).then(() => {
    //         this.closed()
    //       })
    //     }
    //   })
    // },
    // // 设置创建人、角色ID、cid
    // setCommonParam () {
    //   this.$set(this.form, 'creater', this.$store.state.UserID)
    //   this.$set(this.form, 'roleid', this.$store.state.UserRole)
    //   this.$set(this.form, 'cid', this.$store.state._cid)
    // },
    // // 关闭form
    // closed () {
    //   this.formV = false
    //   this.submitLoading = false
    //   this.formDisabled = false
    //   this.form = {}
    //   this.$refs['form'].clearValidate()
    //   this.$refs['form'].resetFields()
    // },
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
      item.creater = this.$store.state.UserID
      item.roleId = this.$store.state.UserRole
      item.cid = this.$store.state._cid
      let params = {
        dto: Object.assign({}, item),
        action: this.operateAction
      }
      ShelfProductUpdate(params).then(res => {
        if (res.success) {
          this.GetListByPage()
        }
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
      })
    },
    // // 多选删除
    // operateDeleteMany () {
    //   this.operateAction = 2
    //   let that = this
    //   if (that.checkedDatas.length > 0) {
    //     that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
    //       that.checkedDatas.forEach(v => {
    //         that.operateAxios(v)
    //       })
    //     })
    //   } else {
    //     that.$message({
    //       message: '请选中要删除的数据',
    //       type: 'warning'
    //     })
    //   }
    // },
    // // 格式化数据
    // formatData () {
    //   if (this.form.brandId === '000000000000000000000000') {
    //     this.form.brandId = ''
    //   }
    //   this.form.mainImgs = []
    //   if (this.form.mainImg !== null && this.form.mainImg.url !== '') {
    //       this.form.mainImgs.push({url: this.form.mainImg.url})
    //   }
    //   // 获取categoryIds
    //   if (this.categoryList.length > 0 && this.form.categorys) {
    //     this.form.categoryIds = []
    //     this.getCategoryIds(this.categoryList, this.form.categorys)
    //   }
    // },
    // // 根据categoryId获取categoryIds
    // getCategoryIds (list, opt) {
    //   try {
    //     this._getCategoryIds(list, opt)
    //   } catch (e) {
    //     // console.log(that.form.categoryIds)
    //   }
    // },
    // _getCategoryIds (list, opt) {
    //   let that = this
    //   list.forEach(val => {
    //     that.form.categoryIds.push(val.value)
    //     if (val.value === opt) {
    //       // 跳出所以循环
    //       // eslint-disable-next-line
    //       throw ('break all')
    //     } else if (val.children && val.children.length > 0) {
    //       // 判断是否还有子项
    //       that._getCategoryIds(val.children, opt)
    //       // 如果子项循环完还是没有跳出循环，删除父级
    //       that.form.categoryIds.pop()
    //     } else {
    //       // 没有子项，直接删除当前节点
    //       that.form.categoryIds.pop()
    //     }
    //   })
    // },
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
        goodsShelvesId: this.$route.query.id || '',
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
      await ShelfProductList(params).then(res => {
        this.listLoading = false
        if (res.success) {
          this.list = res.data
          this.total = res.total
        } else {
          this.$message.warning(res.msg)
        }
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
    // // 加载商品分类
    // async GetAllCategory () {
    //   this.loading = true
    //   let params = {
    //     belongMenu: '/product-category',
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
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   }, err => {
    //     console.log(err)
    //   })
    // }
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
  .order-info {
    .order-info-item {
      margin-right: 25px;
    }
  }
</style>
