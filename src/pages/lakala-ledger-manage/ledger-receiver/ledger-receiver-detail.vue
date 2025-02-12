<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form v-loading="detailLoading" ref="ledgerReceiverFormRef" :model="ledgerReceiverForm" :rules="ledgerReceiverFormRules" label-position="top">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="分账接收方名称" prop="receiverName"> <el-input type="text" v-model.trim="ledgerReceiverForm.receiverName" placeholder="请输入分账接收方名称"></el-input></el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系手机号" prop="contactMobile"> <el-input type="text" v-model.trim="ledgerReceiverForm.contactMobile" placeholder="请输入联系手机号"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-divider content-position="left">收款账户信息</el-divider>
        <el-form-item label="收款账户账户类型" prop="acctTypeCode">
          <el-radio-group v-model="ledgerReceiverForm.acctTypeCode" @input="acctTypeCodeChange" :disabled="formState === 1">
            <el-radio label="57">对公</el-radio>
            <el-radio label="58">对私</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="收款账户名称" prop="acctName"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctName" placeholder="请输入收款账户名称"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款账户卡号" prop="acctNo"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctNo" placeholder="请输入收款账户卡号" @blur="handleBankCardBin"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="收款账户证件类型" prop="acctCertificateType">
          <el-radio-group v-model="ledgerReceiverForm.acctCertificateType" :disabled="formState === 1">
            <el-radio label="17">身份证</el-radio>
            <el-radio label="18">护照</el-radio>
            <el-radio label="19">港澳居民来往内地通行证</el-radio>
            <el-radio label="20">台湾居民来往内地通行证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="收款账户证件号" prop="acctCertificateNo"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctCertificateNo" placeholder="请输入收款账户证件号" :disabled="formState === 1"></el-input></el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <!-- 对公信息 -->
      <el-row v-show="ledgerReceiverForm.acctTypeCode === '57'">
        <div>
          <el-divider content-position="left">法人信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="法人姓名" prop="legalPersonName"> <el-input type="text" v-model.trim="ledgerReceiverForm.legalPersonName" placeholder="请输入法人姓名" :disabled="formState === 1"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="法人证件类型" prop="legalPersonCertificateType">
            <el-radio-group v-model="ledgerReceiverForm.legalPersonCertificateType" :disabled="formState === 1">
              <el-radio label="17">身份证</el-radio>
              <el-radio label="18">护照</el-radio>
              <el-radio label="19">港澳居民来往内地通行证</el-radio>
              <el-radio label="20">台湾居民来往内地通行证</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="法人证件号" prop="legalPersonCertificateNo">
                <el-input type="text" v-model.trim="ledgerReceiverForm.legalPersonCertificateNo" placeholder="请输入法人证件号" :disabled="formState === 1"></el-input
              ></el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider content-position="left">营业执照信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="营业执照名称" prop="licenseName"> <el-input type="text" v-model.trim="ledgerReceiverForm.licenseName" placeholder="请输入营业执照名称" :disabled="formState === 1"></el-input></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营业执照号码" prop="licenseNo"> <el-input type="text" v-model.trim="ledgerReceiverForm.licenseNo" placeholder="请输入营业执照号码" :disabled="formState === 1"></el-input></el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider content-position="left">附件资料上传</el-divider>
          <el-form-item label="上传类型">
            <el-radio-group v-model="attachType" @input="attachTypeChange">
              <el-radio v-for="(item, index) in attachTypeList.filter(item => item.mark === '57')" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item> <upload-file listType="picture" :limitUploadFiles="10" :fileList="fileList" :attType="attachType" @handleUploadFileChange="handleUploadFileChange"></upload-file> </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <!-- 对私信息 -->
      <el-row v-show="ledgerReceiverForm.acctTypeCode === '58'">
        <div>
          <el-divider content-position="left">开户行信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="收款账户开户名称" prop="acctOpenBankName"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctOpenBankName" placeholder="请输入收款账户开户名称"></el-input></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收款账户开户行号" prop="acctOpenBankCode"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctOpenBankCode" placeholder="请输入收款账户开户行号"></el-input></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收款账户清算行行号" prop="acctClearBankCode"> <el-input type="text" v-model.trim="ledgerReceiverForm.acctClearBankCode" placeholder="请输入收款账户清算行行号"></el-input></el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider content-position="left">附件资料上传</el-divider>
          <el-form-item label="上传类型">
            <el-radio-group v-model="attachType" @input="attachTypeChange">
              <el-radio v-for="(item, index) in attachTypeList.filter(item => item.mark === '58')" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item> <upload-file listType="picture" :limitUploadFiles="10" :fileList="fileList" :attType="attachType" @handleUploadFileChange="handleUploadFileChange"></upload-file> </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <el-form-item><el-button :loading="submitLoading" type="primary" @click="submitLedgerReceiverApplyInfo">确定并提交</el-button></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getLedgerReceiverApplyDetailById, ledgerReceiverApplyAddOperation, ledgerReceiverApplyUpdateOperation, getBankCardBinInfo } from '@/api/system'
import UploadFile from '../components/upload-file.vue'

export default {
  components: {
    UploadFile
  },
  data() {
    return {
      ledgerReceiverForm: {
        receiverName: '',
        contactMobile: '',
        licenseNo: '',
        licenseName: '',
        legalPersonName: '',
        legalPersonCertificateType: '17',
        legalPersonCertificateNo: '',
        acctNo: '',
        acctName: '',
        acctTypeCode: '57',
        acctCertificateType: '17',
        acctCertificateNo: '',
        acctOpenBankCode: '',
        acctOpenBankName: '',
        acctClearBankCode: '',
        attachList: []
      },
      attachType: '',
      fileList: [],
      attachmentInfo: {},
      detailLoading: false,
      submitLoading: false,
      ledgerReceiverFormRules: {
        receiverName: [{ required: true, message: '分账接收方名称不能为空', trigger: 'blur' }],
        contactMobile: [{ required: true, message: '联系手机号不能为空', trigger: 'blur' }],
        acctNo: [{ required: true, message: '收款账户卡号不能为空', trigger: 'blur' }],
        acctName: [{ required: true, message: '收款账户名称不能为空', trigger: 'blur' }],
        acctCertificateNo: [{ required: true, message: '收款账户证件号不能为空', trigger: 'blur' }]
      },
      attachTypeList: [
        { value: 'FR_ID_CARD_FRONT', label: '法人身份证正面', mark: '57' },
        { value: 'FR_ID_CARD_BEHIND', label: '法人身份证反面', mark: '57' },
        { value: 'BUSINESS_LICENCE', label: '营业执照', mark: '57' },
        { value: 'OTHERS', label: '存管账户信息(公户信息，加盖公章/开户许可证)', mark: '57' },
        { value: 'ID_CARD_FRONT', label: '身份证正面', mark: '58' },
        { value: 'ID_CARD_BEHIND', label: '身份证反面', mark: '58' },
        { value: 'BANK_CARD', label: '银行卡', mark: '58' }
      ]
    }
  },
  computed: {
    formState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getLedgerReceiverApplyDetail()
    }
  },
  methods: {
    getLedgerReceiverApplyDetail() {
      let params = {
        _id: this.$route.query.id
      }
      this.detailLoading = true
      getLedgerReceiverApplyDetailById(params)
        .then(res => {
          this.detailLoading = false
          this.ledgerReceiverForm = {
            ...res.data
          }
          this.fileList =
            res.data.attachList && res.data.attachList.length > 0
              ? res.data.attachList.map(item => {
                  return {
                    name: this.attachTypeFilter(item.attachType),
                    url: item.attachStorePath
                  }
                })
              : []
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    attachTypeFilter(val) {
      let str = this.attachTypeList.find(v => v.value === val) ? this.attachTypeList.find(v => v.value === val).label : ''
      return str
    },
    handleBankCardBin() {
      if (this.ledgerReceiverForm.acctTypeCode === '58') {
        let params = {
          cardNo: this.ledgerReceiverForm.acctNo
        }
        this.detailLoading = true
        getBankCardBinInfo(params)
          .then(res => {
            this.detailLoading = false
            this.ledgerReceiverForm.acctOpenBankCode = res.data.respData.bankCode
            this.ledgerReceiverForm.acctOpenBankName = res.data.respData.bankName
            this.ledgerReceiverForm.acctClearBankCode = res.data.respData.clearingBankCode
          })
          .catch(() => {
            this.detailLoading = false
          })
      }
    },
    submitLedgerReceiverApplyInfo() {
      this.$refs['ledgerReceiverFormRef'].validate(valid => {
        if (valid) {
          if (this.ledgerReceiverForm.acctTypeCode === '57') {
            if (!this.ledgerReceiverForm.licenseNo || !this.ledgerReceiverForm.licenseName) {
              return this.$message.warning('请将营业执照信息填写完整！')
            }
            if (!this.ledgerReceiverForm.legalPersonName || !this.ledgerReceiverForm.legalPersonCertificateNo) {
              return this.$message.warning('请将法人信息填写完整！')
            }
          }
          if (this.ledgerReceiverForm.acctTypeCode === '58') {
            if (!this.ledgerReceiverForm.acctOpenBankCode || !this.ledgerReceiverForm.acctOpenBankName || !this.ledgerReceiverForm.acctClearBankCode) {
              return this.$message.warning('请将开户行信息填写完整！')
            }
          }
          if (this.ledgerReceiverForm.attachList.length <= 0) {
            return this.$message.warning('请上传所需要的附件资料！')
          }
          let ledgerReceiverApplyOperation = null
          let params = {}
          if (this.formState === 0) {
            ledgerReceiverApplyOperation = ledgerReceiverApplyAddOperation
            params = { ...this.ledgerReceiverForm }
          } else if (this.formState === 1) {
            ledgerReceiverApplyOperation = ledgerReceiverApplyUpdateOperation
            params = {
              _id: this.ledgerReceiverForm._id,
              attachList: this.ledgerReceiverForm.attachList,
              receiverNo: this.ledgerReceiverForm.receiverNo,
              receiverName: this.ledgerReceiverForm.receiverName,
              contactMobile: this.ledgerReceiverForm.contactMobile,
              acctNo: this.ledgerReceiverForm.acctNo,
              acctTypeCode: this.ledgerReceiverForm.acctTypeCode,
              acctOpenBankCode: this.ledgerReceiverForm.acctOpenBankCode,
              acctOpenBankName: this.ledgerReceiverForm.acctOpenBankName,
              acctClearBankCode: this.ledgerReceiverForm.acctClearBankCode
            }
          }
          this.submitLoading = true
          ledgerReceiverApplyOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    acctTypeCodeChange() {
      if (this.formState === 0) {
        this.attachType = ''
        this.ledgerReceiverForm.attachList = []
      }
    },
    attachTypeChange(val) {
      let row = {}
      if (this.ledgerReceiverForm.acctTypeCode === '57') {
        row = this.corporateTypeList.find(item => item.value === val)
      } else if (this.ledgerReceiverForm.acctTypeCode === '58') {
        row = this.privateTypeList.find(item => item.value === val)
      }
      this.attachmentInfo = {
        attachType: val,
        attachName: val === 'OTHERS' ? '其他' : row.label
      }
    },
    handleUploadFileChange(ret) {
      if (ret.path) {
        this.attachmentInfo.attachStorePath = ret.path
        this.ledgerReceiverForm.attachList.push(this.attachmentInfo)
      } else {
        let index = this.ledgerReceiverForm.attachList.findIndex(item => item.attachStorePath === ret.file.url)
        this.ledgerReceiverForm.attachList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
