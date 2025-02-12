<template>
  <div class="vote-item-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info :form="form"
                   :formDisabled="formDisabled"
                   :submitLoading="submitLoading"
                   :loading="loading"
                   :disabledSubmit="disabledSubmit"
                   :operateTitle="operateTitle"
                   :operateAction="operateAction"
                   @formSubmit="formSubmit"
                   @handleDisabledSubmit="handleDisabledSubmit">
        </base-info>
      </el-tab-pane>
      <el-tab-pane label="内容详情" name="second">
        <my-editor style="width: calc(100% - 40px);height: 80vh;" @input="onEditorBlur($event)" :value="form.content"></my-editor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {VoteObjectOperation, VoteObjectGetDetails} from '@/api/system'
import baseInfo from './components/base-info'
import MyEditor from '@/components/my-editor'
export default {
  name: 'vote-item-detail',
  data() {
    return {
      activeName: 'first',
      // 表单数据
      form: {},
      // 是否禁用form
      formDisabled: false,
      // 控制是否显示提交按钮的loading
      submitLoading: false,
      // 控制是否显示加载的loading
      loading: false,
      // 是否禁用提交按钮
      disabledSubmit: false,
      // 当前操作名称
      operateTitle: '',
      // 当前操作标识
      operateAction: 0
    }
  },
  components: {
    baseInfo,
    MyEditor
  },
  methods: {
    // 富文本内容
    onEditorBlur (val) {
      this.form.content = val
    },
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
    },
    async init () {
      if (this.$route.query.voteItemId !== undefined) {
        if (this.$route.query.operate !== undefined && this.$route.query.operate === 'view') {
          // 说明是查看
          this.formDisabled = true
          this.disabledSubmit = true
        }
        // 说明是编辑
        this.operateTitle = '编辑'
        this.operateAction = 1
        let parmas = {
          _id: this.$route.query.voteItemId
        }
        await VoteObjectGetDetails(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.mainImgs = []
              if (this.form.mainImg !== null && this.form.mainImg.url !== '') {
                  this.form.mainImgs.push({url: this.form.mainImg.url})
              }
            } else {
                this.$message.error(res.msg)
            }
        }, err => {
            this.$message.error(err.msg)
        })
      }
      this.loading = false
    },
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push({path: '/vote-detail', query: {id: this.$route.query.voteActivityId, activityName: this.$route.query.voteActivityName}})
    },
    // 提交表单
    formSubmit: function () {
      this.submitLoading = true
      // 设置创建人、角色ID、cid
      this.$set(this.form, 'creater', this.$store.state.UserID)
      this.$set(this.form, 'roleid', this.$store.state.UserRole)
      this.$set(this.form, 'cid', this.$store.state._cid)
      this.$set(this.form, 'activityId', this.$route.query.voteActivityId)
      this.$set(this.form, 'activityName', this.$route.query.voteActivityName)
      let params = {
          Dto: Object.assign({}, this.form),
          Action: this.operateAction
      }
      VoteObjectOperation(params).then(res => {
          this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
          })
          this.clear()
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
