<template>
  <div class="page-contain">
    <div class="form-item-title">
      <span class="item-tips"></span>卡劵信息<span class="border"></span> <span class="EnName">cards</span>
      <el-button class="card-add" type="primary" size="mini" @click="isShowCardSelect = true" :disabled="btnDisabled">选择卡劵</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="80px" label-position="top" class="form-contain" :rules="rules">
      <el-form-item prop="title" label="卡劵名称"> <el-input v-model="form.title" style="width:300px;"></el-input> </el-form-item>
      <el-form-item prop="quantity" label="总库存" v-if="!id"> <el-input v-model="form.quantity" disabled style="width:300px;"></el-input> </el-form-item>
      <el-form-item prop="getLimit" label="领取限制"> <el-input-number v-model="form.getLimit" :min="1" controls-position="right"></el-input-number> </el-form-item>
      <el-form-item prop="time" label="活动时间">
        <el-date-picker v-model="form.time" type="daterange" @change="dataSelect" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      </el-form-item>
      <el-form-item prop="time" label="适用店铺">
        <div v-if="form.isShop">全店铺通用</div>
        <div v-else>
          <span v-for="item in form.partShop" :key="item.shopCid">{{item.shopName}}</span>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="form-item-title">
          启用状态
          <el-switch v-model="form.isOpen"></el-switch>
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="_sumbit(text)" :disabled="btnDisabled">{{ text }}</el-button>
    <!-- 兑换券选择器 -->
    <card-select-radio :isShowCardSelect="isShowCardSelect" :selectedList="selectedList" @saveSelected="saveSelectedVirtual"></card-select-radio>
  </div>
</template>
<script>
import { CardPlatformOperation, GetCardPlatformDetailById } from '@/api/system'
import { formatDate } from '@/components/js/data'
import cardSelectRadio from '@/components/card-select-radio.vue'
export default {
  data() {
    return {
      isShowCardSelect: false,
      selectedList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      btnDisabled: Boolean(this.$route.query.action),
      text: parseInt(this.$route.query.action) === 0 ? '新增' : '修改',
      id: this.$route.query.id,
      pageSize: 10,
      pageIndex: 1,
      form: {
        title: '',
        quantity: 0,
        getLimit: null,
        isOpen: true,
        time: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      rules: {
        title: [{ required: true, message: '请输入卡劵名称', trigger: 'change' }],
        getLimit: [{ required: true, message: '请填写卡劵名称', trigger: 'change' }]
      }
    }
  },
  methods: {
    init() {
      let parmas = {
        _id: this.id
      }
      GetCardPlatformDetailById(parmas).then(
        res => {
          if (res.success) {
            let time = [res.data.startTime.split(' ')[0], res.data.endTime.split(' ')[0]]
            this.form = res.data
            this.form.time = time
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    dataSelect(val) {
      this.searchCondition = {
        startTime: val[0],
        endTime: val[1]
      }
    },
    handleCardSelect(flag) {
      if (flag) {
        this.selectedList = this.detail.voucher
      } else {
        // 关闭产品选择器，初始化数据
        this.selectedList = []
      }
      this.isShowCardSelect = flag
    },
    saveSelectedVirtual(val) {
      this.form = {
        ...this.form,
        title: val.title,
        quantity: val.quantity,
        getLimit: val.getLimit,
        cardId: val._id,
        cardType: 0,
        receiveStatus: false,
        isShop: val.isShop,
        partShop: val.partShop
      }
      this.handleCardSelect(false)
    },
    delectProduct(index) {
      this.form.voucher.splice(index, 1)
    },
    // 提交
    _sumbit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form = {
            ...this.form,
            startTime: this.form.time[0],
            endTime: `${this.form.time[1]}`
          }
          let parmas = {
            dto: this.form,
            action: parseInt(this.$route.query.action)
          }
          this.$confirm('是否' + this.text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              CardPlatformOperation(parmas).then(
                res => {
                  if (res.success) {
                    this.$message.success(res.msg)
                    this.$router.go(-1)
                  } else this.$message.error(res.msg)
                },
                err => {
                  this.$message.error(err.msg)
                }
              )
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    if (this.$route.query.action) {
      this.init()
    }
  },
  components: { cardSelectRadio }
}
</script>
<style lang="scss" scoped>
.page-contain {
  .form-contain {
    padding: 0 120px 20px 20px;
    .el-form-item {
      .el-form-item__content {
        .form-item-title {
          font-weight: bolder;
          font-size: 16px;
          position: relative;
          .card-add {
            margin-left: 80px;
          }
          .item-tips {
            color: #d80000;
          }
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
            text-transform: uppercase;
          }
        }
      }
    }
  }
}
.row-line {
  display: flex;
  display: -webkit-flex;
  .el-form-item {
    flex: 1;
    padding-right: 5%;
    &:last-child {
      padding-right: 0;
    }
  }
}
</style>
