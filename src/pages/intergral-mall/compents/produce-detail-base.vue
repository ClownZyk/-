<template>
  <div class="base-info">
    <div class="page-contain">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled"  v-loading="loading">
        <div class="form-contain-item">
          <el-form-item prop="gategory">
            <div class="form-item-title">产品分类<span class="border"></span><span class="EnName">category</span></div>
            <el-select v-model="form.productType">
              <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.id">{{item.value}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name">
            <div class="form-item-title">商品名称<span class="border"></span><span class="EnName">name</span></div>
            <el-input v-model="form.productName"></el-input>
          </el-form-item>
          <!--<el-form-item prop="name">-->
            <!--<div class="form-item-title">卡劵id<span class="border"></span><span class="EnName">card id</span></div>-->
            <!--<el-input v-model="form.ProductName"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item prop="coordinatesX">
          <div class="form-item-title">排序号<span class="border"></span><span class="EnName">COORDINATESX</span></div>
          <el-input-number placeholder="最小值为99" controls-position="right" :min="99" v-model="form.sortNo"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="introduce" style="width: 100%;">
            <div class="form-item-title">产品简述<span class="border"></span><span class="EnName">summary</span></div>
            <el-input type="textarea" :rows="4" v-model="form.summary" placeholder="请输入产品简述"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item style="width: 100%;">
            <el-button type="primary" @click="addSku" v-show="isShowSkuBtn">添加产品型号</el-button>
          </el-form-item>
          <el-table :data="form.sku" border v-show="isTableShow">
            <el-table-column label="id" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.id"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="兑换卡号" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cardId"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="现价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="图片" align="center">
              <template slot-scope="scope">
                <my-upload :imgs="scope.row.imgs"
                           class="small-img"
                           :limitUploadImgs="1"
                           @handleRemoveImg="handleRemoveImg('img', 1, $event)"
                           @handleUploadImg="handleUploadImg('img', 1, $event)">
                </my-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="form-contain-item" style="margin-top: 15px;">
          <el-form-item prop="introduce" style="width: 100%;">
            <div class="form-item-title">是否上架<span class="border"></span><span class="EnName">isShow</span></div>
            <el-switch style="display: inline-block;" v-model="form.isShow" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">主图<span class="border"></span><span class="EnName">MAINIMAGE</span></div>
            <my-upload :imgs="form.mainImgs"
                       :limitUploadImgs="1"
                       @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)"
                       @handleUploadImg="handleUploadImg('mainImg', 1, $event)">
            </my-upload>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">积分产品列表<span class="border"></span><span class="EnName">IMGAGES</span></div>
            <my-upload :imgs="form.imgs"
                       :limitUploadImgs="4"
                       @handleRemoveImg="handleRemoveImg('imgs', 4, $event)"
                       @handleUploadImg="handleUploadImg('imgs', 4, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
  import myUpload from '@/components/my-upload'
  export default {
    components: {
      myUpload
    },
    props: {
      form: Object,
      rules: Object,
      isTableShow: {
        type: Boolean,
        default: true
      },
      isShowSkuBtn: Boolean
    },
    data () {
      return {
        typeList: [{id: 1, value: '实物'}, {id: 2, value: '虚拟商品'}],
        loading: false,
        formDisabled: false
      }
    },
    methods: {
      addSku() {
        this.form.sku.length === 0 ? this.isTableShow = true : this.isTableShow = false
        this.form.sku.length === 0 ? this.isShowSkuBtn = true : this.isShowSkuBtn = false
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
      }
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
                  text-transform: uppercase;
                  bottom: 0;
                  margin-left: 17px;
                }
              }
            }
          }
          .item-long {
            width: 440px;
          }
          .item-middle {
            width: 210px;
          }
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
</style>
