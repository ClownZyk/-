<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <el-row :gutter="10">
        <!-- 商品基本信息 -->
        <el-col :span="12">
          <div>
            <el-divider content-position="left">基本信息</el-divider>
            <el-form ref="form" :model="form" label-width="80px" label-position="top" class="form-contain" :rules="rules" :disabled="formDisabled">
              <div class="form-contain-item">
                <el-form-item prop="productName" class="item-long">
                  <div class="form-item-title">商品名称<span class="border"></span><span class="EnName">PRODUCTNAME</span></div>
                  <el-input placeholder="请输入商品名称" v-model="form.productName"></el-input>
                </el-form-item>
                <el-form-item prop="categoryId">
                  <div class="form-item-title">商品分类<span class="border"></span><span class="EnName">CATEGORY</span></div>
                  <el-cascader v-model="form.categoryId" :options="categoryList" :props="{ emitPath: false, checkStrictly: true }"></el-cascader>
                </el-form-item>
                <!--
                  <el-form-item prop="englishName">
                    <div class="form-item-title">英文名称<span class="border"></span><span class="EnName">ENGLISHNAME</span></div>
                    <el-input placeholder="请输入英文名称" v-model="form.englishName"></el-input>
                  </el-form-item>
                  <el-form-item prop="producer">
                    <div class="form-item-title">制作师名<span class="border"></span><span class="EnName">PRODUCER</span></div>
                    <el-input v-model="form.producer" placeholder="请输入制作师名"></el-input>
                  </el-form-item>
                -->
              </div>
              <div class="form-contain-item">
                <el-form-item prop="sortNo">
                  <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
                  <el-input-number controls-position="right" v-model="form.sortNo" placeholder="最小值为99" :min="99"></el-input-number>
                </el-form-item>
                <el-form-item prop="sales">
                  <div class="form-item-title">销售量<span class="border"></span><span class="EnName">SALES</span></div>
                  <el-input-number controls-position="right" v-model="form.sales" placeholder="请输入销售量"></el-input-number>
                </el-form-item>
                <el-form-item prop="views">
                  <div class="form-item-title">商品浏览数<span class="border"></span><span class="EnName">SALES</span></div>
                  <el-input-number controls-position="right" v-model="form.views" placeholder="请输入浏览数"></el-input-number>
                </el-form-item>
              </div>
              <!--
                <div class="form-contain-item">
                  <el-form-item prop="summary" class="item-long">
                    <div class="form-item-title">简介<span class="border"></span><span class="EnName">SUMMARY</span></div>
                    <el-input type="textarea" :rows="4" v-model="form.summary" placeholder="请输入简介"></el-input>
                  </el-form-item>
                </div>
              -->
              <!--
                <div class="form-contain-item">
                  <el-form-item prop="productLabel">
                    <div class="form-item-title">商品标签<span class="border"></span><span class="EnName">PRODUCTLABEL</span></div>
                    <el-select v-model="form.productLabel" multiple placeholder="请选择"> <el-option v-for="item in allGoodsLabel" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
                  </el-form-item>
                </div>
              -->
              <div class="form-contain-item">
                <el-form-item prop="isTop" style="width: 130px;">
                  <div class="form-item-title">店长推荐<span class="border"></span><span class="EnName">ISTOP</span></div>
                  <el-switch v-model="form.isTop"></el-switch>
                </el-form-item>
                <el-form-item prop="isShow" style="width: 130px;">
                  <div class="form-item-title">上下架<span class="border"></span><span class="EnName">ISSHOW</span></div>
                  <el-switch v-model="form.isShow"></el-switch>
                </el-form-item>
                <el-form-item prop="deliveryFree" style="width: 180px;">
                  <div class="form-item-title">是否热销<span class="border"></span><span class="EnName">HOTSALE</span></div>
                  <el-switch v-model="form.sellWell"></el-switch>
                </el-form-item>
                <!--
                  <el-form-item prop="isNew" style="width: 180px;">
                    <div class="form-item-title">是否新品<span class="border"></span><span class="EnName">ISNEW</span></div>
                    <el-switch v-model="form.isNew"></el-switch>
                  </el-form-item>
                  <el-form-item prop="isExclusive" style="width: 180px;">
                    <div class="form-item-title">是否专属商品<span class="border"></span><span class="EnName">ISEXCLUSIVE</span></div>
                    <el-switch v-model="form.isExclusive"></el-switch>
                  </el-form-item>
                -->
              </div>
              <div class="form-contain-item">
                <el-form-item prop="deliveryFree" style="width: 180px;">
                  <div class="form-item-title">是否包邮<span class="border"></span><span class="EnName">DELIVERYFREE</span></div>
                  <el-switch v-model="form.deliveryFree" @change="changeDeliveryFree"></el-switch>
                </el-form-item>
                <el-form-item prop="postTemplateId" v-show="form.deliveryFree">
                  <div class="form-item-title">邮费模板<span class="border"></span><span class="EnName">POSTTEMPLATE</span></div>
                  <el-select v-model="form.postTemplateId" placeholder="请选择邮费模板">
                    <el-option v-for="(item, index) in postTemplateList" :key="index" :value="item.value" :label="item.label">{{ item.label }}</el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-contain-item">
                <el-form-item>
                  <div class="form-item-title">主图<span class="border"></span><span class="EnName">MAINIMAGE</span></div>
                  <my-upload :imgs="form.mainImgs" :limitUploadImgs="1" @handleDisabledSubmit="handleDisabledSubmit" @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)" @handleUploadImg="handleUploadImg('mainImg', 1, $event)">
                  </my-upload>
                </el-form-item>
                <!--
                  <el-form-item>
                    <div class="form-item-title">
                      商品详情图片列表<span class="border"></span
                      ><span class="EnName">IMGAGES</span>
                    </div>
                    <my-upload
                      :imgs="form.imgs"
                      :limitUploadImgs="4"
                      @handleDisabledSubmit="handleDisabledSubmit"
                      @handleRemoveImg="handleRemoveImg('imgs', 4, $event)"
                      @handleUploadImg="handleUploadImg('imgs', 4, $event)"
                    >
                    </my-upload>
                  </el-form-item>
                -->
              </div>
            </el-form>
          </div>
        </el-col>
        <!-- 商品型号和饮品属性 -->
        <el-col :span="12">
          <el-divider content-position="left">商品型号</el-divider>
          <!-- 列表部分 -->
          <div class="list-table">
            <el-table class="table-main" ref="listTable" :data="skuList" border tooltip-effect="dark">
              <el-table-column align="center" prop="id" label="id" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="barCode" label="商品条形码" min-width="140" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="stock" label="库存" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="price" label="现价" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="img" label="图片" width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                  <img :src="scope.row.img.url" style="max-width: 100%; max-height: 60px;" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" min-width="160">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" :disabled="disabledSubmit" @click="operateFunc(scope.row, scope.$index, '编辑')">编辑</el-button>
                  <el-button type="danger" size="mini" :disabled="disabledSubmit" @click="operateFunc('', scope.$index, '删除')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="editFormV" width="700px" @closed="closedEditForm" :modal-append-to-body="false">
      <el-form :model="editForm" label-width="100px" :rules="skuRules" ref="editForm" :inline="true">
        <el-form-item label="型号" prop="title"> <el-input v-model="editForm.title" disabled></el-input> </el-form-item>
        <el-form-item label="商品条形码" prop="barCode"> <el-input v-model="editForm.barCode" disabled></el-input> </el-form-item>
        <el-form-item label="库存" prop="stock"> <el-input v-model="editForm.stock" disabled></el-input> </el-form-item>
        <el-form-item label="现价" prop="price"> <el-input v-model="editForm.price"></el-input> </el-form-item>
        <el-form-item label="列表主图" v-if="editForm.img && editForm.img.url" style="width: 100%;"> <el-image style="max-width: 100%; height: 100px" :src="editForm.img.url" fit="fill"></el-image> </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="closedEditForm">取消</el-button>
        <el-button type="primary" @click.native="submitEditForm">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ShopOperation, GetDropDownList, GetAllCategory, ShopGetDetailById, ProductLabelGetAll } from '@/api/system'
import { mapState } from 'vuex'
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
  },
  data() {
    return {
      // 是否禁用form
      formDisabled: false,
      // form验证规则
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      // 表单数据
      form: {
        sortNo: 99,
        sellWell: false,
        isNew: false,
        isExclusive: false,
        categoryIds: []
      },
      skuList: [],
      editForm: {},
      editIndex: 0,
      editFormV: false,
      // 商品分类列表
      categoryList: [],
      // 邮费模板列表
      postTemplateList: [],
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0,
      // 商品标签
      allGoodsLabel: [],
      skuRules: {
        // form验证规则
        title: [{ required: true, message: '请输入商型号', trigger: 'blur' }],
        barCode: [{ required: true, message: '请输入商品条形码', trigger: 'blur' }],
        price: [
          {
            required: true,
            pattern: /^[0-9]+([.][0-9]{1,2})?$/,
            message: '请输入正确价格，且仅保留两位小数',
            trigger: 'blur'
          }
        ]
      },
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    ...mapState(['vShopProduct'])
  },
  methods: {
    init() {
      if (this.$route.query.id !== undefined) {
        if (this.$route.query.operate !== undefined && this.$route.query.operate === 'view') {
          // 说明是查看
          this.formDisabled = true
          this.disabledSubmit = true
        }
        // 说明是编辑
        this.operateTitle = '编辑'
        this.operateAction = 1

        let parmas = {
          _id: this.$route.query.id
        }
        ShopGetDetailById(parmas).then(
          res => {
            if (res.success) {
              this.loading = false
              this.form = res.data
              if (res.data.sku !== undefined && res.data.sku.length > 0) {
                this.skuList = res.data.sku
                this.$store.commit('setVShopProductSKU', res.data.sku)
              }
              // 删掉form中的content和sku,避免提交时，被旧值覆盖，content的值以content-info.vue里的为准, sku以shop-model.vue为准
              delete this.form['content']
              delete this.form['sku']
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.mainImgs = []
              if (this.form.mainImg && this.form.mainImg.url) {
                this.form.mainImgs.push({ url: this.form.mainImg.url })
              }
            } else {
              this.$message.error(res.msg)
            }
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      } else {
        this.loading = false
      }
    },
    // 增删改
    operateFunc(val, index, title) {
      switch (title) {
        case '编辑':
          this.editFormV = true
          this.editIndex = index
          this.editForm = JSON.parse(JSON.stringify(val))
          break
        case '删除':
          this.$confirm('确认删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.skuList.splice(index, 1)
            this.$store.commit('setVShopProductSKU', this.skuList)
          })
          break
        default:
          return false
      }
    },
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.editForm.img === undefined) {
              this.editForm.img = { url: '', thumUrl: '', absoluteUrl: '' }
            }
            this.skuList.splice(this.editIndex, 1, JSON.parse(JSON.stringify(this.editForm)))
            this.$store.commit('setVShopProductSKU', this.skuList)
            this.closedEditForm()
            this.$message({
              type: 'success',
              message: '修改成功，若无其他操作，请提交商品信息'
            })
          })
        }
      })
    },
    clearEditForm() {
      this.$refs['editForm'].clearValidate()
      this.$refs['editForm'].resetFields()
      this.editForm = {}
    },
    closedEditForm() {
      this.editFormV = false
      this.clearEditForm()
    },
    // 加载邮费模板
    async GetDropDownList() {
      let params = {
        templateName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      await GetDropDownList(params).then(
        res => {
          if (res.success) {
            this.postTemplateList = res.data
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 加载商品分类
    async GetAllCategory() {
      this.loading = true
      let params = {
        belongMenu: '/product-category,/service-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      await GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 加载商品标签下拉
    async ProductLabelGetAll() {
      let params = {
        dto: {
          labelName: '',
          pageSize: 0,
          pageIndex: 0,
          isPage: false,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$route.query.cid
        },
        action: 0
      }
      await ProductLabelGetAll(params).then(
        res => {
          if (res.success) {
            this.allGoodsLabel = res.data || []
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 改变是否包邮
    changeDeliveryFree(val) {
      if (val) {
        // 包邮，清空已选中的模板
        this.form.postTemplateId = ''
      }
    },
    // 各种清空
    clear: function() {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/product-list')
    },
    // 提交表单
    formSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$route.query.cid)
            this.$store.commit('setVShopProductBaseInfo', this.form)
            if (this.vShopProduct.sku === undefined || this.vShopProduct.sku.length <= 0) {
              this.$message({
                message: '商品型号不能为空！',
                type: 'warn'
              })
              this.submitLoading = false
              return false
            }
            let params = {
              Dto: Object.assign({}, this.vShopProduct),
              Action: this.operateAction
            }
            // console.log(params)
            ShopOperation(params)
              .then(res => {
                this.$message({
                  message: res.msg,
                  type: res.success ? 'success' : 'error'
                })
                this.clear()
              })
              .catch(() => {
                this.submitLoading = false
              })
          })
        }
      })
    },

    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit(val) {
      this.disabledSubmit = val
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  mounted() {
    // 清空旧值
    this.$store.commit('clearVShopProduct')
    this.GetAllCategory()
    this.GetDropDownList()
    this.ProductLabelGetAll()
  }
}
</script>
<style lang="scss" scoped>
.base-info {
  width: 100%;
  .page-contain {
    width: 100%;
    background-color: #ffffff;
    .form-contain {
      .form-contain-item {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        .el-form-item {
          margin-left: 20px;
          .el-form-item__content {
            .form-item-title {
              font-weight: bolder;
              font-size: 16px;
              position: relative;
              .border {
                width: 1px;
                height: 16px;
                position: absolute;
                background-color: #000000;
                display: inline-block;
                top: 10px;
                margin-left: 8px;
              }
              .EnName {
                font-weight: normal;
                font-size: 14px;
                position: absolute;
                bottom: 0;
                margin-left: 17px;
              }
            }
          }
        }
        .item-long {
          width: 440px;
        }
      }
    }
  }
}
.filters-left {
  .filters-search {
    display: inline-block;
    width: 200px;
  }
}
.tags {
  margin-right: 15px;
}
.submit-btn {
  margin-left: 20px;
}
.list-table {
  margin-bottom: 15px;
}
</style>
