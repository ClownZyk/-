<template>
  <div class="content" >
    <el-form :model="dialog" class="content-form">
      <div class="content-form-row">
        <el-form-item prop="nickName" class="item-long">
          <div class="form-item-title">标题<span class="border"></span> <span class="EnName">TITLE</span></div>
          <div class="item-detail"  v-if="isShow">{{dialog.title}}</div>
          <el-input class="form-item-placehoder" v-model="dialog.title" autocomplete="off" v-else></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">发布时间<span class="border"></span> <span class="EnName">Release time</span></div>
          <div class="item-detail long-short-input"  v-if="isShow">{{dialog.publishDate.toString().split('')[0]}}</div>
          <el-date-picker
            type="date"
            v-else
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="dialog.publishDate"
            class="form-item-placehoder"></el-date-picker>
        </el-form-item>
      </div>
      <div class="content-form-row">
        <el-form-item prop="nickName">
          <div class="form-item-title">分类<span class="border"></span> <span class="EnName">NICKNAME</span></div>
          <div class="item-detail long-short-input"  v-if="isShow">{{dialog.categoryName}}</div>
          <el-cascader
            class="long-short-input"
            expand-trigger="hover"
            placeholder="请选择分类"
            v-model="dialog.categoryIds"
            @change="selectCategory"
            v-else
            :options="categoryList"
            filterable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">状态<span class="border"></span> <span class="EnName">status</span></div>
          <div class="item-detail long-short-input"  v-if="isShow">{{dialog.viewState === 0 ? '待审核' : dialog.viewState === 1 ? '显示' : '不显示'}}</div>
          <el-select v-else v-model="dialog.viewState" placeholder="请选择" class="long-short-input">
            <el-option :label="item.value" :value="item.id" v-for="item in stateList" :key="item.id">{{item.value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">sortNo</span></div>
          <div class="item-detail long-short-input"  v-if="isShow">{{dialog.sortNo}}</div>
          <el-input-number v-else placeholder="最小值为99"
                            class="long-short-input"
                            onkeyup="this.value=this.value.replace(/\D/g,'')"
                            onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="dialog.sortNo" controls-position="right" :min="99"></el-input-number>
        </el-form-item>
        <el-form-item prop="linkURL"  class="item-long">
          <div class="form-item-title">链接<span class="border"></span> <span class="EnName">link</span></div>
          <div class="item-detail"  v-if="isShow">{{dialog.linkURL}}</div>
          <el-input v-else v-model="dialog.linkURL" autocomplete="off"></el-input>
        </el-form-item>
      </div>
      <div class="content-form-row">
        <el-form-item prop="summary"  class="item-long" style="flex: 0 0 100%;">
          <div class="form-item-title">简介<span class="border"></span> <span class="EnName">summary</span></div>
          <div class="item-detail item-summary"  v-if="isShow">{{dialog.summary}}</div>
          <el-input type="textarea"
                    :rows="4" v-model="dialog.summary" autocomplete="off" v-else></el-input>
        </el-form-item>
      </div>
      <div class="content-form-row">
      <el-form-item class="item-long">
        <div class="form-item-title">SEO标题<span class="border"></span> <span class="EnName">seo Title</span></div>
        <div class="item-detail"  v-if="isShow" >{{dialog.seoTitle}}</div>
        <el-input v-else v-model="dialog.seoTitle"></el-input>
      </el-form-item>
      <el-form-item class="item-long">
        <div class="form-item-title">SEO关键词<span class="border"></span> <span class="EnName">SEO keyword</span></div>
        <div class="item-detail"  v-if="isShow">{{dialog.seoKey}}</div>
        <el-input v-else v-model="dialog.seoKey"></el-input>
      </el-form-item>
      </div>
      <div class="content-form-row">
        <el-form-item style="flex: 0 0 100%;">
          <div class="form-item-title">SEO简介<span class="border"></span> <span class="EnName">SEO Description</span></div>
          <div class="item-detail item-summary"  v-if="isShow">{{dialog.seoDescription}}</div>
          <el-input v-else type="textarea"
                    :rows="4" v-model="dialog.seoDescription"></el-input>
        </el-form-item>
      </div>
      <div class="content-form-row">
        <el-form-item>
          <div class="form-item-title">列表主图<span class="border"></span> <span class="EnName">mainimg</span></div>
          <div class="item-detail item-img" :style="{'backgroundImage':  'url('+ dialog.mainImg.url +')'}" v-if="isShow"></div>
          <my-upload v-else :imgs="dialog.mainImgs"
                      :limitUploadImgs="1"
                      ref="uploadImg"
                      @handleRemoveImg="handleRemoveImg('mainImg', 1, $event)"
                      @handleUploadImg="handleUploadImg('mainImg', 1, $event)">
          </my-upload>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import myUpload from '@/components/my-upload'
export default {
  name: 'detail-detail',
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    dialog: Object,
    categoryList: Array
  },
  data() {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        stateList: [{id: 1, value: '待审核'}, {id: 2, value: '显示'}, {id: 3, value: '不显示'}] // 显示状态
      }
  },
  methods: {
    // 分类下拉选择
    selectCategory(val) {
      let list = Array.from(val)
      this.dialog.categoryId = list[list.length - 1]
    },
    handleRemoveImg (txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.dialog[txt] = fileList
      } else {
        this.dialog[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
      }
    },
    // 图片上传成功回调
    handleUploadImg (txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.dialog[txt]) {
          this.$set(this.dialog, txt, [])
        }
        this.dialog[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.dialog[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  components: {
    myUpload
  }
}
</script>

<style scoped lang="scss">
.content-form{
  padding-left: 15px;
  .content-form-row{
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 240px;
      padding-right: 20px;
      margin-top: 10px;
      margin-bottom: 0 !important;
      .item-detail{
        padding: 0 5px;
        height: 40px;
        background-color: #F0F0F0;
      }
      .item-summary{
        height: 96px;
        line-height: 1.5;
        overflow-y: scroll;
      }
      .long-short-input{
        width: 200px;
      }
      .item-img{
        width: 140px;
        height: 140px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
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
          text-transform: uppercase;
          margin-left: 17px;
        }
      }
    }
    .item-long{
      width: 600px;
    }
  }
}
</style>
