<template>
    <div class="container-detail">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <detail></detail>
        </el-tab-pane>
        <!-- <el-tab-pane label="内容评价" name="second"><cms-comments></cms-comments></el-tab-pane> -->
      </el-tabs>
    </div>
</template>

<script type="text/ecmascript-6">
  import Detail from './component/detail'
  import CmsComments from '@/components/cms-comments'
    export default {
      data() {
        return {
          activeName: 'first'
        }
      },
      components: {
        Detail, CmsComments
      }
    }
</script>

<style lang="scss" scoped>
.container-detail{
  /*position: fixed;*/
  /*z-index: 999;*/
  /*top: 0;*/
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  background-color: #ffffff;
  padding: 0 20px 60px;
  .msg-submit{
    position: fixed;
    bottom: 40px;
  }
}
</style>
