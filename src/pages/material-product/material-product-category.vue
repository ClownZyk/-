<template>
  <category-main belongMenu="/material-product-category" class="category-main"></category-main>
</template>

<script type="text/ecmascript-6">
import categoryMain from '@/components/category/category-main.vue'
export default {
  name: 'material-product-category',
  components: {
    categoryMain
  }
}
</script>

<style lang="scss" scoped>
.category-main {
  padding: 20px;
}
</style>
