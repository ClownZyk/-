<template>
  <div v-if="containerIsShow">
    <el-form class="filters" :model="filterParam" inline>
      <div>
        <el-form-item label="内部商户号" prop="merInnerNo"><el-input type="text" v-model.trim="filterParam.merInnerNo" placeholder="请输入内部商户号搜索" clearable @keyup.enter.native="getLedgerMerList('refresh')"></el-input></el-form-item>
        <el-form-item label="银联商户号" prop="merCupNo"><el-input type="text" v-model.trim="filterParam.merCupNo" placeholder="请输入银联商户号搜索" clearable @keyup.enter.native="getLedgerMerList('refresh')"></el-input></el-form-item>
        <el-form-item label="联系手机号" prop="contactMobile"
          ><el-input type="text" v-model.trim="filterParam.contactMobile" placeholder="请输入联系手机号搜索" clearable @keyup.enter.native="getLedgerMerList('refresh')"></el-input
        ></el-form-item>
        <el-form-item><el-button type="primary" @click="getLedgerMerList('refresh')">搜索</el-button></el-form-item>
      </div>
      <div>
        <el-form-item><el-button type="primary" @click="handleLedgerMerApplyAdd">新增商户分账业务申请</el-button></el-form-item>
      </div>
    </el-form>

    <el-table v-loading="listLoading" :data="ledgerMerList" border>
      <el-table-column type="index" width="60" align="center"></el-table-column>
      <el-table-column label="内部商户号" prop="merInnerNo" min-width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.merInnerNo || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="银联商户号" prop="merCupNo" min-width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.merCupNo || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="联系手机号" prop="contactMobile" min-width="120" align="center"></el-table-column>
      <el-table-column label="最低分账比例(%)" prop="splitLowestRatio" min-width="100" align="center"></el-table-column>
      <el-table-column label="分账范围" prop="splitRange" min-width="140" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.splitRange === 'All'">全部交易分账</div>
          <div v-else-if="scope.row.splitRange === 'MARK'">标记交易分账</div>
        </template>
      </el-table-column>
      <el-table-column label="分账依据" prop="sepFundSource" min-width="140" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.sepFundSource === 'TR'">交易分账</div>
          <div v-else-if="scope.row.sepFundSource === 'BA'">余额分账</div>
        </template>
      </el-table-column>
      <el-table-column label="电子合同编号" prop="eleContractNo" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.eleContractNo || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleLedgerMerApplyEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="primary" @click="handleLedgerMerQuery(scope.row)">分账信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-row>

    <!-- 商户分账业务申请弹框 -->
    <el-dialog title="商户分账业务开通申请" :visible.sync="isLedgerMerApplyDialogShow" width="800px" :close-on-click-modal="false">
      <el-form ref="ledgerMerApplyFormRef" :model="ledgerMerApplyForm" :rules="ledgerMerApplyFormRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="内部商户号：" prop="merInnerNo"> <el-input type="text" v-model.trim="ledgerMerApplyForm.merInnerNo" placeholder="请输入内部商户号"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银联商户号：" prop="merCupNo"> <el-input type="text" v-model.trim="ledgerMerApplyForm.merCupNo" placeholder="请输入银联商户号"></el-input> </el-form-item>
          </el-col>
          <div class="tips" style="margin-left:10px">内部商户号和银联商户号必须传一个，都送以内部商户号为准</div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系手机号：" prop="contactMobile"> <el-input type="text" v-model.trim="ledgerMerApplyForm.contactMobile" placeholder="请输入联系手机号"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低分账比例(%)：" prop="splitLowestRatio">
              <el-input-number v-model="ledgerMerApplyForm.splitLowestRatio" :min="0" :max="100" :precision="2" :step="0.01" :controls="false" placeholder="最低分账比例" style="width:100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分账范围：" prop="splitRange">
              <el-radio-group v-model="ledgerMerApplyForm.splitRange">
                <el-radio label="ALL"
                  >全部交易分账 <el-popover placement="top-start" title="" width="200" trigger="hover" content="商户所有交易默认待分账"> <i class="el-icon-question" slot="reference"></i></el-popover
                ></el-radio>
                <el-radio label="MARK"
                  >标记交易分账 <el-popover placement="top-start" title="" width="200" trigger="hover" content="只有带分账标识交易待分账，其余交易正常结算"> <i class="el-icon-question" slot="reference"></i></el-popover
                ></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分账依据：" prop="sepFundSource">
              <el-radio-group v-model="ledgerMerApplyForm.sepFundSource">
                <el-radio label="TR">交易分账 </el-radio>
                <el-radio label="BA">余额分账 </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="电子合同编号：" prop="eleContractNo"> <el-input type="text" v-model.trim="ledgerMerApplyForm.eleContractNo" placeholder="请输入电子合同编号"></el-input> </el-form-item>
        <el-form-item label="分账结算委托书文件上传：" prop="splitEntrustFilePath">
          <upload-file ref="uploadFileRef" uploadType="file" listType="text" :fileList="fileList" @handleUploadFileChange="handleUploadFileChange"></upload-file>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isLedgerMerApplyDialogShow = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitLedgerMerApplyInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getApplyLedgerMerList, ledgerMerApplyAddOperation, ledgerMerApplyUpdateOperation } from '@/api/system'
import UploadFile from '../components/upload-file.vue'

export default {
  components: {
    UploadFile
  },
  data() {
    return {
      filterParam: {
        merInnerNo: '',
        merCupNo: '',
        contactMobile: ''
      },
      ledgerMerList: [],
      listLoading: false,
      ledgerMerApplyForm: {
        merInnerNo: '',
        merCupNo: '',
        contactMobile: '',
        splitLowestRatio: 70,
        splitEntrustFileName: '',
        splitEntrustFilePath: '',
        splitRange: 'MARK',
        sepFundSource: 'TR',
        eleContractNo: ''
      },
      formState: 0,
      fileList: [],
      submitLoading: false,
      isLedgerMerApplyDialogShow: false,
      containerIsShow: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      ledgerMerApplyFormRules: {
        contactMobile: [{ required: true, message: '联系手机号不能为空', trigger: 'blur' }],
        splitLowestRatio: [{ required: true, message: '最低分账比例不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'merchangt-ledger-list') {
        this.getLedgerMerList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isLedgerMerApplyDialogShow(val) {
      if (!val) {
        delete this.ledgerMerApplyForm._id
        this.$refs['ledgerMerApplyFormRef'].resetFields()
        this.ledgerMerApplyForm.splitEntrustFileName = ''
        this.ledgerMerApplyForm.splitEntrustFilePath = ''
        this.$refs['uploadFileRef'].clearFiles()
      }
    }
  },
  mounted() {
    this.getLedgerMerList()
  },
  methods: {
    getLedgerMerList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true
      }
      this.listLoading = true
      getApplyLedgerMerList(params)
        .then(res => {
          this.listLoading = false
          this.ledgerMerList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleLedgerMerApplyAdd() {
      this.formState = 0
      this.isLedgerMerApplyDialogShow = true
    },
    handleLedgerMerApplyEdit(row) {
      this.formState = 1
      this.isLedgerMerApplyDialogShow = true
      this.$nextTick(() => {
        let { merInnerNo, merCupNo, contactMobile, splitLowestRatio, splitEntrustFileName, splitEntrustFilePath, splitRange, sepFundSource, eleContractNo, _id } = row
        this.ledgerMerApplyForm = {
          merInnerNo,
          merCupNo,
          contactMobile,
          splitLowestRatio,
          splitEntrustFileName,
          splitEntrustFilePath,
          splitRange,
          sepFundSource,
          eleContractNo,
          _id
        }
        this.fileList = [{ name: splitEntrustFileName, url: splitEntrustFilePath }]
      })
    },
    handleUploadFileChange(ret) {
      console.log(ret)
      this.ledgerMerApplyForm.splitEntrustFileName = ret.name
      this.ledgerMerApplyForm.splitEntrustFilePath = ret.path
    },
    submitLedgerMerApplyInfo() {
      this.$refs['ledgerMerApplyFormRef'].validate(valid => {
        if (valid) {
          if (!this.ledgerMerApplyForm.merInnerNo && !this.ledgerMerApplyForm.merCupNo) {
            return this.$message.warning('内部商户号和银联商户号必须传一个！')
          }
          if (!this.ledgerMerApplyForm.splitEntrustFileName || !this.ledgerMerApplyForm.splitEntrustFilePath) {
            return this.$message.warning('请上传分账结算委托书文件！')
          }
          this.submitLoading = true
          let applyOPeration = this.formState === 0 ? ledgerMerApplyAddOperation : ledgerMerApplyUpdateOperation
          applyOPeration({ ...this.ledgerMerApplyForm })
            .then(res => {
              this.submitLoading = false
              this.isLedgerMerApplyDialogShow = false
              this.$message.success(res.msg)
              this.getLedgerMerList()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 分账信息查询
    handleLedgerMerQuery(row) {
      this.$router.push({ path: '/merchangt-ledger-detail', query: { merInnerNo: row.merInnerNo, merCupNo: row.merCupNo } })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLedgerMerList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getLedgerMerList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
