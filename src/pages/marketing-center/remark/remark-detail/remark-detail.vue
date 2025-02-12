<template>
  <div class="details">
    <el-form :model="detail" :rules="rules" class="msg-dialog" ref="detail">
      <div class="mag-dialog-row">
        <el-form-item style="flex: 0 0 100%;" prop="Title">
          <div class="form-item-title">活动标题<span class="border"></span> <span class="EnName">title</span></div>
          <el-input v-model="detail.title" placeholder="请输入活动标题"></el-input>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item style="flex: 0 0 100%;">
          <div class="form-item-title">活动简介<span class="border"></span> <span class="EnName">summary</span></div>
          <el-input type="textarea" :rows="2" v-model="detail.summary" placeholder="请输入活动简介"></el-input>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item prop="buytype">
          <div class="form-item-title">活动类型<span class="border"></span> <span class="EnName">type</span></div>
          <el-select v-model="detail.buytype" placeholder="请选择活动类型" class="mag-input"> <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <el-form-item prop="birthday">
          <div class="form-item-title">开始时间<span class="border"></span> <span class="EnName">begin</span></div>
          <el-date-picker class="mag-input" style="width: 100%;" v-model="detail.activeStart" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item prop="birthday">
          <div class="form-item-title">结束时间<span class="border"></span> <span class="EnName">end</span></div>
          <el-date-picker class="mag-input" style="width: 100%;" v-model="detail.activeEnd" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">赠送卡劵<span class="border"></span> <span class="EnName">card</span></div>
          <el-button type="primary" plain @click="handleCardSelect(true)">点击选择兑换券</el-button>
        </el-form-item>
      </div>
      <el-table class="table-main" ref="detail.voucher" v-show="detail.voucher.length !== 0" :data="detail.voucher" border tooltip-effect="dark" style="width: 1000px;">
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column align="center" prop="coupon" label="卡劵id" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="title" label="卡劵名称" min-width="180" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="mag-dialog-row">
        <el-form-item prop="buyNumber">
          <div class="form-item-title">周期首单数<span class="border"></span> <span class="EnName">count</span></div>
          <el-input class="mag-input" v-model="detail.buyNumber" placeholder="请输入周期首单数"></el-input>
        </el-form-item>
        <el-form-item prop="buyMoney">
          <div class="form-item-title">首单满足金额<span class="border"></span> <span class="EnName">money</span></div>
          <el-input class="mag-input" v-model="detail.buyMoney" placeholder="请输入首单满足金额"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">sort</span></div>
          <el-input-number :min="99" controls-position="right" class="mag-input" v-model="detail.sortNo" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item>
          <div class="form-item-title">使用状态<span class="border"></span> <span class="EnName">state</span></div>
          <el-switch v-model="detail.activestate" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </div>
      <div class="mag-dialog-row"></div>
      <div class="mag-dialog-row">
        <el-form-item style="flex: 0 0 100%;">
          <div class="form-item-title">活动详情<span class="border"></span> <span class="EnName">content</span></div>
          <el-input type="textarea" :rows="5" v-model="detail.content" placeholder="请输入活动详情"></el-input>
        </el-form-item>
      </div>
      <div class="mag-dialog-row">
        <el-form-item>
          <div class="form-item-title">活动主图<span class="border"></span> <span class="EnName">mainimg</span></div>
          <!-- <div class="item-detail item-img" :style="{'backgroundImage':  'url('+ detail.mainImg.url +')'}" v-if="isShow"></div> -->
          <my-upload :imgs="detail.mainImgs" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('images', 1, $event)" @handleUploadImg="handleUploadImg('images', 1, $event)"> </my-upload>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" @click="_submit('detail')">提交</el-button>
    <!-- 兑换券选择器 -->
    <exchange-card-select :isShowCardSelect="isShowCardSelect" :selectedList="selectedList" @handleCardSelect="handleCardSelect" @saveSelected="saveSelectedVirtual"></exchange-card-select>
  </div>
</template>

<script>
import { GetBuyActOption, GetBuyActDetail } from '@/api/system'
import exchangeCardSelect from '@/components/exchange-card-select.vue'
import myUpload from '@/components/my-upload'
import { formatDate } from '@/components/js/data'
export default {
  data() {
    return {
      isShowCardSelect: false, // 是否打开选择器
      selectedList: [],
      detail: {
        mainImgs: [],
        summary: '',
        content: '',
        activeStart: formatDate(new Date(), 'yyyy-MM-dd'),
        activeEnd: formatDate(new Date(), 'yyyy-MM-dd'),
        sortNo: 99,
        voucher: [],
        activestate: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      options: [{ value: 1, label: '购买首单累计' }],
      rules: {
        title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
        buyNumber: [{ required: true, message: '请输入周期首单数', trigger: 'blur' }],
        buyMoney: [{ required: true, message: '请输入首单满足金额', trigger: 'blur' }],
        buytype: [{ required: true, message: '请选择活动类型', trigger: 'change' }]
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this._detail()
    }
  },
  methods: {
    _detail() {
      let params = {
        id: this.$route.query.id
      }
      GetBuyActDetail(params).then(
        res => {
          if (res.success) {
            this.detail = res.data
            if (res.data.images.url) {
              this.detail.mainImgs = []
              if (res.data.images !== null && res.data.images.url !== '') {
                this.detail.mainImgs.push({ url: this.detail.mainImgs.url })
              }
            }
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    _submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._option(this.$route.query.action)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 增删改
    _option(action) {
      this.detail.buyNumber = parseInt(this.detail.buyNumber)
      this.detail.buyMoney = parseInt(this.detail.buyMoney)
      if (this.detail.voucher === []) {
        this.$message.warning('请选择卡劵')
        return false
      }
      let params = {
        dto: this.detail,
        action: action
      }
      console.log(params)
      GetBuyActOption(params).then(
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
    },
    // 打开或关闭产品选择器
    handleCardSelect(flag) {
      // console.log(flag)
      if (flag) {
        this.selectedList = this.detail.voucher
      } else {
        // 关闭产品选择器，初始化数据
        this.selectedList = []
      }
      this.isShowCardSelect = flag
    },
    // 保存选中的商品
    saveSelectedVirtual(newSelectedList) {
      // let list = []
      // newSelectedList.forEach(v => {
      //   var index = 0
      //   let obj = {
      //     id: ++index,
      //     coupon: v._id,
      //     title: v.title
      //     // getLimit: v.getLimit,
      //     // quantity: v.quantity,
      //     // useLimit: v.useLimit
      //   }
      //   list.push(obj)
      // })
      this.detail.voucher[0] = newSelectedList
      let index = 0
      this.detail.voucher = this.detail.voucher.map(v => {
        return {
          id: ++index,
          coupon: v._id,
          title: v.title
        }
      })
      this.handleCardSelect(false)
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.detail[txt] = fileList
      } else {
        this.detail[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.detail[txt]) {
          this.$set(this.detail, txt, [])
        }
        this.detail[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.detail[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  components: {
    myUpload,
    exchangeCardSelect
  }
}
</script>

<style lang="scss" scoped>
.details {
  height: 100vh;
  overflow-y: scroll;
}
</style>
