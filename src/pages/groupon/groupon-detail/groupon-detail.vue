<template>
  <div class="groupon-detail">
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form v-loading="detailLoading" ref="form" :model="form" label-position="top" :rules="rules">
      <el-form-item v-if="!this.$route.query.id"> <el-button type="warning" @click="isGrouponTemplateShow = true">选择模板</el-button></el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-row>
            <el-divider content-position="left">团购信息</el-divider>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="团购活动名称" prop="activityName"> <el-input v-model="form.activityName" placeholder="请输入团购活动名称"></el-input> </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="团购活动时间" prop="activityTimeArr">
                  <el-date-picker
                    v-model="form.activityTimeArr"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy/MM/dd HH:mm:ss"
                    value-format="yyyy/MM/dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    style="width: 100%"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="isManage">
              <el-col>
                <el-form-item label="适用门店">
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllShopsChange">全选</el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedShops" @change="handleCheckedShopsChange">
                    <el-checkbox v-for="item in shopList" :label="item.shopCid" :key="item.shopCid" border>{{ item.shopName }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6">
                <el-form-item label="上下架" prop="isForeshow"> <el-switch v-model="form.isForeshow"></el-switch> </el-form-item>
              </el-col>
              <!--
                <el-col :span="4">
                  <el-form-item label="限购" prop="isLimit"> <el-switch v-model="form.isLimit" @change="handleIsLimit"></el-switch> </el-form-item>
                </el-col>
                <el-col :span="6" v-show="form.isLimit">
                  <el-form-item label="限购数量" prop="limitNum"> <el-input-number v-model="form.limitNum" placeholder="限购数量" :controls="false" :min="0" :step="1" step-strictly style="width: 90%"></el-input-number> </el-form-item>
                </el-col>
              -->
              <el-col :span="6">
                <el-form-item label="排序号(越大越在前)" prop="sortNo"> <el-input-number v-model="form.sortNo" placeholder="限购数量" :min="0" :step="1" step-strictly style="width: 100%"></el-input-number> </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-divider content-position="left">商品信息</el-divider>
            <el-form-item label="团购商品" prop="productName"> <el-input type="text" v-model.trim="form.productName" placeholder="请输入商品名称" style="width: 450px"></el-input> </el-form-item>
            <el-form-item>
              <el-table class="table" size="small" ref="tablePrice" :data="form.sku" border style="width: 100%">
                <el-table-column align="center" prop="name" label="商品型号" min-width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name" placeholder="请输入型号"></el-input>
                  </template>
                </el-table-column>
                <!--
                  <el-table-column align="center" prop="barCode" label="商品条码" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.barCode" placeholder="请输入条码"></el-input>
                    </template>
                  </el-table-column>
                -->
                <el-table-column align="center" prop="costPrice" label="成本价" min-width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.costPrice" :min="0" :step="0.01" step-strictly :controls="false" label="成本价" @change="inputChange($event, scope.row, 'costPrice')" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="originalPrice" label="原价" min-width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number
                      size="mini"
                      v-model="scope.row.originalPrice"
                      :min="0"
                      :step="0.01"
                      step-strictly
                      :controls="false"
                      label="原价"
                      @change="inputChange($event, scope.row, 'originalPrice')"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="spellPrice" label="团购价" min-width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number
                      size="mini"
                      v-model="scope.row.spellPrice"
                      label="团购价"
                      :min="0"
                      :step="0.01"
                      step-strictly
                      :controls="false"
                      @change="inputChange($event, scope.row, 'spellPrice')"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="inventoryNum" label="库存" min-width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number
                      size="mini"
                      v-model="scope.row.inventoryNum"
                      placeholder="数量"
                      :min="0"
                      :controls="false"
                      :step="0.1"
                      step-strictly
                      @change="inputChange($event, scope.row, 'inventoryNum')"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="limitNum" label="限购(0为无限购)" min-width="140" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.limitNum" placeholder="限购" :min="0" :controls="false" :step="1" step-strictly @change="inputChange($event, scope.row, 'limitNum')" style="width: 100%"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="inventoryNum" label="图片" min-width="110" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <my-upload class="sku-img" :imgs="scope.row.imgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveSkuImg(scope.$index, $event)" @handleUploadImg="handleUploadSkuImg(scope.$index, $event)"> </my-upload>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="160" fixed="right">
                  <template slot="header" slot-scope="scope">
                    <el-button size="mini" type="primary" plain @click="handleAddSku(scope.row)">新增型号</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="operateDelete(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="商品图片"> <my-upload :imgs="form.images" :limitUploadImgs="5" @handleRemoveImg="handleRemoveImg('images', 5, $event)" @handleUploadImg="handleUploadImg('images', 5, $event)"> </my-upload> </el-form-item>
            <el-form-item label="商品视频">
              <video-upload ref="uploadVideo" videoRef="uploadVideo" :limit="1" @change="uploadVideoChange"> </video-upload>
              <div class="video-contain" v-if="form.videoUrl"><video class="video-item" ref="videoPlay" :src="form.videoUrl" controls muted></video></div>
            </el-form-item>
          </el-row>
          <el-form-item> <el-button :loading="submitLoading" type="primary" @click="formSubmit">提交</el-button> </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-divider content-position="left">团购内容</el-divider>
          <el-row>
            <div v-for="(item, index) in form.contentList" :key="index">
              <div class="content-title">
                <span class="operate-title">{{ item.contentType === 1 ? '大图' : item.contentType === 2 ? '小图' : item.contentType === 3 ? '视频' : '文字' }}</span>
                <span class="operate-btns">
                  <el-button size="mini" plain @click="handleContentUpOrDown(index, -1)" :disabled="index === 0">上移</el-button>
                  <el-button size="mini" plain @click="handleContentUpOrDown(index, 1)" :disabled="index === form.contentList.length - 1">下移</el-button>
                  <el-button size="mini" plain @click="handleContentTop(index)" :disabled="index === 0">置顶</el-button>
                  <el-button size="mini" plain @click="handleContentDelete(index)">删除</el-button>
                </span>
              </div>
              <div v-if="item.contentType === 1" class="content-item">
                <my-upload :imgs="item.bigImgs" :limitUploadImgs="1" @handleRemoveImg="handleBigOrSmallImgRemoveImg('bigImg', 1, index, $event)" @handleUploadImg="handleBigOrSmallImgUploadImg('bigImg', 1, index, $event)"> </my-upload>
              </div>
              <div v-if="item.contentType === 2" class="content-item">
                <my-upload :imgs="item.smallImgs" :limitUploadImgs="9" @handleRemoveImg="handleBigOrSmallImgRemoveImg('smallImg', 9, index, $event)" @handleUploadImg="handleBigOrSmallImgUploadImg('smallImg', 9, index, $event)"> </my-upload>
              </div>
              <div v-if="item.contentType === 3" class="content-item">
                <video-upload ref="uploadContentVideo" videoRef="uploadContentVideo" :limit="1" @change="uploadContentVideoChange(index, $event)"> </video-upload>
                <div class="video-contain" v-if="form.videoUrl"><video class="video-item" ref="videoPlay" :src="form.videoUrl" controls muted></video></div>
              </div>
              <div v-if="item.contentType === 4" class="content-item"><el-input type="textarea" v-model="item.words" :rows="2" placeholder="请输入文字描述"></el-input></div>
            </div>
          </el-row>
          <el-form-item>
            <el-button size="small" type="warning" icon="el-icon-picture-outline" plain @click="contentListAdd(1)">大图</el-button>
            <el-button size="small" type="warning" icon="el-icon-copy-document" plain @click="contentListAdd(2)">小图</el-button>
            <el-button size="small" type="warning" icon="el-icon-video-camera" plain @click="contentListAdd(3)">视频</el-button>
            <el-button size="small" type="warning" icon="el-icon-edit" plain @click="contentListAdd(4)">文字</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 模板团购信息 -->
    <el-dialog title="团购模板" :visible.sync="isGrouponTemplateShow" width="1000px" @close="isGrouponTemplateShow = false" :close-on-click-modal="false">
      <groupon-template-select :isGrouponTemplateShow.sync="isGrouponTemplateShow" @saveGrouponInfo="saveGrouponInfo"></groupon-template-select>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { SpellGroupOperation, SpellGroupGetDetailById, getGrouponSites } from '@/api/system'
import myUpload from '@/components/my-upload'
import videoUpload from '@/components/video-upload'
import GrouponTemplateSelect from './components/groupon-template-select.vue'

export default {
  name: 'groupon-detail',
  components: {
    myUpload,
    videoUpload,
    GrouponTemplateSelect
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      activeName: 'first',
      form: {
        spellGroupType: 1,
        productId: '',
        productName: '',
        activityName: '',
        activityTimeArr: [],
        peopleNum: 1,
        validTimeD: 1,
        validTimeH: 0,
        validTimeM: 0,
        isLimit: false,
        limitNum: 0,
        isTogether: false,
        isSimulation: false,
        isPromotion: false,
        promotionCode: [],
        sku: [],
        content: '',
        limitCid: [],
        images: [],
        videoUrl: '',
        sortNo: 99,
        isForeshow: true,
        contentList: []
      },
      shopList: [],
      checkedShops: [],
      submitLoading: false,
      detailLoading: false,
      isGrouponTemplateShow: false,
      rules: {
        activityName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        spellGroupType: [{ required: true, message: '请选择拼团类型', trigger: 'change' }],
        activityTimeArr: [{ type: 'array', required: true, message: '请选择生效时间', trigger: 'change' }],
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    operateAction() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    },
    checkAll: {
      get() {
        if (this.shopList.length <= 0) {
          return false
        }
        return this.checkedShops.length === this.shopList.length
      },
      set() {}
    },
    isIndeterminate() {
      return this.checkedShops.length > 0 && this.checkedShops.length < this.shopList.length
    }
  },
  watch: {
    checkedShops(value) {
      this.form.limitCid = this.shopList.filter(item => {
        return value.find(val => val === item.shopCid)
      })
    }
  },
  mounted() {
    this.getAllShops()
  },
  methods: {
    getAllShops() {
      getGrouponSites().then(res => {
        this.shopList = res.data.map(item => {
          return {
            shopName: item.companyName,
            shopCid: item.cid
          }
        })
        if (!this.isManage && !this.$route.query.id) {
          this.form.limitCid = this.shopList.filter(item => item.shopCid === this.$store.state._cid)
          if (!this.form.limitCid || this.form.limitCid.length <= 0) {
            this.$message.warning('请前往‘商城—>商城设置（经营范围中勾选‘云极小超团购’）’，否则团购活动无效！')
            this.$router.back()
          }
        }
        if (this.$route.query.id) {
          this.init()
        }
      })
    },
    handleCheckAllShopsChange(value) {
      this.checkedShops = value ? this.shopList.map(item => item.shopCid) : []
    },
    handleCheckedShopsChange(value) {
      this.checkedShops = value
    },
    init() {
      let parmas = {
        _id: this.$route.query.id
      }
      this.detailLoading = true
      SpellGroupGetDetailById(parmas)
        .then(res => {
          this.detailLoading = false
          this.form = res.data
          let skuList = res.data.sku.map(item => {
            return {
              ...item,
              imgs: item.img && item.img.url ? [{ url: item.img.url, name: '商品图片' }] : []
            }
          })
          this.$set(this.form, 'sku', skuList)
          let contentList = res.data.contentList.map(item => {
            return {
              ...item,
              bigImgs: item.bigImg ? [{ url: item.bigImg }] : [],
              smallImgs:
                item.smallImg && item.smallImg.length > 0
                  ? item.smallImg.map(val => {
                      return { url: val }
                    })
                  : []
            }
          })
          this.$set(this.form, 'contentList', contentList)
          // 处理时间数组
          if (this.form.activityStartTime && this.form.activityEndTime) {
            this.$set(this.form, 'activityTimeArr', [this.form.activityStartTime, this.form.activityEndTime])
          }
          this.form.validTimeD = this.form.validTime[0] ? this.form.validTime[0] : 0
          this.form.validTimeH = this.form.validTime[1] ? this.form.validTime[1] : 0
          this.form.validTimeM = this.form.validTime[2] ? this.form.validTime[2] : 0

          // 适用站点处理
          this.checkedShops = res.data.limitCid.map(item => item.shopCid)
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    saveGrouponInfo(res) {
      this.form = { ...this.form, ...res }
    },
    // 删除sku里面的值
    operateDelete(index) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.sku.splice(index, 1)
      })
    },
    // 开关是否限购
    handleIsLimit(val) {
      if (val) {
        // 限购，清空限购数量
        this.form.limitNum = 0
      }
    },
    // 拼团输入框值改变时，限定值不能为空
    inputChange(e, row, txt) {
      this.$nextTick(() => {
        if (e === undefined) {
          row[txt] = 0
        }
      })
    },
    handleAddSku() {
      let row = {
        name: '',
        barCode: '',
        costPrice: 0,
        originalPrice: 0,
        spellPrice: 0,
        inventoryNum: 0,
        limitNum: 0,
        img: null,
        imgs: []
      }
      this.form.sku.push(row)
    },
    uploadVideoChange(videoUrl) {
      this.form.videoUrl = videoUrl
    },
    handleRemoveSkuImg(index, fileList) {
      this.form.sku[index].img = { url: '', thumUrl: '', absoluteUrl: '' }
    },
    handleUploadSkuImg(index, imgObj) {
      this.form.sku[index].img = JSON.parse(JSON.stringify(imgObj))
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
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
    // 提交表单
    formSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.sku.length <= 0) {
            return this.$message.warning('请添加商品型号信息后再提交数据！')
          }
          let isSkuEmpty = this.form.sku.some(item => !item.name)
          if (isSkuEmpty) {
            return this.$message.warning('请将商品型号信息填写完整后再提交数据！')
          }
          this.$confirm('确认提交数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (!this.form.validTimeD) this.form.validTimeD = 0
              if (!this.form.validTimeH) this.form.validTimeH = 0
              if (!this.form.validTimeM) this.form.validTimeM = 0
              this.$set(this.form, 'validTime', [this.form.validTimeD, this.form.validTimeH, this.form.validTimeM])
              if (this.form.activityTimeArr.length > 0) {
                this.form.activityStartTime = this.form.activityTimeArr[0]
                this.form.activityEndTime = this.form.activityTimeArr[1]
              }
              this.$set(this.form, 'creater', this.$store.state.UserID)
              this.$set(this.form, 'roleId', this.$store.state.UserRole)
              this.$set(this.form, 'cid', this.$store.state._cid)
              let params = {
                dto: Object.assign({}, this.form),
                action: this.operateAction
              }
              // console.log(params)
              this.submitLoading = true
              SpellGroupOperation(params)
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
            .catch(() => {})
        }
      })
    },

    // 团购内容添加，修改，删除
    contentListAdd(type) {
      let row = {
        contentType: type,
        bigImg: '',
        smallImg: [],
        videoUrl: '',
        words: '',
        labels: []
      }
      this.form.contentList.push(row)
    },
    handleContentUpOrDown(index, count) {
      let moveIndex = count > 0 ? index + 1 : index - 1
      this.form.contentList[index] = this.form.contentList.splice(moveIndex, 1, this.form.contentList[index])[0]
    },
    handleContentTop(index) {
      let contentList = [...this.form.contentList]
      this.form.contentList = [...contentList.splice(index, 1), ...contentList]
    },
    handleContentDelete(index) {
      this.form.contentList.splice(index, 1)
    },
    handleBigOrSmallImgRemoveImg(txt, limitNum, index, fileList) {
      if (limitNum <= 1) {
        this.form.contentList[index][txt] = ''
      } else {
        this.form.contentList[index][txt] = fileList && fileList.length > 0 ? fileList.map(item => item.url) : []
      }
    },
    handleBigOrSmallImgUploadImg(txt, limitNum, index, imgObj) {
      if (limitNum <= 1) {
        this.form.contentList[index][txt] = JSON.parse(JSON.stringify(imgObj)).url
      } else {
        this.form.contentList[index][txt].push(JSON.parse(JSON.stringify(imgObj)).url)
      }
    },
    uploadContentVideoChange(index, videoUrl) {
      this.form.contentList[index].videoUrl = videoUrl
    },
    // 各种清空
    clear() {
      this.submitLoading = false
      this.$router.push('/groupon-list')
    }
  }
}
</script>

<style lang="scss" scoped>
.video-contain {
  width: 50%;
  height: 260px;
  margin-top: 5px;
  .video-item {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.content-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .operate-title {
    font-weight: 700;
    font-size: 14px;
  }
}
.content-item {
  margin-bottom: 10px;
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
.el-checkbox-group {
  .el-checkbox {
    width: 255px !important;
    margin-right: 20px !important;
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: unset;
  }
}
</style>
