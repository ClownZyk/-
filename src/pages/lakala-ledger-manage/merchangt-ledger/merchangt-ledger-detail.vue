<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form :model="ledgerMerInfo" label-position="right" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="内部商户号：">{{ ledgerMerInfo.merInnerNo || '--' }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银联商户号：">{{ ledgerMerInfo.merCupNo || '--' }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商户分账状态：">{{ ledgerMerInfo.splitStatus === 'VALID' ? '启用' : ledgerMerInfo.splitStatus === 'INVALID' ? '禁用' : '--' }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="最低分账比例：">{{ ledgerMerInfo.splitLowestRatio || '--' }}%</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分账范围：">{{ ledgerMerInfo.splitRange === 'ALL' ? '全部交易分账' : ledgerMerInfo.splitRange === 'MARK' ? '标记交易分账' : '--' }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分账依据：">{{ ledgerMerInfo.sepFundSource === 'TR' ? '交易分账' : ledgerMerInfo.sepFundSource === 'BA' ? '余额分账' : '--' }}</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <div class="title">已绑定接收方列表：</div>
        <el-button size="small" type="warning" @click="handleLedgerBind" style="margin-bottom:10px">分账接收方绑定</el-button>
        <el-table :data="ledgerMerInfo.bindRelations" border>
          <el-table-column type="index" width="60" align="center"></el-table-column>
          <el-table-column label="接收方编号名称" prop="receiverName" min-width="160" align="center"></el-table-column>
          <el-table-column label="接收方编号" prop="receiverNo" min-width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleLedgerUnbind(scope.row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-dialog :title="`商户分账业务${formState === 1 ? '绑定' : '解绑'}信息`" :visible.sync="isLedgerInfoDialogShow" width="700px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" label-position="right" label-width="120px">
        <el-form-item label="内部商户号：">{{ form.merInnerNo || '--' }}</el-form-item>
        <el-form-item label="银联商户号：">{{ form.merCupNo || '--' }}</el-form-item>
        <el-form-item label="接收方编号：">
          <div v-if="formState === 1">
            <span v-if="form.receiverNo" style="margin-right:8px">{{ form.receiverNo }}</span
            ><el-button size="small" type="warning" @click="handleLedgerReceiverSelect">分账接收方选择</el-button>
          </div>
          <div v-else-if="formState === 2">{{ form.receiverNo }}</div>
        </el-form-item>
        <el-form-item label="合作协议附件：" prop="entrustFilePath"> <upload-file ref="uploadFileRef" uploadType="file" listType="text" :fileList="fileList" @handleUploadFileChange="handleUploadFileChange"></upload-file> </el-form-item>
        <el-form-item label="备注说明：" prop="remark"> <el-input type="textarea" v-model="form.remark" :rows="2" placeholder="请输入备注说明"></el-input> </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isLedgerInfoDialogShow = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitLedgerInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分账接收方列表" :visible.sync="isLedgerReceiverDialogShow" width="1000px" :close-on-click-modal="false">
      <el-form :model="filterParam" inline>
        <el-form-item label="分账接收方名称" prop="receiverName"
          ><el-input type="text" v-model.trim="filterParam.receiverName" placeholder="请输入分账接收方名称搜索" clearable @keyup.enter.native="getLedgerReceiveList('refresh')"></el-input
        ></el-form-item>
        <el-form-item label="联系手机号" prop="contactMobile"
          ><el-input type="text" v-model.trim="filterParam.contactMobile" placeholder="请输入联系手机号搜索" clearable @keyup.enter.native="getLedgerReceiveList('refresh')"></el-input
        ></el-form-item>
        <el-form-item><el-button type="primary" @click="getLedgerReceiveList('refresh')">搜索</el-button></el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="ledgerReceiverList" border>
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column label="分账接收方名称" prop="receiverName" min-width="180" align="center"> </el-table-column>
        <el-table-column label="分账接收方编号" prop="receiverNo" min-width="180" align="center"> </el-table-column>
        <el-table-column label="联系手机号" prop="contactMobile" min-width="120" align="center"></el-table-column>
        <el-table-column label="收款账户类型" min-width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.acctTypeCode === '57'">对公</div>
            <div v-else-if="scope.row.acctTypeCode === '58'">对私</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="收款账户名称" prop="acctName" min-width="120" align="center"></el-table-column>
        <el-table-column label="收款账户卡号" prop="acctNo" min-width="180" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="saveLedgerReceiverInfo(scope.row)">选择此接收方</el-button>
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
    </el-dialog>
  </div>
</template>

<script>
import { queryLedgerMerApplyinfo, getApplyLedgerReceiverList, ledgerBindApplyOperation, ledgerUnBindApplyOperation } from '@/api/system'
import UploadFile from '../components/upload-file.vue'

export default {
  components: {
    UploadFile
  },
  data() {
    return {
      ledgerMerInfo: {},
      form: {
        merInnerNo: '',
        merCupNo: '',
        receiverNo: '',
        entrustFileName: '',
        entrustFilePath: '',
        remark: ''
      },
      formState: 1,
      queryLoading: false,
      isLedgerInfoDialogShow: false,
      filterParam: {
        receiverName: '',
        contactMobile: ''
      },
      ledgerReceiverList: [],
      fileList: [],
      listLoading: false,
      submitLoading: false,
      isLedgerReceiverDialogShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isLedgerInfoDialogShow(val) {
      if (!val) {
        this.form = {
          merInnerNo: '',
          merCupNo: '',
          receiverNo: '',
          entrustFileName: '',
          entrustFilePath: '',
          remark: ''
        }
        this.$refs['uploadFileRef'].clearFiles()
      }
    }
  },
  mounted() {
    this.queryLedgerMerInfo()
  },
  methods: {
    queryLedgerMerInfo() {
      let params = {
        merInnerNo: this.$route.query.merInnerNo,
        merCupNo: this.$route.query.merCupNo
      }
      this.queryLoading = true
      queryLedgerMerApplyinfo(params)
        .then(res => {
          this.queryLoading = false
          this.ledgerMerInfo = res.data.respData || {}
        })
        .catch(() => {
          this.queryLoading = false
        })
    },
    handleLedgerBind() {
      this.formState = 1
      this.isLedgerInfoDialogShow = true
      this.$nextTick(() => {
        this.form = {
          merInnerNo: this.$route.query.merInnerNo,
          merCupNo: this.$route.query.merCupNo,
          receiverNo: '',
          entrustFileName: '',
          entrustFilePath: '',
          remark: ''
        }
      })
    },
    handleLedgerUnbind(row) {
      this.formState = 2
      this.isLedgerInfoDialogShow = true
      this.$nextTick(() => {
        let { merInnerNo, merCupNo, receiverNo } = row
        this.form = {
          merInnerNo,
          merCupNo,
          receiverNo,
          entrustFileName: '',
          entrustFilePath: '',
          remark: ''
        }
      })
    },
    handleLedgerReceiverSelect() {
      this.isLedgerReceiverDialogShow = true
      this.getLedgerReceiveList()
    },
    getLedgerReceiveList(refresh) {
      if (refresh === 'refresh') {
        this.pegIndex = 1
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
      getApplyLedgerReceiverList(params)
        .then(res => {
          this.listLoading = false
          this.ledgerReceiverList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    saveLedgerReceiverInfo(row) {
      this.form.receiverNo = row.receiverNo
      this.isLedgerReceiverDialogShow = false
    },
    handleUploadFileChange(ret) {
      this.form.entrustFileName = ret.name
      this.form.entrustFilePath = ret.path
    },
    submitLedgerInfo() {
      if (!this.form.merInnerNo && !this.form.merCupNo) {
        return this.$message.warning('内部商户号或者银联商户号不能都为空！')
      }
      if (!this.form.receiverNo) {
        return this.$message.warning('请选择分账接收方信息！')
      }
      if (!this.form.entrustFileName || !this.form.entrustFilePath) {
        return this.$message.warning('请上传合作协议附件信息！')
      }
      if (this.formState === 2 && !this.form.remark) {
        return this.$message.warning('请输入分账解绑备注说明！')
      }
      if (this.formState === 2) {
        this.$confirm('确定解绑该商户绑定的接收方信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.ledgerBindOrUnBindOperation(ledgerUnBindApplyOperation)
          })
          .catch(() => {})
      } else {
        this.ledgerBindOrUnBindOperation(ledgerBindApplyOperation)
      }
    },
    ledgerBindOrUnBindOperation(operationType) {
      this.submitLoading = true
      operationType({ ...this.form })
        .then(res => {
          this.submitLoading = false
          this.isLedgerInfoDialogShow = false
          this.$message.success(res.msg)
          this.queryLedgerMerInfo()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getLedgerReceiveList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getLedgerReceiveList()
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}
</style>
