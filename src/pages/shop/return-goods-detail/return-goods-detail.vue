<template>
  <div class="return-goods-detail">
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
    </el-tabs>
  </div>
</template>

<script>
import {RefoundUpdateReply, RefoundGetOrderDetail} from '@/api/system'
import baseInfo from './components/base-info'
export default {
  name: 'return-goods-detail',
  data() {
    return {
      activeName: 'first',
      // 医院列表
      hospitalList: [],
      // 表单数据
      form: {
        oriOrder: {
          sendInfo: {
            receiverInfo: {}
          }
        }
      },
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
    baseInfo
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.disabledSubmit = val
    },
    async init () {
      if (this.$route.query.id !== undefined) {
        if (this.$route.query.operate !== undefined && this.$route.query.operate === 'view') {
          // 说明是查看
          this.formDisabled = true
          this.disabledSubmit = true
        }
        // 说明是编辑
        this.operateTitle = '编辑'
        this.operateAction = 1
        let parmas = {
          _id: this.$route.query.id
        }
        await RefoundGetOrderDetail(parmas).then(res => {
            if (res.success) {
              this.form = res.data
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
      this.$router.push('/return-goods')
    },
    // 提交表单
    formSubmit: function () {
      this.submitLoading = true
      let parmas = {
        remark: this.form.remark,
        replyContent: this.form.replyContent,
        state: this.form.state,
        _id: this.form._id
      }
      RefoundUpdateReply(parmas).then(res => {
          this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
          })
          this.clear()
      }).catch(() => {
        this.submitLoading = false
        this.disabledSubmit = false
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
