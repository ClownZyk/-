<template>
    <div class="chain">
      <div class="chain-item">
        <div class="chain-circle">
          <div class="chain-circle-text">
            <div>Stranggers</div>
            <div>陌生人</div>
          </div>
        </div>
        <div class="chain-right">
          <i class="iconfont icon-xiangyou"></i>
          <i class="iconfont icon-xiangyou right-icon"></i>
          <div class="chain-txt">吸引</div>
        </div>
      </div>
      <div class="chain-item">
        <div class="chain-circle" style="background-color: #FFC000;">
          <div class="chain-circle-text">
            <div>Vistors</div>
            <div>访问者</div>
          </div>
        </div>
        <div class="chain-right">
          <i class="iconfont icon-xiangyou"></i>
          <i class="iconfont icon-xiangyou right-icon"></i>
          <div class="chain-txt">转化</div>
        </div>
      </div>
      <div class="chain-item">
        <div class="chain-circle" style="background-color: #EE9252;">
          <div class="chain-circle-text">
            <div>Leads</div>
            <div>潜在用户</div>
          </div>
        </div>
        <div class="chain-right">
          <i class="iconfont icon-xiangyou"></i>
          <i class="iconfont icon-xiangyou right-icon"></i>
          <div class="chain-txt">购买</div>
        </div>
      </div>
      <div class="chain-item">
        <div class="chain-circle" style="background-color: #00B0F0;">
          <div class="chain-circle-text">
            <div>Customers</div>
            <div>消费者</div>
          </div>
        </div>
        <div class="chain-right">
          <i class="iconfont icon-xiangyou"></i>
          <i class="iconfont icon-xiangyou right-icon"></i>
          <div class="chain-txt">升华</div>
        </div>
      </div>
      <div class="chain-item">
        <div class="chain-circle" style="background-color: #0070C0;">
          <div class="chain-circle-text">
            <div>Prometers</div>
            <div>忠实粉丝</div>
          </div>
        </div>
        <div class="chain-right">
          <i class="iconfont icon-xiangyou"></i>
          <i class="iconfont icon-xiangyou right-icon"></i>
          <div class="chain-txt">推荐</div>
        </div>
      </div>
      <div class="chain-item">
        <div class="chain-circle" style="background-color: #F5F7FA;">
          <div class="chain-circle-text">
            <div style="margin-top: 10px;"> ··· </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'scrm-chain'
    }
</script>

<style scoped lang="scss">
.chain{
  padding-top: 50px;
  display: flex;
  display: -webkit-flex;
  height: 80vh;
  .chain-item {
    display: flex;
    display: -webkit-flex;
    .chain-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background-color: #BCB4AB;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      color: #ffffff;
      .chain-circle-text {
        font-weight: bolder;
        font-size: 16px;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        align-items: center;
        margin-top: 45px;
        div {
        }
      }
    }
    .chain-right {
      padding: 50px 10px 0;
      position: relative;
      i {
        font-size: 45px;
        color: #f2f2f2;
      }
      .right-icon {
        margin-left: -20px;
      }
      .chain-txt {
        position: absolute;
        top: 19px;
        color: #585858;
        left: 24px;
        font-size: 17px;
      }
    }
  }
}
</style>
