<template>
  <div class="base-info">
    <div class="page-contain" v-loading="loading">
      <!--表单-->
      <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain">
        <div class="form-contain-item">
          <el-form-item prop="userName">
            <div class="form-item-title">用户名<span class="border"></span><span class="EnName">USERNAME</span></div>
            <el-input v-model="form.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="organizationName">
            <div class="form-item-title">店名<span class="border"></span><span class="EnName">SHOPNAME</span></div>
            <el-input v-model="form.organizationName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item prop="yuAmount">
            <div class="form-item-title">账户余额<span class="border"></span><span class="EnName">AMOUNT</span></div>
            <el-input v-model="form.yuAmount" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">坐标(经纬度)<span class="border"></span><span class="EnName">COORDINATE</span></div>
            <el-input v-model="form.coordinate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item class="item-long">
            <div class="form-item-title">地址<span class="border"></span><span class="EnName">ADDRESS</span></div>
            <el-input type="textarea" :rows="2" v-model="form.addressFull" :disabled="true"></el-input>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item prop="shopNo">
            <div class="form-item-title">门店编号<span class="border"></span><span class="EnName">SHOPNO</span></div>
            <el-input placeholder="请输入门店编号" v-model="form.shopNo"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId">
            <div class="form-item-title">门店分类<span class="border"></span><span class="EnName">CATEGORYID</span></div>
            <el-cascader v-model="form.categoryIds" :options="categoryList" change-on-select expand-trigger="hover"></el-cascader>
          </el-form-item>
          <el-form-item prop="bankCardNumber">
            <div class="form-item-title">银行卡号<span class="border"></span><span class="EnName">BankCardNumber</span></div>
            <el-input placeholder="请输入银行卡号" v-model="form.bankCardNumber"></el-input>
          </el-form-item>
          <el-form-item prop="isExamine">
            <div class="form-item-title">合作状态<span class="border"></span><span class="EnName">ISEXAMINE</span></div>
            <el-switch v-model="form.isExamine"></el-switch>
          </el-form-item>
        </div>
        <div class="form-contain-item">
          <el-form-item>
            <div class="form-item-title">营业执照<span class="border"></span><span class="EnName">BUSLICENSE</span></div>
            <my-upload :imgs="form.busLicenses"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('busLicense', 1, $event)"
                       @handleUploadImg="handleUploadImg('busLicense', 1, $event)">
            </my-upload>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">资质证明<span class="border"></span><span class="EnName">PROOF</span></div>
            <my-upload :imgs="form.proofs"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('proof', 1, $event)"
                       @handleUploadImg="handleUploadImg('proof', 1, $event)">
            </my-upload>
          </el-form-item>
          <el-form-item>
            <div class="form-item-title">头像<span class="border"></span><span class="EnName">HEADIMAGE</span></div>
            <my-upload :imgs="form.faceImages"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('faceImage', 1, $event)"
                       @handleUploadImg="handleUploadImg('faceImage', 1, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" @click="formSubmit" :loading="submitLoading" :disabled="disabledSubmit" class="submit-btn">提交</el-button>
    </div>
  </div>
</template>
<script>
import {ChannelUserDetail, ChannelUserOperation, GetAllCategory} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  components: {
    myUpload
  },
  data() {
    return {
      // 表单数据
      form: {},
      // 控制是否显示加载的loading
      loading: false,
      submitLoading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0,
      categoryList: []
    }
  },
  methods: {
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
    async init () {
      if (this.$route.query.id !== undefined) {
        // 编辑操作
        this.operateTitle = '编辑'
        this.operateAction = 1
        let parmas = {
          _id: this.$route.query.id,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        this.loading = true
        await ChannelUserDetail(parmas).then(res => {
          this.loading = false
          if (res.success) {
            this.form = res.data
            // 拼图片的回显列表
            this.form.busLicenses = []
            this.form.proofs = []
            this.form.faceImages = []
            if (this.form.busLicense !== null && this.form.busLicense.url !== '') {
                this.form.busLicenses.push({url: this.form.busLicense.url})
            }
            if (this.form.proof !== null && this.form.proof.url !== '') {
                this.form.proofs.push({url: this.form.proof.url})
            }
            if (this.form.faceImage !== null && this.form.faceImage.url !== '') {
                this.form.faceImages.push({url: this.form.faceImage.url})
            }
            // 获取categoryIds
            if (this.categoryList.length > 0 && this.form.categoryId) {
              this.$set(this.form, 'categoryIds', [])
              this.getCategoryIds(this.categoryList, this.form.categoryId)
            }
            this.form.addressFull = this.form.province + this.form.city + this.form.area + this.form.adress
            this.form.coordinate = this.form.longitude + ',' + this.form.latitude
          } else {
            this.$message.error(res.msg)
          }
        }, err => {
          this.loading = false
          this.$message.error(err.msg)
        })
      } else {
        this.loading = false
      }
    },
    // 根据categoryId获取categoryIds
    getCategoryIds (list, opt) {
      try {
        this._getCategoryIds(list, opt)
      } catch (e) {
        // console.log(that.form.categoryIds)
      }
    },
    _getCategoryIds (list, opt) {
      let that = this
      list.forEach(val => {
        that.form.categoryIds.push(val.value)
        if (val.value === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw ('break all')
        } else if (val.children && val.children.length > 0) {
          // 判断是否还有子项
          that._getCategoryIds(val.children, opt)
          // 如果子项循环完还是没有跳出循环，删除父级
          that.form.categoryIds.pop()
        } else {
          // 没有子项，直接删除当前节点
          that.form.categoryIds.pop()
        }
      })
    },
    // 加载商品分类
    async GetAllCategory () {
      this.loading = true
      let params = {
        belongMenu: '/only-channel-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(res => {
        if (res.success) {
          this.categoryList = res.data
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/only-channel-list')
    },
    // 提交表单
    formSubmit: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确认' + this.operateTitle + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            let categoryIds = this.form.categoryIds || []
            if (categoryIds.length > 0) {
              this.form.categoryId = categoryIds[categoryIds.length - 1]
            }
            let params = {
              Dto: Object.assign({}, this.form),
              Action: this.operateAction
            }
            ChannelUserOperation(params).then(res => {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
              this.clear()
            }).catch(() => {
              this.submitLoading = false
            })
          })
        }
      })
    }
  },
  mounted() {
    this.GetAllCategory()
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
              .el-input {
                width: 210px;
              }
            }
          }
          .item-middle {
            width: 210px;
          }
          .item-long {
            width: 440px;
          }
        }
      }
    }
  }
  .submit-btn{
    margin-left: 20px;
  }
</style>
