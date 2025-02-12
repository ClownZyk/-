<template>
  <div class="comments-list">
    <div class="search">
      <el-cascader v-model="categoryIds" :options="options" change-on-select clearable expand-trigger="hover"></el-cascader>
      <el-input v-model="title" style="width: 220px;" placeholder="请输入内容"></el-input>
      <el-button type="primary">查询</el-button>
    </div>
    <!--列表-->
    <div class="comments-mian">
      <div class="comments-item" v-for="item in commentsList" :key="item.value">
        <div class="comments-item-main">
          <div class="comments-item-t"  style="position: relative;">
            <i class="iconfont icon-guanbi" @click.stop="option(item, 2, '删除')"></i>
            <div class="comments-item-title">
              <div class="comments-item-img"
                   :style="{'background-image': 'url('+item.imgSource[0].url+')'}">
              </div>
              <div class="comments-item-name">{{item.collectTitle}}</div>
            </div>
            <div style="position: absolute;bottom: 10px;right: 10px;text-decoration: underline;cursor: pointer;" @click="clickDetail(item)">详情</div>
          </div>
          <div class="comments-item-b">
            <div class="comments-list-txt">
              <div class="comment-txt">
                <span class="comment-per">{{item.userName}}</span>
                <span class="comment-content">{{item.content}}</span>
              </div>
              <div class="comment-time">{{item.createTime}}</div>
            </div>
            <div class="comments-list-txt" :style="{opacity: item.replys.replyName !== null && item.replys.replyName !== '' ? 1 : 0}">
            <div class="comment-txt">
            <span class="comment-per">{{item.replys.replyName}}：</span>
            <span class="comment-content">{{item.replys.replyContent}}</span>
            </div>
            <div class="comment-time">{{item.replys.replyTime.toString().split('T')[0]}}<i class="el-icon-delete" @click.stop="option(item, 4, '删除')"></i></div>
            </div>
            <el-input placeholder="回复：" @keyup.enter.native="replay(item)" v-model="item.replayText" :disabled="item.replys.replyName !== null && item.replys.replyName !== ''"></el-input>
          </div>
        </div>
      </div>
    </div>
    <!--分页-->
    <el-pagination
      v-show="total !== 0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    <!--弹出层-->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="400px">
      <!--商品-->
      <div class="detail-name">
        <div class="user-msg">
          <div class="user-img goods" :style="{'background-image': 'url('+detail.imgSource+')'}"></div>
          <div class="user-txt">
            <div>{{detail.collectTitle}}</div>
          </div>
        </div>
      </div>
      <!--评论-->
      <div class="detail-name">
        <div class="user-msg">
          <div class="user-img"  :style="{'background-image': 'url('+detail.userImg+')'}"></div>
          <div class="user-txt">
            <div>{{detail.userName}}：</div>
            <div class="user-time">{{detail.createTime}}</div>
          </div>
        </div>
        <div class="user-content">{{detail.content}}</div>
      </div>
      <!--回复-->
      <div class="detail-name" style="margin-top: 15px;"  v-show="detail.replys.replyName !== null && detail.replys.replyName !== ''">
      <div class="user-msg">
      <div class="user-img" :style="{'background-image': 'url('+detail.replys.replyHead+')'}"></div>
      <div class="user-txt">
      <div>{{detail.replys.replyName}}：</div>
      <div class="user-time">{{detail.replys.replyTime}}</div>
      </div>
      </div>
      <div class="user-content">{{detail.replys.replyContent}}</div>
      </div>
      <div class="shenhe">审核通过<el-switch v-model="detail.isIncluded" @change="showClick(detail)"></el-switch></div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {EvaluateList, EvaluateOperation, GetAllCategory} from '@/api/system'
  export default {
    data() {
      return {
        dialogVisible: false,
        category: '',
        // 分类id列表
        categoryIds: [],
        detail: {
          replys: {}
        },
        title: '',
        replayText: '', // 回复文字
        options: [],
        commentsList: [],
        pageIndex: 1,
        pageSize: 2,
        total: 0,
        Action: {}
      }
    },
    methods: {
      init() {
        if (this.$route.path === '/scrm-detail' && this.$route.query.openid === undefined) {
          this.commentsList = []
        } else {
          if (this.categoryIds.length > 0) {
            this.category = this.search.categoryIds[this.search.categoryIds.length - 1]
          } else {
            this.category = ''
          }
          let params = {
            collectTable: '',
            collectId: this.$route.query.id,
            content: this.title,
            openid: this.$route.query.openid,
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
          EvaluateList(params).then(res => {
            if (res.success) {
              this.loading = false
              this.commentsList = res.data
              this.total = res.total
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }
      },
      // 获取所有分类
      GetAllCategory() {
        let params = {
          belongMenu: '/product-category',
          isPage: false,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        GetAllCategory(params).then(res => {
          if (res.success) {
            this.options = res.data
          } else {
            this.$message.error(res.msg)
          }
        }, err => {
          console.log(err)
        })
      },
      // 回车触发回复
      replay(item) {
        item.replys.replyContent = item.replayText
        item.replys.creater = this.$store.state.UserID
        item.replys.replyName = this.$store.state.UserName
        console.log(item)
        let params = {
          dto: item,
          action: 1
        }
        EvaluateOperation(params).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.init()
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 点击详情
      clickDetail(dto) {
        this.dialogVisible = true
        this.detail = dto
        console.log(dto)
      },
      // 修改
      option(dto, action, txt) {
        let params = {
          action: action,
          dto: dto
        }
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (action === 4) {
            params.dto.replys = {}
            params.action = 1
          }
          EvaluateOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.init()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      // 是否审核
      showClick(dto) {
        // this.detail.isIncluded = !this.detail.isIncluded
        // console.log(dto)
        let params = {
          action: 1,
          dto: dto
        }
        EvaluateOperation(params).then(res => {
          if (res.success) {
            this.dialogVisible = false
            this.$message.success(res.msg)
            this.init()
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.init()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.init()
      }
    },
    mounted() {
      this.init()
      this.GetAllCategory()
    }
  }
</script>

<style lang="scss" scoped>
  .comments-list{
    padding: 10px;
    .search{
      padding: 0 10px;
    }
    /*留言列表*/
    .comments-mian{
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      .comments-item{
        flex: 0 0 20%;
        min-width: 300px;
        min-height: 240px;
        padding: 0 10px;
        margin-top: 10px;
        cursor: pointer;
        .comments-item-main {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background-color: #FCFCFC;
          &:hover {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          }
          .comments-item-t {
            width: 100%;
            height: 30%;
            border-radius: 10px 10px 0 0;
            background-color: #409EFF;
            padding: 10px;
            position: relative;
            color: #ffffff;
            .iconfont {
              position: absolute;
              top: 5px;
              right: 5px;
            }
            .comments-item-title {
              margin-top: 10px;
              display: flex;
              display: -webkit-flex;
              .comments-item-img{
                width: 40px;
                height: 40px;
                background-color: #f2f2f2;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
              }
              .comments-item-name{
                padding-left: 5px;
              }
            }
          }
          .comments-item-b{
            width: 100%;
            height: 70%;
            padding: 10px;
            .comments-list-txt{
              .comment-txt{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                .comment-per{
                  font-size: 16px;
                  color: #223041;
                }
                .comment-content{
                  font-size: 15px;
                }
              }
              .comment-time{
                text-align: right;
                font-size: 12px;
                margin: 3px 0;
                color: #99A9BF;
                display: flex;
                display: -webkit-flex;
                justify-content: space-between;
                i{
                  margin-left: 5px;
                  color: red;
                }
              }
            }
          }
        }
      }
    }
    .pagination{
      float: right;
      margin-top: 10px;
    }
  }
  .detail-name{
    font-size: 16px;
    line-height: 1.5;
    .user-msg{
      display: flex;
      display: -webkit-flex;
      .user-img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f2f2f2;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .goods{
        border-radius: 0;
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      .user-txt{
        padding-left: 5px;
        .user-time{
          font-size: 14px;
          color: #99A9BF;
        }
      }
    }
    .user-content{
      line-height: 1.5;
      font-size: 15px;
      text-indent:2em;
    }
  }
  .shenhe{
    margin-top: 10px;
    font-size: 16px;
    font-weight: bolder;
    .el-switch{
      margin-left: 10px;
    }
  }
</style>
