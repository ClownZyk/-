<template>
  <div class="list">
    <div class="list-item" :list-type="item.behaviorType" v-for="(item, index) in activities2" :key="index">
      <div class="right">{{item.createTime}}</div>
      <div class="left">
        <div class="left-item">
          <div class="name">{{item.behaviorType}}</div>
          <div class="content">{{item.behavior}}</div>
          <div class="log-link" v-show="item.relationId !== ''" @click="detailClick(item.relationTable, item.relationId)">点击跳转</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {UserLogList} from '@/api/system'
  export default {
    name: 'journal',
    data() {
      return {
        pageSize: 10,
        pageIndex: 1,
        activities2: []
      }
    },
    created() {
      this._initData()
    },
    methods: {
      detailClick(type, id) {
        if (type === 'GiftCard') {
          this.$router.push({
          })
        }
      },
      init() {
        if (this.$route.query.id !== undefined) {
          let parmas = {
            customerId: this.$route.query.id,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            isPage: true,
            isOrder: true,
            isAsc: true,
            creater: this.$store.state.UserID,
            roleid: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          UserLogList(parmas).then(res => {
            if (res.success) {
              this.activities2 = res.data
            } else this.$message.err(res.msg)
          }, err => { this.$message.err(err.msg) })
        }
      },
      _initData() {
        this.activities2 = this.activities2.map((item) => {
          item.time = item.time.slice(0, item.time.lastIndexOf(':')).replace(/-/g, '/')
          return item
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped lang="scss">
  .list {
    .list-item {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      padding-bottom: 30px;
      &:not(:last-child) {
        .left {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            width: 1px;
            margin-left: -1px;
            height: 100px;
            border-left: 1px solid #ddd;
          }
        }
      }
      .right {
        padding-right: 20px;
        position: relative;
        font-size: 16px;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          width: 8px;
          height: 8px;
          margin-top: -4px;
          margin-right: -4px;
          border-radius: 50%;
          z-index: 1;
        }
      }
      .left {
        padding-left: 20px;
        font-size: 15px;
        position: relative;
        .left-item{
          display: flex;
          display: -webkit-flex;
          align-items: flex-end;
          .content {
            margin-left: 10px;
            font-size: 12px;
            color: #aaa;
          }
          .log-link {
            font-size: 12px;
            text-decoration: underline;
            margin-left: 10px;
            color: #2299dd;
            cursor: pointer;
            &:hover{
              color: #409EFF;
            }
          }
        }
      }
    }
  }
  .list-item[list-type='签到'] {
    .right {
      &::after {
        background-color: #409EFF;
      }
    }
    .left {
      .name {
        color: #409EFF;
      }
    }
  }
  .list-item[list-type='buy'] {
    .right {
      &::after {
        background-color: #FFA340;
      }
    }
    .left {
      .name {
        color: #FFA340;
      }
    }
  }
  .list-item[list-type='卡券'] {
    .right {
      &::after {
        background-color: #FF4040;
      }
    }
    .left {
      .name {
        color: #FF4040;
      }
    }
  }
  .list-item[list-type='vip'] {
    .right {
      &::after {
        background-color: #60D551;
      }
    }
    .left {
      .name {
        color: #60D551;
      }
    }
  }
  .list-item[list-type='join'] {
    .right {
      &::after {
        background-color: #60D551;
      }
    }
    .left {
      .name {
        color: #60D551;
      }
    }
  }
</style>
