<template>
  <el-tabs v-model="tabIndex" class="tabs">
    <el-tab-pane label="基本信息" name="first">
      <base-setting></base-setting>
    </el-tab-pane>
    <el-tab-pane label="关注时回复" name="second">
      <attention-replay></attention-replay>
    </el-tab-pane>
    <el-tab-pane label="默认回复" name="third">
      <default-replay></default-replay>
    </el-tab-pane>
    <el-tab-pane label="文本回复" name="fourth">
      <text-replay></text-replay>
    </el-tab-pane>
    <el-tab-pane label="图文回复" name="fifth">
      <img-text-replay></img-text-replay>
    </el-tab-pane>
  </el-tabs>
</template>

<script type='text/ecmascript-6'>
import baseSetting from './components/base-setting'
import attentionReplay from './components/attention-replay'
import defaultReplay from './components/default-replay'
import textReplay from './components/text-replay'
import imgTextReplay from './components/img-text-replay'
export default {
    name: 'wx-main-config',
    components: {
        baseSetting,
        attentionReplay,
        defaultReplay,
        textReplay,
        imgTextReplay
    },
    data() {
        return {
            tabIndex: 'first'
        }
    }
}
</script>

<style lang="scss" scoped>
  .tabs {
    padding: 20px;
  }
</style>
