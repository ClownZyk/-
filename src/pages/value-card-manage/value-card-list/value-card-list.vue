<template>
  <div class="value-card-container">
    <div v-if="containerIsShow">
      <div class="alert" v-permission="['/value-card-list:insert']">
        <el-alert
          title="云点卡说明："
          description="1、云点卡新增：点击‘新增’按钮——>读卡器读卡——>选择充值面额、支付方式——>点击‘确定’按钮，若云点卡读取错误可点击右下方‘重置’按钮后重新刷卡；2、云点卡充值：点击‘批量充值导入’按钮——>选择excel表格即可，也可点击‘单卡充值’按钮进行单张充值；"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <el-form class="filter" ref="filterParamRef" :model="filterParam" inline>
        <div class="filter-left">
          <el-form-item v-if="isManage" label="门店">
            <el-select v-model="filterParam.queryCid" placeholder="请选择门店" @change="getCardType()"> <el-option v-for="item in shopList" :key="item.cid" :label="item.shopName" :value="item.cid"> </el-option> </el-select>
          </el-form-item>
          <el-form-item label="卡编号"> <el-input type="text" v-model="filterParam.title" placeholder="请输入卡编号检索" clearable @keyup.enter.native="getValueCardData('refresh')"></el-input> </el-form-item>
          <!--
            <el-form-item label="卡号" prop="cardNumber">
              <div>
                <span>{{ filterParam.cardNumber | cardNumberReplace }}</span> <span style="color:#909399;font-size:12px">(点‘重置’清除数据后再进行刷卡检索)</span>
              </div>
              <el-input class="searchCardInput" type="text" ref="searchCardInput" v-model="filterParam.cardNumber" placeholder="请刷云点卡检索" clearable @keyup.enter.native="getValueCardList('refresh')"></el-input>
            </el-form-item>
          -->
          <el-form-item label="姓名" prop="name"> <el-input type="text" v-model="filterParam.name" placeholder="请输入姓名检索" clearable @keyup.enter.native="getValueCardData('refresh')"></el-input> </el-form-item>
          <el-form-item label="手机号" prop="phone"> <el-input type="text" v-model="filterParam.phone" placeholder="请输入手机号检索" clearable @keyup.enter.native="getValueCardData('refresh')"></el-input> </el-form-item>
          <el-form-item label="卡面类型" prop="entityCardType">
            <el-select v-model="filterParam.entityCardType" placeholder="请选择卡面类型" clearable> <el-option v-for="(item, index) in cardTypeList" :key="index" :label="item.title" :value="item.cardFaceId"> </el-option> </el-select>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="getValueCardData('refresh')">查询</el-button> </el-form-item>
          <el-form-item>
            <el-button :loading="queryLoading" type="primary" @click="getValueCardTotalAmount">总余额查询（{{ totalAmount }} 元）</el-button>
          </el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item> <el-button type="primary" @click="valueCardAddOrRecharge(0)" v-permission="['/value-card-list:insert']">新增云点卡</el-button> </el-form-item>
          <el-form-item v-permission="['/value-card-list:update']">
            <a href="https://v6.wxbos.cn/template/云点卡批量充值导入模板.xlsx" class="inorder-dow-btn">批量充值导入模板下载</a>
            <el-upload style="display: inline-block;" ref="uploadRechargeRef" action :limit="1" :show-file-list="false" :before-upload="beforeUploadRecharge" :http-request="uploadRecharge" :on-exceed="handleExceedRecharge">
              <el-button :loading="uploadLoading" type="warning">批量充值导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getAllRechargeRecord">流水记录（充值，消费，记账）</el-button> </el-form-item>
          <el-form-item> <el-button :loading="exportLoading" type="warning" @click="valueCardDataExport">数据导出</el-button> </el-form-item>
        </div>
      </el-form>

      <div class="table-list">
        <el-table v-loading="tableLoading" :data="valueCardList" border>
          <el-table-column label="编号" prop="title" width="120" align="center"></el-table-column>
          <el-table-column label="卡号" min-width="180" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.cardNumber | cardNumberReplace }}</div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" min-width="120" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.name || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phone" min-width="160" align="center"></el-table-column>
          <el-table-column label="余额(元)" prop="amount" min-width="160" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="备注" min-width="160" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.remarks || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="卡状态" width="140" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.isUse" style="color:#67C23A">已激活</span> <span v-else style="color:#F56C6C">已挂失</span>
            </template>
          </el-table-column>
          <el-table-column label="绑定状态" width="140" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.isBind" style="color:#67C23A">已绑定</span> <span v-else style="color:#F56C6C">未绑定</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="valueCardInfoEdit(scope.row)" v-permission="['/value-card-list:update']">编辑</el-button>
              <el-button size="mini" type="warning" @click="getTurnoverRecord(scope.row)">流水记录</el-button>
              <el-button v-if="!isManage && scope.row.isUse" size="mini" type="danger" @click="valueCardAddOrRecharge(2, scope.row)" v-permission="['/value-card-list:update']">挂失补卡</el-button>
              <!-- <el-button v-if="!isManage && !scope.row.isUse" size="mini" type="success" @click="handleValueCardActive(scope.row)">激活</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          style="text-align:right;margin-top:10px"
        ></el-pagination>
      </div>

      <!-- 卡新增，刷卡充值，挂失补卡弹框 -->
      <el-dialog :title="addFormState === 0 ? '云点卡新增' : addFormState === 1 ? '云点卡充值' : '云点卡挂失补卡'" :visible.sync="isCardShow" width="700px" @close="isCardShow = false" :close-on-click-modal="false">
        <el-input ref="cardInputRef" class="card-input" v-model="addForm.cardNumber"></el-input>
        <el-row :gutter="20">
          <el-col :span="12">
            <div v-if="addFormState === 2 && addForm.oriCardNumber" class="ori-cardNumber"><span class="ori-cardNumber-span">原卡号：</span>{{ addForm.oriCardNumber | cardNumberReplace }}</div>
          </el-col>
          <el-col :span="12">
            <div v-if="addFormState === 2 && addForm.oriCardNumber" class="ori-cardNumber"><span class="ori-cardNumber-span">原卡面剩余金额：</span>{{ addForm.cardPay.recharge }} 元</div>
          </el-col>
        </el-row>
        <el-form v-if="addForm.cardNumber" ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
          <div>
            <div class="ori-cardNumber" v-if="addFormState === 2"><span class="ori-cardNumber-span">新卡号：</span>{{ addForm.cardNumber | cardNumberReplace }}</div>
            <div class="ori-cardNumber" v-if="addFormState !== 2"><span class="ori-cardNumber-span">卡号：</span>{{ addForm.cardNumber | cardNumberReplace }}</div>
            <el-row v-if="addFormState !== 1" :gutter="20">
              <el-col :span="12">
                <el-form-item label="卡面类型：" prop="entityCardType">
                  <el-select size="small" v-model="addForm.entityCardType" placeholder="请选择卡面类型" @change="cardTypeChange" style="width:100%">
                    <el-option v-for="(item, index) in cardTypeList" :key="index" :label="item.title" :value="item.cardFaceId"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="卡编号：" prop="title"> <el-input size="small" type="text" v-model.trim="addForm.title" placeholder="请输入卡编号"></el-input> </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="addFormState !== 1" :gutter="20">
              <el-col :span="12">
                <el-form-item label="适用门店：（若需修改请前往中台账号进行配置）">
                  <div v-if="addForm.entityCardType">
                    <div v-if="addForm.limitCid.length > 0"><el-button size="mini" type="warning" @click="isShopShow = true">查看适用门店</el-button></div>
                    <div v-else style="color: #E6A23C">适用所有门店</div>
                  </div>
                  <div v-else style="color: #E6A23C">选择卡面类型后可查看~~</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="卡面图片：">
                  <div v-if="addForm.entityCardType">
                    <el-image v-if="addForm.images && addForm.images.url" style="width: 185px; height: 90px" :src="addForm.images.url" :preview-src-list="[addForm.images.url]" fit="fill"></el-image>
                    <div v-else style="color: #E6A23C">后台暂未上传~~</div>
                  </div>
                  <div v-else style="color: #E6A23C">选择卡面类型后可查看~~</div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item v-if="addFormState !== 1" label="姓名：" prop="name"> <el-input size="small" type="text" v-model.trim="addForm.name" placeholder="请输入姓名"></el-input> </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="addFormState !== 1" label="手机号：" prop="phone"> <el-input size="small" type="text" v-model.trim="addForm.phone" placeholder="请输入手机号"></el-input> </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="addFormState !== 2">
              <el-col :span="12">
                <el-form-item label="充值金额：" prop="cardPay.recharge">
                  <el-input-number size="small" v-model="addForm.cardPay.recharge" :min="0" :controls="false" :step="0.01" step-strictly style="width:100%"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="赠送金额：" prop="cardPay.giving">
                  <el-input-number size="small" v-model="addForm.cardPay.giving" :min="0" :controls="false" :step="0.01" step-strictly style="width:100%"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item v-if="addFormState === 0" label="云点卡备注：" prop="remarks"> <el-input size="small" type="textarea" v-model.trim="addForm.remarks" :rows="2" placeholder="请输入云点卡备注信息"></el-input> </el-form-item>
          </div>
        </el-form>
        <el-empty
          v-else
          :description="addFormState === 0 ? '将云点卡放上读卡器进行新增' : addFormState === 1 ? '将云点卡放上读卡器进行充值' : '将新云点卡放上读卡器进行补办'"
          image="http://v6.wxbos.cn/Files/Pictures/2023/3/31/7b0e5966-f2b7-446e-85f3-854844e24551.png"
        ></el-empty>
        <span slot="footer">
          <el-button v-if="!addForm.cardNumber && addFormState === 2" type="danger" @click="loseValueCard">仅挂失</el-button>
          <el-button v-if="addForm.cardNumber && addFormState !== 2" @click="clearCardInfo">重 置</el-button>
          <el-button v-if="addForm.cardNumber" :loading="submitLoading" type="primary" @click="submitCardInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 门店弹框 -->
      <el-dialog title="适用门店" :visible.sync="isShopShow" width="900px" @click="isShopShow = false" :close-on-click-modal="false">
        <div class="shop-main">
          <el-tag v-for="shop in addForm.limitCid" :key="shop.cid"> {{ shop.shopName }} </el-tag>
        </div>
        <span slot="footer"> </span>
      </el-dialog>

      <!-- 云点卡基本信息弹框 -->
      <el-dialog title="基本信息" :visible.sync="isCardInfoShow" width="900px" @click="isCardInfoShow = false" :close-on-click-modal="false">
        <el-form ref="cardInfoRef" :model="cardInfo" :rules="cardInfoRules" label-position="top">
          <el-form-item label="卡编号："> {{ cardInfo.title }} </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名：" prop="name"> <el-input type="text" v-model.trim="cardInfo.name" placeholder="请输入姓名" clearable></el-input> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号：" prop="phone"> <el-input type="text" v-model.trim="cardInfo.phone" placeholder="请输入手机号" clearable></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="适用门店(若不勾选则表示适用所有门店)：" prop="limitCid">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group size="small" v-model="checkedShops" @change="handleCheckedShopsChange">
              <el-checkbox v-for="item in shopList.slice(1)" :key="item.cid" :label="item.cid" border>{{ item.shopName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer"> <el-button type="primary" @click="submitValueCardInfo">确 定</el-button> </span>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import {
  getValueCardList,
  valueCardAddOperation,
  valueCardRechargeOperation,
  valueCardLogOffOperation,
  valueCardRechargeExcel,
  getValueCardSetUp,
  valueCardOperation,
  getAllStore,
  valueCardExport,
  getValueCardTotalAmount
} from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      filterParam: {
        name: '',
        title: '',
        entityCardType: '',
        cardNumber: '',
        phone: '',
        queryCid: this.$store.state._cid
      },
      valueCardList: [],
      shopList: [],
      checkedShops: [],
      totalAmount: 0,
      addForm: {
        entityCardType: '',
        cardNumber: '',
        title: '',
        name: '',
        phone: '',
        amount: 0,
        cardPay: {
          payType: 15, // 线下付款
          payState: 'ok',
          rechargeId: '',
          recharge: 0,
          giving: 0
        },
        limitCid: [],
        images: null,
        remarks: ''
      },
      cardTypeList: [],
      addFormState: 0,
      cardInfo: {},
      isCardInfoShow: false,
      isCardShow: false,
      isShopShow: false,
      submitLoading: false,
      tableLoading: false,
      uploadLoading: false,
      containerIsShow: true,
      exportLoading: false,
      queryLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        entityCardType: [{ required: true, message: '请选择卡面类型', trigger: 'change' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '卡编号不能为空', trigger: 'blur' }],
        'cardPay.recharge': [{ required: true, message: '请输入充值金额', trigger: 'change' }],
        'cardPay.giving': [{ required: true, message: '请输入赠送金额', trigger: 'change' }]
      },
      cardInfoRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'value-card-list') {
        this.getValueCardData()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isCardShow(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['cardInputRef'].focus()
        })
      } else {
        this.clearCardInfo()
      }
    },
    checkedShops(val) {
      this.cardInfo.limitCid = this.shopList.filter(item => {
        return val.find(shopCid => shopCid === item.cid)
      })
    }
  },
  computed: {
    checkAll: {
      get() {
        if (this.shopList.length <= 0) {
          return false
        }
        return this.checkedShops.length === this.shopList.length
      },
      set() {}
    },
    isIndeterminate() {
      return this.checkedShops.length > 0 && this.checkedShops.length < this.shopList.length
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs['searchCardInput'].focus()
    // })
    // if (this.isManage) {
    //   this.getAllShop()
    // } else {
    //   this.getCardType()
    //   this.getValueCardData()
    // }
    this.getAllShop()
  },
  methods: {
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = [
            {
              cid: localStorage.getItem('cid'),
              shopName: '所有门店'
            },
            ...res.data.map(item => {
              return {
                cid: item.cid,
                shopName: item.companyName
              }
            })
          ]
          // this.filterParam.queryCid = this.shopList.length > 0 ? this.shopList[0].value : this.$store.state._cid
          // 获取云点卡信息
          this.getCardType()
          this.getValueCardData()
        }
      })
    },
    getCardType() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      getValueCardSetUp(params).then(res => {
        this.cardTypeList = res.data
      })
    },
    getValueCardData(refresh) {
      this.getValueCardList(refresh)
      this.getValueCardTotalAmount()
    },
    getValueCardList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      this.tableLoading = true
      getValueCardList(params)
        .then(res => {
          this.tableLoading = false
          this.valueCardList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 云点卡总余额查询
    getValueCardTotalAmount() {
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      this.queryLoading = true
      getValueCardTotalAmount(params)
        .then(res => {
          this.queryLoading = false
          this.totalAmount = res.data
        })
        .catch(() => {
          this.queryLoading = false
        })
    },
    // 云点卡基本信息修改
    valueCardInfoEdit(row) {
      this.isCardInfoShow = true
      this.$nextTick(() => {
        this.cardInfo = row
        this.checkedShops = row.limitCid && row.limitCid.length > 0 ? row.limitCid.map(item => item.shopCid) : []
      })
    },
    handleCheckAllChange(val) {
      this.checkedShops = val ? this.shopList.map(item => item.cid) : []
    },
    handleCheckedShopsChange(val) {
      this.checkedShops = val
    },
    submitValueCardInfo() {
      this.$refs['cardInfoRef'].validate(valid => {
        if (valid) {
          this.$confirm('确定修改该云点卡基本信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                dto: this.cardInfo,
                action: 1
              }
              valueCardOperation(params).then(res => {
                this.isCardInfoShow = false
                this.$message.success(res.msg)
                this.getValueCardList()
              })
            })
            .catch(() => {})
        }
      })
    },
    cardTypeChange(val) {
      let data = this.cardTypeList.find(item => item.cardFaceId === val)
      this.addForm.limitCid = data.limitCid
      this.addForm.images = data.images
    },
    valueCardAddOrRecharge(state, row) {
      this.addFormState = state
      this.isCardShow = true
      if (row) {
        this.addForm.entityCardType = row.entityCardType
        this.addForm.oriCardNumber = row.cardNumber
        this.addForm.name = row.name
        this.addForm.phone = row.phone
        this.addForm.cardPay.recharge = row.amount
        this.addForm.limitCid = row.limitCid
        this.addForm.images = row.images
        this.addForm.remarks = `原卡号：${this.addForm.oriCardNumber}`
      }
    },
    submitCardInfo() {
      if (this.addFormState === 0) {
        // 新增云点卡
        this.valueCardAddOperation()
      } else if (this.addFormState === 1) {
        // 云点卡充值
        this.valueCardRechargeOperation()
      } else if (this.addFormState === 2) {
        // 云点卡挂失
        this.getCardLogOff()
      }
    },
    valueCardAddOperation(type) {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          let params = {
            entityCardType: this.addForm.entityCardType,
            title: this.addForm.title,
            cardNumber: this.addForm.cardNumber.substring(0, 10),
            name: this.addForm.name,
            phone: this.addForm.phone,
            amount: parseFloat((this.addForm.cardPay.recharge + this.addForm.cardPay.giving).toFixed(2)),
            cardPay: this.addForm.cardPay,
            limitCid: this.addForm.limitCid,
            images: this.addForm.images,
            remarks: this.addForm.remarks,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          // console.log(params)
          this.submitLoading = true
          valueCardAddOperation(params)
            .then(res => {
              if (res.success) {
                this.submitLoading = false
                this.isCardShow = false
                this.$message.success(res.msg)
                if (type === 'reissue') {
                  this.valueCardLoseOperation()
                } else {
                  this.getValueCardData()
                }
              } else {
                this.submitLoading = false
                this.isCardShow = false
                this.$message.success(res.msg)
              }
            })
            .catch(() => {
              this.submitLoading = false
              this.isCardShow = false
            })
        }
      })
    },
    valueCardRechargeOperation() {
      let params = {
        cardNumber: this.addForm.cardNumber.substring(0, 10),
        amount: parseFloat((this.addForm.cardPay.recharge + this.addForm.cardPay.giving).toFixed(2)),
        cardPay: this.addForm.cardPay,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      // console.log(params)
      this.submitLoading = true
      valueCardRechargeOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isCardShow = false
          this.$message.success(res.msg)
          this.getValueCardData()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    getCardLogOff() {
      this.$confirm('确定挂失此云点卡并补办?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.valueCardAddOperation('reissue')
        })
        .catch(() => {})
    },
    valueCardLoseOperation() {
      let params = {
        cardNumber: this.addForm.oriCardNumber
      }
      valueCardLogOffOperation(params).then(res => {
        this.$message.success(res.msg)
        this.getValueCardData()
      })
    },
    // 云点卡仅挂失操作
    loseValueCard() {
      this.$confirm('确认挂失该云点卡，挂失后该卡将不可用，确认继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.valueCardLoseOperation()
        })
        .catch(() => {})
    },
    // 已挂失云点卡激活操作
    handleValueCardActive(row) {},
    // 批量充值
    handleExceedRecharge(files, fileList) {
      this.$message.warning('一次只能上传一个文件导入')
    },
    beforeUploadRecharge(file) {
      const fileNameBack = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileNameBack !== 'xls' && fileNameBack !== 'xlsx') {
        this.$message({
          message: '上传文件只能是 xls、xlsx 格式!',
          type: 'warning'
        })
        return false
      }
      return true
    },
    uploadRecharge(param) {
      const file = param.file
      let formData = new FormData()
      formData.append('excelfile', file)
      formData.append('cid', this.$store.state._cid)
      formData.append('roleId', this.$store.state.UserRole)
      formData.append('creater', this.$store.state.UserID)
      this.uploadLoading = true
      valueCardRechargeExcel(formData).then(
        res => {
          this.uploadLoading = false
          if (res.success) {
            this.$message.success(res.msg)
            this.getValueCardData()
          } else {
            const content = res
            const blob = new Blob([content])
            const fileName = '差异信息.xls'
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob, {
                type: 'application/vnd.ms-excel'
              })
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          }
          this.$refs.uploadRechargeRef.clearFiles()
        },
        () => {
          this.uploadLoading = false
          this.$refs.uploadRechargeRef.clearFiles()
        }
      )
    },
    // 云点卡数据导出
    valueCardDataExport() {
      let params = {
        ...this.filterParam,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.filterParam.queryCid
      }
      this.exportLoading = true
      valueCardExport(params)
        .then(res => {
          this.exportLoading = false
          const content = res
          const blob = new Blob([content])
          const fileName = '云点卡数据列表.xls'
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob, {
              type: 'application/vnd.ms-excel'
            })
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    clearCardInfo() {
      this.addForm = {
        entityCardType: '',
        cardNumber: '',
        title: '',
        name: '',
        phone: '',
        amount: 0,
        cardPay: {
          payType: 15, // 线下付款
          payState: 'ok',
          rechargeId: '',
          recharge: 0,
          giving: 0
        },
        limitCid: [],
        images: null,
        remarks: ''
      }
      this.$refs['cardInputRef'].focus()
    },
    // 查看云点卡流水记录
    getTurnoverRecord(row) {
      this.$router.push({
        path: '/value-card-flow-record',
        query: {
          cid: row.cid,
          cardNumber: row.cardNumber
        }
      })
    },
    getAllRechargeRecord() {
      this.$router.push({
        path: '/value-card-flow-record',
        query: { cid: this.filterParam.queryCid }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getValueCardList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getValueCardList()
    }
  }
}
</script>

<style lang="scss" scoped>
.value-card-container {
  padding: 20px;
  .searchCardInput,
  .card-input {
    position: absolute;
    z-index: 999999;
    opacity: 0;
  }
  .alert {
    margin-bottom: 10px;
  }
  // .filter {
  //   display: flex;
  //   justify-content: space-between;
  // }
  .ori-cardNumber {
    height: 30px;
    .ori-cardNumber-span {
      display: inline-block;
      padding-right: 12px;
      font-size: 14px;
      font-weight: 700;
      color: #606266;
      text-align: right;
    }
  }
  .inorder-dow-btn {
    background-color: #409eff;
    border-color: #409eff;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    line-height: 1;
  }
  .el-tag {
    width: 250px;
    margin-right: 10px;
  }
}
.el-checkbox {
  width: 260px;
  margin-right: 25px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: unset !important;
  // margin-right: 25px;
}
</style>
