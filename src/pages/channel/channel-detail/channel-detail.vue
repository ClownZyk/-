<template>
  <div class="channel-detail">
    <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first"><base-info></base-info></el-tab-pane>
        <el-tab-pane label="合伙人" name="second"><partner></partner></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import baseInfo from './components/base-info'
import partner from './components/partner'
export default {
    name: 'channel-detail',
    data() {
        return {
            activeName: 'first'
        }
    },
    components: {
        baseInfo,
        partner
    }
}
</script>

<style scoped lang="scss">
    // .channel-detail{
    //     position: fixed;
    //     width: calc(100% - 240px);
    //     height: calc(100vh - 90px);
    //     background-color: #ffffff;
    //     overflow: scroll;
    // }
</style>
