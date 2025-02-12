<template>
  <div class="contain">
    <div class="contain-main">
    <el-form label-position="right" label-width="80px">
      <el-form-item label="快递配送">
        <el-switch v-model="isDelivery" @change="deliveryClick"></el-switch>
      </el-form-item>
    </el-form>
    <div class="delivery-main" v-show="mainShow">
      <div class="area-title">
        <div class="area-add">
          <el-button type="primary" class="add-area" @click="operationClick(undefined)">新增</el-button>
        </div>
      </div>
      <el-table :data="areaList" border style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" :align="align"></el-table-column>
        <el-table-column label="编号" type="index" :align="align" width="80">
        </el-table-column>
        <el-table-column prop="templateName" label="模板名称" :align="align" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productAddress" label="发货地" :align="align"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="deliverTime" label="发货时间/小时"  width="130" :align="align"></el-table-column>
        <el-table-column label="操作"  :align="align" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="operationClick(scope.row._id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="operationArea(scope.row, 2, '删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="areaList.length !== 0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import AreaSelect from '../../../../components/area-select'
  import {PostTemplateList, PostTempOperation} from '@/api/system'
  export default {
    name: 'intraCity-service',
    data () {
      return {
        pageSize: 10,
        pageIndex: 1,
        loading: false, // 加载
        isDelivery: true, // 配送按钮
        mainShow: false, // 配送设置的显示
        align: 'center', // 表格位置
        areaList: [], // 派送区域列表
        selectTableList: [], // 被选中的table列表
        total: 0,
        shen: '',
        shi: '',
        qu: ''
      }
    },
    methods: {
      // 获取派送区域列表
      init() {
        let parmas = {
          templateName: '',
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        this.loading = true
        PostTemplateList(parmas).then(res => {
          if (res.success) {
            this.loading = false
            this.areaList = res.data
            this.total = res.total
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 配送事件触发
      deliveryClick() {
        this.isDelivery === true ? this.mainShow = true : this.mainShow = false
      },
      // 删除
      operationArea(list, action, text) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            action: action,
            dto: list
          }
          PostTempOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.init()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      // 页面跳转
      operationClick(id) {
          this.$router.push({
            path: '/build-template',
            query: {templateId: id}
          })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.init()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.init()
      }
    },
    mounted() {
      this.isDelivery === true ? this.mainShow = true : this.mainShow = false
      this.init()
    },
    watch: {
      '$route': 'init'
    },
    components: {
      AreaSelect
    }
  }
</script>

<style lang="scss" scoped>
  .contain{
    .contain-main {
      position: fixed;
      width: calc(100% - 240px);
      height: 100vh;
      background-color: #ffffff;
      .delivery-main {
        .area-title {
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;
          padding-bottom: 10px;
          .area-add {
            display: flex;
            display: -webkit-flex;
          }
        }
      }
    }
  }
  .pagination{
    margin-top: 10px;
    float: right;
  }
</style>
