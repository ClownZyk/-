<template>
    <div class="face">
      <div class="face-matching">
        <div class="face-matching-title">匹配库</div>
        <ul class="matching-list">
          <li class="matching-item" v-for="item in matchingList" :key="item._id">
            <div class="matching-img" :style="{'background-image': 'url('+item.headImg+')'}"></div>
            <el-button type="danger" size="mini" style="margin: 6px 9px;" @click="noMatch(item._id)">解除匹配</el-button>
          </li>
        </ul>
      </div>
      <div class="face-matching mange">
        <div class="face-matching-title">人脸管理</div>
        <ul class="face-list">
          <li class="face-item" v-for="item in faceList" :key="item._id">
            <div class="face-img">
              <div class="face-img-item" :style="{'background-image': 'url('+item.headImg+')'}"></div>
              <div class="face-img-item" :style="{'background-image': 'url('+item.headImg+')'}"></div>
            </div>
            <div class="face-txt">
              <div>相似度：{{item.simliar}}%</div>
              <div>时间：{{item.createTime}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          matchingList: [
            {headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', _id: '12132'},
            {headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', _id: '12133'},
            {headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', _id: '12134'},
            {headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', _id: '12135'},
            {headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', _id: '12136'}
          ],
          faceList: [
            {_id: '1234', headImg: 'http://core.wxbos.cn/Files/Pictures/2019/4/16/fecf4e86-677b-4fa2-acda-71e2da95e78b.jpg', simliar: '100', createTime: '2019/04/20 12:12:32'}
          ]
        }
      },
      methods: {
        noMatch(_id) {
          console.log(_id)
        }
      }
    }
</script>

<style scoped lang="scss">
  .face{
    .face-matching{
      .face-matching-title{
        font-weight: bolder;
        font-size: 20px;
      }
      .matching-list{
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        margin-left: -15px;
        .matching-item{
          width: 100px;
          height: 140px;
          margin: 10px 0 0 15px;
          /*background-color: #FCFCFC;*/
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          .matching-img{
            width: 100%;
            height: 100px;
            background-color: #f2f2f2;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
          &:hover{
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .3);
          }
        }
      }
    }
    .mange{
      margin-top: 20px;
      .face-list{
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        margin-left: -15px;
        .face-item  {
          width: 200px;
          height: 160px;
          margin: 10px 0 0 15px;
          cursor: pointer;
          padding: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
          .face-img{
            display: flex;
            display: -webkit-flex;
            justify-content: space-between;
            .face-img-item{
              width: 80px;
              height: 80px;
              background-color: #f2f2f2;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
            }
          }
          .face-txt{
            margin-top: 5px;
            font-size: 14px;
            div{
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
</style>
