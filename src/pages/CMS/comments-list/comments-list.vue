<template>
    <div class="">
      <cms-comments></cms-comments>
    </div>
</template>

<script type="text/ecmascript-6">
  import CmsComments from '@/components/cms-comments'
    export default {
      components: {CmsComments}
    }
</script>

<style lang="scss" scoped>
.comments-list{
  padding: 20px 10px;
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
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
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
              font-size: 14px;
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
