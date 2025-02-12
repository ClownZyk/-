<template>
  <div class="notice-wrapper">
    <div class="notice-list" v-if="noticeList.length > 0" v-infinite-scroll="listLoad" infinite-scroll-disabled="disabled" infinite-scroll-distance="50">
      <div class="notice-item" v-for="(item, index) in noticeList" :key="index" @click="handleNoticeView(item)">
        <div class="notice-item-title">
          <span :class="[item.isRead ? 'isRead' : '']">{{ item.title }}</span>
          <div>
            <!--
              <el-popconfirm v-if="item.isRead" title="确认已处理完成？" @confirm="handleNoticeOperation(item)">
                <span slot="reference" class="tips">已读(<span style="color:#F56C6C;cursor:pointer">未处理</span>)</span>
              </el-popconfirm>
            -->
            <span class="tips" v-if="!item.isRead">未读</span>
          </div>
        </div>
        <div class="notice-item-content">{{ item.content }}</div>
        <div class="notice-item-time">
          <span>{{ item.createTime }}</span>
          <!--
            <span>
              <el-button type="text" @click="handleNoticeView(item)"> <span>去查看</span> <i class="el-icon-arrow-right"></i> </el-button>
            </span>
          -->
        </div>
      </div>
      <p class="tips" v-if="listLoading">加载中...</p>
      <!-- <p class="tips" v-if="noMore">没有更多了</p> -->
    </div>
    <div class="no-notice" v-else><el-empty description="暂无新消息通知"></el-empty></div>
    <div class="notice-center" @click="handleNoticeCenter">前往通知中心</div>
  </div>
</template>

<script>
import { getNoticeMailList, noticeMailReadSubmit } from '@/api/system'

export default {
  props: {
    isPopoverShow: {
      type: Boolean,
      default: false
    },
    unReadNoticeNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      noticeList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    noMore() {
      return this.pageIndex >= this.total / this.pageSize
    },
    disabled() {
      return this.listLoading || this.noMore
    }
  },
  mounted() {
    this.getNoticeList()
    this.$eventBus.$on('handleStateChange', this.getNoticeList)
  },
  methods: {
    getNoticeList(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        isRead: false,
        isHandle: false,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getNoticeMailList(params)
        .then(res => {
          this.listLoading = false
          if (refresh === 'refresh') {
            this.noticeList = res.data.listData
          } else {
            this.noticeList = this.noticeList.concat(res.data.listData)
          }
          this.total = res.data.total
          this.$emit('update:unReadNoticeNum', this.total)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    listLoad() {
      this.listLoading = true
      setTimeout(() => {
        this.pageIndex++
        this.getNoticeList()
        this.listLoading = false
      }, 1500)
    },
    // 查看通知信息
    handleNoticeView(item) {
      if (!item.isRead) {
        let params = {
          _id: item._id,
          isRead: true,
          isHandle: false
        }
        noticeMailReadSubmit(params).then(res => {
          this.getNoticeList('refresh')
        })
      }
      // 关闭popover弹框
      // this.$emit('update:isPopoverShow', false)
    },
    // 消息处理
    handleNoticeOperation(item) {
      let params = {
        _id: item._id,
        isRead: item.isRead,
        isHandle: true
      }
      noticeMailReadSubmit(params).then(res => {
        this.getNoticeList('refresh')
      })
    },
    // 前往通知中心
    handleNoticeCenter() {
      if (this.$route.name !== 'notice-list') {
        this.$router.push({ path: '/notice-list' })
      }
      this.$emit('update:isPopoverShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-wrapper {
  position: relative;
  max-height: calc(100vh - 100px);
  cursor: default;
  .notice-list {
    max-height: calc(100vh - 100px);
    padding-bottom: 40px;
    overflow-y: scroll;
    .notice-item {
      padding: 10px 0 4px;
      color: #9a9a9a;
      border-bottom: 1px solid #e7e7eb;
      .notice-item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        font-weight: 700;
        color: #353535;
        .tips {
          font-size: 14px;
          font-weight: 400;
          color: #9a9a9a;
        }
        .isRead {
          color: #9a9a9a;
        }
      }
      .notice-item-content {
        margin: 4px 0;
        font-size: 14px;
      }
      .notice-item-time {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        font-size: 13px;
      }
    }
    .tips {
      margin: 10px 0;
      text-align: center;
      color: #9a9a9a;
    }
  }
  .no-notice {
    height: 350px;
  }
  .notice-center {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 9999;
    width: 100%;
    height: 40px;
    line-height: 45px;
    text-align: center;
    font-size: 16px;
    color: #7d8cad;
    background: #ffffff;
    border-top: 1px solid #e7e7eb;
  }
}
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
