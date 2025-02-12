<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules" :disabled="formDisabled">
        <div class="form-contain-item">
          <el-form-item prop="sname" class="item-long">
            <div class="form-item-title">商家名称<span class="border"></span><span class="EnName">NAME</span></div>
            <el-input placeholder="请输入商家名称" v-model="form.sname"></el-input>
          </el-form-item>
          <el-form-item prop="sortNo">
            <div class="form-item-title">排序号<span class="border"></span><span class="EnName">SORTNO</span></div>
            <el-input-number placeholder="排序号" controls-position="right" v-model="form.sortNo" :min="99"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="belongsBank" class="item-middle">
            <div class="form-item-title">所属银行<span class="border"></span><span class="EnName">BELONGSBANK</span></div>
            <el-input placeholder="所属银行" v-model="form.belongsBank"></el-input>
          </el-form-item>
          <el-form-item prop="bankAccount" class="item-middle">
            <div class="form-item-title">银行账号<span class="border"></span><span class="EnName">BANKACCOUNT</span></div>
            <el-input placeholder="银行账号" v-model="form.bankAccount"></el-input>
          </el-form-item>
          <el-form-item prop="ghtype" class="item-middle">
            <div class="form-item-title">供货类型<span class="border"></span><span class="EnName">TYPE</span></div>
            <el-select v-model="form.ghtype">
              <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ghRange" class="item-middle">
            <div class="form-item-title">供货范围<span class="border"></span><span class="EnName">RANGE</span></div>
            <el-input placeholder="供货范围" v-model="form.ghRange"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="address" class="item-long">
            <div class="form-item-title">商家地址<span class="border"></span><span class="EnName">ADDRESS</span></div>
            <el-input v-model="form.address" placeholder="请输入商家地址"></el-input>
          </el-form-item>
          <el-form-item prop="remark" class="item-long">
            <div class="form-item-title">备注<span class="border"></span><span class="EnName">REMARK</span></div>
            <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">主图<span class="border"></span><span class="EnName">IMAGE</span></div>
            <my-upload :imgs="form.aptimages"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('aptimage', 1, $event)"
                       @handleUploadImg="handleUploadImg('aptimage', 1, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" size="mini" @click="addContact" class="submit-btn">添加联系人</el-button>
      <el-table class="tableContact" ref="tableContact" :data="form.heads" border>
        <el-table-column align="center" prop="csName" label="联系人名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input placeholder="联系人名称" size="mini" v-model="scope.row.csName"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="place" label="联系人职位" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input placeholder="联系人职位" size="mini" v-model="scope.row.place"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phone" label="联系人电话" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input placeholder="联系人电话" size="mini" v-model="scope.row.phone"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteContact(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
  </div>
</template>
<script>
import {SupplierOperation, SupplierGetDetailById} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
  },
  data () {
    return {
      typeList: [
        { value: 1, label: '批发销售' }
      ],
      rules: {
        sname: [
          {required: true, message: '请输入商家名称', trigger: 'blur'}
        ],
        ghtype: [
          {required: true, message: '请选择供货类型', trigger: 'change'}
        ]
      },
      // 表单数据
      form: {},
      // 是否禁用form
      formDisabled: false,
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0
    }
  },
  methods: {
    // 添加联系人
    addContact () {
      let arr = this.form.heads || []
      let obj = {
        csName: '',
        place: '',
        phone: ''
      }
      arr.push(obj)
      this.$set(this.form, 'heads', arr)
    },
    // 删除联系人
    deleteContact (index) {
      this.$confirm('确认删除该条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.heads.splice(index, 1)
      })
    },
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
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
    },
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/supply-supplier-list')
    },
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            let params = {
                Dto: Object.assign({}, this.form),
                Action: this.operateAction
            }
            SupplierOperation(params).then(res => {
                this.$message({
                    message: res.msg,
                    type: res.success ? 'success' : 'error'
                })
                this.clear()
            }).catch(() => {
              this.submitLoading = false
              this.disabledSubmit = false
            })
          })
        }
      })
    },
    async init () {
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
        await SupplierGetDetailById(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.aptimages = []
              if (this.form.aptimage !== null && this.form.aptimage.url !== '') {
                  this.form.aptimages.push({url: this.form.aptimage.url})
              }
            } else {
                this.$message.error(res.msg)
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
      this.loading = false
    }
  },
  mounted () {
    this.init()
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
  .tableContact {
    width: 800px;
    margin: 10px 0 20px 20px;
  }
</style>
