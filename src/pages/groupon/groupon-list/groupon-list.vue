<template>
  <div class="groupon-container">
    <div class="groupon-list" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" :model="filterParam" inline>
        <div class="filters-left">
          <el-form-item label="活动名称"> <el-input v-model="filterParam.activityName" placeholder="输入活动名称检索" clearable></el-input> </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="filterParam.activityTimeArr"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy/MM/dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
        </div>
        <div class="filters-right">
          <el-form-item>
            <el-button type="warning" @click="operateFunc('', '添加', 0)">新增拼团活动</el-button>
            <el-button type="danger" @click="operateDeleteMany">批量删除</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" v-loading="listLoading" ref="listTable" :data="grouponList" border @selection-change="selectTableRow">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="activityName" label="活动名称" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="activityStartTime" label="活动时间" min-width="260" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.activityStartTime }}-{{ scope.row.activityEndTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="productName" label="拼团商品" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="上下架" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isForeshow" @change="operateFunc(scope.row, '编辑开关', 1)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="activityState" label="活动状态" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.activityState === 1" style="color:#E6A23C">未开始</div>
              <div v-else-if="scope.row.activityState === 2" style="color:#67C23A">进行中</div>
              <div v-else-if="scope.row.activityState === 3" style="color:#909399">暂停中</div>
              <div v-else-if="scope.row.activityState === 4" style="color:#909399">已结束</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="operateFunc(scope.row, '编辑', 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="operateFunc(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 15, 20, 25]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            background
            style="float:right;"
          >
          </el-pagination>
        </el-col>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSpellGroupGetList, SpellGroupOperation, SpellGroupDeleteMany} from '@/api/system'
import moment from 'moment'

export default {
  name: 'groupon-list',
  watch: {
    '$route' (to, from) {
      if (to.name === 'groupon-list') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data () {
    return {
      filterParam: {
        spellGroupType: 0,
        activityName: '',
        activityTimeArr: []
      },
      grouponList: [],
      operateAction: 0,
      checkedDatas: [],
      listLoading: false,
      containerIsShow: true,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      spellTypeList: [
        { label: '全部', value: 0 },
        { label: '普通拼团', value: 1 },
        { label: '老带新拼团', value: 2 }
      ]
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage () {
      if (!this.filterParam.activityTimeArr) {
        this.filterParam.activityTimeArr = []
      }
      let params = {
        spellGroupType: this.filterParam.spellGroupType,
        activityName: this.filterParam.activityName,
        activityStartTime: this.filterParam.activityTimeArr[0] ? this.filterParam.activityTimeArr[0] : '',
        activityEndTime: this.filterParam.activityTimeArr[1] ? this.filterParam.activityTimeArr[1] : '',
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
      getSpellGroupGetList(params).then(res => {
        this.listLoading = false
        this.grouponList = res.data.map(item => {
          return {
            ...item,
            activityState: this.activityTimeFilter(item.activityStartTime, item.activityEndTime, item.isForeshow)
          }
        })
        this.total = res.total
      }, () => {
        this.listLoading = false
      })
    },
    // 增删改查
    operateFunc (row, title, action) {
      this.operateAction = action
      switch (title) {
        case '添加':
          this.$router.push('/groupon-detail')
          break
        case '编辑': // 编辑
          this.$router.push({path: '/groupon-detail', query: {id: row._id}})
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          }).catch(() => {})
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        case '查看': // 查看
          this.$router.push({path: '/groupon-detail', query: {id: row._id, operate: 'view'}})
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
      SpellGroupOperation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 选中行
    selectTableRow (row) {
      this.checkedDatas = row
    },
    // 多选删除
    operateDeleteMany () {
      let that = this
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          let ids = that.checkedDatas.map(item => item._id)
          let params = {
            _ids: ids
          }
          SpellGroupDeleteMany(params).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this.GetListByPage()
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    activityTimeFilter(time1, time2, isForeshow) {
      if (moment().isBefore(time1)) {
        return 1 // 未开始
      } else if (moment().isBetween(time1, time2, null, '()')) {
        return isForeshow ? 2 : 3 // 2进行中  3暂停中
      } else if (moment().isAfter(time2)) {
        return 4 // 已结束
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.groupon-container {
  position: relative;
  padding: 20px;
}
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-table {
  color: #666666;
  .table-main {
    text-align: center;
    margin-bottom: 15px;
  }
}
</style>
