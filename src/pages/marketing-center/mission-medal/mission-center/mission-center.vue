<template>
  <div class="mission-center-container">
    <div class="mission-center" v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :inline="true">
        <div class="filters-left">
          <el-form-item>
            <el-button type="primary" @click="addCategory">新增分类</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="operateFunc('', '添加', 0)">新增</el-button>
          <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="list" border tooltip-effect="dark" @selection-change="selectTableRow" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column prop="name" label="勋章名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="isUse" label="是否启用" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isUse" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sortNo" label="排序号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="250" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)">查看</el-button>
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :page-sizes="[10, 15, 20, 25]"
                        :total="total"
                        layout="total, sizes, prev, pager, next"
                        background
                        style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!-- form -->
      <el-dialog :visible.sync="formV" width="800px" @closed="closed">
        <el-form :model="form" label-width="100px" :rules="formRules" ref="form" class="form" :inline="true" :disabled="formDisabled">
          <el-form-item label="勋章名称" prop="name">
              <el-input v-model="form.name" class="item-long"></el-input>
          </el-form-item>
          <el-form-item label="勋章分类" prop="categoryIds">
            <el-cascader v-model="form.categoryIds" :options="categoryList" change-on-select expand-trigger="hover"></el-cascader>
          </el-form-item>
          <el-form-item label="勋章规则" prop="ruleId">
            <el-select v-model="form.ruleId" clearable>
              <el-option v-for="(item, index) in mainRuleList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="sortNo">
            <el-input-number controls-position="right" v-model="form.sortNo" placeholder="最小值为99" :min="99"></el-input-number>
          </el-form-item>
          <el-form-item label="是否启用" prop="isUse">
              <el-switch v-model="form.isUse"></el-switch>
          </el-form-item>
          <el-form-item label="简介" prop="introduce">
              <el-input v-model="form.introduce" type="textarea" :rows="4" class="item-long"></el-input>
          </el-form-item>
          <el-form-item label="图片已点亮" prop="lightUpImgs">
            <my-upload :imgs="form.lightUpImgs"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('lightUpImg', 1, $event)"
                       @handleUploadImg="handleUploadImg('lightUpImg', 1, $event)">
            </my-upload>
          </el-form-item>
          <el-form-item label="图片未点亮" prop="lightDownImgs">
            <my-upload :imgs="form.lightDownImgs"
                       :limitUploadImgs="1"
                       @handleDisabledSubmit="handleDisabledSubmit"
                       @handleRemoveImg="handleRemoveImg('lightDownImg', 1, $event)"
                       @handleUploadImg="handleUploadImg('lightDownImg', 1, $event)">
            </my-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit" :loading="submitLoading" :disabled="submitDisabled">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {MedalCenterGetListByPage, MedalCenterOperation, GetAllCategory, MedalRuleGetDropDownList} from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  name: 'mission-center',
  watch: {
    '$route' (to, from) {
      if (to.name === 'mission-center') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    myUpload
  },
  data () {
    return {
      mainRuleList: [],
      formDisabled: false,
      submitLoading: false,
      submitDisabled: false,
      formV: false,
      form: {},
      formRules: {
        name: [
          {required: true, message: '请输入勋章名称', trigger: 'blur'}
        ],
        categoryIds: [
          {type: 'array', required: true, message: '请选择勋章分类', trigger: 'change'}
        ],
        ruleId: [
          {required: true, message: '请选择勋章规则', trigger: 'change'}
        ]
      },
      // 控制列表显示还是字内容显示
      containerIsShow: true,
      // 分类列表
      categoryList: [],
      // 活动报名列表
      list: [],
      // 控制loading是否显示
      listLoading: false,
      // 分页相关
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      // 操作标识(增0，改1，删2)
      operateAction: 0,
      operateTitle: '',
      // 多选删除的数据列表
      checkedDatas: []
    }
  },
  methods: {
    // 是否禁用提交按钮,与上传相关
    handleDisabledSubmit (val) {
      this.submitDisabled = val
    },
    // 删除图片
    handleRemoveImg (txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
      }
    },
    // 图片上传成功回调
    handleUploadImg (txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 提交form
    formSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.lightUpImg ||
              JSON.stringify(this.form.lightUpImg) === '{"url":"","thumUrl":"","absoluteUrl":""}' ||
              JSON.stringify(this.form.lightUpImg) === '{}') {
            this.$message({
              type: 'warning',
              message: '请上传已点亮图片'
            })
            return false
          }
          if (!this.form.lightDownImg ||
              JSON.stringify(this.form.lightDownImg) === '{"url":"","thumUrl":"","absoluteUrl":""}' ||
              JSON.stringify(this.form.lightDownImg) === '{}') {
            this.$message({
              type: 'warning',
              message: '请上传未点亮图片'
            })
            return false
          }
          this.$confirm('确认' + this.operateTitle + '吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleid', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            let categoryIds = this.form.categoryIds
            if (categoryIds.length > 0) {
              this.form.categoryId = categoryIds[categoryIds.length - 1]
            }
            this.operateAxios(this.form)
          }).then(() => {
            this.closed()
          })
        }
      })
    },
    // 关闭form
    closed () {
      this.formV = false
      this.submitLoading = false
      this.formDisabled = false
      this.submitDisabled = false
      this.form = {}
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
    },
    // 格式化数据
    formatData () {
      this.form.lightUpImgs = []
      if (this.form.lightUpImg !== null && this.form.lightUpImg.url !== '') {
          this.form.lightUpImgs.push({url: this.form.lightUpImg.url})
      }
      this.form.lightDownImgs = []
      if (this.form.lightDownImg !== null && this.form.lightDownImg.url !== '') {
          this.form.lightDownImgs.push({url: this.form.lightDownImg.url})
      }
      // 获取categoryIds
      if (this.categoryList.length > 0 && this.form.categoryId) {
        this.form.categoryIds = []
        this.getCategoryIds(this.categoryList, this.form.categoryId)
      }
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
    // 新增分类
    addCategory () {
      this.$router.push('/mission-center-category')
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.form = JSON.parse(JSON.stringify(row))
          this.formatData()
          this.formV = true
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.formDisabled = true
          this.submitDisabled = true
          this.formV = true
          this.form = JSON.parse(JSON.stringify(row))
          this.formatData()
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      MedalCenterOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany () {
      this.operateAction = 2
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.operateAxios(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // pageSize 改变
    handleSizeChange (val) {
      console.log('pageSize 改变')
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange (val) {
      console.log('currentPage 改变')
      this.pageIndex = val
      this.GetListByPage()
    },
    // 加载商品分类
    async GetAllCategory () {
      let params = {
        belongMenu: '/mission-center-category',
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
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载规则列表
    async MedalRuleGetDropDownList () {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      await MedalRuleGetDropDownList(params).then(res => {
        if (res.success) {
          this.mainRuleList = res.data
        } else {
          this.$message.error(res.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await MedalCenterGetListByPage(params).then(res => {
        this.listLoading = false
        this.list = res.data
        this.total = res.total
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    }
  },
  mounted() {
    this.GetListByPage()
    this.GetAllCategory()
    this.MedalRuleGetDropDownList()
  }
}
</script>

<style lang="scss" scoped>
  .mission-center-container {
    padding: 20px;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filters-left {
      .filters-search {
        display: inline-block;
        width: 200px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
  .form {
    .item-long {
      width: 548px;
    }
  }
</style>
