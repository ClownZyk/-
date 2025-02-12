<template>
  <div class="product-detail">
    <div class="top-btns">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="warning" @click="formV8Detail">V8同步</el-button>
      <el-button type="info" @click="cancelSubmit">取消</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info v-if="$route.query.id && loginData.attribute !== 4" ref="baseInfoRef"></base-info>
        <retail-base-info v-if="loginData.attribute === 4" ref="baseInfoRef" :form="form"></retail-base-info>
      </el-tab-pane>
      <el-tab-pane label="内容详情" name="second"> <content-info></content-info> </el-tab-pane>
      <el-tab-pane v-if="$route.query.id" label="销售成本" name="sixth"> <cost-list></cost-list> </el-tab-pane>
      <el-tab-pane v-if="$route.query.id" label="销售批次" name="seventh"> <sales-bantch></sales-bantch> </el-tab-pane>
    </el-tabs>
    <!--
      <div class="my-tabs-list">
        <div class="tab-item" v-for="(tab, index) in tabList" :key="index">
          <router-link class="tab-link" tag="div" :to="tab.to">{{tab.text}}</router-link>
        </div>
      </div>
    -->
    <!-- v8同步 -->
    <el-dialog title="同步内容选择" :visible.sync="dialogShow" width="600px" :before-close="handleClose">
      <el-form :inline="true" :model="dialogSynchro" class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品分类"> <el-switch v-model="dialogSynchro.categoryId" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称"> <el-switch v-model="dialogSynchro.productName" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="简介"> <el-switch v-model="dialogSynchro.summary" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="保存条件"> <el-switch v-model="dialogSynchro.storage" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品详情"> <el-switch v-model="dialogSynchro.content" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="列表主图"> <el-switch v-model="dialogSynchro.mainImg" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品sku"> <el-switch v-model="dialogSynchro.sku" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品标签"> <el-switch v-model="dialogSynchro.productLabel" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小计量单位名称"> <el-switch v-model="dialogSynchro.unitName" active-color="#13ce66"></el-switch> </el-form-item>
          </el-col>
        </el-row>
        <!--
          <el-form-item label="商品详情页图片列表">
              <el-switch v-model="dialogSynchro.imgs" active-color="#13ce66"></el-switch>
          </el-form-item>
        -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="sureV8Detail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baseInfo from './components/base-info'
import retailBaseInfo from './components/retail-base-info'
import contentInfo from './components/content-info'
import OrderEvaluate from '@/components/order-evaluate'
import CostList from './components/cost-list'
import salesBantch from './components/sales-bantch'
import { UpdateProduct, ShopGetDetailById } from '@/api/system'
import { mapState } from 'vuex'

export default {
  name: 'product-detail',
  computed: {
    ...mapState(['loginData'])
  },
  data() {
    return {
      tabList: [{ to: { name: 'base-info' }, text: '基本信息' }, { to: { name: 'content-info' }, text: '内容详情' }, { to: { name: 'shop-model' }, text: '商品型号' }, { to: { name: 'cost-list' }, text: '销售成本' }],
      activeName: 'first',
      dialogShow: false, // V8同步
      dialogSynchro: {
        categoryId: false,
        productName: true,
        summary: false,
        storage: false,
        content: true,
        mainImg: true,
        imgs: false,
        sku: false,
        unitName: false,
        productLabel: false
      },
      selectProduct: null,
      form: {
        categoryId: '',
        productName: '',
        summary: '',
        storage: '',
        content: '',
        sellWell: false,
        isTop: false,
        isShow: true,
        isNew: false,
        isExclusive: false,
        sortNo: 99,
        sales: 0,
        mainImg: null,
        mainImgs: [],
        imgs: [],
        sku: [],
        productLabel: [],
        unitName: '',
        stock: 0
      },
      categoryList: []
    }
  },
  components: { baseInfo, retailBaseInfo, contentInfo, OrderEvaluate, CostList, salesBantch },
  mounted() {
    this._detail()
  },
  methods: {
    // 提交
    submit() {
      this.$refs.baseInfoRef.formSubmit()
    },
    handleClose() {
      this.dialogShow = false
    },
    formV8Detail() {
      this.dialogShow = true
    },
    sureV8Detail() {
      let param = {
        ...this.dialogSynchro,
        uniqueCode: this.form.uniqueCode,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$route.query.cid
      }
      UpdateProduct(param).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.dialogShow = false
            this._detail()
          } else this.$message.error(res.msg)
        }
      )
    },
    _detail() {
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
              // 删掉form中的content和sku,避免提交时，被旧值覆盖，content的值以content-info.vue里的为准, sku以shop-model.vue为准
              if (this.loginData.attribute !== 4) {
                delete this.form['content']
                delete this.form['sku']
              }
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.mainImgs = []
              this.form.paramImg1List = []
              this.form.paramImg2List = []
              this.form.paramImg3List = []
              this.form.paramImg4List = []
              if (this.form.mainImg && this.form.mainImg.url) {
                this.form.mainImgs.push({ url: this.form.mainImg.url })
              }
              if (this.form.parameterImg1 && this.form.parameterImg1.url) {
                this.form.paramImg1List.push({ url: this.form.parameterImg1.url })
              }
              if (this.form.parameterImg2 && this.form.parameterImg2.url) {
                this.form.paramImg2List.push({ url: this.form.parameterImg2.url })
              }
              if (this.form.parameterImg3 && this.form.parameterImg3.url) {
                this.form.paramImg3List.push({ url: this.form.parameterImg3.url })
              }
              if (this.form.parameterImg4 && this.form.parameterImg4.url) {
                this.form.paramImg4List.push({ url: this.form.parameterImg4.url })
              }
            }
          }
        )
      } else {
        this.loading = false
      }
    },
    // 取消
    cancelSubmit() {
      this.$confirm('确认取消吗？未保存的数据将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-tabs-list {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
  .tab-item {
    .tab-link {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #909399;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
      cursor: pointer;
      position: relative;
      &.router-link-exact-active {
        background-color: #fff;
        color: #409eff;
        border-left-color: #dcdfe6;
        border-right-color: #dcdfe6;
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          border-bottom: 1px solid #fff;
        }
      }
    }
    &:first-child {
      .tab-link {
        &.router-link-exact-active {
          border-left-color: transparent;
          border-right-color: #dcdfe6;
        }
      }
    }
  }
}
</style>
