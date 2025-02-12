<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form ref="pan-form" :model="panForm" label-position="top" label-suffix="：" size="medium">
      <el-form-item label="活动名称" required> <el-input v-model="panForm.title" placeholder="请出入本次大转盘活动的名称"></el-input> </el-form-item>
      <el-form-item label="活动时间" required>
        <el-date-picker v-model="panForm.timeRange" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy/MM/dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="中奖后多少天领取（0为无限制）"> <el-input-number v-model="panForm.day" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
      <el-form-item label="独立帐号参与次数（0为无限制）"> <el-input-number v-model="panForm.attend" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="奖品设置"> <el-button type="success" size="medium" @click="addAwardsItem">添加奖品</el-button> </el-form-item>
    </el-form>
    <el-tabs v-model="activeTabIndex" type="card" closable @tab-remove="onTabRemove">
      <el-tab-pane v-for="item in awardsList" :key="item.jiangPinValue" :label="item.jiangPinLevel" :name="item.jiangPinValue">
        <el-form>
          <el-form-item label="奖项名称" required> <el-input v-model="item.jiangPinLevel" placeholder="请出入此奖项名称"></el-input> </el-form-item>
          <el-form-item label="奖品类型" required>
            <el-select v-model="item.jiangPinType" placeholder="请选择奖品类型" @change="onPanAwardTypesChange($event, item)">
              <el-option v-for="item in panAwardTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡券类型" v-if="item.jiangPinType === 1" required>
            <el-select v-model="item.cardType" placeholder="请选择奖品类型" @change="onPanCardTypesChange($event, item)">
              <el-option v-for="item in panCardTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="item.cardId" placeholder="请选择卡券" :disabled="item.chooseCardList.length <= 0">
              <el-option v-for="item in item.chooseCardList" :key="item._id" :label="item.title" :value="item._id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员天数" v-if="item.jiangPinType === 2" required> <el-input-number v-model="item.vipDayss" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
          <el-form-item label="储值金额" v-if="item.jiangPinType === 3" required> <el-input-number v-model="item.moneyQuota" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
          <el-form-item label="奖品名称" required> <el-input v-model="item.jiangPinName" placeholder="请出入此奖品名称"></el-input> </el-form-item>
          <el-form-item label="获奖概率"> <el-input-number v-model="item.gailv" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
          <el-form-item label="获奖数量（0为无限制）"> <el-input-number v-model="item.count" :step="1" step-strictly :min="0"></el-input-number> </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" size="medium" @click="submitPanForm" :disabled="!canSubmitBtn">编辑转盘活动</el-button>
  </div>
</template>
<script>
import myUpload from '@/components/my-upload'
import Filters from '@/components/js/Filters'
import { GetAllCardByPage, panOperation, ZhuanPanDetail } from '@/api/system'
const awardsItem = {
  jiangPinLevel: '',
  jiangPinType: '',
  cardType: '',
  cardId: '',
  vipDayss: 0,
  jiangPinName: '',
  gailv: 0,
  count: 0,
  moneyQuota: 0,
  prizeCount: 0,
  chooseCardList: []
}
export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  data() {
    return {
      activeTabIndex: '',
      panForm: {
        title: '',
        attend: 3,
        day: 0,
        isShow: true,
        timeRange: [],
        beginTime: '',
        endTime: ''
      },
      awardsList: [],
      chooseCardList: []
    }
  },
  watch: {
    'panForm.timeRange'(val) {
      this.panForm.beginTime = val[0]
      this.panForm.endTime = val[1]
    }
  },
  computed: {
    canSubmitBtn() {
      if (!this.panForm.title || !this.panForm.beginTime || !this.panForm.endTime) {
        return false
      }
      if (this.awardsList.length <= 0) {
        return false
      }
      if (
        this.awardsList.findIndex(v => {
          if (!v.jiangPinType || !v.jiangPinName) {
            return true
          }
          if (v.jiangPinType === 1) {
            if (v.cardType === '' || !v.cardId) {
              return true
            }
          } else if (v.jiangPinType === 2) {
            if (!v.vipDayss) {
              return true
            }
          } else if (v.jiangPinType === 3) {
            if (!v.moneyQuota) {
              return true
            }
          }
          return false
        }) !== -1
      ) {
        return false
      }
      return true
    }
  },
  created() {
    if (!this.$route.query.editId) {
      this.$router.back()
      return false
    }
    this.getPanDetail()
  },
  methods: {
    getPanDetail() {
      let param = {
        _id: this.$route.query.editId
      }
      ZhuanPanDetail(param).then(ret => {
        let { _id, title, attend, day, isShow, beginTime, endTime, jiangPin } = ret.data
        this.panForm = {
          _id,
          title,
          attend,
          day,
          isShow,
          timeRange: [beginTime, endTime]
        }
        this.activeTabIndex = jiangPin[0].jiangPinLevel
        this.awardsList = jiangPin.map(item => {
          return {
            ...item,
            jiangPinValue: item.jiangPinLevel,
            chooseCardList: []
          }
        })
        this.awardsList.map(item => {
          if (item.jiangPinType === 1) {
            this.getCardsList(item.cardType, item)
          }
        })
      })
    },
    onPanAwardTypesChange(val, item) {
      item.cardId = ''
      item.cardType = ''
      item.vipDayss = 0
      item.moneyQuota = 0
    },
    onPanCardTypesChange(val, item) {
      item.cardId = ''
      this.getCardsList(val, item)
    },
    getCardsList(cardType, item) {
      let param = {
        cardType,
        IsPage: false,
        Creater: this.$store.state.UserID,
        RoleId: this.$store.state.UserRole,
        Cid: this.$store.state._cid
      }
      GetAllCardByPage(param).then(ret => {
        item.chooseCardList = ret.data
      })
    },
    onTabRemove(ret) {
      if (this.awardsList.findIndex(v => v.jiangPinValue === ret) !== -1) {
        this.awardsList.splice(this.awardsList.findIndex(v => v.jiangPinValue === ret), 1)
      }
    },
    addAwardsItem() {
      let awardItemTitle = generateAwardName(this.awardsList)
      this.awardsList.push(
        JSON.parse(
          JSON.stringify({
            ...awardsItem,
            jiangPinLevel: awardItemTitle,
            jiangPinValue: awardItemTitle
          })
        )
      )
      this.activeTabIndex = awardItemTitle
    },
    submitPanForm() {
      let param = {
        dto: {
          ...this.panForm,
          jiangPin: this.awardsList,
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid
        },
        action: 1
      }
      panOperation(param).then(() => {
        this.$notify({
          title: '编辑成功',
          message: '已完成编辑一个大转盘活动',
          type: 'success',
          duration: 1200,
          onClose: () => {
            this.$router.back()
          }
        })
      })
    }
  }
}
function generateAwardName(list) {
  let n = list.length + 1
  let ret = ''
  ;(function fn() {
    if (list.find(v => v.jiangPinValue === '奖项' + n)) {
      fn(list, ++n)
    } else {
      ret = '奖项' + n
    }
  })()
  return ret
}
</script>
