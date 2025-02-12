<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="异常订单详情"> </el-page-header></div>
    <el-form :model="orderDetail" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单视频：">
            <div class="video-main" v-if="orderDetail.videoUrls && orderDetail.videoUrls.length > 0"><video v-for="(item, index) in orderDetail.videoUrls" :key="index" :src="item" controls muted></video></div>
            <div class="video-main" v-else><video :src="orderDetail.videoUrl" controls muted></video></div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单详情：">
            <div>开门编码：{{ orderDetail.orderCode }}</div>
            <div>售卖机名称：{{ orderDetail.vmName }}</div>
            <div>售卖机编码：{{ orderDetail.vmCode }}</div>
            <div>异常原因：{{ orderDetail.abnormalReasons | abnormalReasonsFilters }}</div>
            <div>开关门时间：{{ orderDetail.openDoorTime }} ~ {{ orderDetail.closeDoorTime }}</div>
          </el-form-item>
          <el-form-item label="订单处理：">
            <el-row>
              <el-radio-group v-model="handleForm.isShop" @input="radioChange">
                <el-radio :label="true">有购物</el-radio>
                <el-radio :label="false">无购物</el-radio>
              </el-radio-group>
            </el-row>
            <el-row class="prod-select" v-if="handleForm.isShop">
              <div v-if="!orderDetail.isHandle"><el-button size="small" type="warning" @click="handleProductSelect(true)">产品选择</el-button></div>
              <el-table class="table-list" size="small" :data="handleForm.orderGoodsList" border>
                <el-table-column type="index" width="55" align="center"></el-table-column>
                <el-table-column label="产品名称" prop="itemName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="产品价格" prop="price" width="140" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ Math.round(scope.row.itemPrice) / 100 }}
                  </template>
                </el-table-column>
                <el-table-column label="产品数量" min-width="160" align="center">
                  <template slot-scope="scope">
                    <el-input-number v-if="!orderDetail.isHandle" size="small" v-model="scope.row.count" :min="1" :controls="false" :step="1" step-strictly></el-input-number>
                    <span v-else>{{ scope.row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="140" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="removeProd(scope.row)" :disabled="orderDetail.isHandle">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <el-row class="remarks"> <el-input type="textarea" v-model="handleForm.remarks" :rows="2" placeholder="请输入异常订单处理备注"></el-input> </el-row>
          </el-form-item>
          <el-row v-if="!orderDetail.isHandle">
            <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitOrderHandleInfo">订单处理</el-button> </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <!-- 产品选择器 -->
    <vending-product-select :isShowProductSelect="isShowProductSelect" @handleProductSelect="handleProductSelect" @saveSelected="saveSelected"></vending-product-select>
  </div>
</template>

<script>
import { getVendingMachineAbnormalOrderDetail, abnormalOrderHandleOperation, getVendingMachineOrderVideo } from '@/api/system'
import VendingProductSelect from '@/components/vending-product-select.vue'
import { getDataString } from '@/filters/filters'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  components: { VendingProductSelect },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      orderDetail: {
        abnormalReasons: []
      },
      handleForm: {
        isShop: true,
        orderCode: '',
        orderGoodsList: [],
        remarks: ''
      },
      isShowProductSelect: false,
      submitLoading: false
    }
  },
  mounted() {
    this.getAbnormalOrderDetail()
  },
  methods: {
    getAbnormalOrderDetail() {
      let params = {
        orderCode: this.$route.query.orderCode
      }
      getVendingMachineAbnormalOrderDetail(params).then(res => {
        this.orderDetail = {
          ...res.data,
          openDoorTime: getDataString(new Date(res.data.openDoorTime), 'yyyy-MM-dd hh:mm:ss'),
          closeDoorTime: getDataString(new Date(res.data.closeDoorTime), 'yyyy-MM-dd hh:mm:ss')
        }
        // 若无视频url，调取视频接口
        if (!res.data.videoUrls && res.data.videoUrls.length <= 0 && !res.data.videoUrl) {
          this.getVideoDetail(res.data.tradeRequestId)
        }
        if (res.data.isHandle) {
          this.handleForm.isShop = !!(res.data.orderGoodsList && res.data.orderGoodsList.length)
          this.handleForm.orderGoodsList = res.data.orderGoodsList
          this.handleForm.remarks = res.data.remarks
        }
      })
    },
    getVideoDetail(tradeRequestId) {
      getVendingMachineOrderVideo(tradeRequestId).then(res => {
        this.orderDetail.videoUrl = res.data.videoUrl
      })
    },
    radioChange(val) {
      this.handleForm.orderGoodsList = []
      this.handleForm.remarks = ''
    },
    handleProductSelect(flag) {
      this.isShowProductSelect = flag
    },
    saveSelected(list) {
      let noRepeatList = list
        .filter(item => {
          return this.handleForm.orderGoodsList.every(val => item.itemCode !== val.itemCode)
        })
        .map(item => {
          return {
            itemCode: item.itemCode,
            itemName: item.name,
            itemPrice: item.price,
            count: 1
          }
        })
      this.handleForm.orderGoodsList.push(...noRepeatList)
    },
    removeProd(row) {
      let index = this.handleForm.orderGoodsList.findIndex(item => item.itemCode === row.itemCode)
      this.handleForm.orderGoodsList.splice(index, 1)
    },
    submitOrderHandleInfo() {
      if (this.handleForm.isShop && this.handleForm.orderGoodsList.length <= 0) {
        return this.$message.warning('请选择该订单所购物的产品信息！')
      }
      this.$confirm('确定提交该订单处理数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            orderCode: this.orderDetail.orderCode,
            orderGoodsList: this.handleForm.orderGoodsList,
            remarks: this.handleForm.remarks
          }
          // console.log(params)
          this.submitLoading = true
          abnormalOrderHandleOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.video-main {
  width: 100%;
  video {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }
}
.prod-select {
  margin-top: 6px;
  .table-list {
    margin-top: 5px;
    margin-bottom: 15px;
  }
}
.remarks {
  margin-bottom: 15px;
}
</style>
