const panAwardTypes = [
  { value: 1, label: '卡券' },
  { value: 2, label: 'VIP会员卡' },
  { value: 3, label: '储值金' },
  { value: 99, label: '未中奖' }
]
const panCardTypes = [
  { value: 0, label: '兑换券' },
  { value: 1, label: '代金券' },
  { value: 2, label: '折扣券' },
  { value: 3, label: '大小券' }
]
const allotOnlyStatus = [
  { value: 1, label: '未完成' },
  { value: 2, label: '已完成' },
  { value: 3, label: '已作废' }
]
const attribute = [
  { value: 0, label: '全部属性' },
  { value: 1, label: '直营店' },
  { value: 2, label: '加盟店' },
  { value: 3, label: '联营店' },
  { value: 4, label: '联盟店' }
]
const shopType = [
  { value: 1, label: '园区店' },
  { value: 2, label: '景区品牌店' }
]
const shopState = [
  { value: 1, label: '营业中' },
  { value: 2, label: '闭店中' },
  { value: 3, label: '停业中' }
]
const checkType = [
  { value: 0, label: '已盘' },
  { value: 1, label: '未盘' }
]
const allotProductType = [
  { value: 1, label: '标准产品' },
  { value: 2, label: '散称产品' },
  { value: 3, label: '自制餐食产品' },
  { value: 4, label: '原料产品' },
  { value: 5, label: '自制饮品产品' }
]
const manageRange = [
  { value: 1, label: '云极小超零售' },
  { value: 2, label: '云极小食堂餐食' },
  { value: 3, label: '云极咖啡饮品' },
  { value: 4, label: '云极自助零售柜' }
]
const shopManageRange = [
  { value: 1, label: '云极小超零售' },
  { value: 2, label: '云极小食堂餐食' },
  { value: 3, label: '云极咖啡饮品' },
  { value: 4, label: '云极小超团购' }
]
const payTypeState = [
  { value: 99, label: '所有支付方式' },
  { value: 0, label: '微信支付' },
  { value: 1, label: '支付宝支付' },
  { value: 2, label: '余额支付' },
  { value: 3, label: '现金支付' },
  { value: 4, label: '银行卡支付' },
  { value: 11, label: '西银惠付' },
  { value: 14, label: '通联支付' },
  { value: 15, label: '通联收款码' },
  { value: 16, label: '美团外卖' },
  { value: 17, label: '宁波银行易收宝' },
  { value: 18, label: '微信收款码' },
  { value: 19, label: '工银数币' },
  { value: 20, label: '企业购付款' },
  { value: 21, label: '宁波银行收款码' },
  { value: 22, label: '自助售卖机' },
  { value: 23, label: '食膳坊' },
  { value: 24, label: '收款码' },
  { value: 25, label: '饿了么外卖' },
  { value: 26, label: '纸质兑换券' },
  { value: 27, label: '云点卡' },
  { value: 28, label: '免费招待' },
  { value: 29, label: '记账云点卡' },
  { value: 30, label: '腾讯数币' },
  { value: 31, label: '拉卡拉' }
]
const orderTypeState = [
  { value: 0, label: '全部订单状态' },
  { value: 1, label: '待发货' },
  { value: 2, label: '待收货' },
  { value: 3, label: '待评价' },
  { value: 4, label: '退款中' },
  { value: 5, label: '已退款' },
  { value: 6, label: '已完成' },
  { value: 7, label: '拒绝退款' },
  { value: 8, label: '待接单' },
  { value: 9, label: '取消支付' },
  { value: 10, label: '支付失败' },
  { value: 11, label: '待取货' },
  { value: 12, label: '配送中' },
  { value: 13, label: '制作中' }
]
const orderPresentState = [
  { value: 1, label: '订单失败' },
  { value: 2, label: '卡劵已领取' },
  { value: 3, label: '待发货' },
  { value: 4, label: '配送中' },
  { value: 5, label: '已完成' }
]
const payState = [
  { value: '', label: '所有支付状态' },
  { value: 'ok', label: '支付成功' },
  { value: 'fail', label: '支付失败' },
  { value: 'cancel', label: '取消支付' },
  { value: 'prepay', label: '待支付' },
  { value: 'error', label: '错误订单' }
]
const formatDisCount = [
  { value: 0, label: '抹零' },
  { value: 1, label: '折扣' },
  { value: 2, label: '优惠金额' },
  { value: 3, label: '微信卡劵' }
]
const orderSource = [
  { value: '', label: '全部来源' },
  { value: '在店购买', label: '在店购买' },
  { value: '自助购买', label: '自助购买' },
  { value: '小程序', label: '小程序' }
]
const supplyOrderState = [
  { value: 1, label: '未推送' },
  { value: 2, label: '已完成' },
  { value: 3, label: '已推送' },
  { value: 4, label: '已撤回' },
  { value: 5, label: '待入库' },
  { value: 6, label: '已驳回' },
  { value: 7, label: '已出库' }
]
const taskType = [
  { value: 1, label: '开闭店' },
  { value: 2, label: '日清任务' },
  { value: 3, label: '周清任务' },
  { value: 4, label: '月清任务' },
  { value: 5, label: '开店协同任务' },
  { value: 6, label: '协同任务' }
]
const taskArrangeType = [
  { value: 1, label: '团体任务' },
  { value: 2, label: '个人任务' }
]
const taskState = [
  { value: 0, label: '全部状态' },
  { value: 1, label: '未完成' },
  { value: 2, label: '已完成' },
  { value: 3, label: '待审核' }
]
const discountType = [
  { value: -1, label: '所有优惠类型' },
  { value: 0, label: '抹零优惠' },
  { value: 1, label: '打折优惠' },
  { value: 2, label: '金额优惠' },
  { value: 5, label: '无优惠' }
]
const vendingOrderState = [
  { value: 0, label: '所有订单状态' },
  { value: 1, label: '购物中' },
  { value: 2, label: '待结算' },
  { value: 3, label: '已完成' },
  { value: 4, label: '签约扣款失败|待扣款' },
  { value: 5, label: '异常支付失败' },
  { value: 6, label: '开门中' }
]
const vendingOrderRefundState = [
  { value: 0, label: '--' },
  { value: 1, label: '退款中' },
  { value: 2, label: '已退款' },
  { value: 3, label: '拒绝退款' }
]
const handleStatusList = [
  { value: 1, label: '本地识别正常' },
  { value: 2, label: '本地识别失败' },
  { value: 3, label: '云端识别完成' },
  { value: 4, label: '云端识别失败' }
]
const hardwareExList = [
  { value: 'CAMERA', label: '摄像头异常' },
  { value: 'GRAVITY', label: '重感异常' },
  { value: 'FOREIGN_INVASION', label: '异物入侵' },
  { value: 'NETWORK', label: '网络异常' }
]
const shopMoveList = [
  { value: 1, label: '门未开' },
  { value: 2, label: '门开无动作' },
  { value: 3, label: '门开有动作' }
]
const abnormalReasonsList = [
  { value: 'CAMERA_EX', label: '摄像头异常' },
  { value: 'GRAVITY_EX', label: '重感不准' },
  { value: 'FOREIGN_INVASION', label: '异物入侵' },
  { value: 'UNKNOWN_ITEM', label: '未知商品' },
  { value: 'OTHER', label: '其他' }
]
const procureType = [
  { value: 1, label: '零售产品' },
  { value: 2, label: '称重产品' },
  { value: 3, label: '原料产品' },
  { value: 4, label: '耗材产品' }
]
export default {
  data() {
    return {
      panAwardTypes,
      panCardTypes,
      allotOnlyStatus,
      attribute,
      shopType,
      shopState,
      checkType,
      allotProductType,
      manageRange,
      payTypeState,
      orderTypeState,
      orderPresentState,
      payState,
      formatDisCount,
      orderSource,
      supplyOrderState,
      taskType,
      taskArrangeType,
      taskState,
      discountType,
      vendingOrderState,
      vendingOrderRefundState,
      handleStatusList,
      hardwareExList,
      shopMoveList,
      abnormalReasonsList,
      shopManageRange,
      procureType
    }
  },
  filters: {
    cardNumberReplace(str) {
      return str.replace(/^(.{2}).*(.{3})$/, '$1*****$2')
    },
    filterTime(time) {
      return time && time.split(' ')[0]
    },
    payTypeStateFilter(val) {
      let str = payTypeState.find(v => v.value === val) ? payTypeState.find(v => v.value === val).label : ''
      return str
    },
    orderTypeStateFilter(val) {
      let str = orderTypeState.find(v => v.value === val) ? orderTypeState.find(v => v.value === val).label : ''
      return str
    },
    orderPresentStateFilter(val) {
      let str = orderPresentState.find(v => v.value === val) ? orderPresentState.find(v => v.value === val).label : ''
      return str
    },
    payStateFilter(val) {
      let str = payState.find(v => v.value === val) ? payState.find(v => v.value === val).label : ''
      return str
    },
    formatDisCountFilter(val) {
      let str = formatDisCount.find(v => v.value === val) ? formatDisCount.find(v => v.value === val).label : '其它优惠'
      return str
    },
    manageRange2Str(val) {
      let str = manageRange.find(v => v.value === val) ? manageRange.find(v => v.value === val).label : ''
      return str
    },
    manageRangeFilter(arr) {
      let filterArr = manageRange.filter(item => {
        return arr.find(val => val === item.value)
      })
      let str = filterArr.map(item => item.label).join('，')
      return str
    },
    allotProductType2Str(val) {
      let str = allotProductType.find(v => v.value === val) ? allotProductType.find(v => v.value === val).label : ''
      return str
    },
    panAwardTypes2Str(val) {
      let str = panAwardTypes.find(v => v.value === val) ? panAwardTypes.find(v => v.value === val).label : ''
      return str
    },
    panCardTypes2Str(val) {
      let str = panCardTypes.find(v => v.value === val) ? panCardTypes.find(v => v.value === val).label : ''
      return str
    },
    supplyOrderStateToString(val) {
      let str = supplyOrderState.find(v => v.value === val) ? supplyOrderState.find(v => v.value === val).label : ''
      return str
    },
    allotOnlyStatus(val) {
      let str = allotOnlyStatus.find(v => v.value === val) ? allotOnlyStatus.find(v => v.value === val).label : ''
      return str
    },
    attributeFilter(val) {
      let str = attribute.find(v => v.value === val) ? attribute.find(v => v.value === val).label : ''
      return str
    },
    shopTypeFilter(val) {
      let str = shopType.find(v => v.value === val) ? shopType.find(v => v.value === val).label : ''
      return str
    },
    shopStateFilter(val) {
      let str = shopState.find(v => v.value === val) ? shopState.find(v => v.value === val).label : ''
      return str
    },
    taskTypeFilter(val) {
      let str = taskType.find(v => v.value === val) ? taskType.find(v => v.value === val).label : ''
      return str
    },
    taskArrangeTypeFilter(val) {
      let str = taskArrangeType.find(v => v.value === val) ? taskArrangeType.find(v => v.value === val).label : ''
      return str
    },
    vendingOrderStateFilter(val) {
      let str = vendingOrderState.find(v => v.value === val) ? vendingOrderState.find(v => v.value === val).label : ''
      return str
    },
    vendingOrderRefundStateFilter(val) {
      let str = vendingOrderRefundState.find(v => v.value === val) ? vendingOrderRefundState.find(v => v.value === val).label : ''
      return str
    },
    handleStatusListFilter(val) {
      let str = handleStatusList.find(v => v.value === val) ? handleStatusList.find(v => v.value === val).label : ''
      return str
    },
    hardwareExListFilter(val) {
      let str = hardwareExList.find(v => v.value === val) ? hardwareExList.find(v => v.value === val).label : ''
      return str
    },
    shopMoveListFilter(val) {
      let str = shopMoveList.find(v => v.value === val) ? shopMoveList.find(v => v.value === val).label : ''
      return str
    },
    abnormalReasonsFilters(arr) {
      let filterArr = abnormalReasonsList.filter(item => {
        return arr.find(val => val === item.value)
      })
      let str = filterArr.map(item => item.label).join('，')
      return str
    },
    procureTypeFilter(val) {
      let str = procureType.find(v => v.value === val) ? procureType.find(v => v.value === val).label : ''
      return str
    }
  }
}
