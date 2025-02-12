<template>
  <div>
    <el-alert title="提示" type="warning" description="可通过鼠标选定支付方式进行拖拽排序" show-icon :closable="false"> </el-alert>
    <!-- 收银台和小程序支付设置 -->
    <div class="setting">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>收银台支付</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="payTypeSelectShow(1)">支付配置</el-button>
            </div>
            <draggable element="div" v-model="configData.cashier" :options="options" @end="cashierEnd">
              <el-tag v-for="item in configData.cashier" :key="item.payTypeEnum" closable @close="removePay(item.payTypeEnum, 1)">{{ item.payName }}</el-tag>
            </draggable>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>小程序支付</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="payTypeSelectShow(2)">支付配置</el-button>
            </div>
            <draggable element="div" v-model="configData.miniProg" :options="options" @end="miniProgEnd">
              <el-tag v-for="item in configData.miniProg" :key="item.payTypeEnum" closable @close="removePay(item.payTypeEnum, 2)">{{ item.payName }}</el-tag>
            </draggable>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>自助收银支付(1种方式)</span>
              <el-button style="float: right; padding: 3px 0" type="text" :disabled="configData.smilePay.length > 0" @click="payTypeSelectShow(3)">支付配置</el-button>
            </div>
            <draggable element="div" v-model="configData.smilePay" :options="options" @end="smilePayEnd">
              <el-tag v-for="item in configData.smilePay" :key="item.payTypeEnum" closable @close="removePay(item.payTypeEnum, 3)">{{ item.payName }}</el-tag>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
      <div class="submit-btn">
        <el-button type="primary" :disabled="!configData.cashier.length || !configData.miniProg.length" @click="submitShopConfigOperation">提交</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="isPayShow" title="支付方式" width="750px" @closed="closed">
      <el-checkbox-group v-loading="loading" v-model="selectedPayType" @change="selectTypeChange">
        <el-checkbox
          v-for="(item, index) in allPayType"
          :key="index"
          :label="item.payTypeEnum"
          border
          :disabled="
            (payType === 3 && selectedPayType.length > 0 && !selectedPayType.includes(item.payTypeEnum))
          "
          >{{ item.payName }}</el-checkbox
        >
        <!-- (payType === 2 && item.payTypeEnum !== 2 && selectedPayType.find(i => i !== 2) && !selectedPayType.includes(item.payTypeEnum)) ||  -->
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!selectedPayType.length" @click="handlePayConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShopConfigByCid, getShopPayMethodList, shopConfigOperation } from '@/api/system'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      allPayType: [],
      configData: {
        cashier: [], // 收银台支付方式
        miniProg: [], // 小程序支付方式
        smilePay: [] // 自助收银支付方式
      },
      selectedPayType: [],
      payType: 1,
      operateAction: 0,
      options: {
        //  group: "name",  // 分组用的，同一组的不同list可以相互拖动
        sort: true, // 定义是否可以拖拽
        delay: 0, // 定义鼠标选中列表单元可以开始拖动的延迟时间
        touchStartThreshold: 0, // 取消延迟拖动事件之前，该点应移动多少像素
        disabled: false, // 为true时sortable对象不能拖放排序等功能
        store: null,
        animation: 150, // 动画时间
        handle: '.el-tag', // 使列表单元中符合选择器的元素成为拖动的手柄
        filter: '', // 定义哪些元素不可以进行拖放，可用','隔开
        preventOnFilter: true, // 当拖动filter时是否触发event.preventDefault()默认触发
        draggable: '.el-tag', // 定义哪些元素可以进行拖放
        ghostClass: 'el-tag-ghost', // 定义副本影子样式
        chosenClass: 'el-tag-chosen', // 目标选中时样式
        dragClass: 'el-tag-drag', // 目标拖动样式
        //  dataIdAttr: 'data-id',
        forceFallback: false, // 设置为true时，将不使用原生的html5的拖放
        scroll: true, // 拖放是否引起区域滚动
        scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {}, // 用于自定义滚动条的适配
        scrollSensitivity: 30, // 鼠标靠近边缘多远开始滚动默认30
        scrollSpeed: 10 // 滚动速度
      },
      loading: false,
      isPayShow: false
    }
  },
  mounted() {
    this.init()
    // 防止火狐浏览器拖拽时打开新页面
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    init() {
      this.getConfigByCid()
    },
    // 获取该门店已配置的支付方式
    getConfigByCid() {
      let params = {
        pageSize: 0,
        pageIndex: 0,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getShopConfigByCid(params).then(
        res => {
          if (res.success) {
            if (res.data) {
              // 有值，设为编辑
              this.operateAction = 1
              this.configData = {
                ...res.data,
                smilePay: res.data.smilePay ? res.data.smilePay : []
              }
            }
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 获取所有支付方式
    getAllPayType() {
      this.loading = true
      getShopPayMethodList().then(
        res => {
          if (res.success) {
            this.loading = false
            this.allPayType = this.handleData(res.data)
          }
        },
        () => {
          this.loading = false
        }
      )
    },
    payTypeSelectShow(type) {
      this.payType = type
      this.isPayShow = true
      this.getAllPayType()
      this.$nextTick(() => {
        if (this.payType === 1) {
          this.selectedPayType = this.configData.cashier.map(item => item.payTypeEnum)
        } else if (this.payType === 2) {
          this.selectedPayType = this.configData.miniProg.map(item => item.payTypeEnum)
        } else if (this.payType === 3) {
          this.selectedPayType = this.configData.smilePay.map(item => item.payTypeEnum)
        }
      })
    },
    // 区分是选择收银台还是小程序配置还是自助收银
    handlePayConfig() {
      if (this.payType === 1) {
        // 收银台配置
        this.configData.cashier = this.selectedType
      } else if (this.payType === 2) {
        // 小程序配置
        this.configData.miniProg = this.selectedType
      } else if (this.payType === 3) {
        // 自助收银配置
        this.configData.smilePay = this.selectedType
      }
      this.closed()
    },
    // 支付方式配置提交
    submitShopConfigOperation() {
      this.$confirm('确认提交此配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: {
              ...this.configData,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.operateAction
          }
          // console.log(params)
          shopConfigOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.getConfigByCid()
            }
          })
        })
        .catch(() => {})
    },
    // 拖拽后的支付方式
    cashierEnd() {
      this.configData.cashier = JSON.parse(JSON.stringify(this.configData.cashier))
    },
    miniProgEnd() {
      this.configData.miniProg = JSON.parse(JSON.stringify(this.configData.miniProg))
    },
    smilePayEnd() {
      this.configData.smilePay = JSON.parse(JSON.stringify(this.configData.smilePay))
    },
    // 移除支付方式标签
    removePay(payNum, type) {
      if (type === 1) {
        let index = this.configData.cashier.findIndex(item => {
          return item.payTypeEnum === payNum
        })
        this.configData.cashier.splice(index, 1)
      } else if (type === 2) {
        let index = this.configData.miniProg.findIndex(item => {
          return item.payTypeEnum === payNum
        })
        this.configData.miniProg.splice(index, 1)
      } else if (type === 3) {
        let index = this.configData.smilePay.findIndex(item => {
          return item.payTypeEnum === payNum
        })
        this.configData.smilePay.splice(index, 1)
      }
    },
    // 复选框勾选数值改变
    selectTypeChange(val) {
      this.selectedType = this.allPayType.filter(item => {
        return val.some(v => v === item.payTypeEnum)
      })
    },
    closed() {
      this.isPayShow = false
      this.selectedPayType = []
    },
    // 数据处理
    handleData(obj) {
      let arr = []
      for (var key in obj) {
        let o = {
          payTypeEnum: obj[key],
          payName: key,
          isUsed: true
        }
        arr.push(o)
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox.is-bordered {
  width: 190px;
  margin-bottom: 15px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: unset;
}
.el-tag {
  cursor: default;
  margin-right: 10px;
  margin-bottom: 15px;
}
.el-card {
  height: 300px;
}
.setting {
  margin-top: 20px;
  .submit-btn {
    margin-top: 15px;
  }
}
.el-tag-chosen {
  background-color: #409eff;
  color: #fff;
}
</style>
