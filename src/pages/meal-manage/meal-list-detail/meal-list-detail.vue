<template>
  <div class="detail">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="基础信息" name="first"> <detail :detail="detail" :dialog="dialog" @operateMsku="operateMsku"></detail> </el-tab-pane>
      <el-tab-pane label="内容详情" name="second"> <my-editor style="width: calc(100% - 40px);height: 80vh;" @input="onEditorBlur($event)" :value="detail.detail"></my-editor> </el-tab-pane>
    </el-tabs>
    <el-button type="primary" style="margin-top: 20px;" @click="_option">保存</el-button>
  </div>
</template>

<script>
import MyEditor from '@/components/my-editor'
import Detail from './component/detail'
import { MProdOperation, MealsProductId } from '@/api/system'
export default {
  data() {
    return {
      activeName: 'first',
      dialog: {},
      detail: {
        mainImg: {},
        msku: [],
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      Txt: ''
    }
  },
  mounted() {
    if (this.$route.query.action === 0 || this.$route.query.action === undefined) {
    } else {
      this._detail()
    }
  },
  methods: {
    onEditorBlur(event) {
      this.detail.detail = event
    },
    // 详情
    _detail() {
      let params = {
        _id: this.$route.query.id
      }
      MealsProductId(params).then(
        res => {
          if (res.success) {
            this.detail = res.data
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 增删改
    _option() {
      this.$route.query.action === 1 ? (this.Txt = '修改') : (this.Txt = '新增')
      this.$confirm('确认' + this.Txt + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.detail.msku.length === 0) {
          this.$message.error('请添加产品')
          return false
        }
        let params = {
          dto: this.detail,
          action: this.$route.query.action
        }
        // console.log(this.detail)
        MProdOperation(params).then(
          res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.$router.push('../meal-list')
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      })
    },
    operateMsku(dto) {
      if (!dto) {
        this.dialog = {}
      } else {
        this.dialog = dto
        this.dialog.Headimgs = []
        if (dto.img !== null && dto.img.url !== '') {
          this.dialog.Headimgs.push({ url: dto.img.url })
        }
      }
    }
  },
  components: {
    MyEditor,
    Detail
  }
}
</script>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
}
</style>
