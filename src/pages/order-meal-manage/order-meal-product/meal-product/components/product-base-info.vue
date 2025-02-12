<template>
  <el-form ref="productDetailRef" :model="productDetail" :rules="productDetailRules" label-position="top">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="菜品名称" prop="productName"> <el-input v-model.trim="productDetail.productName" placeholder="请输入菜品名称"></el-input> </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="菜品分类" prop="categoryId">
          <el-select v-model="productDetail.categoryId" placeholder="请选择菜品分类" style="width:100%"> <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="所属区域" prop="zoneId">
          <el-select v-model="productDetail.zoneId" placeholder="请选择菜品所属区域" style="width:100%"> <el-option v-for="item in zoneList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="排序号" prop="sortNo"> <el-input-number v-model="productDetail.sortNo" :min="0" :step="1" step-strictly style="width:100%"></el-input-number> </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="菜品简介" prop="summary"> <el-input type="textarea" v-model="productDetail.summary" :rows="3" placeholder="请输入菜品简介"></el-input> </el-form-item>
    <el-form-item label="菜品型号">
      <el-table :data="productDetail.sku" border size="small">
        <el-table-column label="规则名称" min-width="140" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.title" placeholder="请输入型号"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="条码" min-width="140" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.barCode" placeholder="请输入条码"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="零售价" min-width="110" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.price" :min="0" :precision="2" :step="0.01" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="会员价" min-width="110" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.vipPrice" :min="0" :max="scope.row.price" :precision="2" :step="0.01" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="成本价" min-width="110" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.costPrice" :min="0" :precision="2" :step="0.01" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="110" align="center">
          <template slot-scope="scope">
            <el-input-number size="mini" :controls="false" v-model="scope.row.stock" :min="0" :precision="0" :step="1" style="width:100%"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="160" align="center">
          <template slot-scope="scope">
            <my-upload class="sku-img" :imgs="scope.row.imgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveSkuImg(scope.$index, $event)" @handleUploadImg="handleUploadSkuImg(scope.$index, $event)"> </my-upload>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" fixed="right">
          <template slot="header" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleAddSku(scope.row)">新增菜品型号</el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDeleteSku(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="上下架" prop="isShow"> <el-switch v-model="productDetail.isShow"></el-switch> </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="热销菜品" prop="sellWell"> <el-switch v-model="productDetail.sellWell"></el-switch> </el-form-item>
      </el-col>
      <!--
        <el-col :span="8">
          <el-form-item label="新品菜品" prop="isNew"> <el-switch v-model="productDetail.isNew"></el-switch> </el-form-item>
        </el-col>
      -->
    </el-row>
    <el-form-item label="菜品图片"> <my-upload :imgs="productDetail.imgs" :limitUploadImgs="5" @handleRemoveImg="handleRemoveImg('imgs', $event)" @handleUploadImg="handleUploadImg('imgs', $event)"> </my-upload> </el-form-item>
  </el-form>
</template>

<script>
import myUpload from '@/components/my-upload'

export default {
  props: {
    productDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    categoryList: {
      type: Array,
      default() {
        return []
      }
    },
    zoneList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    myUpload
  },
  data() {
    return {
      productDetailRules: {
        categoryId: [{ required: true, message: '请选择菜品分类', trigger: 'change' }],
        productName: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleUploadImg(txt, imgObj) {
      if (!this.productDetail[txt]) {
        this.$set(this.productDetail, txt, [])
      }
      this.productDetail[txt].push(JSON.parse(JSON.stringify(imgObj)))
    },
    // 删除图片
    handleRemoveImg(txt, fileList) {
      this.productDetail[txt] = fileList.map(item => {
        return {
          url: item.url,
          thumUrl: '',
          absoluteUrl: ''
        }
      })
    },
    handleAddSku(item) {
      let row = {
        title: '',
        barCode: '',
        price: 0,
        vipPrice: 0,
        costPrice: 0,
        stock: 0,
        img: null
      }
      this.productDetail.sku.push(row)
    },
    handleDeleteSku(index) {
      this.$confirm('确定删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.productDetail.sku.splice(index, 1)
        })
        .catch(() => {})
    },
    handleRemoveSkuImg(index, fileList) {
      this.productDetail.sku[index].img = { url: '', thumUrl: '', absoluteUrl: '' }
    },
    handleUploadSkuImg(index, imgObj) {
      this.productDetail.sku[index].img = JSON.parse(JSON.stringify(imgObj))
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
