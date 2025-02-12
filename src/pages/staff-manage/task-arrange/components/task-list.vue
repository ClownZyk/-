<template>
  <div>
    <el-form class="filter" :model="searchForm" inline>
      <div class="filter-left">
        <div v-if="isManage">
          <!-- <el-form-item> <el-input type="text" v-model.trim="searchForm.phone" placeholder="请输入手机号搜索" clearable></el-input> </el-form-item> -->
          <el-form-item>
            <el-select v-model="searchForm.cid" placeholder="请选择门店"> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
        </div>
      </div>
      <div class="filter-right">
        <el-form-item>
          <el-button type="primary" @click="gotoTaskDetail">{{ taskTitle }}添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <el-table v-loading="listLoading" :data="taskList" style="width: 100%" border>
        <!--
          <el-table-column type="expand" width="55" align="center">
            <template slot-scope="props">
              <div class="content-item" v-for="(item, index) in props.row.taskContent" :key="index">{{ index + 1 }}. {{ item.content }}</div>
            </template>
          </el-table-column>
        -->
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="任务名称" min-width="200" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="任务时间" min-width="250" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }} ~ {{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="任务安排类型" min-width="180" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.arrangeType | taskArrangeTypeFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="taskType === 5" label="员工分配" min-width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(worker, i) of scope.row.join" :key="i">{{ worker.name + (i + 1 !== scope.row.join.length ? '；' : '') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleEditTask(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleRemoveTask(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { getTaskTemplateList, taskTemplateOperation, getAllStore } from '@/api/system'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  props: {
    taskTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      searchForm: {
        userId: '',
        phone: '',
        cid: this.$store.state._cid
      },
      taskType: 1,
      taskList: [],
      shopList: [],
      listLoading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0
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
    // 获取任务模板列表
    getTaskList(type) {
      this.taskType = type
      let params = {
        ...this.searchForm,
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
      getTaskTemplateList(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.taskList = res.data.map(item => {
              return {
                ...item,
                startTime: this.filterDateTime(item.startTime, item.taskType),
                endTime: this.filterDateTime(item.endTime, item.taskType)
              }
            })
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    gotoTaskDetail() {
      this.$router.push({
        path: '/task-detail',
        query: {
          taskType: this.taskType
        }
      })
    },
    handleEditTask(row) {
      this.$router.push({
        path: '/task-detail',
        query: {
          id: row._id,
          taskType: row.taskType
        }
      })
    },
    handleRemoveTask(row) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: { ...row },
            action: 2
          }
          taskTemplateOperation(params).then(res => {
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
    filterDateTime(time, type) {
      if (time.indexOf(',') !== -1) {
        let arr = time.split(',')
        if (type === 3) {
          switch (arr[0]) {
            case '0':
              return `周一, ${arr[1]}`
            case '1':
              return `周二, ${arr[1]}`
            case '2':
              return `周三, ${arr[1]}`
            case '3':
              return `周四, ${arr[1]}`
            case '4':
              return `周五, ${arr[1]}`
            case '5':
              return `周六, ${arr[1]}`
            case '6':
              return `周日, ${arr[1]}`
          }
        }
        if (type === 4) {
          return `${arr[0]}号, ${arr[1]}`
        }
      } else {
        return time
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  justify-content: space-between;
}
.content-item {
  // margin-left: 55px;
  padding: 5px 0;
}
</style>
