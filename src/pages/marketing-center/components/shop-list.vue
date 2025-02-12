<template>
  <el-dialog
    title="提示"
    :visible.sync="isShopList"
    width="1000px">
    <el-table :data="shopList" border class="table">
      <el-table-column type="selection" align="center" width="50"></el-table-column>
      <el-table-column label="编号" align="center" type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="商店名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="add" align="center" label="地址" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="shoper" align="center" label="店长" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tel" align="center" label="联系方式" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="isShopList = false">取 消</el-button>
    <el-button type="primary" @click="isShopList = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
      props: {
        isShopList: Boolean
      },
      data() {
        return {
          shopList: [
            {name: '云极小超', add: '车城产业园', shoper: '刘佳', tel: '18331432214'}
          ]
        }
      }
    }
</script>

<style scoped>

</style>
