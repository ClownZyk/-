<template>
<div>
    <div class="product-title">
      <div>预约商品</div>
      <el-button type="primary" size="mini" @click="productDetailShow=true">新增</el-button>
    </div>
    <el-table :data="productList" border tooltip-effect="dark" v-loading="listLoading">
      <el-table-column prop="productName" align="center" label="商品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" align="center" label="单价" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="vipPrice" align="center" label="会员价" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="reserveName" align="center" label="开启状态" min-width="240" show-overflow-tooltip>
             <template slot-scope="scope">
               <el-switch v-model="scope.row.isShow"  @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
      <el-table-column align="center" label="操作"  min-width="180" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="mini" @click="_serview(scope.row)">预约</el-button> -->
          <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
          <el-button type="warning" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
     <el-col :span="24" class="toolbar" v-if="productList.length>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            background
            style="float:right;margin-top: 10px;"
          ></el-pagination>
        </el-col>
    <!-- 弹框 -->
        <el-dialog :visible.sync="productDetailShow" width="800px">
          <el-form :model="form" label-width="80px" :rules="formRules" ref="form" class="form">
            <div class="dialof-felx">
              <el-form-item label="产品名称" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="开启状态" prop="remarks">
                <el-switch v-model="form.isShow"></el-switch>
              </el-form-item>
            </div>
            <div class="dialof-felx">
              <el-form-item label="单价" prop="price">
                <el-input-number v-model="form.price" placeholder="请输入产品单价" controls-position="right" :min="0" :precision="2"></el-input-number>
              </el-form-item>
              <el-form-item label="会员价" prop="vipPrice">
                <el-input-number v-model="form.vipPrice" placeholder="请输入产品会员价" controls-position="right" :min="0" :precision="2"></el-input-number>
              </el-form-item>
            </div>
            <el-form-item label="简述" prop="remarks">
              <el-input v-model="form.desc" placeholder="请输入产品简述" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="列表主图" prop="imgs">
              <my-upload :imgs="form.prodImage"
                          :limitUploadImgs="2"
                          ref="uploadImg"
                          @handleRemoveImg="handleRemoveImg('prodImage', 2, $event)"
                          @handleUploadImg="handleUploadImg('prodImage', 2, $event)">
              </my-upload>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="info" @click="productDetailShow = false">取消</el-button>
            <el-button type="primary" @click.native="formSubmit('form')">提交</el-button>
          </div>
        </el-dialog>
 </div>
</template>

<script type="text/ecmascript-6">
import {ProdOperation, GetReserveProduct} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  name: 'arrange-list',
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: null,
      operateAction: 0,
      listLoading: false,
      productList: [], // 产品列表
      productDetailShow: false, // 产品弹框显示状态
      form: {
        isShow: true
      }, // 产品详情弹框
      formRules: {
        productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        price: [
            { required: true, message: '请输入产品单价', trigger: 'blur' }
        ],
        vipPrice: [
            { required: true, message: '请输入产品会员价', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    // 获取列表
    async GetListByPage () {
        let params = {
          reserveItemId: this.$route.query.id, // 预约项目
          productName: '', // 产品名称
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        this.listLoading = true
        await GetReserveProduct(params).then(res => {
          this.listLoading = false
         if (res.success) {
           this.productList = res.data
           this.total = res.total
         } else this.$message.error(res.msg)
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      },
    // 商品点击判断
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.productDetailShow = true
          break
        case '编辑': // 编辑
          this.productDetailShow = true
          this.operateAction = action
          this.form = row
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        default:
          return false
      }
    },
    // 商品修改提交
    formSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           // 设置创建人、角色ID、cid
            this.$set(this.form, 'reserveItemId', this.$route.query.id)
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.operateAxios(this.form)
          } else {
            return false
          }
        });
    },
      // 操作的后台请求
    operateAxios(item) {
      item = {
          ...item,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
    ProdOperation(params).then(res => {
       if (res.success) {
                this.productDetailShow = false
                this.GetListByPage()
                this.$message.success(res.msg)
         } else this.$message.err(res.msg)
      })
    },
     handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
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
  },
  watch: {
    productDetailShow: {
        handler(newName, oldName) {
          if (newName === false) {
            this.$refs['form'].resetFields()
            this.form.prodImage = []
          }
        }
      }
  },
  components: {myUpload}
}
</script>

<style lang="scss" scoped>
.product-title{
  display: flex;
  display: -webkit-flex;
  margin-bottom: 10px;
  div{
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
}

.dialof-felx{
  display: flex;
  display: -webkit-flex;
}
</style>
