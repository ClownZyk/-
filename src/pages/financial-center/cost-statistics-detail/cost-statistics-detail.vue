<template>
    <div>
      <el-form :model="dialog" ref="dialog" :rules="rules" class="dialog-main">
        <div class="mag-dialog-row">
          <el-form-item prop="nickName">
            <div class="form-item-title">统计时间<span class="border"></span> <span class="EnName">time</span></div>
            <el-date-picker
              v-model="dialog.costTime"
              type="month"
              :disabled="disable"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="Payer">
            <div class="form-item-title">缴纳人<span class="border"></span> <span class="EnName">counter</span></div>
            <el-input class="form-item-input" v-model="dialog.Payer" autocomplete="off" placeholder="请输入缴纳人"></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
            <el-form-item prop="waterCost">
              <div class="form-item-title">水费总额<span class="border"></span> <span class="EnName">water rate</span></div>
              <el-input-number class="form-item-input" v-model="dialog.waterCost" :precision="2" controls-position="right" autocomplete="off" placeholder="请输入水费总额"></el-input-number>
            </el-form-item>
          <el-form-item prop="electricCost">
            <div class="form-item-title">电费总额<span class="border"></span> <span class="EnName">power rate</span></div>
            <el-input-number class="form-item-input" v-model="dialog.electricCost" :precision="2" controls-position="right" autocomplete="off" placeholder="请输入电费总额"></el-input-number>
          </el-form-item>
            <el-form-item prop="rentalfee">
              <div class="form-item-title">房租仓库费<span class="border"></span> <span class="EnName">Warehouse</span></div>
              <el-input-number class="form-item-input" v-model="dialog.rentalfee" :precision="2" controls-position="right" placeholder="仓库"></el-input-number>
            </el-form-item>
            <el-form-item prop="propertyFee">
              <div class="form-item-title">物业费<span class="border"></span> <span class="EnName">Property fee</span></div>
              <el-input-number class="form-item-input" v-model="dialog.propertyFee" :precision="2" controls-position="right" autocomplete="off" placeholder="请输入物业"></el-input-number>
            </el-form-item>
          <el-form-item prop="laborCost">
            <div class="form-item-title">人工费<span class="border"></span> <span class="EnName">labour cost</span></div>
            <el-input-number class="form-item-input" v-model="dialog.laborCost" :precision="2" controls-position="right" autocomplete="off" placeholder="请输入人工费"></el-input-number>
          </el-form-item>
          <el-form-item prop="hardwareCost">
            <div class="form-item-title">设备采购费<span class="border"></span> <span class="EnName">Sourcing</span></div>
            <el-input-number class="form-item-input" v-model="dialog.hardwareCost" :precision="2" controls-position="right" autocomplete="off" placeholder="请输入人工费"></el-input-number>
          </el-form-item>
          </div>
          <div class="mag-dialog-row">
            <el-form-item prop="remarks" class="el-form-row">
              <div class="form-item-title">备注<span class="border"></span> <span class="EnName">remark</span></div>
              <el-input type="textarea" style="width: 80%;"  :rows="4" class="form-item-input" v-model="dialog.remarks" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
          <div class="mag-dialog-row">
            <el-form-item prop="headImg">
              <div class="form-item-title">图片说明<span class="border"></span> <span class="EnName">icon</span></div>
              <my-upload :imgs="dialog.ticketImgae"
                         :limitUploadImgs="1"
                         @handleRemoveImg="handleRemoveImg('ticketImgae', 5, $event)"
                         @handleUploadImg="handleUploadImg('ticketImgae', 5, $event)">
              </my-upload>
            </el-form-item>
          </div>
      </el-form>
      <el-button type="primary" @click="save('dialog')" v-show="action !== 4">保存</el-button>
    </div>
</template>

<script>
  import myUpload from '@/components/my-upload'
  import {formatDate} from '@/components/js/data'
  import {CargodamageOperation, DetailCostReport} from '@/api/system'
    export default {
      data() {
        return {
          disable: false,
          dialog: {
            costTime: formatDate(new Date(), 'yyyy-MM'),
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          },
          action: this.$route.query.action,
          loading: false,
          rules: {
            Payer: [
              { required: true, message: '请输入缴纳人', trigger: 'blur' }
            ],
            waterCost: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            electricCost: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            rentalfee: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            propertyFee: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            laborCost: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            hardwareCost: [
              { required: true, message: '请输入金额', trigger: 'blur' }
            ],
            remarks: [
              { required: true, message: '请输入备注', trigger: 'blur' }
            ]
          }
        }
      },
      mounted() {
        if (this.$route.query.id !== undefined) {
          this._detail()
        }
      },
      methods: {
        _detail() {
          let params = {
            _id: this.$route.query.id
          }
          this.loading = true
          DetailCostReport(params).then(res => {
            if (res.success) {
              this.disable = true
              this.dialog = res.data
            } else this.$message.error(res.msg)
            this.loading = false
          }, err => {
            this.$message.error(err.msg)
          })
        },
        save(formName) {
          var txt = ''
          this.$route.query.action === 1 ? txt = '修改' : txt = '新增'
          this.$confirm('是否' + txt + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.loading = true
                let params = {
                  action: this.$route.query.action,
                  dto: this.dialog
                }
                console.log(params)
                CargodamageOperation(params).then(res => {
                  if (res.success) {
                    this.$message.success(res.msg)
                    this.$router.go(-1)
                  } else this.$message.error(res.msg)
                  this.loading = false
                }, err => {
                  this.$message.error(err.msg)
                })
              } else {
                return false
              }
            })
          }).catch(() => {})
        },
        // 删除图片
        handleRemoveImg (txt, limitUploadImgs, fileList) {
          if (limitUploadImgs > 1) {
            this.dialog[txt] = fileList
          } else {
            this.dialog.headImg = ''
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
            this.dialog.headImg = JSON.parse(JSON.stringify(imgObj)).url
          }
        }
      },
      components: {myUpload}
    }
</script>

<style scoped>
</style>
