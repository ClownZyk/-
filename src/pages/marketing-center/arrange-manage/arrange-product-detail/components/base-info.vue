<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        label-position="top"
        class="form-contain"
        :rules="rules"
        :disabled="formDisabled"
      >
        <div class="form-contain-item">
          <el-form-item prop="prodName" class="item-long">
            <div class="form-item-title">
              商品名称
              <span class="border"></span>
              <span class="EnName">PRODUCTNAME</span>
            </div>
            <el-input placeholder="请输入商品名称" v-model="form.prodName"></el-input>
          </el-form-item>
          <el-form-item prop="price">
            <div class="form-item-title">
              单价
              <span class="border"></span>
              <span class="EnName">ENGLISHNAME</span>
            </div>
            <el-input-number
              controls-position="right"
              placeholder="请输入单价"
              :precision="2"
              :min="0"
              v-model="form.price"
            ></el-input-number>
          </el-form-item>
          <el-form-item prop="vipPrice">
            <div class="form-item-title">
              会员价
              <span class="border"></span>
              <span class="EnName">PRODUCER</span>
            </div>
            <el-input-number
              controls-position="right"
              v-model="form.vipPrice"
              :precision="2"
              :min="0"
              placeholder="请输入会员价"
            ></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="categoryIds">
            <div class="form-item-title">
              商品分类
              <span class="border"></span>
              <span class="EnName">CATEGORY</span>
            </div>
            <el-select v-model="form.categoryId">
              <el-option
                v-for="item in categoryList"
                :key="item._id"
                :label="item.categoryName"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sortNo">
            <div class="form-item-title">
              排序号
              <span class="border"></span>
              <span class="EnName">SORTNO</span>
            </div>
            <el-input-number
              controls-position="right"
              v-model="form.sortNo"
              placeholder="最小值为99"
              :min="99"
            ></el-input-number>
          </el-form-item>
          <el-form-item prop="sales">
            <div class="form-item-title">
              销售量
              <span class="border"></span>
              <span class="EnName">SALES</span>
            </div>
            <el-input-number controls-position="right" v-model="form.sales" placeholder="请输入销售量"></el-input-number>
          </el-form-item>
          <el-form-item prop="views">
            <div class="form-item-title">
              商品浏览数
              <span class="border"></span>
              <span class="EnName">SALES</span>
            </div>
            <el-input-number controls-position="right" v-model="form.views" placeholder="请输入浏览数"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="summary" class="item-long">
            <div class="form-item-title">
              简介
              <span class="border"></span>
              <span class="EnName">SUMMARY</span>
            </div>
            <el-input type="textarea" :rows="4" v-model="form.summary" placeholder="请输入简介"></el-input>
          </el-form-item>
          <el-form-item prop="storage" class="item-long">
            <div class="form-item-title">
              保存条件
              <span class="border"></span>
              <span class="EnName">STORAGE</span>
            </div>
            <el-input type="textarea" :rows="4" v-model="form.storage" placeholder="请输入保存条件"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="isShow" style="width: 130px;">
            <div class="form-item-title">
              上下架
              <span class="border"></span>
              <span class="EnName">ISSHOW</span>
            </div>
            <el-switch v-model="form.isShow" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">
              主图
              <span class="border"></span>
              <span class="EnName">MAINIMAGE</span>
            </div>
            <my-upload
              :imgs="form.prodImage"
              :limitUploadImgs="3"
              @handleDisabledSubmit="handleDisabledSubmit"
              @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)"
              @handleUploadImg="handleUploadImg('prodImage', 3, $event)"
            ></my-upload>
          </el-form-item>
          <!-- <el-form-item>
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
          </el-form-item>-->
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reserveMProdOperation, GetReserveCategory, ReserveProductId } from '@/api/system'
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
        prodName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        vipPrice: [{ required: true, message: '请输入会员价', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      // 表单数据
      form: {
        sortNo: 99,
        sellWell: false,
        categoryIds: []
      },
      // 商品分类列表
      categoryList: [],
      // 邮费模板列表
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0
    }
  },
  computed: {
    ...mapState(['vShopProduct'])
  },
  methods: {
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
    },
    async init() {
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
        await ReserveProductId(parmas).then(
          res => {
            if (res.success) {
              this.loading = false
              this.form = res.data
              // 删掉form中的content和sku,避免提交时，被旧值覆盖，content的值以content-info.vue里的为准, sku以shop-model.vue为准
              delete this.form['content']
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
    // 根据categoryId获取categoryIds
    getCategoryIds(list, opt) {
      try {
        this._getCategoryIds(list, opt)
      } catch (e) {
        // console.log(that.form.categoryIds)
      }
    },
    _getCategoryIds(list, opt) {
      let that = this
      list.forEach(val => {
        that.form.categoryIds.push(val.value)
        if (val.value === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw 'break all'
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
    // 加载商品分类
    async GetAllCategory() {
      this.loading = true
      let params = {
        name: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetReserveCategory(params).then(
        res => {
          this.loading = false
          if (res.success) {
            this.categoryList = res.data
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 各种清空
    clear: function() {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/arrange-product')
    },
    // 提交表单
    formSubmit() {
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
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.$store.commit('setVShopProductBaseInfo', this.form)
            let params = {
              Dto: Object.assign({}, this.vShopProduct),
              Action: this.operateAction
            }
            reserveMProdOperation(params)
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
    }
  },
  mounted() {
    // 清空旧值
    this.$store.commit('clearVShopProduct')
    this.init()
    this.GetAllCategory()
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
.submit-btn {
  margin-left: 20px;
}
</style>
