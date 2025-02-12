<template>
  <div class="detail-container">
    <div class="base-info">
      <!-- 基本信息和内容详情 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-divider content-position="left">基本信息</el-divider>
          <el-form class="product-form" ref="productFormRef" :model="productForm" :rules="rules" label-width="100px" label-position="top">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item prop="productName">
                  <div class="title">产品名称</div>
                  <el-input type="text" v-model="productForm.productName" :disabled="!isManage"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="categoryId">
                  <div class="title">产品分类</div>
                  <el-cascader v-model="productForm.categoryId" :options="categoryList" :props="props" placeholder="请选择产品分类" :disabled="!isManage && loginData.attribute !== 4" style="width:100%"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="7" v-show="!isManage">
                <el-form-item>
                  <div class="title">产品区域</div>
                  <el-select v-model="productForm.zoneId" placeholder="请选择产品所在区域" @change="zoneChange" style="width:100%">
                    <el-option v-for="item in zoneList" :key="item.zoneId" :label="item.zoneName" :value="item.zoneId"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item>
                  <div class="title">排序号</div>
                  <el-input-number controls-position="right" v-model="productForm.sortNo" placeholder="最小值为99" :min="99" :step="1" step-strictly style="width:100%"></el-input-number>
                </el-form-item>
              </el-col>
              <!--
                <el-col :span="8">
                  <el-form-item>
                    <div class="title">销售量</div>
                    <el-input-number :controls="false" v-model="productForm.sales" placeholder="请输入销售量" :min="0" :step="1" step-strictly :disabled="!isManage" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
              -->
              <el-col :span="8">
                <el-form-item>
                  <div class="title">浏览数</div>
                  <el-input-number :controls="false" v-model="productForm.views" placeholder="请输入浏览数" :min="0" :step="1" step-strictly :disabled="!isManage" style="width:100%"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item>
                  <div class="title">简介</div>
                  <el-input type="textarea" :rows="4" v-model="productForm.summary" placeholder="请输入产品简介"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <div class="title">保存条件</div>
                  <el-input type="textarea" :rows="4" v-model="productForm.storage" placeholder="请输入保存条件"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="4">
                <el-form-item>
                  <div class="title">上下架</div>
                  <el-switch v-model="productForm.isShow"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <div class="title">热销</div>
                  <el-switch v-model="productForm.sellWell"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <div class="title">新品</div>
                  <el-switch v-model="productForm.isNew"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item>
                  <div class="title">商品图片</div>
                  <my-upload :imgs="productForm.imgs" :limitUploadImgs="5" @handleRemoveImg="handleRemoveImg('imgs', 5, $event)" @handleUploadImg="handleUploadImg('imgs', 5, $event)"> </my-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">内容详情</el-divider>
          <my-editor @input="onEditorChange($event)" :value="productForm.content"></my-editor>
        </el-col>
      </el-row>
      <!-- 商品型号 -->
      <el-row>
        <el-col>
          <el-divider content-position="left">商品型号</el-divider>
          <el-table :data="productForm.sku" style="width: 100%" :default-expand-all="true" border size="small">
            <el-table-column type="expand" width="100">
              <template slot-scope="scope">
                <el-table :data="scope.row.recipe" style="width: 50%;margin: 10px 0 10px 10px" border size="small">
                  <el-table-column label="编号" type="index" width="55" align="center"></el-table-column>
                  <el-table-column prop="recipeName" label="原料名称" min-width="160" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column label="原料数量" min-width="150" align="center" show-overflow-tooltip>
                    <template slot-scope="props">
                      <div v-if="scope.row.isAddOrEdit && isManage"><el-input-number size="mini" controls-position="right" v-model="props.row.dose" :min="0" label="请输入数量"></el-input-number></div>
                      <div v-else>{{ props.row.dose }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="recipeUnitName" label="原料单位" min-width="120" align="center" show-overflow-tooltip> </el-table-column>
                  <el-table-column label="操作" width="120" align="center" fixed="right" v-if="isManage">
                    <template slot-scope="props">
                      <el-button size="mini" type="danger" :disabled="!scope.row.isAddOrEdit" @click="removeRecipe(scope.$index, props.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="商品型号" min-width="140" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.isAddOrEdit && isManage"><el-input size="mini" v-model="scope.row.title" placeholder="请输入型号"></el-input></div>
                <div v-else>{{ scope.row.title }}</div>
              </template>
            </el-table-column>
            <el-table-column label="原价" min-width="110" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.isAddOrEdit"><el-input-number size="mini" controls-position="right" v-model="scope.row.price" :min="0" label="请输入原价"></el-input-number></div>
                <div v-else>{{ scope.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="优惠价" min-width="110" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.isAddOrEdit"><el-input-number size="mini" controls-position="right" v-model="scope.row.vipPrice" :min="0" label="请输入优惠价"></el-input-number></div>
                <div v-else>{{ scope.row.vipPrice }}</div>
              </template>
            </el-table-column>
            <el-table-column label="成本价" min-width="110" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.costPrice }}</div>
              </template>
            </el-table-column>
            <el-table-column label="库存" min-width="110" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.stock }}</div>
              </template>
            </el-table-column>
            <el-table-column label="配方" min-width="100" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="warning" size="mini" :disabled="!isManage" @click="handleSelectRecipe(scope.$index, 'recipe')">添加配方</el-button>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="160" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.isAddOrEdit">
                  <my-upload class="sku-img" :imgs="scope.row.imgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveSkuImg(scope.$index, $event)" @handleUploadImg="handleUploadSkuImg(scope.$index, $event)"> </my-upload>
                </div>
                <div v-else><el-image v-if="scope.row.img && scope.row.img.url" style="width: 40px; height: 40px" :src="scope.row.img.url" fit="fill"></el-image></div>
              </template>
            </el-table-column>
            <el-table-column width="200" align="center" fixed="right">
              <template slot="header" slot-scope="scope">
                <el-button v-if="isManage" size="mini" type="primary" icon="el-icon-plus" @click="handleAddSku(scope.row)">新增商品型号</el-button>
              </template>
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="scope.row.isAddOrEdit" @click="handleSaveSku(scope.row)">保存</el-button>
                <el-button size="mini" type="warning" v-if="!scope.row.isAddOrEdit" @click="handleEditSku(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" v-if="!scope.row.isAddOrEdit && isManage" :disabled="!isManage" @click="handleDeleteSku(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 饮品属性 -->
      <el-row>
        <el-col>
          <el-divider content-position="left">饮品属性</el-divider>
          <el-form ref="drinkLabelForm" label-width="80px" label-position="top" class="form-contain">
            <div class="form-contain-item" v-for="item in drinkLabelList" :key="item._id">
              <el-form-item :label="item.labelTypeName">
                <!-- 新增 -->
                <el-checkbox-group v-if="action === 0" v-model="item.drinkForm.labelName" :disabled="!isManage">
                  <el-checkbox v-for="tag in item.labelName" :label="tag" :key="tag" border :disabled="tag === item.labelName[0]">{{ tag }}</el-checkbox>
                </el-checkbox-group>
                <!-- 编辑 -->
                <el-checkbox-group v-else-if="action === 1" v-model="item.drinkForm.labelName" :disabled="!isManage">
                  <el-checkbox v-for="tag in Array.from(new Set(item.labelName.concat(item.drinkForm.labelName)))" :label="tag" :key="tag" border :disabled="tag === item.labelName[0]">{{ tag }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="form-contain-item">
              <el-form-item>
                <div class="form-item-title">
                  <span>加料</span>
                  <el-button v-if="isManage" size="mini" type="primary" @click="handleSelectRecipe(null, 'batch')" style="margin-left: 15px;">添加</el-button>
                </div>
                <el-table :data="batching" border style="width: 50%;margin:10px 0;" size="small">
                  <el-table-column type="index" label="编号" align="center" width="60"></el-table-column>
                  <el-table-column prop="prodName" label="产品名称" align="center" min-width="160" show-overflow-tooltip> </el-table-column>
                  <el-table-column label="计量换算" align="center" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div v-if="isManage"><span>1份 = </span><el-input-number v-model="scope.row.convertCount" :min="0" :precision="0" :controls="false" size="small" style="width:80px"></el-input-number> {{ scope.row.unitName }}</div>
                      <div v-else>1份 = {{ scope.row.convertCount }}{{ scope.row.unitName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" min-width="150" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div v-if="isManage"><el-input-number v-model="scope.row.price" :min="0" controls-position="right" size="small"></el-input-number></div>
                      <div v-else>{{ scope.row.price }}元</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="120" fixed="right" v-if="isManage">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="removeBatch(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <!-- 提交按钮 -->
      <div class="submit-btn"><el-button :loading="submitLoading" type="primary" @click="submitHomemadeProductInfo">提 交</el-button></div>
    </div>

    <!-- 选择配料弹框 -->
    <raw-product-select :isShowProductSelect="isRecipeShow" @handleProductSelect="handleProductSelect" @saveSelected="saveSelectedRecipe"></raw-product-select>
  </div>
</template>

<script>
import { GetAllCategory, drinkProductOperation, getDrinkProductDetail, GetDrinkLabelByPage, getDrinkZoneList } from '@/api/system'
import MyEditor from '@/components/my-editor'
import myUpload from '@/components/my-upload'
import rawProductSelect from '../components/raw-product-select.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MyEditor,
    myUpload,
    rawProductSelect
  },
  computed: {
    ...mapState(['loginData'])
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      productForm: {
        productName: '',
        categoryId: '',
        sortNo: 99,
        sales: 0,
        views: 0,
        summary: '',
        storage: '',
        isShow: true,
        sellWell: false,
        isNew: false,
        imgs: [],
        sku: [],
        content: '',
        zoneId: '',
        zoneName: ''
      },
      zoneList: [],
      categoryList: [],
      skuFileList: [],
      recipeList: [],
      action: 0,
      // 饮品参数
      drinkLabelList: [],
      batching: [],
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      submitLoading: false,
      isRecipeShow: false,
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择产品分类', trigger: 'change' }]
      }
    }
  },
  created() {
    this.action = parseInt(this.$route.query.action)
    this.getProductCategory()
    this.getZoneList()
  },
  mounted() {
    // 获取饮品参数
    this.getDrinkLabelList()
    if (this.$route.query.id) {
      this.init()
    }
  },
  methods: {
    // 获取饮品标签
    getDrinkLabelList() {
      // let commonParam =
      //   this.loginData.attribute === 4
      //     ? { creater: this.$store.state.UserID, roleId: this.$store.state.UserRole, cid: this.$store.state._cid }
      //     : { creater: localStorage.getItem('creater'), roleId: localStorage.getItem('roleId'), cid: localStorage.getItem('cid') }
      let params = {
        labelTypeName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetDrinkLabelByPage(params).then(
        res => {
          if (res.success) {
            this.drinkLabelList = res.data.map(item => {
              return {
                labelTypeName: item.labelTypeName,
                labelName: item.labelName,
                drinkForm: {
                  labelTypeName: item.labelTypeName,
                  labelName: [item.labelName[0]]
                },
                _id: item._id
              }
            })
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 编辑进入页面
    init() {
      let params = {
        _id: this.$route.query.id
      }
      getDrinkProductDetail(params)
        .then(res => {
          if (res.success) {
            res.data.sku.forEach(item => {
              item.isAddOrEdit = false
              item.imgs = item.img && item.img.url ? [{ url: item.img.url }] : []
            })
            this.productForm = res.data
            this.batching = res.data.batching
            this.drinkLabelList.forEach(item => {
              res.data.drinkLabels.forEach(v => {
                if (v.labelTypeName === item.labelTypeName) {
                  item.drinkForm.labelName = v.labelName
                }
              })
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取自制产品分类
    getProductCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => {
        this.categoryList = res.data
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
      getDrinkZoneList(params).then(res => {
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
      this.productForm.zoneName = this.zoneList.find(item => item.zoneId === val).zoneName
    },
    // 新增sku
    handleAddSku(item) {
      let row = {
        title: '',
        price: 0,
        vipPrice: 0,
        costPrice: 0,
        stock: 0,
        img: null,
        recipe: [],
        isAddOrEdit: true
      }
      this.productForm.sku.push(row)
    },
    // 修改sku
    handleEditSku(row) {
      row.isAddOrEdit = true
    },
    // 保存sku
    handleSaveSku(row) {
      if (!row.title) {
        this.$message.warning('请输入商品型号！')
        return false
      }
      if (!row.recipe.length) {
        this.$message.warning('请选择产品配料！')
        return false
      }
      row.isAddOrEdit = false
    },
    // 删除sku
    handleDeleteSku(row, index) {
      this.$confirm('确定删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let skuIndex = this.productForm.sku.findIndex((val, i) => {
            return i === index
          })
          this.productForm.sku.splice(skuIndex, 1)
        })
        .catch(() => {})
    },

    // 打开配方弹框
    handleSelectRecipe(index, type) {
      this.isRecipeShow = true
      this.openType = type
      this.selectSkuIndex = index
    },
    // 选择配料数据
    handleProductSelect(val) {
      this.isRecipeShow = val
    },
    saveSelectedRecipe(val) {
      if (this.openType === 'recipe') {
        let selectedRecipeList = val.map(item => {
          return {
            recipeName: item.productName,
            uniqueCode: item.uniqueCode,
            dose: 1,
            recipeUnitName: item.unitName
          }
        })
        let norepeatSelect = selectedRecipeList.filter(item => {
          return this.productForm.sku[this.selectSkuIndex].recipe.every(v => v.uniqueCode !== item.uniqueCode)
        })
        this.productForm.sku[this.selectSkuIndex].recipe.push(...norepeatSelect)
      } else if (this.openType === 'batch') {
        let batchings = val.map(item => {
          return {
            uniqueCode: item.uniqueCode,
            barCode: null,
            prodName: item.productName,
            unitName: item.unitName,
            convertCount: 1,
            price: 1
          }
        })
        let norepeatSelect = batchings.filter(item => {
          return this.batching.every(v => v.uniqueCode !== item.uniqueCode)
        })
        this.batching.push(...norepeatSelect)
      }
    },
    // 删除配料信息
    removeRecipe(index, row) {
      this.$confirm('确认删除此数据吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let recipeIndex = this.productForm.sku[index].recipe.findIndex(v => v.uniqueCode === row.uniqueCode)
          this.productForm.sku[index].recipe.splice(recipeIndex, 1)
        })
        .catch(() => {})
    },
    // 提交产品自制配方信息
    submitHomemadeProductInfo() {
      if (!this.productForm.sku.length) {
        this.$message.warning('请添加产品型号信息后再提交！')
        return false
      }
      let sku = this.productForm.sku.find(v => !v.title)
      if (sku) {
        this.$message.warning('请填写产品型号后再提交！')
        return false
      }
      let recipe = this.productForm.sku.find(v => v.recipe.length <= 0)
      if (recipe) {
        this.$message.warning('请添加产品型号对应配料后再提交！')
        return false
      }
      this.$refs['productFormRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.productForm,
              batching: this.batching,
              drinkLabels: this.drinkLabelList.map(item => {
                return item.drinkForm
              }),
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.action
          }
          // console.log(params)
          this.submitLoading = true
          drinkProductOperation(params)
            .then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.submitLoading = false
                this.$router.push('/drink-product-list')
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 删除辅料
    removeBatch(row) {
      let index = this.batching.findIndex(item => {
        return item.uniqueCode === row.uniqueCode
      })
      this.$confirm('确认删除此辅料?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.batching.splice(index, 1)
        })
        .catch(() => {})
    },
    // 富文本详情
    onEditorChange(val) {
      this.productForm.content = val
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.productForm[txt]) {
          this.$set(this.productForm, txt, [])
        }
        this.productForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.productForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.productForm[txt] = fileList.map(item => {
          return {
            url: item.url,
            thumUrl: '',
            absoluteUrl: ''
          }
        })
      } else {
        this.productForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
      // this.productForm.mainImgs = this.productForm[txt]
    },
    // handleSkuUploadChange(ret, index) {
    //   this.productForm.sku[index].img = ret[0]
    // },
    handleRemoveSkuImg(index, fileList) {
      this.productForm.sku[index].img = { url: '', thumUrl: '', absoluteUrl: '' }
    },
    handleUploadSkuImg(index, imgObj) {
      this.productForm.sku[index].img = JSON.parse(JSON.stringify(imgObj))
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  .product-form {
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  /deep/ .sku-img {
    div {
      .el-upload-list--picture-card {
        .el-upload-list__item {
          width: 60px;
          height: 60px;
          margin: 0 5px 0;
        }
      }
    }
  }
  /deep/ .sku-img {
    div {
      .el-upload--picture-card {
        width: 60px;
        height: 60px;
        i {
          font-size: 20px;
          display: block;
          line-height: 60px;
        }
      }
    }
  }
}
</style>
