<template>
  <div class="contains">
    <div class v-if="containerIsShow">
      <!--搜索部分-->
      <el-form class="filters" :inline="true">
        <el-form-item>
          <el-input
            v-model="search"
            placeholder="请输入检索内容"
            class="filters-search"
            @keyup.enter.native="_searchCondition"
          ></el-input>
          <el-button type="primary" @click="_searchCondition">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="formV=true">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="home-b-main"
        :data="categoryList"
        border
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column
          prop="reserveName"
          align="center"
          label="项目名称"
          min-width="240"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="reserveName"
          align="center"
          label="开启状态"
          min-width="240"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.display" @change="operateFunc(scope.row, '编辑开关', 1)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          min-width="240"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          label="操作"
          min-width="250"
          show-overflow-tooltip
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_serview(scope.row)">预约</el-button>
            <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
            <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" v-if="categoryList.length>0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          background
          style="float:right;margin-top: 10px;"
        ></el-pagination>
      </el-col>
      <!-- 弹窗 -->
      <el-dialog :visible.sync="formV" width="800px" @closed="closed">
        <el-form
          :model="form"
          label-width="80px"
          :rules="formRules"
          ref="form"
          class="form"
          :inline="true"
        >
          <el-form-item label="名称" prop="reserveName">
            <el-input v-model="form.reserveName" style="width:640px;"></el-input>
          </el-form-item>
          <el-form-item label="开启状态" prop="remarks">
            <el-switch v-model="form.display"></el-switch>
          </el-form-item>
          <el-form-item label="简介" prop="remarks">
            <el-input v-model="form.remarks" style="width:640px;" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="列表主图" prop="imgs">
            <my-upload
              :imgs="form.prodImage"
              :limitUploadImgs="3"
              ref="uploadImg"
              @handleRemoveImg="handleRemoveImg('prodImage', 3, $event)"
              @handleUploadImg="handleUploadImg('prodImage', 3, $event)"
            ></my-upload>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="info" @click="closed">返回</el-button>
          <el-button type="primary" @click.native="formSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetReserveItem, ReserveOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
export default {
  name: 'groupon',
  data() {
    return {
      formV: false,
      total: 0,
      containerIsShow: true,
      form: {
        reserveName: '',
        remarks: '',
        display: true,
        prodImage: []
      },
      pageIndex: 1,
      pageSize: 10,
      operateAction: 0,
      search: '',
      listLoading: false,
      categoryList: [],
      formRules: {
        reserveName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    // 预约排单
    _serview(row) {
      this.$router.push({
        path: '/arrange-list',
        query: {
          id: row._id
        }
      })
    },
    _searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    operateFunc(row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.formV = true
          break
        case '编辑': // 编辑
          this.formV = true
          this.form = row
          this.operateAction = action
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        default:
          return false
      }
    },
    // 操作的后台请求
    operateAxios(item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      ReserveOperation(params).then(res => {
        if (res.success) {
          this.formV = false
          this.GetListByPage()
          this.$message.success(res.msg)
        } else this.$message.err(res.msg)
      })
    },
    formSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('是否提交？', '提示', {}).then(() => {
            this.formLoading = true
            // 设置创建人、角色ID、cid
            this.$set(this.form, 'creater', this.$store.state.UserID)
            this.$set(this.form, 'roleId', this.$store.state.UserRole)
            this.$set(this.form, 'cid', this.$store.state._cid)
            this.operateAxios(this.form)
          })
        }
      })
    },
    // 获取列表
    async GetListByPage() {
      let params = {
        name: this.search,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await GetReserveItem(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.categoryList = res.data
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    closed() {
      this.$refs['form'].clearValidate()
      this.$refs['form'].resetFields()
      this.$refs.uploadImg.clearFiles()
      this.$emit('closeForm')
      this.formV = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.form[txt] = fileList
      } else {
        this.form[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.form[txt]) {
          this.$set(this.form, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.form[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'arrange-type') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  components: {
    myUpload
  }
}
</script>

<style scoped>
.filters-search {
  width: 150px;
}
</style>
