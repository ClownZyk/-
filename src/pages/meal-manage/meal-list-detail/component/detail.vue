<template>
  <div>
    <el-form :model="detail" class="">
      <div class="mag-dialog-row">
        <el-form-item class="el-form-item el-form-row" prop="name">
          <div class="form-item-title">美食名称<span class="border"></span> <span class="EnName">title</span></div>
          <el-input class="form-input" placeholder="请输入美食名称" v-model="detail.prodName"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item el-form-row" prop="name">
          <div class="form-item-title">储藏条件<span class="border"></span> <span class="EnName">title</span></div>
          <el-input class="form-input" placeholder="请输入储藏条件" v-model="detail.storage"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item el-form-row" prop="name">
          <div class="form-item-title">美食简介<span class="border"></span> <span class="EnName">title</span></div>
          <el-input class="form-input" placeholder="请输入美食简介" type="textarea" :row="3" v-model="detail.desc"></el-input>
        </el-form-item>
        <el-form-item class="el-form-item el-form-row">
          <div class="form-item-title">列表主图<span class="border"></span> <span class="EnName">mainimg</span></div>
          <!-- <div class="item-detail item-img" :style="{'backgroundImage':  'url('+ detail.mainImg.url +')'}" v-if="isShow"></div> -->
          <my-upload :imgs="detail.prodImage" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)" @handleUploadImg="handleUploadImg('prodImage', 3, $event)"> </my-upload>
        </el-form-item>
      </div>
      <el-button type="primary" size="mini" @click="_option(null, 0, '新增', null)">点击添加产品</el-button>
      <el-table class="table-main" ref="detail.msku" v-show="detail.msku.length !== 0" :data="detail.msku" border tooltip-effect="dark" style="width: 1000px;margin-top: 10px;">
        <el-table-column align="title" prop="title" label="规格" width="180"></el-table-column>
        <el-table-column align="center" prop="sizeDimension" label="净重" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="barCode" label="产品条码" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="costPrice" label="成本价" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="price" label="现价" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="vipPrice" label="会员价" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="title" label="图片" width="120">
          <template slot-scope="scope" v-if="scope.row.img">
            <div class="image" :style="{ backgroundImage: 'url(' + scope.row.img.url + ')' }"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_option(scope.row, 1, '编辑', scope.$index)">编辑</el-button>
            <el-button type="danger" size="mini" @click="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 新增 -->
    <el-dialog title="产品详情" :visible.sync="dialogFormVisible" :before-close="handleClose" width="800px">
      <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm">
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item" prop="name">
            <div class="form-item-title">规格<span class="border"></span> <span class="EnName">title</span></div>
            <el-input class="mag-input" placeholder="请输入规格" v-model="dialog.title"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" prop="days">
            <div class="form-item-title">净重<span class="border"></span> <span class="EnName">sizeDimension</span></div>
            <el-input class="mag-input" placeholder="请输入净重" v-model="dialog.sizeDimension"></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item" prop="costPrice">
            <div class="form-item-title">成本价<span class="border"></span> <span class="EnName">costprice</span></div>
            <el-input class="mag-input" placeholder="请输入成本价" v-model="dialog.costPrice"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" prop="price">
            <div class="form-item-title">现价<span class="border"></span> <span class="EnName">nowprice</span></div>
            <el-input class="mag-input" placeholder="请输入现价" v-model="dialog.price"></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item" prop="vipPrice">
            <div class="form-item-title">会员价<span class="border"></span> <span class="EnName">vipprice</span></div>
            <el-input class="mag-input" placeholder="请输入会员价" v-model="dialog.vipPrice"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" prop="barCode">
            <div class="form-item-title">条码<span class="border"></span> <span class="EnName">barcode</span></div>
            <el-input class="mag-input" placeholder="请输入条码" v-model="dialog.barCode"></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item prop="headImg">
            <div class="form-item-title">图像<span class="border"></span> <span class="EnName">image</span></div>
            <my-upload :imgs="dialog.Headimgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg1('img', 1, $event)" @handleUploadImg="handleUploadImg1('img', 1, $event)"> </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="operation('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from '@/components/my-upload'
export default {
  data() {
    return {
      dialogFormVisible: false,
      list: [],
      Action: null,
      Dto: {},
      Txt: '',
      Index: null,
      formRules: {
        title: [{ required: true, message: '请输入美食名称', trigger: 'blur' }],
        costPrice: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
        price: [{ required: true, message: '请输入现价', trigger: 'blur' }],
        vipPrice: [{ required: true, message: '请输入会员价', trigger: 'blur' }],
        barCode: [{ required: true, message: '请输入条码', trigger: 'blur' }]
      }
    }
  },
  props: {
    detail: Object,
    dialog: Object
  },
  mounted() {},
  methods: {
    handleClose(done) {
      done()
    },
    // 新增或者是修改
    _option(dto, action, txt, index) {
      this.dialogFormVisible = true
      this.$emit('operateMsku', dto)
      this.Action = action
      this.Dto = dto
      this.Txt = txt
      this.Index = index
    },
    // 添加产品
    operation(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('确认' + this.Txt + '吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogFormVisible = false
            if (this.Action === 0) {
              this.detail.msku.push(JSON.parse(JSON.stringify(this.dialog)))
            } else {
              this.detail.msku[this.Index] = this.dialog
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除产品
    remove(index) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.detail.msku.splice(index, 1)
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.detail[txt] = fileList
      } else {
        this.detail[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.detail[txt]) {
          this.$set(this.detail, txt, [])
        }
        this.detail[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.detail[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    handleRemoveImg1(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.dialog[txt] = fileList
      } else {
        this.dialog[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg1(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.dialog[txt]) {
          this.$set(this.dialog, txt, [])
        }
        this.dialog[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        console.log(JSON.parse(JSON.stringify(imgObj)))
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
.image {
  width: 50px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f2f2f2;
  margin: 0 auto;
  background-size: cover;
}
.v-modal {
  z-index: 3 !important;
}
.mag-dialog-row {
  .el-form-item {
    .form-input {
      width: 80%;
    }
  }
}
</style>
