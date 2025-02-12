<template>
  <div class="detail">
    <el-row>
      <el-col :span="12">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
          <!-- 套餐名称,套餐区域 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="setMealName">
                <div class="form-item-title">套餐名称<span class="border"></span> <span class="EnName">title</span></div>
                <el-input v-model="addForm.setMealName" placeholder="请输入套餐名称(最多10个字符)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="zoneName">
                <div class="form-item-title">套餐区域<span class="border"></span> <span class="EnName">zoneName</span></div>
                <el-select v-model="addForm.zoneId" placeholder="请选择产品所在区域" @change="zoneChange"> <el-option v-for="item in zoneList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option> </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 价格，排序号，启用状态 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="setPrice">
                <div class="form-item-title">套餐价格<span class="border"></span> <span class="EnName">Price</span></div>
                <el-input-number :min="0" class="mag-input" v-model="addForm.setPrice"></el-input-number>
                <div class="tips" style="font-size:12px">注：套餐价格不得高于套餐所包含产品总价</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="sortNo">
                <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">Sort</span></div>
                <el-input-number :min="0" class="mag-input" v-model="addForm.sortNo"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="display">
                <div class="form-item-title">启用状态<span class="border"></span> <span class="EnName">State</span></div>
                <el-switch v-model="addForm.display"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="form-item-title">
                  套餐标准产品<span class="border"></span> <span class="EnName">Product</span>
                  <el-button type="warning" size="mini" style="margin-left: 15px" @click="addProduct">添加产品</el-button>
                </div>
                <div class="product-list">
                  <el-table :data="addForm.fixedProduct" border size="small">
                    <el-table-column align="center" type="index" label="编号" width="55"></el-table-column>
                    <el-table-column align="center" prop="productName" label="产品名称" min-width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="barCode" label="产品条码" min-width="140" show-overflow-tooltip> </el-table-column>
                    <el-table-column align="center" prop="price" label="产品价格" min-width="140" show-overflow-tooltip> </el-table-column>
                    <el-table-column align="center" label="操作" width="120" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="removeProd(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 套餐包含分类 -->
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="form-item-title">
                  套餐产品分类<span class="border"></span> <span class="EnName">Category</span>
                  <el-button type="warning" size="mini" style="margin-left: 15px" @click="addCateDialog">添加分类</el-button>
                </div>
                <div class="tips">注：若只选择分类，不选产品，则默认该分类下的全部产品</div>
                <div class="cate-list">
                  <el-table :data="addForm.optCategory" border size="small">
                    <el-table-column type="expand" width="55" align="center">
                      <template slot-scope="props">
                        <div class="prod-contain" v-if="props.row.optProduct.length > 0">
                          <div class="prod-item" v-for="(item, index) in props.row.optProduct" :key="index">
                            <div class="productName">{{ item.productName }}</div>
                            <div class="barCode">{{ item.barCode }}</div>
                            <div class="price">{{ item.price }}元</div>
                            <div><el-button size="mini" type="danger" plain @click="removeCateProd(props.row.categoryId, item)">删除</el-button></div>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" type="index" label="编号" width="55"></el-table-column>
                    <el-table-column align="center" prop="categoryName" label="分类名称" min-width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="number" label="可选数量" min-width="140" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input-number :min="1" controls-position="right" size="mini" v-model="scope.row.number"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="180" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="prodSelect(scope.row)">产品选择</el-button>
                        <el-button size="mini" type="danger" @click="removeCate(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 套餐主图 -->
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="form-item-title">套餐主图<span class="border"></span> <span class="EnName">MainImage</span></div>
                <my-upload :imgs="addForm.prodImage" :limitUploadImgs="3" ref="uploadImg" @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)" @handleUploadImg="handleUploadImg('prodImage', 3, $event)"> </my-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item> <el-button :loading="submitLoading" type="primary" @click="sumbitData">提交</el-button> </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <!-- 分类弹框 -->
    <el-dialog title="分类选择" :visible.sync="cateDialogVisible" width="35%" @close="cateDialogVisible = false">
      <el-form :model="searchForm" :inline="true">
        <el-form-item> <el-input v-model="searchForm.categoryName" placeholder="请输入分类名称"></el-input> </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
          <el-button type="warning" @click="saveSelectedCate">保存</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="tableLoading" :data="categoryList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="分类名称" align="center"></el-table-column>
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
        background
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- 餐食产品弹框 -->
    <meal-product-select ref="mealRef" :isMealProductShow="isMealProductShow" @savedMealData="saveProdData" @closedMealDialog="closedMealDialog"></meal-product-select>
  </div>
</template>

<script>
import { GetAllCategory, getMakeSetMealDetail, makeSetMealOperation, getMakeZoneList } from '@/api/system'
import myUpload from '@/components/my-upload'
import MealProductSelect from '@/components/meal-product-select'

export default {
  components: {
    myUpload,
    MealProductSelect
  },
  data() {
    return {
      addForm: {
        setMealName: '',
        setPrice: 0,
        sortNo: 99,
        display: true,
        fixedProduct: [],
        optCategory: [],
        prodImage: [],
        zoneId: '',
        zoneName: ''
      },
      searchForm: {
        categoryName: ''
      },
      zoneList: [],
      categoryList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      cateDialogVisible: false,
      isMealProductShow: false,
      submitLoading: false,
      tableLoading: false,
      addFormRules: {
        setMealName: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    operationAction() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    },
    totalMoney() {
      let total = 0
      this.addForm.fixedProduct.forEach(item => {
        total += item.price
      })
      return total
    }
  },
  mounted() {
    this.getZoneList()
    if (this.$route.query.id) {
      this.getSetMealDetail()
    }
  },
  methods: {
    getSetMealDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getMakeSetMealDetail(params).then(res => {
        this.addForm = res.data
      })
    },
    // 获取区域
    getZoneList() {
      let params = {
        zoneName: '',
        isPage: false,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getMakeZoneList(params).then(res => {
        if (res.success) {
          this.zoneList = res.data.map(item => {
            return {
              zoneId: item._id,
              zoneName: item.zoneName
            }
          })
        }
      })
    },
    // 区域选择变动
    zoneChange(val) {
      this.addForm.zoneName = this.zoneList.find(item => item.zoneId === val).zoneName
    },
    // 分类弹框
    addCateDialog() {
      this.cateDialogVisible = true
      // 获取分类数据
      this.getCategory()
    },
    getCategory() {
      let params = {
        belongMenu: '/homemade-product-category',
        categoryName: '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.total = res.total
            this.tableLoading = false
          }
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    // 分类选择数据处理
    handleSelectionChange(val) {
      this.selectedCate = val.map(item => {
        return {
          categoryId: item.value,
          categoryName: item.label,
          number: 1,
          optProduct: []
        }
      })
    },
    // 保存选中的分类数据
    saveSelectedCate() {
      let norepeatSelect = this.selectedCate.filter(item => {
        return this.addForm.optCategory.every(v => v.categoryId !== item.categoryId)
      })
      this.addForm.optCategory.push(...norepeatSelect)
      this.cateDialogVisible = false
    },
    // 选择分类下的产品
    prodSelect(row) {
      this.isMealProductShow = true
      this.$nextTick(() => {
        this.$refs['mealRef'].initData(row.categoryId, 'cate')
      })
    },
    // 删除已选择的分类数据
    removeCate(row) {
      this.$confirm('确认删除此数据吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let cateIndex = this.addForm.optCategory.findIndex(v => v.categoryId === row.categoryId)
          this.addForm.optCategory.splice(cateIndex, 1)
        })
        .catch(() => {})
    },
    // 套餐产品
    addProduct() {
      this.isMealProductShow = true
      this.$nextTick(() => {
        this.$refs['mealRef'].initData('', 'prod')
      })
    },
    closedMealDialog(val) {
      this.isMealProductShow = val
    },
    saveProdData(newSelectedList, cateId, type) {
      if (type === 'prod') {
        let norepeatSelect = newSelectedList
          .filter(item => {
            return this.addForm.fixedProduct.every(v => v.barCode !== item.barCode)
          })
          .map(item => {
            return {
              uniqueCode: item.uniqueCode,
              productName: item.productName,
              barCode: item.barCode,
              price: item.price,
              images: item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''
            }
          })
        this.addForm.fixedProduct.push(...norepeatSelect)
      } else if (type === 'cate') {
        let index = this.addForm.optCategory.findIndex(item => item.categoryId === cateId)
        let norepeatSelect = newSelectedList
          .filter(item => {
            return this.addForm.optCategory[index].optProduct.every(v => v.barCode !== item.barCode)
          })
          .map(item => {
            return {
              uniqueCode: item.uniqueCode,
              productName: item.productName,
              barCode: item.barCode,
              price: item.price,
              images: item.imgs && item.imgs.length > 0 ? item.imgs[0].url : ''
            }
          })
        this.addForm.optCategory[index].optProduct.push(...norepeatSelect)
      }
    },
    removeProd(row) {
      this.$confirm('确认删除此数据吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let prodIndex = this.addForm.fixedProduct.findIndex(v => v.barCode === row.barCode)
          this.addForm.fixedProduct.splice(prodIndex, 1)
        })
        .catch(() => {})
    },
    // 删除分类下包含的产品
    removeCateProd(cateId, prodItem) {
      let cateIndex = this.addForm.optCategory.findIndex(item => item.categoryId === cateId)
      let prodIndex = this.addForm.optCategory[cateIndex].optProduct.findIndex(val => val.barCode === prodItem.barCode)
      this.addForm.optCategory[cateIndex].optProduct.splice(prodIndex, 1)
    },
    // 提交餐食选购套餐数据
    sumbitData() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.optCategory.length <= 0 && this.addForm.fixedProduct.length <= 0) {
            return this.$message.warning('请选择套餐包含的标准产品或分类！')
          }
          if (this.addForm.optCategory.length <= 0 && this.totalMoney < this.addForm.setPrice) {
            return this.$message.warning('套餐价格不得高于套餐所包含产品价格！')
          }
          let params = {
            dto: {
              ...this.addForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operationAction
          }
          // console.log(params)
          this.submitLoading = true
          makeSetMealOperation(params).then(
            res => {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.$router.push('/choose-meal')
            },
            () => {
              this.submitLoading = false
            }
          )
        }
      })
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.addForm[txt]) {
          this.$set(this.addForm, txt, [])
        }
        this.addForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.addForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 图片删除回调
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.addForm[txt] = fileList
      } else {
        this.addForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 搜索分类
    searchCondition() {
      this.pageIndex = 1
      this.getCategory()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategory()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getCategory()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.form-item-title {
  font-weight: bolder;
  font-size: 16px;
  .border {
    width: 1px;
    height: 16px;
    background-color: #000000;
    display: inline-block;
    margin: 0 8px;
  }
  .EnName {
    font-weight: normal;
    font-size: 14px;
    text-transform: uppercase;
  }
}
.prod-contain {
  .prod-item {
    display: flex;
    div {
      margin-right: 15px;
    }
    .productName {
      min-width: 240px;
      @include no-wrap();
    }
    .barCode {
      min-width: 150px;
      @include no-wrap();
    }
    .price {
      min-width: 120px;
      @include no-wrap();
    }
  }
}
.tips {
  color: #f56c6c;
}
/deep/.el-table {
  .el-table__expanded-cell[class*='cell'] {
    padding: 0px 20px;
  }
}
</style>
