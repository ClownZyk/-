<template>
  <div class="contain-main">
    <div class="contain-list" v-if="containerIsShow">
      <div class="search">
        <el-row class="search-l">
          <el-input v-model="name" placeholder="请输入姓名" @keyup.enter.native="GetListByPage"></el-input>
          <el-button @click="GetListByPage" type="primary">搜索</el-button>
        </el-row>
        <el-button @click="operateFunc('', '新增', 0)" type="primary">新增</el-button>
      </div>
      <!--卡片列表-->
      <ul class="person-list" v-loading="loading">
        <router-link :to="{ path: '/channel-detail', query: { id: item._id } }" tag="li" class="person-item" v-for="(item, index) in personList" :key="index">
          <i class="iconfont icon-guanbi" @click.stop="operateFunc(item, '删除', 2)"></i>
          <div class="item-t">
            <div class="item-img" :style="{ 'background-image': 'url(' + setHeadImg(item.headImg) + ')' }">
              <div class="item-sex-bg" :class="item.sex === 0 ? '' : item.sex === 1 ? 'boy' : 'girl'">
                <i class="iconfont icon-nan" v-if="item.sex === 0"></i>
                <i class="iconfont icon-nv" v-else></i>
              </div>
            </div>
            <div class="item-t-r">
              <div class="item-msg">
                <span class="item-realname">{{ item.realName }}</span>
                <span class="item-nickname">{{ item.nickName }}</span>
              </div>
              <div class="item-tel">{{ item.phone }}</div>
            </div>
          </div>
          <div class="item-b">
            <div class="item-b-item">
              <div>状态：{{ item.jobState }}</div>
              <div>
                工号：<span>{{ item.jobNumber }}</span>
              </div>
            </div>
            <div class="item-b-item">
              <div>地址：{{ item.address }}</div>
            </div>
          </div>
        </router-link>
      </ul>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {ChannelGetListByPage, ChannelOperation} from '@/api/system'
export default {
    name: 'channel-list',
    watch: {
      '$route' (to, from) {
        if (to.name === 'channel-list') {
          this.GetListByPage()
          this.containerIsShow = true
        } else {
          this.containerIsShow = false
        }
      }
    },
    data() {
        return {
            // 控制列表显示还是子内容显示
            containerIsShow: true,
            // 分页相关
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            // 搜索条件（姓名）
            name: '',
            // 控制loading是否显示
            loading: false,
            // 人员列表
            personList: []
        }
    },
    methods: {
        setHeadImg: function (imgObj) {
          if (imgObj !== null && imgObj !== undefined) {
            // console.log(imgObj.url.replace(/\\/g, '/'))
            return imgObj.url ? imgObj.url.replace(/\\/g, '/') : ''
          }
          return ''
        },
        // pageSize 改变
        handleSizeChange (val) {
            console.log('pageSize 改变')
            this.pageSize = val
            this.GetListByPage()
        },
        // currentPage 改变
        handleCurrentChange (val) {
            console.log('currentPage 改变')
            this.pageIndex = val
            this.GetListByPage()
        },
        // 增删改查
        operateFunc: function (row, title, action) {
            if (action === 0) {
                this.$router.push('/channel-detail')
            } else if (action === 2) {
                this.$confirm('确认删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let parmas = {
                        dto: row,
                        action: action
                    }
                    ChannelOperation(parmas).then(res => {
                        this.$message({
                            message: res.msg,
                            type: res.success ? 'success' : 'error'
                        })
                        this.GetListByPage()
                    })
                })
            }
        },
        // 加载数据
        async GetListByPage () {
            let parmas = {
                realName: this.name,
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
            await ChannelGetListByPage(parmas).then(res => {
                if (res.success) {
                    this.loading = false
                    this.personList = res.data
                    this.total = res.total
                } else {
                    this.$message.error(res.msg)
                }
            }, err => {
                this.$message.error(err.msg)
            })
        }
    },
    mounted() {
      this.GetListByPage()
    }
}
</script>

<style scoped lang="scss">
.contain-main {
  padding: 20px;
  .contain-list {
    // position: fixed;
    // width: calc(100% - 240px);
    // height: calc(100vh - 90px);
    // overflow: scroll;
    .search {
      // 搜索
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      .search-l {
        display: flex;
        display: -webkit-flex;
        .el-button {
          margin-left: 20px;
        }
      }
    }
    .person-list {
      width: 100%;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      margin-left: -10px;
      .person-item {
        /*margin-right: 10px;*/
        padding: 10px;
        margin-left: 8px;
        padding-top: 20px;
        margin-top: 10px;
        cursor: pointer;
        flex: 0 0 268px;
        background-color: #fcfcfc;
        position: relative;
        .icon-guanbi {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #ea2000;
        }
        .item-t {
          display: flex;
          display: -webkit-flex;
          .item-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            background-color: #f2f6fc;
            position: relative;
            .item-sex-bg {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              right: 0;
              .iconfont {
                text-align: center;
                margin-left: 2px;
                line-height: 20px;
                color: #ffffff;
              }
            }
            .boy {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              right: 0;
              background-color: #2299dd;
            }
            .girl {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              right: 0;
              background-color: #ea2000;
            }
          }
          .item-t-r {
            padding-left: 10px;
            font-size: 14px;
            .item-msg {
              .item-realname {
                font-weight: bolder;
                font-size: 16px;
              }
              .iconfont {
                color: #ffba13;
              }
            }
            .item-tel {
              margin-top: 5px;
            }
          }
        }
        .item-b {
          font-size: 14px;
          .item-b-item {
            display: flex;
            display: -webkit-flex;
            div {
              flex: 1;
              span {
                color: #409eff;
                font-size: 16px;
                font-weight: bolder;
              }
            }
          }
        }
      }
      /*&:nth-child(7n) {*/
      /*margin-right: 0;*/
      /*}*/
      .person-item:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }
    .pagination {
      margin-top: 10px;
      float: right;
    }
  }
}
</style>
