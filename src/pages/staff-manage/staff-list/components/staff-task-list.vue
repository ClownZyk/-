<template>
  <div>
    <el-form class="filter" size="small" :model="searchForm" inline>
      <el-form-item label="门店" v-if="isManage">
        <el-select v-model="searchForm.cid" placeholder="请选择门店"> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
      </el-form-item>
      <el-form-item label="任务时间" v-if="taskType < 5">
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
      <el-table size="small" v-loading="listLoading" :data="staffTask" style="width: 100%" border>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="任务名称" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务时间" min-width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <!--
          <el-table-column label="员工分配" min-width="200" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="(worker, i) of scope.row.join" :key="i">{{ worker.name + (i + 1 !== scope.row.join.length ? '；' : '') }}</span>
            </template>
          </el-table-column>
        -->
        <el-table-column label="任务状态" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.taskState === 1" style="color: #F56C6C">未完成</div>
            <div v-if="scope.row.taskState === 2" style="color: #67C23A">已完成</div>
            <div v-if="scope.row.taskState === 3" style="color: #E6A23C">待审核</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleCheckTaskDetail(scope.row)">详情</el-button>
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

    <!-- 详情弹框 -->
    <el-dialog title="任务详情" :visible.sync="isTaskDetailShow" width="1000px" @close="isTaskDetailShow = false" :close-on-click-modal="false">
      <div class="table-list">
        <div class="title">任务名称：{{ checkForm.title }}</div>
        <div class="title" v-if="checkForm.taskType === 5">
          分配人员：<span v-for="(worker, i) of checkForm.join" :key="i">{{ worker.name + (i + 1 !== checkForm.join.length ? '、' : '') }}</span>
        </div>
        <el-table size="small" :data="checkForm.taskContent" border>
          <el-table-column type="expand" width="40">
            <template slot-scope="props">
              <div class="check-state" v-if="props.row.lookUp && props.row.lookUp.lookUpTime">
                <div class="check-title"><strong>审核驳回：</strong></div>
                <div class="check-info">
                  <div>
                    驳回原因：<span>{{ props.row.lookUp.reason || '--' }}</span>
                  </div>
                  <div class="check-time">
                    驳回时间：<span>{{ props.row.lookUp.lookUpTime }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" width="55" align="center"></el-table-column>
          <el-table-column prop="content" label="子任务名称" min-width="200" align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column label="完成人" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.operate.name || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成图片" min-width="160" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.operate.images && scope.row.operate.images.length > 0">
                <el-image
                  style="width: 50px; height: 50px;margin-right: 5px;"
                  v-for="(item, index) in scope.row.operate.images"
                  :key="index"
                  :src="item.url"
                  :preview-src-list="scope.row.operate.images.map(item => item.url)"
                  fit="fill"
                ></el-image>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="完成备注" min-width="140" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.operate.remarks || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="完成时间" min-width="160" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.operate.updateTime || '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="子任务状态" min-width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.state === 1" style="color: #F56C6C">未完成</span> <span v-if="scope.row.state === 2" style="color: #67C23A">已完成</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskList, getAllStore } from '@/api/system'
import myUpload from '@/components/my-upload'
import { getDataString } from '@/filters/filters'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      shopList: [],
      searchForm: {
        userId: this.$route.query.id || '',
        phone: '',
        taskState: 0,
        cid: this.$store.state._cid
      },
      checkForm: {},
      taskId: '',
      weekDate: new Date(),
      dataTime: new Date(),
      staffTask: [],
      taskType: 1,
      listLoading: false,
      isTaskDetailShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isTaskDetailShow(val) {
      if (!val) {
        this.checkForm = {}
      }
    }
  },
  methods: {
    initData(type) {
      if (this.isManage) {
        this.getAllShop(type)
      } else {
        this.getStaffTask(type)
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
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getAllStore(params).then(res => {
        if (res.success) {
          if (res.data && res.data.length > 0) {
            this.shopList = res.data.map(item => {
              return {
                cid: item.cid,
                companyName: item.companyName
              }
            })
            this.searchForm.cid = this.isManage ? this.shopList[0].cid : this.$store.state._cid
            this.getStaffTask(type)
          }
        }
      })
    },
    getStaffTask(type) {
      this.taskType = type
      let finalDateTime = ''
      if (type === 3) {
        // this.weekDate = new Date()
        this.dataTime = this.$moment(this.weekDate)
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
        roleId: this.$store.state.UserRole,
        cid: this.searchForm.cid
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
    // 获取任务详情
    handleCheckTaskDetail(row) {
      this.isTaskDetailShow = true
      this.checkForm = JSON.parse(JSON.stringify(row))
    },
    searchCondition() {
      this.pageIndex = 1
      this.getStaffTask(this.taskType)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getStaffTask(this.taskType)
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getStaffTask(this.taskType)
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

.table-list {
  .title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
.check-state {
  display: flex;
  font-size: 14px;
  .check-info {
    .check-time {
      margin-top: 5px;
    }
  }
}
</style>
