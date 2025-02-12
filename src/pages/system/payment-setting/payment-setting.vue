<template>
  <div class="page-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="微信支付" name="first"><wechat-pay-setting></wechat-pay-setting></el-tab-pane>
      <el-tab-pane label="支付宝" name="second"><alipay-setting></alipay-setting></el-tab-pane>
      <el-tab-pane label="富友支付" name="third"><fuiou-setting></fuiou-setting></el-tab-pane>
      <el-tab-pane label="通联支付" name="four"><allin-setting></allin-setting></el-tab-pane>
      <el-tab-pane label="西银惠付" name="fifth"><west-setting></west-setting></el-tab-pane>
      <el-tab-pane label="宁波银行易收宝" name="sixth"><ningbo-setting></ningbo-setting></el-tab-pane>
      <el-tab-pane label="拉卡拉支付" name="seventh"><lakala-setting></lakala-setting></el-tab-pane>
      <el-tab-pane label="支付配置" name="eighth"><pay-config></pay-config></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import wechatPaySetting from './components/wechat-pay-setting'
import alipaySetting from './components/alipay-setting'
import fuiouSetting from './components/fuiou-setting'
import allinSetting from './components/allin-setting'
import westSetting from './components/west-setting'
import ningboSetting from './components/ningbo-setting'
import lakalaSetting from './components/lakala-setting'
import payConfig from './components/pay-config'

export default {
  name: 'payment-setting',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    wechatPaySetting,
    alipaySetting,
    fuiouSetting,
    allinSetting,
    westSetting,
    ningboSetting,
    lakalaSetting,
    payConfig
  }
}
</script>

<style lang="scss" scoped></style>
