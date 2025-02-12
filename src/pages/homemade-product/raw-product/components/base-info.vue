<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form :model="rawProductDetail" label-width="100px" label-position="top" disabled>
          <div class="info-item">
            <el-divider content-position="left">基本信息</el-divider>
            <el-row>
              <el-form-item>
                <div class="info-text">产品名称</div>
                <el-input type="text" v-model="rawProductDetail.productName"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item>
                  <div class="info-text">排序号</div>
                  <el-input-number v-model="rawProductDetail.sortNo" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="info-text">产品库存</div>
                  <el-input-number v-model="rawProductDetail.stock" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <div class="info-text">产品单位</div>
                  <el-input type="text" v-model="rawProductDetail.unitName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6" v-if="rawProductDetail.mainImg && rawProductDetail.mainImg.url">
                <el-form-item>
                  <div class="info-text">产品图片</div>
                  <el-image style="width: 120px; height: 120px" :src="rawProductDetail.mainImg.url" fit="fill"></el-image>
                </el-form-item>
              </el-col>
              <el-col :span="18" v-if="rawProductDetail.imgs && rawProductDetail.imgs.length">
                <el-form-item>
                  <div class="info-text">产品详情图</div>
                  <el-image v-for="(item, index) in rawProductDetail.imgs" :key="index" style="width: 120px; height: 120px;margin-right:15px" :src="item.url" fit="fill"></el-image>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="info-item">
            <el-divider content-position="left">产品型号</el-divider>
            <el-row>
              <el-table class="table-main" ref="listTable" :data="rawProductDetail.sku" border>
                <el-table-column align="center" prop="id" label="id" width="55" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="barCode" label="商品条形码" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="换算关系" min-width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>1{{ scope.row.unitName }} = {{ scope.row.convertCount }}{{ rawProductDetail.unitName }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="costPrice" label="供货价" min-width="90" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="price" label="零售指导价" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="oriPrice" label="采购价" min-width="90" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column align="center" prop="vipPrice" label="V6会员价" min-width="100" show-overflow-tooltip></el-table-column> -->
                <el-table-column align="center" prop="img" label="图片" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <img :src="scope.row.img ? scope.row.img.url : ''" style="max-width: 100%; max-height: 60px;" />
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRawProductDetail } from '@/api/system'

export default {
  data() {
    return {
      rawProductDetail: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.init()
    }
  },
  methods: {
    init() {
      let params = {
        _id: this.$route.query.id
      }
      getRawProductDetail(params).then(
        res => {
          if (res.success) {
            this.rawProductDetail = res.data
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  .info-text {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
