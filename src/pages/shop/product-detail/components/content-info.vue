<template>
  <my-editor @input="onEditorBlur($event)" :value="initValue"></my-editor>
</template>

<script>
import {ShopGetDetailById} from '@/api/system'
import MyEditor from '@/components/my-editor'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      initValue: ''
    }
  },
  computed: {
    ...mapState(['vShopProduct'])
  },
  components: {
    MyEditor
  },
  methods: {
    async init () {
      if (this.$route.query.id) {
        let parmas = {
          _id: this.$route.query.id
        }
        this.loading = true
        await ShopGetDetailById(parmas).then(res => {
            if (res.success) {
              this.loading = false
              if (res.data.content) {
                this.initValue = res.data.content
                this.$store.commit('setVShopProductContent', res.data.content)
              }
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
    },
    onEditorBlur (event) {
      this.$store.commit('setVShopProductContent', event)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
