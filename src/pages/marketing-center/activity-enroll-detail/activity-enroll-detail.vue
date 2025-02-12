<template>
  <div class="activity-enroll-detail">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <base-info :form="form"
                   :categoryList="categoryList"
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
import {ActivityEnrollOperation, GetAllCategory, ActivityEnrollGetDetailById} from '@/api/system'
import baseInfo from './components/base-info'
import MyEditor from '@/components/my-editor'
export default {
  name: 'activity-enroll-detail',
  data() {
    return {
      activeName: 'first',
      // 表单数据
      form: {},
      // 活动分类列表
      categoryList: [],
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
        await ActivityEnrollGetDetailById(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              // 将已上传图片，存到一个新数组放在该条数据内
              this.form.mainImgs = []
              if (this.form.mainImg !== null && this.form.mainImg.url !== '') {
                  this.form.mainImgs.push({url: this.form.mainImg.url})
              }
              // 获取categoryIds
              if (this.categoryList.length > 0 && this.form.categoryId) {
                this.form.categoryIds = []
                this.getCategoryIds(this.categoryList, this.form.categoryId)
              }
              // 控制坐标
              if (this.form.coordinates && this.form.coordinates.length > 0) {
                this.form.coordinatesX = this.form.coordinates[0]
                this.form.coordinatesY = this.form.coordinates[1]
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
    // 根据categoryId获取categoryIds
    getCategoryIds (list, opt) {
      try {
        this._getCategoryIds(list, opt)
      } catch (e) {
        // console.log(that.form.categoryIds)
      }
    },
    _getCategoryIds (list, opt) {
      let that = this
      list.forEach(val => {
        that.form.categoryIds.push(val.value)
        if (val.value === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw ('break all')
        } else if (val.children && val.children.length > 0) {
          // 判断是否还有子项
          that._getCategoryIds(val.children, opt)
          // 如果子项循环完还是没有跳出循环，删除父级
          that.form.categoryIds.pop()
        } else {
          // 没有子项，直接删除当前节点
          that.form.categoryIds.pop()
        }
      })
    },
    // 加载活动分类
    async GetAllCategory () {
      this.loading = true
      let params = {
        belongMenu: '/activity-enroll-category',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await GetAllCategory(params).then(res => {
        if (res.success) {
          this.categoryList = res.data
          this.init()
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 各种清空
    clear: function () {
      this.submitLoading = false
      this.disabledSubmit = false
      this.$router.push('/activity-enroll')
    },
    // 提交表单
    formSubmit: function () {
      if (!this.form.content) {
        this.$message({
          message: '内容详情不能为空',
          type: 'warning'
        })
        this.submitLoading = false
        this.disabledSubmit = false
        return false
      }
      this.submitLoading = true
      // 设置创建人、角色ID、cid
      this.$set(this.form, 'creater', this.$store.state.UserID)
      this.$set(this.form, 'roleid', this.$store.state.UserRole)
      this.$set(this.form, 'cid', this.$store.state._cid)
      let categoryIds = this.form.categoryIds
      if (categoryIds.length > 0) {
        // console.log(categoryIds[categoryIds.length-1])
        this.form.categoryId = categoryIds[categoryIds.length - 1]
      }
      if (!this.form.coordinates) {
        this.form.coordinates = []
      }
      this.form.coordinates.splice(0, 1, this.form.coordinatesX)
      this.form.coordinates.splice(1, 1, this.form.coordinatesY)
      // console.log(this.form)
      // this.clear()
      let params = {
          Dto: Object.assign({}, this.form),
          Action: this.operateAction
      }
      ActivityEnrollOperation(params).then(res => {
          this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
          })
          this.clear()
      })
    }
  },
  mounted() {
    this.GetAllCategory()
  }
}
</script>

<style lang="scss" scoped>

</style>
