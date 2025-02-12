<template>
  <div class="msg-main">
    <div class="main-item height-low">
      <div class="main-item-main">
        <div class="main-top-msg white-bg">
          <div class="main-top-bg">
            <img src="../../../../assets/scrm/consume.png" />
            <div class="main-top-title">
              <div class="main-title-cn">消费概况</div>
              <div class="main-title-en">Consunption profile</div>
            </div>
          </div>
        </div>
        <div class="main-bottom">
          <div class="bottom-flex">
            <div class="bottom-item">
              <div>本月订单数</div>
              <div class="bottom-price">{{ userStatus.monthCount }}</div>
            </div>
            <div class="bottom-item">
              <div>本月会员优惠总额</div>
              <div class="bottom-price">￥ {{ userStatus.monthMemberDiscountTotal.toFixed(2) }}</div>
            </div>
            <div class="bottom-item">
              <div>本月卡劵优惠总额</div>
              <div class="bottom-price">￥ {{ userStatus.monthPromotionTotal.toFixed(2) }}</div>
            </div>
            <div class="bottom-item">
              <div>本月营销优惠总额</div>
              <div class="bottom-price">￥ {{ userStatus.monthCardTotal.toFixed(2) }}</div>
            </div>
          </div>
          <div class="bottom-fee">
            <div>本月消费总额</div>
            <div class="fee-price">￥ {{ userStatus.monthPayTotal.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-item main-item-hover" :class="{ actived: isCur === 1 }">
      <div class="main-item-main">
        <div class="main-top-msg">
          <div class="main-top-bg">
            <img src="../../../../assets/scrm/card.png" />
            <div class="main-top-title">
              <div class="main-title-cn">会员卡劵</div>
              <div class="main-title-en">Member coupon</div>
            </div>
          </div>
          <div class="top-more" @click="_more(1)">更多</div>
        </div>
        <div class="main-bottom main-padding">
          <div class="no-data" v-if="cardList.length === 0">暂无数据</div>
          <div class="cards-list">
            <div class="cards-item" v-for="(item, index) in cardList" :key="index">
              <div class="card-item-type">{{ item.type | panCardTypes2Str }}</div>
              <div class="card-item-main">
                <div>
                  <span class="card-item-price">{{ item.title }}</span> <span class>{{ item.description }}</span>
                </div>
                <div class="card-item-time">到期时间：{{ item.effectEndDate | filterTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-item main-item-hover" :class="{ actived: isCur === 2 }">
      <div class="main-item-main">
        <div class="main-top-msg">
          <div class="main-top-bg">
            <img src="../../../../assets/scrm/addr.png" />
            <div class="main-top-title">
              <div class="main-title-cn">会员地址</div>
              <div class="main-title-en">Member address</div>
            </div>
          </div>
          <div class="top-more" @click="_more(2)">更多</div>
        </div>
        <div class="main-bottom main-padding">
          <div class="no-data" v-if="addresslist.length === 0">暂无数据</div>
          <div class="address-item" v-else v-for="(addr, index) in addresslist" :key="index">
            <div class="addr-item-name">{{ addr.receiveName }}</div>
            <div class="addr-item-msg">
              <div class="addr-item-tel">{{ addr.receivePhone }}</div>
              <div class="addr-item-addr">
                <div>{{ addr.province }} {{ addr.city }} {{ addr.area }}</div>
                <div>{{ addr.address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetAddressList, GetUserDetail } from '@/api/system'
import Filter from '@/components/js/Filters'
export default {
  mixins: [Filter],
  name: 'msg',
  data() {
    return {
      isCur: null,
      VipTime: [],
      cardList: [],
      addresslist: [],
      userStatus: {
        monthPayTotal: 0,
        monthCount: 0,
        monthMemberDiscountTotal: 0,
        monthPromotionTotal: 0,
        monthCardTotal: 0
      }
    }
  },
  mounted() {
    this._getDetail()
    this._getAddress()
  },
  methods: {
    _getDetail() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        GetUserDetail(parmas).then(res => {
          if (res.success) {
            this.userStatus = res.data
            this.cardList = [...res.data.giftCard, ...res.data.cashCard, ...res.data.discountCard, ...res.data.smallCard]
          }
        })
      }
    },
    _getAddress() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          Userid: this.$route.query.id
        }
        GetAddressList(parmas).then(res => {
          if (res.success) {
            this.addresslist = res.data
          }
        })
      }
    },
    _more(index) {
      if (this.isCur === index) {
        this.isCur = null
      } else this.isCur = index
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  margin: 20px 0;
  color: #cccccc;
  text-align: center;
}
.msg-main {
  display: flex;
  display: -webkit-flex;
  .main-item {
    width: 420px;
    height: 500px;
    transition: 1s;
    padding: 10px;
    .main-item-main {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      .main-top-msg {
        width: 100%;
        height: 120px;
        background-color: #0481ff;
        border-radius: 10px 10px 0 0;
        border-bottom: 1px solid #efefef;
        position: relative;
        .main-top-bg {
          width: 100%;
          height: 100%;
          border-top-right-radius: 100px;
          background-color: #ffffff;
          display: flex;
          display: -webkit-flex;
          align-items: center;
          transition: 1s;
          padding: 0 20px;
          .main-top-title {
            margin-left: 10px;
            .main-title-cn {
              font-size: 18px;
              font-weight: bold;
            }
            .main-title-en {
              font-size: 14px;
            }
          }
          img {
            width: 66px;
            height: 46px;
          }
        }
        .top-more {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #ffffff;
          display: none;
          transition: 1s;
          cursor: pointer;
        }
      }
      .main-bottom {
        height: calc(100% - 120px);
        overflow: hidden;
        overflow-y: scroll;
        .bottom-flex {
          display: flex;
          flex-wrap: wrap;
          .bottom-item {
            border-bottom: 1px solid #efefef;
            flex: 0 0 50%;
            text-align: center;
            padding: 20px 0;

            .bottom-price {
              color: #0481ff;
              margin-top: 10px;
              font-size: 20px;
              font-weight: 700;
            }
            &:nth-child(2n) {
              border-left: 1px solid #efefef;
            }
          }
        }
        .bottom-fee {
          padding: 15px;
          display: flex;
          display: -webkit-flex;
          justify-content: space-between;
        }
        .fee-price {
          color: #0481ff;
          font-size: 20px;
          font-weight: 700;
        }
      }
    }
  }
  .height-low {
    height: 400px;
  }
}
.white-bg {
  background-color: #ffffff !important;
}
// 会员卡劵
.main-padding {
  padding: 0 10px;
  .cards-item {
    display: flex;
    display: -webkit-flex;
    height: 80px;
    margin-top: 10px;
    .card-item-type {
      flex: 0 0 120px;
      height: 100%;
      background-color: #f5f5f5;
      color: #0481ff;
      font-size: 18px;
      line-height: 80px;
      text-align: center;
      font-weight: 700;
      border-radius: 10px;
      border-right: 1px dashed #ffffff;
    }
    .card-item-main {
      flex: 1;
      height: 100%;
      background-color: #f5f5f5;
      border-radius: 10px;
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      .card-item-price {
        font-size: 18px;
        font-weight: 700;
        margin-right: 10px;
      }
      .card-item-time {
        margin-top: 5px;
        font-size: 14px;
        color: #848484;
      }
    }
  }
}
// 会员地址
.address-item {
  display: flex;
  display: -webkit-flex;
  margin-top: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  .addr-item-name {
    padding: 0 15px;
    font-size: 16px;
    font-weight: 700;
    border-right: 1px dashed #ffffff;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .addr-item-tel {
    border-bottom: 1px dashed #ffffff;
    padding: 10px 20px;
  }
  .addr-item-addr {
    padding: 10px 15px;
    div {
      line-height: 1.5;
    }
  }
}
.main-item-hover:hover .main-top-bg {
  border-top-right-radius: 120px !important;
}
.main-item-hover:hover .top-more {
  display: block !important;
}
.actived {
  height: 600px !important;
}
</style>
