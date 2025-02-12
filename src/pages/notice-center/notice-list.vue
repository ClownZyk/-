<template>
  <div class="page-container">
    <el-form :model="filterParam" ref="filterParam" :inline="true" label-width="68px" v-show="showFilterArea">
      <el-form-item label="消息状态" prop="isRead">
        <el-select v-model="filterParam.isRead" placeholder="请选择消息状态"> <el-option v-for="item in readStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
      </el-form-item>
      <!--
        <el-form-item label="处理状态" prop="isHandle">
          <el-select v-model="filterParam.isHandle" placeholder="请选择处理状态"> <el-option v-for="item in handleStateList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
      -->
      <el-form-item> <el-button type="primary" @click="getNoticeList('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <!-- 消息列表 -->
    <el-collapse v-loading="listLoading" class="notice-collapse" v-model="activeName" accordion>
      <el-collapse-item v-for="(item, index) in noticeList" :key="index" :name="index" @click.native="handleUnReadNotice(item)">
        <template slot="title">
          <div class="collapse-top">
            <div :class="['collapse-title', item.isRead ? 'isRead' : '']">{{ item.title }}</div>
            <div class="collapse-top-right collapse-info">
              <span class="collapse-time">{{ item.createTime }}</span>
              <span class="collapse-handle">
                <span class="tips" v-if="!item.isRead">未读</span>
                <!--
                  <el-popconfirm v-if="item.isRead && !item.isHandle" title="确认已处理完成？" @confirm="handleNoticeOperation(item)">
                    <span slot="reference" class="tips" @click.stop>已读(<span style="color:#F56C6C">未处理</span>)</span>
                  </el-popconfirm>
                -->
                <span class="tips" v-if="item.isRead" style="color:#67C23A">已读</span>
              </span>
            </div>
          </div>
        </template>
        <div @click.stop="handleUnReadNotice(item)">
          <div class="collapse-info">{{ item.content }}</div>
          <!--
            <div class="collapse-btn">
              <el-button type="text"> <span>去查看</span> <i class="el-icon-arrow-right"></i> </el-button>
            </div>
          -->
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        background
        style="margin-top:15px;text-align:right"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getNoticeMailList, noticeMailReadSubmit } from '@/api/system'

export default {
  data() {
    return {
      filterParam: {
        isRead: null,
        isHandle: null
      },
      noticeList: [],
      activeName: 0,
      listLoading: false,
      showFilterArea: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      readStateList: [{ value: null, label: '全部状态' }, { value: false, label: '未读消息' }, { value: true, label: '已读消息' }],
      handleStateList: [{ value: null, label: '全部状态' }, { value: false, label: '未处理' }, { value: true, label: '已处理' }]
    }
  },
  mounted() {
    this.getNoticeList()
  },
  methods: {
    getNoticeList(refresh) {
      if (refresh === 'refresh') {
        this.filterParam.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getNoticeMailList(params)
        .then(res => {
          this.listLoading = false
          this.noticeList = res.data.listData
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 处理未读消息
    handleUnReadNotice(item) {
      if (!item.isRead) {
        let params = {
          _id: item._id,
          isRead: true,
          isHandle: true
        }
        noticeMailReadSubmit(params).then(() => {
          this.getNoticeList()
          this.$eventBus.$emit('handleStateChange', 'refresh')
        })
      }
    },
    handleNoticeOperation(item) {
      let params = {
        _id: item._id,
        isRead: item.isRead,
        isHandle: true
      }
      noticeMailReadSubmit(params).then(res => {
        this.$message.success(res.msg)
        this.getNoticeList()
        this.$eventBus.$emit('handleStateChange', 'refresh')
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getNoticeList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getNoticeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-collapse {
  margin-top: 15px;
  .collapse-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 98%;
    .collapse-title {
      font-size: 15px;
      font-weight: 700;
      color: #353535;
    }
    .isRead {
      color: #9a9a9a;
    }
  }
  .collapse-info {
    font-size: 15px;
    color: #9a9a9a;
  }
  .collapse-top-right {
    display: flex;
    .collapse-time {
      display: block;
      width: 170px;
    }
    .collapse-handle {
      display: block;
      width: 100px;
    }
  }
}
</style>
