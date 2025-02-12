<template>
  <div class="monitor-container">
    <div class="monitor" v-if="containerIsShow">
      <!-- 监控配置 -->
      <div class="set-btn"><el-button type="primary" @click="gotoSetting()">监控配置</el-button></div>
      <!-- 监控列表 -->
      <div class="monitor-info">
        <!--
          <div class="filter" style="display:flex">
            <div id="video1"></div>
            <div id="video2"></div>
          </div>
          <div class="filter" style="display:flex">
            <div id="video3"></div>
            <div id="video4"></div>
          </div>
        -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane v-for="item in monitorList" :key="item._id" :label="item.shopName" :name="item.shopName">
            <div class="monitor-list">
              <div v-for="device in item.deviceSerial" :key="device.deviceSerial" :class="[item.deviceSerial.length === 1 ? 'one' : item.deviceSerial.length > 4 ? 'overfour' : 'two-four', 'monitor-item']">
                <div class="save-btn">
                  <el-button size="mini" type="primary" @click="startVideo(device.player)">开始录像</el-button>
                  <el-button size="mini" type="primary" @click="stopVideo(device.player)">结束录像</el-button>
                  <el-button size="mini" type="warning" @click="capturePicture(device.player)">视频截图</el-button>
                </div>
                <div :id="`video-${device.deviceSerial}`"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import EZUIKit from 'ezuikit-js'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import { getShopCameraList } from '@/api/system'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'store-monitor') {
        this.getMonitorList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      activeName: '',
      monitorList: [],
      deviceName: [],
      loading: false,
      containerIsShow: true
    }
  },
  computed: {
    ...mapState(['monitorToken'])
  },
  mounted() {
    this.getAccessToken()
  },
  methods: {
    ...mapMutations(['setMonitorToken']),
    // 获取token值
    getAccessToken() {
      axios({
        method: 'post',
        url: 'https://open.ys7.com/api/lapp/token/get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          appKey: '0c69271b499240d59c36263aae5f6184',
          appSecret: '426698b0acd3a18afeb9de304a613965'
        }
      })
        .then(res => {
          this.setMonitorToken(res.data.data.accessToken)
          this.getMonitorList()
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 获取token值
    // getAccessToken() {
    //   axios({
    //     method: 'post',
    //     url: 'https://open.ys7.com/api/lapp/token/get',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     params: {
    //       appKey: 'c662e704f07549b9bb217136329fb96a',
    //       appSecret: 'bf975bb9880d01b6d303585ef11b9738'
    //     }
    //   })
    //     .then(res => {
    //       let player1 = new EZUIKit.EZUIKitPlayer({
    //         id: 'video1', // 视频容器ID
    //         accessToken: res.data.data.accessToken,
    //         url: 'ezopen://open.ys7.com/K44636841/1.cloud.rec?begin=20221111103600&end=20221111235959',
    //         width: 817,
    //         height: 417
    //       })
    //       let player2 = new EZUIKit.EZUIKitPlayer({
    //         id: 'video2', // 视频容器ID
    //         accessToken: res.data.data.accessToken,
    //         url: 'ezopen://open.ys7.com/E36258892/2.cloud.rec?begin=20221109145600&end=20221109150000',
    //         width: 817,
    //         height: 417
    //       })

    //       let player3 = new EZUIKit.EZUIKitPlayer({
    //         id: 'video3', // 视频容器ID
    //         accessToken: res.data.data.accessToken,
    //         url: 'ezopen://open.ys7.com/E36258892/1.rec?begin=20221109145600&end=20221109150000',
    //         width: 817,
    //         height: 417
    //       })
    //       let player4 = new EZUIKit.EZUIKitPlayer({
    //         id: 'video4', // 视频容器ID
    //         accessToken: res.data.data.accessToken,
    //         url: 'ezopen://open.ys7.com/E36258892/2.rec?begin=20221109145600&end=20221109150000',
    //         width: 817,
    //         height: 417
    //       })
    //       this.player1 = player1
    //       this.player2 = player2
    //       this.player3 = player3
    //       this.player4 = player4
    //     })
    //     .catch(err => {
    //       console.log(err.msg)
    //     })
    // },
    // 获取监控列列表
    getMonitorList() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.loading = true
      getShopCameraList(params).then(
        res => {
          this.loading = false
          if (res.data && res.data.length > 0) {
            this.monitorList = res.data
            this.activeName = res.data[0].shopName
            this.deviceName.push(this.activeName)
            this.$nextTick(() => {
              this.initMonitor(res.data[0].deviceSerial)
            })
          } else {
            this.monitorList = []
            this.activeName = ''
          }
        },
        () => {
          this.loading = false
        }
      )
    },
    // 初始化视频
    initMonitor(device) {
      device.forEach(item => {
        let player = new EZUIKit.EZUIKitPlayer({
          id: `video-${item.deviceSerial}`, // 视频容器ID
          accessToken: this.monitorToken,
          url: `ezopen://open.ys7.com/${item.deviceSerial}/${item.channelNo}.live`,
          width: device.length === 1 ? 1672 : device.length > 4 ? 550 : 817,
          height: device.length === 1 ? 850 : device.length > 4 ? 278 : 417
        })
        item.player = player
      })
    },
    // 监控配置
    gotoSetting() {
      this.$router.push('/monitor-setting')
      this.deviceName = []
    },
    // tab页切换
    handleTabClick() {
      let repeat = this.deviceName.find(v => v === this.activeName)
      if (!repeat) {
        this.deviceName.push(this.activeName)
        let device = this.monitorList.find(item => item.shopName === this.activeName)
        this.initMonitor(device.deviceSerial)
      }
    },
    // 开始录像
    startVideo(player) {
      console.log(player)
      this.$message.success('开始视频录制...')
      player.startSave()
    },
    // 结束录像
    stopVideo(player) {
      this.$message.success('视频录制结束！')
      player.stopSave()
    },
    // 视频截图
    capturePicture(player) {
      this.$message.success('视频截图成功！')
      player.capturePicture()
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor {
  width: 100%;
  height: calc(100vh - 50);
  padding: 20px;
  background: #f7f7f7;
  .monitor-info {
    margin: 15px 0;
    .monitor-list {
      height: 850px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow: hidden;
      overflow-y: scroll;
      .save-btn {
        margin-bottom: 8px;
      }
      .monitor-item {
        margin-right: 10px;
        margin-bottom: 45px;
      }
      .one {
        width: 100%;
        height: 850px;
      }
      .two-four {
        width: 49%;
        height: 417px;
      }
      .overfour {
        width: 32.5%;
        height: 278px;
      }
    }
  }
}
</style>
