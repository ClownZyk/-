<template>
    <category-main belongMenu="/cms" class="category-main"></category-main>
</template>

<script type="text/ecmascript-6">
import categoryMain from '@/components/category/category-main.vue'
export default {
    name: 'cms-category',
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
