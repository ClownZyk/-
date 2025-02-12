<template>
  <div class="detail">
    <div class="staff-info">
      <div class="staff-info-left">
        <div class="staff-msg-simple">
          <img class="staff-headImg" :src="editForm.faceImage.url" />
          <div class="staff-name">{{ editForm.realName || '--' }}</div>
          <div class="button"><el-button size="mini" type="primary" @click="isStaffShow = true">修改资料</el-button></div>
        </div>
      </div>
      <div class="staff-info-right">
        <div class="staff-msg-whole">
          <div class="staff-msg-more">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-tel.png" />
                  <div class="more-item-title">电话：{{ editForm.phone || '--' }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-rechange.png" />
                  <div class="more-item-title">职位：{{ editForm.post || '--' }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-sex.png" />
                  <div class="more-item-title">所属门店：{{ editForm.belongName || '--' }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-code.png" />
                  <div class="more-item-title">工号：{{ editForm.number || '--' }}</div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-vip.png" />
                  <div class="more-item-title">等级：{{ editForm.grade || '--' }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-time.png" />
                  <div class="more-item-title">加入时间：{{ editForm.createTime || '--' }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-integral.png" />
                  <div class="more-item-title">积分：{{ editForm.integral }}</div>
                </div>
              </el-col>
              <el-col :span="14">
                <div class="msg-more-item">
                  <img src="../../../assets/scrm/icon-mail.png" />
                  <div class="more-item-title">地址：{{ editForm.address || '--' }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 勋章 -->
          <div class="satff-medal"></div>
        </div>
      </div>
    </div>
    <div class="staff-task">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="开闭店任务" name="1"><staff-task-list ref="staffTaskRef1"></staff-task-list></el-tab-pane>
        <el-tab-pane label="日清任务" name="2"><staff-task-list ref="staffTaskRef2"></staff-task-list></el-tab-pane>
        <el-tab-pane label="周清任务" name="3"><staff-task-list ref="staffTaskRef3"></staff-task-list></el-tab-pane>
        <el-tab-pane label="月清任务" name="4"><staff-task-list ref="staffTaskRef4"></staff-task-list></el-tab-pane>
        <el-tab-pane label="开店协同任务" name="5"><staff-task-list ref="staffTaskRef5"></staff-task-list></el-tab-pane>
        <el-tab-pane label="协同任务" name="6"><staff-task-list ref="staffTaskRef6"></staff-task-list></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 员工资料修改弹框 -->
    <staff-info :isStaffShow.sync="isStaffShow" :detailForm="editForm" @staffOperation="staffOperation"></staff-info>
  </div>
</template>

<script>
import { getWorkerDetail, workerOperation } from '@/api/system'
import StaffTaskList from './components/staff-task-list.vue'
import StaffInfo from './components/staff-info.vue'

export default {
  components: {
    StaffTaskList,
    StaffInfo
  },
  data() {
    return {
      editForm: {
        faceImage: {}
      },
      activeName: '1',
      operateState: 1,
      isStaffShow: false
    }
  },
  mounted() {
    this.getWorkDetail()
    this.$refs['staffTaskRef1'].initData(parseInt(this.activeName))
  },
  methods: {
    // 获取员工信息
    getWorkDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getWorkerDetail(params).then(res => {
        if (res.success) {
          this.editForm = res.data
        }
      })
    },
    // 获取员工任务
    handleClick() {
      this.$refs['staffTaskRef' + parseInt(this.activeName)].initData(parseInt(this.activeName))
    },
    // 修改员工信息
    staffOperation() {
      let params = {
        dto: {
          ...this.editForm,
          creater: localStorage.getItem('creater'),
          roleId: localStorage.getItem('roleId'),
          cid: localStorage.getItem('cid')
        },
        action: this.operateState
      }
      // console.log(params)
      workerOperation(params).then(res => {
        if (res.success) {
          this.isStaffShow = false
          this.$message.success(res.msg)
          this.getWorkDetail()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  .staff-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .staff-info-left {
      width: 12%;
      height: 215px;
      background: url('../../../assets/scrm/bg1.png') no-repeat top center;
      background-size: 100% 100%;
      .staff-msg-simple {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        .staff-headImg {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
        .staff-name {
          margin: 15px 0;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
    .staff-info-right {
      width: 87%;
      height: 215px;
      background: url('../../../assets/scrm/bg2.png') no-repeat top center;
      background-size: 100% 100%;
      .staff-msg-whole {
        padding: 20px 40px;
        .staff-msg-more {
          .msg-more-item {
            display: flex;
            // align-items: center;
            margin-bottom: 15px;
            img {
              width: 20px;
              height: 20px;
            }
            .more-item-title {
              font-size: 14px;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .staff-task {
    margin-top: 10px;
  }
}
</style>
