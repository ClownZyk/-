<template>
  <div>
    <el-row>
      <!-- <el-col :span="12"> -->
      <el-form :model="weighProductDeatil" label-width="100px" label-position="top" disabled>
        <el-row :gutter="10">
          <!-- 基本信息 -->
          <el-col :span="12">
            <el-divider content-position="left">基本信息</el-divider>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item>
                  <div class="info-text">产品名称</div>
                  <el-input type="text" v-model="weighProductDeatil.productName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <div class="info-text">产品分类</div>
                  <el-cascader v-model="weighProductDeatil.categoryId" :options="categoryList" :props="props"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item>
                  <div class="info-text">产品库存</div>
                  <el-input-number v-model="weighProductDeatil.stock" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <div class="info-text">产品销量</div>
                  <el-input-number v-model="weighProductDeatil.sales" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <div class="info-text">排序号</div>
                  <el-input-number v-model="weighProductDeatil.sortNo" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item>
                  <div class="info-text">产品单位</div>
                  <el-input type="text" v-model="weighProductDeatil.unitName"></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item>
                  <div class="info-text">产品简介</div>
                  <el-input type="textarea" v-model="weighProductDeatil.summary"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <div class="info-text">保存条件</div>
                  <el-input type="textarea" v-model="weighProductDeatil.storage"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="4">
                <el-form-item>
                  <div class="info-text">上下架</div>
                  <el-switch v-model="weighProductDeatil.isShow"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <div class="info-text">热销</div>
                  <el-switch v-model="weighProductDeatil.sellWell"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <div class="info-text">店长推荐</div>
                  <el-switch v-model="weighProductDeatil.isTop"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6" v-if="weighProductDeatil.mainImg && weighProductDeatil.mainImg.url">
                <el-form-item label="产品图片">
                  <el-image style="width: 120px; height: 120px" :src="weighProductDeatil.mainImg.url" fit="fill"></el-image>
                </el-form-item>
              </el-col>
              <el-col :span="18" v-if="weighProductDeatil.imgs && weighProductDeatil.imgs.length">
                <el-form-item label="产品详情图">
                  <el-image v-for="(item, index) in weighProductDeatil.imgs" :key="index" style="width: 120px; height: 120px;margin-right:15px" :src="item.url" fit="fill"></el-image>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-divider content-position="left">内容详情</el-divider>
            <my-editor :value="weighProductDeatil.content"></my-editor>
          </el-col>
        </el-row>
        <el-row>
          <el-divider content-position="left">产品型号</el-divider>
          <el-table class="table-main" ref="listTable" :data="weighProductDeatil.sku" border>
            <el-table-column align="center" prop="id" label="id" width="55" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="barCode" label="商品条形码" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="stock" label="库存" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="price" label="现价" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="costPrice" label="原价" min-width="90" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="oriPrice" label="采购价" min-width="90" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column align="center" prop="vipPrice" label="V6会员价" min-width="100" show-overflow-tooltip></el-table-column> -->
            <el-table-column align="center" prop="img" label="图片" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <img :src="scope.row.img ? scope.row.img.url : ''" style="max-width: 100%; max-height: 60px;" />
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <!-- </el-col> -->
    </el-row>
  </div>
</template>

<script>
import { getWeighProductDetail, GetAllCategory } from '@/api/system'
import MyEditor from '@/components/my-editor'

export default {
  components: {
    MyEditor
  },
  data() {
    return {
      categoryList: [],
      weighProductDeatil: {},
      props: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  created() {
    this.getCategoryList()
    if (this.$route.query.id) {
      this.init()
    }
  },
  methods: {
    init() {
      let params = {
        _id: this.$route.query.id
      }
      getWeighProductDetail(params).then(
        res => {
          if (res.success) {
            this.weighProductDeatil = res.data
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 获取分类
    getCategoryList() {
      let params = {
        belongMenu: '/weigh-product-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
          }
        },
        err => {
          console.log(err)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.info-text {
  font-size: 16px;
  font-weight: 700;
}
</style>
