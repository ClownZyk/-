<template>
  <div>
    <el-form class="filter" size="small" :model="searchForm" inline>
      <el-form-item label="门店" v-if="isManage">
        <el-select v-model="searchForm.cid" placeholder="请选择任务分配门店"> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="任务时间" v-if="taskType !== 5">
        <el-date-picker v-if="taskType === 1 || taskType === 2" v-model="dataTime" type="date" placeholder="请选择任务日期" format="yyyy-MM-dd"> </el-date-picker>
        <el-date-picker v-if="taskType === 3" v-model="weekDate" type="week" format="yyyy-WW" placeholder="请选择任务周"> </el-date-picker>
        <el-date-picker v-if="taskType === 4" v-model="dataTime" type="month" format="yyyy-MM" placeholder="请选择任务月"> </el-date-picker>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="searchForm.taskState" placeholder="请选择任务状态"> <el-option v-for="item in taskState" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
    </el-form>
    <div class="table-list">
      <el-table v-loading="listLoading" :data="staffTask" style="width: 100%" border>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="任务名称" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务时间" min-width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="taskType === 5" label="员工分配" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(worker, i) of scope.row.join" :key="i">{{ worker.name + (i + 1 !== scope.row.join.length ? '；' : '') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.taskState === 1" style="color: #F56C6C">未完成</div>
            <div v-if="scope.row.taskState === 2" style="color: #67C23A">已完成</div>
            <div v-if="scope.row.taskState === 3" style="color: #E6A23C">待审核</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleCheckTask(scope.row)">{{ scope.row.taskState === 3 ? '任务审核' : '审核详情' }}</el-button>
            <el-button size="mini" type="success" @click="handleCheckDiscuss(scope.row)">留言</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px;text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>
    </div>

    <!-- 留言弹框 -->
    <el-dialog title="评论区" :visible.sync="isTaskDiscussShow" width="1000px" @close="isTaskDiscussShow = false" :close-on-click-modal="false">
      <div v-if="discussList.length > 0">
        <div class="comment-list">
          <el-card class="comment-item" v-for="(item, index) in discussList" :key="index">
            <div slot="header" class="clearfix">
              <div class="avatar"><el-image style="width: 40px; height: 40px;border-radius:50%" :src="item.join.headImage" fit="fill"></el-image></div>
              <div class="comment-name">
                <strong>{{ item.join.name }}</strong>
              </div>
            </div>
            <div class="comment-info">
              <div class="comment-time">发表于 {{ item.createTime }}</div>
              <div class="comment-detail">
                <div class="remarks">{{ item.remarks }}</div>
                <div class="images" v-if="item.images && item.images.length > 0">
                  <el-image style="width: 50px; height: 50px;margin:5px 10px 0 0" v-for="(img, i) in item.images" :key="i" :preview-src-list="item.images.map(img => img.url)" :src="img.url" fit="fill"></el-image>
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <el-pagination
          style="margin-top: 15px;text-align: right;"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageIndex1"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next"
          :total="total1"
          background
        >
        </el-pagination>
      </div>
      <div v-else class="empty"><img :src="emptybg" /> <span>暂无评论</span></div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskList, getAllStore, getTaskDiscussList, taskOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
import { getDataString } from '@/filters/filters'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  watch: {
    isTaskDiscussShow(val) {
      if (!val) {
        this.taskId = ''
        this.discussList = []
      }
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      searchForm: {
        userId: '',
        phone: '',
        taskState: 0,
        cid: this.$store.state._cid
      },
      dataTime: new Date(),
      weekDate: new Date(),
      staffTask: [],
      taskDetail: {},
      shopList: [],
      taskType: 1,
      actionOperation: 1,
      discussList: [],
      discussLoading: false,
      isTaskDiscussShow: false,
      listLoading: false,
      isTaskDetailShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      pageIndex1: 1,
      pageSize1: 10,
      total1: 0,
      emptybg: require('../../../../assets/image/empty.jpg')
    }
  },
  methods: {
    initData(type) {
      if (this.isManage) {
        this.getAllShop(type)
      } else {
        this.getTaskList(type)
      }
    },
    // 获取所有门店信息
    getAllShop(type) {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          this.searchForm.cid = this.isManage ? this.shopList[0].cid : this.$store.state._cid
          this.getTaskList(type)
        }
      })
    },
    getTaskList(type) {
      this.taskType = type
      let finalDateTime = ''
      if (type === 3) {
        // this.weekDate = new Date()
        finalDateTime = this.$moment(this.weekDate)
          .utcOffset(480)
          .format('yyyy-ww')
      } else if (type === 4) {
        finalDateTime = getDataString(this.dataTime, 'yyyy-MM')
      } else if (type === 5 || type === 6) {
        this.dataTime = ''
      } else {
        finalDateTime = getDataString(this.dataTime, 'yyyy-MM-dd')
      }
      let params = {
        ...this.searchForm,
        dataTime: this.dataTime ? parseInt(finalDateTime.replace(/-/g, '')) : 0,
        taskType: type,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
        // cid: this.$store.state._cid
      }
      this.listLoading = true
      getTaskList(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.staffTask = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 审核任务
    handleCheckTask(row) {
      this.$router.push({
        path: '/check-detail',
        query: {
          id: row._id
        }
      })
    },
    // 查看任务评论
    handleCheckDiscuss(row) {
      this.isTaskDiscussShow = true
      this.taskId = row._id
      this.$nextTick(() => {
        this.getTaskDiscuss(row._id)
      })
    },
    // 获取任务评论列表
    getTaskDiscuss(id) {
      let params = {
        userId: '',
        taskId: id,
        pageIndex: this.pageIndex1,
        pageSize: this.pageSize1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.discussLoading = true
      getTaskDiscussList(params)
        .then(res => {
          if (res.success) {
            this.discussLoading = false
            this.discussList = res.data
            this.total1 = res.total
          }
        })
        .catch(() => {
          this.discussLoading = false
        })
    },
    // 删除任务
    handleDeleteTask(row) {
      this.$confirm('确认删除此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          taskOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.getTaskList(this.taskType)
            }
          })
        })
        .catch(() => {})
    },
    searchCondition() {
      this.pageIndex = 1
      this.getTaskList(this.taskType)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTaskList(this.taskType)
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getTaskList(this.taskType)
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getTaskDiscuss(this.taskId)
    },
    handleCurrentChange1(val) {
      this.pageIndex1 = val
      this.getTaskDiscuss(this.taskId)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-item {
  display: flex;
  align-items: center;
  // margin-left: 55px;
  padding: 5px 0;
}
.task-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.task-content {
  padding-left: 20px;
  .complete {
    display: flex;
    margin-top: 15px;
    .title {
      font-weight: 700;
      font-size: 14px;
    }
    .info > div {
      margin-bottom: 5px;
    }
  }
}
.comment-list {
  display: flex;
  flex-wrap: wrap;
  .comment-item {
    width: 32%;
    margin-right: 10px;
    margin-bottom: 10px;
    .clearfix {
      display: flex;
      align-items: center;
      .comment-name {
        margin-left: 15px;
      }
    }
    .comment-info {
      .comment-time {
        font-size: 12px;
        color: #909399;
      }
      .comment-detail {
        margin-top: 5px;
      }
    }
  }
}
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 180px;
    height: 180px;
    margin-bottom: 15px;
  }
}
.el-card {
  .el-card__header {
    padding: 5px 10px;
  }
  .el-card__body {
    padding: 8px 20px;
  }
}
</style>
