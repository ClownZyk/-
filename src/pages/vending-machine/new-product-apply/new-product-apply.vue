<template>
  <div v-if="containerIsShow">
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="申请状态">
          <el-select v-model="filterParam.applyStatus" placeholder="请选择申请状态"> <el-option v-for="item in applyStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option></el-select>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="getNewProductApplyList('refresh')">搜索</el-button> </el-form-item>
      </div>
      <div>
        <el-form-item> <el-button type="warning" @click="handleMachineNewProdApply">新品申请</el-button> </el-form-item>
        <el-form-item> <el-button type="success" @click="handleMachineThirdProd">第三方基础库产品</el-button> </el-form-item>
      </div>
    </el-form>
    <el-table v-loading="listLoading" :data="applyProdList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="商品id" prop="id" width="140" align="center"></el-table-column>
      <el-table-column label="商品图片" width="120" align="center">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.imgUrl" fit="cover" :preview-src-list="[scope.row.imgUrl]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品条码" prop="qrCodes" min-width="140" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="零售价（元）" width="130" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ parseFloat((scope.row.price / 100).toFixed(2)) }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="applyTime" width="180" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="申请状态" width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.applyStatus === 1" style="color:#E6A23C">审核中</div>
          <div v-else-if="scope.row.applyStatus === 2" style="color:#67C23A">通过</div>
          <div v-else-if="scope.row.applyStatus === 3" style="color:#F56C6C">驳回</div>
        </template>
      </el-table-column>
      <el-table-column label="驳回类型" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.rejectType">{{ scope.row.rejectType | rejectTypeFilter }}</div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="驳回原因" prop="rejectReason" min-width="160" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.rejectReason || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleNewProdEdit(scope.row)" :disabled="scope.row.applyStatus !== 3">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </el-col>

    <!-- 新品申请添加/修改弹框 -->
    <el-dialog :title="`${operateAction === 1 ? '新品申请添加' : '新品申请修改'}`" :visible.sync="isNewProdApplyShow" width="750px" @close="isNewProdApplyShow = false" :close-on-click-modal="false">
      <el-form ref="newProdFormRef" :model="newProdForm" :rules="newProdFormRules" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="item.name"> <el-input type="text" v-model.trim="newProdForm.item.name" placeholder="商品名称"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品条码" prop="item.qrCodes"> <el-input type="text" v-model.trim="newProdForm.item.qrCodes" placeholder="商品条码"></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品零售价（元）" prop="item.price">
              <el-input-number v-model="newProdForm.item.price" :controls="false" :min="0" :step="0.01" step-strictly label="零售价" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品售卖展示图（1张）">
              <prod-upload
                ref="mainImgRef"
                :imgs.sync="mainImgs"
                :limitUploadImgs="1"
                :uploadSize="uploadSize"
                @handleUploadImgFile="handleUploadImgFile('mainImgFile', 1, $event)"
                @handleRemoveImg="handleRemoveImg('mainImgFile', 1, $event)"
              >
              </prod-upload>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图片上传备注">
              <ul>
                <li>建议像素800*800，大小不超过300k</li>
                <li>仅支持白色背景，多角度拍摄</li>
                <li>商品在画面居中，四周留有一定空白</li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="正确示例（点击放大查看）"> <el-image style="width: 200px;height:200px" :src="exampleImg" fit="cover" :preview-src-list="[exampleImg]"></el-image> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="商品实物图（4张-商品上下左右四面，至少1张条码清晰可见）">
              <prod-upload
                ref="actualImgsRef"
                :imgs.sync="actualImgs"
                :limitUploadImgs="4"
                :uploadSize="uploadSize"
                @handleUploadImgFile="handleUploadImgFile('actualImgsFile', 4, $event)"
                @handleRemoveImg="handleRemoveImg('actualImgsFile', 4, $event)"
              >
              </prod-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitNewProdApplyInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getNewProductApplyList, applyVendingMachineNewProd, getNewProdApplyDetail } from '@/api/system'
import prodUpload from './components/prod-upload'

export default {
  components: {
    prodUpload
  },
  watch: {
    $route(to, from) {
      if (to.name === 'new-product-apply') {
        this.getNewProductApplyList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isNewProdApplyShow(val) {
      if (!val) {
        this.newProdForm = {
          item: {
            name: '',
            collType: 1,
            qrCodes: '',
            price: 0
          },
          mainImgFile: null,
          actualImgsFile: []
        }
        this.$refs['mainImgRef'].clearFiles()
        this.$refs['actualImgsRef'].clearFiles()
      }
    }
  },
  data() {
    return {
      filterParam: {
        applyStatus: 0
      },
      applyProdList: [],
      newProdForm: {
        item: {
          name: '',
          collType: 1,
          qrCodes: '',
          price: 0
        },
        mainImgFile: null,
        actualImgsFile: []
      },
      mainImgs: [],
      actualImgs: [],
      uploadSize: 0.3,
      operateAction: 1,
      listLoading: false,
      submitLoading: false,
      isNewProdApplyShow: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      exampleImg: 'http://v6.wxbos.cn/Files/Pictures/2023/10/25/2ea0b305-4437-4e96-9200-ed7fda96cee3_t.png',
      newProdFormRules: {
        'item.name': [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        'item.qrCodes': [{ required: true, message: '商品条码不能为空', trigger: 'blur' }],
        'item.price': [{ required: true, message: '商品价格不能为空', trigger: 'blur' }]
      },
      applyStatus: [{ value: 0, label: '全部状态' }, { value: 1, label: '审核中' }, { value: 2, label: '通过' }, { value: 3, label: '驳回' }]
    }
  },
  filters: {
    rejectTypeFilter(val) {
      let rejectTypeList = [{ value: '1', label: '名称不合规' }, { value: '2', label: '条码不合规' }, { value: '3', label: '展示图不清晰' }, { value: '4', label: '其他' }]
      let arr = val.split(',')
      let list = rejectTypeList.filter(item => {
        return arr.find(v => v === item.value)
      })
      let str = ''
      if (list.length > 0) {
        str = list.map(item => item.label).join('、')
      } else {
        str = '--'
      }
      return str
    }
  },
  mounted() {
    this.getNewProductApplyList()
  },
  methods: {
    // 获取新品申请列表
    getNewProductApplyList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        applyStatus: this.filterParam.applyStatus,
        page: this.pageIndex,
        limit: this.pageSize
      }
      this.listLoading = true
      getNewProductApplyList(params)
        .then(res => {
          this.listLoading = false
          this.applyProdList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 申请新品
    handleMachineNewProdApply() {
      this.operateAction = 1
      this.isNewProdApplyShow = true
    },
    // 修改新品申请
    handleNewProdEdit(row) {
      this.operateAction = 2
      this.isNewProdApplyShow = true
      this.$nextTick(() => {
        this.getNewProdApplyDetail(row)
      })
    },
    getNewProdApplyDetail(row) {
      let params = {
        id: row.id
      }
      getNewProdApplyDetail(params).then(res => {
        let { name, qrCodes, collType, price, imgUrl, actualImgs, id } = res.data.data
        this.newProdForm = {
          item: {
            id,
            name,
            collType,
            qrCodes,
            price: parseFloat((price / 100).toFixed(2))
          },
          mainImgFile: null,
          actualImgsFile: []
        }
        this.mainImgs = [{ name: '商品售卖展示图', url: imgUrl }]
        this.actualImgs = actualImgs.map((item, index) => {
          return {
            name: `商品实物图${index + 1}`,
            url: item
          }
        })
      })
    },
    submitNewProdApplyInfo() {
      this.$refs['newProdFormRef'].validate(valid => {
        if (valid) {
          if (this.operateAction === 1) {
            if (!this.newProdForm.mainImgFile || this.newProdForm.actualImgsFile.length < 4) {
              return this.$message.warning('请上传商品售卖展示图和实物图！')
            }
          } else if (this.operateAction === 2) {
            if ((this.mainImgs.length <= 0 && !this.newProdForm.mainImgFile) || this.newProdForm.actualImgsFile.length < 4 - this.actualImgs.length) {
              return this.$message.warning('请上传商品售卖展示图和实物图！')
            }
            this.newProdForm.item.actualImgs = this.actualImgs.map(item => item.url)
          }
          let formData = new FormData()
          formData.append('item', JSON.stringify({ ...this.newProdForm.item, price: parseInt((this.newProdForm.item.price * 100).toFixed(0)) }))
          formData.append('id', this.operateAction)
          if (this.newProdForm.mainImgFile) {
            formData.append('file', this.newProdForm.mainImgFile)
          }
          if (this.newProdForm.actualImgsFile.length > 0) {
            this.newProdForm.actualImgsFile.forEach(item => {
              formData.append('files', item)
            })
          }
          // for (var key of formData.keys()) {
          //   console.log(key)
          // }
          // for (var value of formData.values()) {
          //   console.log(value)
          // }
          this.submitLoading = true
          applyVendingMachineNewProd(formData)
            .then(res => {
              this.submitLoading = false
              this.isNewProdApplyShow = false
              this.$message.success(res.msg)
              this.getNewProductApplyList()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (this.operateAction === 1) {
        if (limitUploadImgs > 1) {
          this.newProdForm[txt] = fileList.length > 0 ? this.newProdForm[txt].filter(item => item.uid === fileList[0].uid) : []
        } else {
          this.newProdForm[txt] = null
        }
      } else if (this.operateAction === 2) {
        if (txt === 'actualImgsFile') {
          this.actualImgs = fileList
        } else {
          this.mainImgs = []
        }
      }
    },
    handleUploadImgFile(txt, limitUploadImgs, file) {
      if (file.size.size > this.uploadSize * 1024 * 1024) {
        return false
      }
      if (limitUploadImgs > 1) {
        this.newProdForm[txt].push(file)
      } else {
        this.newProdForm[txt] = file
      }
    },
    handleMachineThirdProd() {
      this.$router.push({ path: '/third-product-list' })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getNewProductApplyList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getNewProductApplyList()
    }
  }
}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
ul {
  list-style-type: disc;
  font-size: 12px;
  color: #666;
}
</style>
