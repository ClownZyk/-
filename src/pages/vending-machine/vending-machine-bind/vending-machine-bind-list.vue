<template>
  <div v-if="containerIsShow">
    <el-form class="filters" inline>
      <el-form-item> <el-button type="primary" @click="isVendingMachineShow = true" v-permission="['/vending-machine-bind-list:insert']">售卖机批量生成</el-button> </el-form-item>
    </el-form>
    <div class="alert"><el-alert title="售卖机绑定成功后请前往 ‘售卖机列表’ 模块进行查看" type="warning" show-icon :closable="false"> </el-alert></div>
    <div class="table-list">
      <el-table v-loading="tableLoading" :data="machineList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column label="自编码" prop="vUnionCode" width="120" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="绑定店铺" prop="companyName" min-width="140" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.companyName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机名称" prop="name" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机编码" prop="code" min-width="160" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.code || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="售卖机位置" prop="location" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.location || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="门状态" min-width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isOpen" style="color:#F56C6C">开启</span> <span v-else style="color:#67C23A">关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="联网状态" min-width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isOnLine" style="color:#67C23A">在线</span> <span v-else style="color:#F56C6C">未绑定</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleVendingMachineDetail(scope.row)" v-permission="['/vending-machine-bind-list:update']">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleQrCode(scope.row)">二维码生成</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <!-- 批量生成自编码弹框 -->
    <el-dialog title="售卖机批量生成" :visible.sync="isVendingMachineShow" width="400px" @close="isVendingMachineShow = false" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编码前缀：" prop="prefix"> <el-input v-model.trim="addForm.prefix" placeholder="请输入编码前缀"></el-input> </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生成个数：" prop="count"> <el-input-number v-model="addForm.count" :min="1" :controls="false" :step="1" step-strictly label="生成编码个数" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer"> <el-button type="primary" @click="submitMachineCodeInfo">确 定</el-button> </span>
    </el-dialog>
    <!-- 二合一二维码弹框 -->
    <el-dialog title="售卖机二维码（微信、支付宝）" :visible.sync="isQrCodeShow" width="550px" @close="isQrCodeShow = false" :close-on-click-modal="false">
      <el-form ref="qrCodeFormRef" :model="qrCodeForm" label-position="left">
        <el-row>
          <el-col>
            <el-form-item label="售卖机名称：" prop="name">{{ qrCodeForm.name }}</el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="售卖机编码：" prop="code">{{ qrCodeForm.code }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="二维码生成：" prop="qrCodeImg">
          <div class="qrCode-main"><div class="qrCode" ref="qrCodeRef" v-show="qrCodeForm.qrCodeImg"></div></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { bulkInsertVUnionCode, getShopNotBindVendingMachine } from '@/api/system'
import AppConfig from '@/components/js/gem'
import QRcode from 'qrcodejs2'
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      machineList: [],
      addForm: {
        prefix: 'YJ',
        count: 1
      },
      qrCodeForm: {
        name: '',
        code: '',
        qrCodeImg: ''
      },
      tableLoading: false,
      qrLoading: false,
      containerIsShow: true,
      isQrCodeShow: false,
      isVendingMachineShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        count: [{ required: true, message: '生成售卖机自编码个数不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'vending-machine-bind-list') {
        this.getShopNotBindVendingMachine()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isVendingMachineShow(val) {
      if (!val) {
        this.$refs['addFormRef'].resetFields()
      }
    },
    isQrCodeShow(val) {
      if (!val) {
        this.qrCodeForm = {
          name: '',
          code: '',
          qrCodeImg: ''
        }
        this.$refs['qrCodeRef'].innerHTML = ''
      }
    }
  },
  mounted() {
    this.getShopNotBindVendingMachine()
  },
  methods: {
    getShopNotBindVendingMachine(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getShopNotBindVendingMachine(params)
        .then(res => {
          this.tableLoading = false
          this.machineList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    submitMachineCodeInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          let params = {
            ...this.addForm,
            cid: this.$store.state._cid
          }
          bulkInsertVUnionCode(params).then(res => {
            this.isVendingMachineShow = false
            this.$message.success(res.msg)
            this.getShopNotBindVendingMachine()
          })
        }
      })
    },
    handleQrCode(row) {
      this.isQrCodeShow = true
      this.$nextTick(() => {
        this.qrCodeForm.name = row.name
        this.qrCodeForm.code = row.code
        // eslint-disable-next-line no-new
        new QRcode(this.$refs['qrCodeRef'], {
          text: `https://${AppConfig.FULLDOMAINNAME}?code=${row.vUnionCode}`,
          width: 250,
          height: 250,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
        // 生成图片
        this.createQRcodePicture()
      })
    },
    createQRcodePicture() {
      html2canvas(this.$refs['qrCodeRef'], {
        backgroundColor: null,
        width: 250,
        height: 250
      }).then(canvas => {
        this.qrCodeForm.qrCodeImg = canvas.toDataURL('image/jpeg')
      })
    },
    handleVendingMachineDetail(row) {
      this.$router.push({ path: '/vending-machine-bind-detail', query: { cid: row.cid, vUnionCode: row.vUnionCode, vmcode: row.code } })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getShopNotBindVendingMachine()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getShopNotBindVendingMachine()
    }
  }
}
</script>

<style lang="scss" scoped>
.qrCode-main {
  margin-top: 40px;
  padding: 0 114px;
  .qrCode {
    border: 1px solid #eeeff0;
    padding: 15px;
  }
}
</style>
