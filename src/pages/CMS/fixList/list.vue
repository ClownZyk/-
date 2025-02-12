<template>
  <div class="list-container">
    <router-view></router-view>
    <!-- 搜索部分 -->
    <div class="contain-mianer">
      <div class="list-search">
        <div class="home-t">
          <el-form ref="form" :model="search" label-width="80px" :inline="true">
            <el-form-item label="分类">
              <el-select class="long-short-input" v-model="search.categoryId" placeholder="请选择分类"> <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
            </el-form-item>
            <el-form-item label="标题"> <el-input v-model="search.name" width="160" placeholder="请输入标题" clearable></el-input> </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="search.status" placeholder="请选择审核状态" style="width: 150px;">
                <el-option v-for="item in stateList" :key="item.value" :value="item.id" :label="item.value">{{ item.value }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
          </el-form>
          <el-form :inline="true">
            <el-form-item> <el-button type="primary" @click="detailClick()">新增</el-button> </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <div class="home-b">
        <el-table class="home-b-main" :data="contentList" border tooltip-effect="dark" v-loading="listLoading" @selection-change="selectTableRow">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
          <el-table-column prop="title" label="标题" width="420" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="分类" align="center" width="300" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.categoryName | fomartCategoryName }}
            </template>
          </el-table-column>
          <el-table-column label="显示状态" row-class-name="table-view" align="center" :width="tableInputWidth" show-overflow-tooltip>
            <!-- <template slot-scope="scope">{{scope.row.viewState === 1 ? '待审核' : (scope.row.viewState === 2 ? '显示' : '不显示')}}</template> -->
            <!-- 1:待审核；2：显示；3：不显示 -->
            <template slot-scope="scope">
              <div v-if="scope.row.viewState === 1" style="color: #e6b321;">待审核</div>
              <div v-else-if="scope.row.viewState === 2" style="color: #13CE66;">显示</div>
              <div v-else-if="scope.row.viewState === 3" style="color: #FF4949;">不显示</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="发布日期" align="center" :width="tableInputWidth" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.publishDate.split(' ')[0] }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="240" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="detailClick(scope.row._id, '修改')">查看</el-button>
              <el-button size="mini" type="primary" @click="detailClick(scope.row._id, '提交')">编辑</el-button>
              <el-button size="mini" type="danger" @click="CMSContent(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[15, 20, 25, 30]"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            background
            style="float:right;"
          ></el-pagination>
        </el-col>
      </div>
      <!-- 弹框 -->
    </div>
  </div>
</template>

<script>
import { CMSFIXContentList, CMSFIXOperation } from '@/api/system'
import MyEditor from '../../../components/my-editor'
export default {
  filters: {
    fomartCategoryName(val) {
      switch (val) {
        case '1':
          return '轮播图'
        case '2':
          return '广告位'
        case '3':
          return '分类页上分banner'
        case '4':
          return '积分商城轮播图'
        case '5':
          return '收银台-无人收银首页banner'
        case '6':
          return '收银台-banner'
        case '7':
          return '收银台-hello页banner'
        case '8':
          return '云极小管家公告位'
        case '9':
          return '云极ERP公告位'
        case '10':
          return '电视图片轮播广告位'
        case '11':
          return '云极咖啡首页弹框banner'
        case '12':
          return '云极咖啡首页公告位'
        case '13':
          return '云极咖啡首页内容banner'
        case '14':
          return '云极咖啡首页轮播banner'
        case '15':
          return '云极咖啡积分商城banner'
      }
    }
  },
  data() {
    return {
      categoryList: [
        { value: '0', label: '所有分类' },
        { value: '1', label: '轮播图' },
        { value: '2', label: '广告位' },
        { value: '3', label: '分类页上分banner' },
        { value: '4', label: '积分商城轮播图' },
        { value: '5', label: '收银台-无人收银首页banner' },
        { value: '6', label: '收银台-banner' },
        { value: '7', label: '收银台-hello页banner' },
        { value: '8', label: '云极小管家公告位' },
        { value: '9', label: '云极ERP公告位' },
        { value: '10', label: '电视图片轮播广告位' },
        { value: '11', label: '云极咖啡首页弹框banner' },
        { value: '12', label: '云极咖啡首页公告位' },
        { value: '13', label: '云极咖啡首页内容banner' },
        { value: '14', label: '云极咖啡首页轮播banner' },
        { value: '15', label: '云极咖啡积分商城banner' }
      ], // 分类列表
      dialogImageUrl: '',
      dialogVisible: false,
      tableInputWidth: 200, // 统一宽度
      inputWidth: 'width: 290px;',
      inputWidth1: 'width: 272px;',
      labelWidth: '60px',
      labelWidth1: '78px', // SEO的label
      search: {
        // 搜索的表单提交
        name: '',
        category: '',
        status: 0
      },
      stateList: [{ value: '所有', id: 0 }, { value: '待审核', id: 1 }, { value: '显示', id: 2 }, { value: '不显示', id: 3 }],
      dialog: {}, // 表单
      contentList: [], // 表格列表
      total: 0, // 分页总数
      pageIndex: 1, // 当前页码
      pageSize: 15, // 每页条数
      editDialog: false, // 弹框显示
      selectTableList: [], // 被选中的table列表
      isShowDialogFooter: true, // 是否显示提交按钮
      Row: {}, // 表单提交数据
      Action: null, // 增删改查状态
      Title: '', // 操作文字状态
      cateID: '',
      listLoading: false // 控制loading是否显示
    }
  },
  methods: {
    detailClick(id, text) {
      this.$router.push({
        path: '/cms-fix-detail',
        query: { cmsId: id, action: text }
      })
    },
    // CMS内容列表
    setData() {
      let params = {
        categoryId: this.search.categoryId,
        title: this.search.name,
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
      CMSFIXContentList(params).then(
        res => {
          // List内容列表
          if (res.success) {
            this.contentList = res.data
            this.total = res.total
            this.listLoading = false
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 选择分类
    selectCategory(val) {
      let list = Array.from(val)
      this.search.category = list[list.length - 1]
    },
    // CMS分类管理
    // init: function() {
    //   let params = {
    //     belongMenu: '/cms',
    //     isPage: true,
    //     isOrder: true,
    //     isAsc: true,
    //     creater: this.$store.state.UserID,
    //     roleid: this.$store.state.UserRole,
    //     cid: this.$store.state._cid
    //   }
    //   GetAllCategory(params).then(
    //     res => {
    //       // CMS分类列表
    //       if (res.success) {
    //         this.categoryList = res.data
    //         this.categoryList.unshift({
    //           value: '',
    //           label: '所有分类'
    //         })
    //       } else this.$message.error(res.msg)
    //     },
    //     err => {
    //       this.$message.error(err.msg)
    //     }
    //   )
    // },
    // 表格选中状态
    selectTableRow: function(val) {
      this.selectTableList = val
    },
    // 搜索
    searchCondition: function() {
      this.setData()
    },
    // 删除
    CMSContent: function(list, title, action) {
      this.$confirm('确定删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            Dto: list,
            Action: action
          }
          CMSFIXOperation(params).then(
            res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.setData()
              } else this.$message.error(res.msg)
            },
            err => {
              this.$message.error(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    // 分类下拉选择
    categoryClick: function(a, b, c) {
      for (var i = 0; i < c.length; i++) {
        if (c[i].label === b.categoryName) {
          this.dialog.Categoryid = c[i].value
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.setData()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.setData()
    }
  },
  mounted() {
    this.setData()
    // this.init()
  },
  watch: {
    $route: 'setData'
  },
  components: {
    MyEditor
  }
}
</script>

<style scoped lang="scss">
.list-container {
  .contain-mianer {
    position: fixed;
    z-index: 1;
    width: calc(100% - 200px);
    height: 100vh;
    overflow-y: scroll;
    padding: 0 20px 60px;
    background-color: #ffffff;
    .home-b {
      padding: 10px 0;
      .home-b-main {
        margin-bottom: 15px;
        .table-view {
          background-color: #2299dd;
        }
      }
    }
  }
}
.table-row {
  height: 10px !important;
}
.editor-container {
  height: 500px;
}
.form-container {
  min-height: 500px;
}
.home-t {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
  border-bottom: 1px solid #e6e5e5;
}
.dialog-line {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
</style>
