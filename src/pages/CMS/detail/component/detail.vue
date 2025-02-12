<template>
  <div class="detail-main">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="基础信息" name="first">
        <detail-detail  :isShow="isShow" :dialog="dialog" :categoryList="categoryList"></detail-detail>
      </el-tab-pane>
      <el-tab-pane label="内容详情" name="second">
        <my-editor style="width: calc(100% - 40px);height: 80vh;" @input="onEditorBlur($event)" :value="value"></my-editor>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="option" class="option">{{text}}</el-button>
  </div>
</template>

<script>
import {CMSOperation, GetCmsDetailById, GetAllCategory} from '@/api/system'
import {formatDate} from '@/components/js/data'
import MyEditor from '@/components/my-editor'
import DetailDetail from './detail-detail'
export default {
  name: 'detail',
  data() {
    return {
      dialog: {
        title: '', // 标题
        publishDate: formatDate(new Date(), 'yyyy-MM-dd'),
        mainImg: {},
        linkURL: '', // 链接
        sortNo: 99,
        viewState: 2,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      categoryList: [],
      isShow: true,
      activeName: 'first',
      text: '修改',
      action: 0,
      value: ''
    }
  },
  methods: {
    init() {
      if (this.$route.query.cmsId !== undefined) {
        let params = {
          _id: this.$route.query.cmsId
        }
        GetCmsDetailById(params).then(res => {
          if (res.success) {
            this.dialog = res.data
            this.dialog.mainImgs = []
            if (res.data.mainImg !== null && res.data.mainImg.url !== '') {
              this.dialog.mainImgs.push({url: res.data.mainImg.url})
            }
            // 获取categoryIds
            if (this.categoryList.length > 0 && this.dialog.categoryId) {
              this.dialog.categoryIds = []
              this.getCategoryIds(this.categoryList, this.dialog.categoryId)
            }
            this.value = res.data.content
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      }
    },
    // 分类管理
    getAllCategory() {
      let params = {
        belongMenu: '/cms',
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllCategory(params).then(res => { // CMS分类列表
        if (res.success) {
          this.categoryList = res.data
          this.init()
        } else this.$message.error(res.msg)
      }, err => {
        this.$message.error(err.msg)
      })
    },
    // 根据categoryId获取categoryIds
    getCategoryIds (list, opt) {
      try {
        this._getCategoryIds(list, opt)
      } catch (e) {
        // console.log(that.dialog.categoryIds)
      }
    },
    _getCategoryIds (list, opt) {
      let that = this
      list.forEach(val => {
        that.dialog.categoryIds.push(val.value)
        if (val.value === opt) {
          // 跳出所以循环
          // eslint-disable-next-line
          throw ('break all')
        } else if (val.children && val.children.length > 0) {
          // 判断是否还有子项
          that._getCategoryIds(val.children, opt)
          // 如果子项循环完还是没有跳出循环，删除父级
          that.dialog.categoryIds.pop()
        } else {
          // 没有子项，直接删除当前节点
          that.dialog.categoryIds.pop()
        }
      })
    },
    onEditorBlur (event) {
      this.dialog.content = event
    },
    option() {
      if (this.text === '修改') {
        this.text = '提交'
        this.isShow = false
      } else {
        if (this.dialog.title === undefined) {
          this.$message.warning('请输入标题')
          return false
        }
        if (this.dialog.categoryId === undefined) {
          this.$message.warning('请选择分类')
          return false
        }
        if (this.dialog.content === undefined) {
          this.$message.warning('请输入详情')
          return false
        } else {
          this.$route.query.cmsId !== undefined ? this.action = 1 : this.action = 0
          this.$confirm('是否' + this.text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {
              dto: this.dialog,
              action: this.action
            }
            // console.log(this.dialog)
            CMSOperation(params).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.$router.go(-1)
              } else this.$message.error(res.msg)
            }, err => {
              this.$message.error(err.msg)
            })
          }).catch(() => {})
        }
      }
        }
  },
  created() {
    if (this.$route.query.cmsId === undefined) {
      this.text = '新增'
      this.isShow = false
    } else if (this.$route.query.action === '提交') {
      this.text = '提交'
      this.isShow = false
    } else {
      this.text = '修改'
    }
  },
  mounted() {
    // this.init()
    this.getAllCategory()
  },
  components: {DetailDetail, MyEditor}
}
</script>

<style scoped>
.option{
  margin-top: 10px;
  margin-left: 7%;
}
</style>
