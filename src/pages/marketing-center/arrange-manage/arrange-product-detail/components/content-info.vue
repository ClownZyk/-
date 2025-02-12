<template>
  <my-editor style="position: fixed; width: 80%; height: 80%;" @input="onEditorBlur($event)" :value="initValue"></my-editor>
</template>

<script>
import {ReserveProductId} from '@/api/system'
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
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        this.loading = true
        await ReserveProductId(parmas).then(res => {
            if (res.success) {
              this.loading = false
              if (res.data.content !== undefined && res.data.content !== '') {
                this.initValue = res.data.content
                this.$store.commit('setVShopProductContent', res.data.content)
              }
            } else {
                this.$message.error(res.msg)
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
    },
    onEditorBlur (event) {
      this.$store.commit('setVShopProductContent', event)
      // console.log('这3' + JSON.stringify(this.vShopProduct))
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
