<template>
  <category-main belongMenu="/property-category" class="category-main"></category-main>
</template>

<script>
import categoryMain from '@/components/category/category-main.vue'

export default {
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
