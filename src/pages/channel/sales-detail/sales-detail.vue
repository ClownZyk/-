<template>
  <div class="sales-detail">
    <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first"><base-info></base-info></el-tab-pane>
        <el-tab-pane label="用户" name="second"><user></user></el-tab-pane>
        <el-tab-pane label="提现记录" name="third"><withdrawal></withdrawal></el-tab-pane>
        <el-tab-pane label="分润记录" name="fourth"><benefit></benefit></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import baseInfo from './components/base-info'
import benefit from './components/benefit'
import user from './components/user'
import withdrawal from './components/withdrawal'
export default {
    name: 'sales-detail',
    data() {
        return {
            activeName: 'first'
        }
    },
    components: {
        baseInfo,
        benefit,
        user,
        withdrawal
    }
}
</script>

<style scoped lang="scss">
    // .sales-detail{
    //     position: fixed;
    //     width: calc(100% - 240px);
    //     height: calc(100vh - 90px);
    //     background-color: #ffffff;
    //     overflow: scroll;
    // }
</style>
