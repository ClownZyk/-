<template>
  <div v-loading="loading">
    <div class="filter-info title">
      <span>任务名称：{{ taskDetail.title }}</span>
      <div v-if="taskDetail.taskState === 3">
        <el-button type="success" @click="taskOperation('agree')">审核通过</el-button>
        <el-button type="danger" @click="taskOperation('reject')">审核驳回</el-button>
      </div>
    </div>
    <div class="title" v-if="taskDetail.taskType === 5">
      分配人员：<span v-for="(worker, i) of taskDetail.join" :key="i">{{ worker.name + (i + 1 !== taskDetail.join.length ? '、' : '') }}</span>
    </div>
    <el-table :data="taskDetail.taskContent" border>
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
      <el-table-column prop="content" label="子任务名称" min-width="180" align="center" show-overflow-tooltip></el-table-column>
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
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="taskDetail.taskState === 3" size="mini" type="danger" @click="taskReject(scope.row)">子任务驳回</el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTaskDetail, updateTaskState } from '@/api/system'
import { getDataString } from '@/filters/filters'

export default {
  data() {
    return {
      taskDetail: {
        taskContent: []
      },
      taskRejectContent: [],
      loading: false
    }
  },
  mounted() {
    this.getTaskDetail()
  },
  methods: {
    // 获取任务详情
    getTaskDetail() {
      let params = {
        _id: this.$route.query.id
      }
      this.loading = true
      getTaskDetail(params)
        .then(res => {
          if (res.success) {
            this.loading = false
            this.taskDetail = res.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 子任务驳回
    taskReject(row) {
      this.$prompt('请输入子任务驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          let lookUp = {
            reason: value,
            lookUpTime: getDataString(new Date(), 'yyyy-MM-dd hh:mm:ss')
          }
          let obj = { ...row, state: 1, lookUp }
          let index = this.taskRejectContent.findIndex(item => item.no === obj.no)
          if (index === -1) {
            this.taskRejectContent.push({ ...row, state: 1, lookUp })
          } else {
            this.taskRejectContent.splice(index, 1, JSON.parse(JSON.stringify(obj)))
          }
          this.$message.warning('若无其他子任务需驳回，请点击表格上方 审核驳回 按钮进行数据信息提交！')
        })
        .catch(() => {})
    },
    // 任务审核操作
    taskOperation(type) {
      if (type === 'agree') {
        this.$confirm('确认通过此任务审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = {
              taskId: this.$route.query.id,
              taskContent: this.taskDetail.taskContent,
              taskState: 2
            }
            updateTaskState(params).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.$router.go(-1)
              }
            })
          })
          .catch(() => {})
      } else if (type === 'reject') {
        if (this.taskRejectContent.length <= 0) {
          return this.$message.warning('请选择需要驳回的子任务信息！')
        }
        this.$confirm('确认驳回此任务审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = {
              taskId: this.$route.query.id,
              taskContent: this.taskRejectContent,
              taskState: 1
            }
            updateTaskState(params).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.$router.go(-1)
              }
            })
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-info {
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 10px;
}
.check-state {
  display: flex;
  font-size: 16px;
  .check-info {
    .check-time {
      margin-top: 5px;
    }
  }
}
</style>
