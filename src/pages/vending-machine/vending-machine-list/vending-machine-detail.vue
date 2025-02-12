<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <div class="detail">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="vending-machine-base-info">
            <el-alert title="客服电话修改后需重启机器才会更新" type="warning" :closable="false" style="margin-bottom: 8px"> </el-alert>
            <el-descriptions title="售卖机信息" :column="2" border>
              <template slot="extra">
                <el-button size="small" type="warning" @click="handleMachineUpdate">修改</el-button>
              </template>
              <el-descriptions-item label="自定义编码"> {{ machineDetail.vUnionCode }}</el-descriptions-item>
              <el-descriptions-item label="绑定店铺">
                <el-select v-if="isManage" size="small" v-model="machineDetail.cid" placeholder="请选择店铺" style="width:100%">
                  <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option>
                </el-select>
                <div v-else>{{ this.$store.state.loginData.organizationName }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="售卖机名称"> <el-input size="small" type="text" v-model.trim="machineDetail.name" placeholder="请输入售卖机名称"></el-input> </el-descriptions-item>
              <el-descriptions-item label="售卖机编码"> <el-input size="small" type="text" v-model.trim="machineDetail.vmCode" placeholder="请输入售卖机编码" :disabled="!!$route.query.vmcode"></el-input></el-descriptions-item>
              <el-descriptions-item label="售卖机位置"> <el-input size="small" type="text" v-model.trim="machineDetail.location" placeholder="请输入售卖机位置"></el-input></el-descriptions-item>
              <el-descriptions-item label="客服电话"> <el-input size="small" type="text" v-model.trim="machineDetail.phone" placeholder="修改后需重启机器才会更新"></el-input> </el-descriptions-item>
              <el-descriptions-item label="经度(0-180)"> <el-input-number size="small" v-model.trim="machineDetail.coordinate[0]" label="经度" :controls="false" style="width: 100%"></el-input-number></el-descriptions-item>
              <el-descriptions-item label="纬度(0-90)"> <el-input-number size="small" v-model.trim="machineDetail.coordinate[1]" label="纬度" :controls="false" style="width: 100%"></el-input-number></el-descriptions-item>
              <el-descriptions-item label="更新时间"> {{ machineDetail.updateTime || '--' }} </el-descriptions-item>
              <el-descriptions-item label="商户id"> {{ machineDetail.merchantId }} </el-descriptions-item>
              <el-descriptions-item label="商品包id"> {{ machineDetail.itemsetId }} </el-descriptions-item>
              <el-descriptions-item label="系统音量"> {{ machineDetail.volume }} </el-descriptions-item>
              <el-descriptions-item label="广告音量"> {{ machineDetail.adVolume }} </el-descriptions-item>
              <el-descriptions-item label="温度设定(℃)"> <el-input-number size="small" v-model="machineDetail.temp" :min="-50" :max="50" :controls="false" :step="0.1" step-strictly label="温度设定"></el-input-number> </el-descriptions-item>
              <el-descriptions-item label="压缩机开关"> <el-switch v-model="machineDetail.engineOnState"></el-switch> </el-descriptions-item>
              <el-descriptions-item label="售卖机图片">
                <my-upload :imgs="facadeImgs" :limitUploadImgs="1" @handleRemoveImg="handleRemoveImg('facadeImg', $event)" @handleUploadImg="handleUploadImg('facadeImg', $event)"> </my-upload>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-if="$route.query.vmcode" class="vending-machine-hardware-info">
            <el-descriptions title="售卖机硬件详情" :column="2" border>
              <template slot="extra"> </template>
              <el-descriptions-item label="售卖机编码"> {{ deviceDetail.code }} </el-descriptions-item>
              <el-descriptions-item label="客户端版本号"> {{ deviceDetail.clientVersion }} </el-descriptions-item>
              <el-descriptions-item label="设定温度(℃)"> {{ deviceDetail.targetTemp }} </el-descriptions-item>
              <el-descriptions-item label="当前温度(℃)"> {{ deviceDetail.temperature }} </el-descriptions-item>
              <el-descriptions-item label="压缩机开关"> <span v-if="deviceDetail.engineOn === 1" style="color:#67C23A">开</span> <span v-else style="color:#F56C6C">关</span> </el-descriptions-item>
              <el-descriptions-item label="当前音量"> {{ deviceDetail.volume }} </el-descriptions-item>
              <el-descriptions-item label="总储存空间(Mb)"> {{ deviceDetail.bytesTotal }} </el-descriptions-item>
              <el-descriptions-item label="空闲存储空间(Mb)"> {{ deviceDetail.bytesFree }} </el-descriptions-item>
              <el-descriptions-item label="可用摄像头数量"> {{ deviceDetail.cameraCount }} </el-descriptions-item>
              <el-descriptions-item label="可用重感数量"> {{ deviceDetail.gravityCount }} </el-descriptions-item>
              <el-descriptions-item label="灯状态"> <span v-if="deviceDetail.light === 0" style="color:#67C23A">正常</span> <span v-else style="color:#F56C6C">异常</span> </el-descriptions-item>
              <el-descriptions-item label="本地识别状态"> <span v-if="deviceDetail.detector === 0" style="color:#67C23A">正常</span> <span v-else style="color:#F56C6C">异常</span> </el-descriptions-item>
              <el-descriptions-item label="重感状态"> <span v-if="deviceDetail.gravitySensor === 0" style="color:#67C23A">正常</span> <span v-else style="color:#F56C6C">异常</span> </el-descriptions-item>
              <el-descriptions-item label="串口连接状态"> <span v-if="deviceDetail.serialPort === 0" style="color:#67C23A">正常</span> <span v-else style="color:#F56C6C">异常</span> </el-descriptions-item>
              <el-descriptions-item label="串口数据格式状态"> <span v-if="deviceDetail.serialPortDataFormat === 0" style="color:#67C23A">正常</span> <span v-else style="color:#F56C6C">异常</span> </el-descriptions-item>
              <el-descriptions-item label="ccid"> {{ deviceDetail.ccid }} </el-descriptions-item>
              <el-descriptions-item label="供电方式"> {{ deviceDetail.powerStatus === 1 ? '市电' : 'ups' }} </el-descriptions-item>
              <el-descriptions-item label="心跳上报时间戳"> {{ deviceDetail.deviceUpdateTimestamp }} </el-descriptions-item>
              <el-descriptions-item label="网络状态"> <span v-if="deviceDetail.onlineStatus === 1" style="color:#67C23A">在线</span> <span v-else style="color:#F56C6C">离线</span> </el-descriptions-item>
              <el-descriptions-item label="4G连接"> <span v-if="deviceDetail.networkInfo.mobile === 1" style="color:#67C23A">连接</span> <span v-else style="color:#F56C6C">未连接</span> </el-descriptions-item>
              <el-descriptions-item label="wifi连接"> <span v-if="deviceDetail.networkInfo.wifi === 1" style="color:#67C23A">连接</span> <span v-else style="color:#F56C6C">未连接</span> </el-descriptions-item>
              <el-descriptions-item label="网线连接"> <span v-if="deviceDetail.networkInfo.ethernet === 1" style="color:#67C23A">连接</span> <span v-else style="color:#F56C6C">未连接</span> </el-descriptions-item>
              <el-descriptions-item label="wifi强度"> {{ deviceDetail.networkInfo.signalWifi }} </el-descriptions-item>
              <el-descriptions-item label="4G强度"> {{ deviceDetail.networkInfo.signalMobile }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="map-container">
            <div class="map-wap" ref="mapContainer">
              <div id="toolControl">
                <div :class="['toolItem', activeType === 'marker' ? 'active' : '']" id="marker" title="位置标记" @click.stop="handleActiveType"></div>
                <div class="toolItem delete" id="delete" title="标记点删除" @click.stop="markerDelete">标记删除</div>
              </div>
            </div>
            <div class="search">
              <el-input placeholder="请输入售卖机投放地址" clearable v-model.trim="searchAddress" @input="handleSearchAddress"> <el-button slot="append" icon="el-icon-search" @click="handleSearchAddress"></el-button> </el-input>
              <ul class="search-box" v-if="searchAddressList.length > 0">
                <li class="search-item" v-for="item in searchAddressList" :key="item.id" @click.stop="onSearchAppointAddress(item, 'selectAddress')">
                  <div>{{ item.title }}</div>
                  <div class="search-text">{{ item.address }}</div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getAllStore, getVendingMachineDetail, getVendingMachineDeviceDetail, shopBindVendingMachineOperation, tMapSuggestion } from '@/api/system'
import { getDataString } from '@/filters/filters'
import myUpload from '@/components/my-upload'
import { $debounce } from '@/components/js/debounce'

export default {
  components: {
    myUpload
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      machineDetail: {
        cid: '',
        vmCode: '',
        vUnionCode: this.$route.query.vUnionCode,
        name: '',
        location: '',
        phone: '',
        temp: 0,
        engineOnState: false,
        coordinate: [],
        facadeImg: null,
        isTrade: true,
        merchantId: 0,
        itemsetId: 0,
        volume: 0,
        adVolume: 0
      },
      shopList: [],
      facadeImgs: [],
      deviceDetail: {
        networkInfo: {}
      },
      // 地图参数
      deliverMap: null,
      mapEditor: null,
      marker: null,
      polygon: null,
      activeType: 'marker',
      searchAddress: '',
      searchAddressList: []
    }
  },
  mounted() {
    if (this.isManage) {
      this.getAllShop()
      this.machineDetail.cid = localStorage.getItem('cid')
    }
    if (this.$route.query.vmcode) {
      // 获取售卖机详情
      this.getMachineDetail()
    } else {
      this.initMap()
    }
  },
  methods: {
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = [{ companyName: '中台总门店', cid: '5bf8c51c2f74c8157868e97d' }, ...res.data]
        }
      })
    },
    getMachineDetail() {
      getVendingMachineDetail({ vmcode: this.$route.query.vmcode }).then(res => {
        this.machineDetail = { ...res.data, vmCode: res.data.code, engineOnState: res.data.engineOn === 1 }
        this.facadeImgs = res.data.facadeImg && res.data.facadeImg.url ? [{ url: res.data.facadeImg.url }] : []
        this.initMap()
        if (res.data.code) {
          // 获取售卖机硬件信息
          this.getDeviceDeatil()
        }
      })
    },
    getDeviceDeatil() {
      getVendingMachineDeviceDetail({ vmcode: this.$route.query.vmcode }).then(res => {
        this.deviceDetail = { ...res.data, deviceUpdateTimestamp: getDataString(new Date(res.data.deviceUpdateTimestamp), 'yyyy/MM/dd hh:mm:ss') }
      })
    },
    handleMachineUpdate() {
      if (!this.machineDetail.name) {
        return this.$message.warning('售卖机名称不能为空')
      }
      if (!this.machineDetail.vmCode) {
        return this.$message.warning('售卖机编码不能为空')
      }
      if (!this.machineDetail.location) {
        return this.$message.warning('售卖机位置不能为空')
      }
      if (this.machineDetail.coordinate.length <= 0) {
        return this.$message.warning('经纬度不能为空')
      }
      if (this.machineDetail.temp === undefined) {
        return this.$message.warning('温度设定不能为空')
      }
      // if (!this.machineDetail.cid) {
      //   return this.$message.warning('请选择绑定的店铺信息')
      // }
      let params = {
        ...this.machineDetail,
        engineOn: this.machineDetail.engineOnState ? 1 : 0
      }
      // console.log(params)
      shopBindVendingMachineOperation(params).then(res => {
        this.$message.success(res.msg)
        this.$router.back()
      })
    },
    handleActiveType(e) {
      this.activeType = e.target.id
      this.mapEditor.setActiveOverlay(this.activeType)
      if (this.activeType === 'marker') {
        if (this.machineDetail.coordinate.length > 0 && this.machineDetail.coordinate[0]) {
          this.mapEditor.setActionMode(new window.TMap.tools.constants.EDITOR_ACTION.INTERACT())
          this.mapEditor.setSelectable(true)
        } else {
          this.mapEditor.setActionMode(new window.TMap.tools.constants.EDITOR_ACTION.DRAW())
        }
      }
    },
    initMap() {
      this.deliverMap = new window.TMap.Map(this.$refs.mapContainer, {
        center: new window.TMap.LatLng(this.machineDetail.coordinate[1] ? this.machineDetail.coordinate[1] : 39.90736606309809, this.machineDetail.coordinate[0] ? this.machineDetail.coordinate[0] : 116.39825820922852),
        zoom: 16,
        viewMode: '2D',
        baseMap: 'vector'
      })
      this.initEditor(this.machineDetail.coordinate)
    },
    initEditor(coordinate, type) {
      this.marker = new window.TMap.MultiMarker({
        map: this.deliverMap,
        geometries: coordinate.length > 0 && coordinate[0] ? [{ position: new window.TMap.LatLng(coordinate[1], coordinate[0]) }] : []
      })
      this.mapEditor = new window.TMap.tools.GeometryEditor({
        map: this.deliverMap, // 编辑器绑定的地图对象
        overlayList: [
          {
            overlay: this.marker,
            id: 'marker'
          }
        ],
        actionMode: window.TMap.tools.constants.EDITOR_ACTION.DRAW, // 编辑器的工作模式
        activeOverlayId: this.activeType, // 激活图层
        // selectable: true, // 开启点选功能
        snappable: true // 开启吸附
      })
      if (this.$route.query.vmcode || type === 'selectAddress') {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
        this.mapEditor.setSelectable(true)
      }
      if (type === 'selectAddress') {
        this.$set(this.machineDetail, 'coordinate', [coordinate[0], coordinate[1]])
      }
      this.mapEditor.on('draw_complete', geometry => {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
        this.mapEditor.setSelectable(true)
        if (geometry.position) {
          this.$set(this.machineDetail, 'coordinate', [geometry.position.lng, geometry.position.lat])
        }
      })
    },
    markerDelete(type) {
      this.activeType = 'marker'
      this.mapEditor.setActiveOverlay(this.activeType)
      if (this.marker) {
        this.marker.setGeometries([])
        this.machineDetail.coordinate = []
      }
      if (type !== 'selectAddress') {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
      }
    },
    handleSearchAddress: $debounce(function() {
      if (!this.searchAddress) {
        return false
      }
      tMapSuggestion({ url: `https://apis.map.qq.com/ws/place/v1/suggestion?key=IGFBZ-NIQLX-Z3O4T-ZHBA3-CFHNE-MMFWG&keyword=${this.searchAddress}` }).then(ret => {
        const response = JSON.parse(ret.data)
        if (response.status === 0) {
          this.searchAddressList = response.data
        } else {
          this.$message.error(response.message)
        }
      })
    }),
    onSearchAppointAddress(item, type) {
      this.markerDelete(type)
      this.deliverMap.setCenter(new window.TMap.LatLng(item.location.lat, item.location.lng))
      this.initEditor([item.location.lng, item.location.lat], type)
      this.searchAddress = item.title
      this.searchAddressList = []
    },
    // 图片上传成功回调
    handleUploadImg(txt, imgObj) {
      this.machineDetail[txt] = JSON.parse(JSON.stringify(imgObj))
    },
    // 删除图片
    handleRemoveImg(txt) {
      this.machineDetail[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  margin-top: 15px;
  .vending-machine-hardware-info {
    margin-top: 10px;
  }
  .map-container {
    height: calc(100vh - 130px);
    position: relative;
    .map-wap {
      width: 100%;
      height: 100%;
    }
    .search {
      position: absolute;
      top: 15px;
      left: 10px;
      width: 400px;
      z-index: 9999;
      .search-box {
        height: 350px;
        overflow: hidden;
        overflow-y: scroll;
        padding: 0 10px;
        font-size: 14px;
        background: #fff;
        .search-item {
          padding: 5px 0;
          cursor: default;
          .search-text {
            // margin-top: -15px;
            font-size: 12px;
            color: #989898;
          }
        }
      }
    }
    #toolControl {
      position: absolute;
      top: 15px;
      left: 430px;
      // width: 120px;
      z-index: 9999;
      .toolItem {
        width: 40px;
        height: 40px;
        float: left;
        margin: 1px 5px 1px 1px;
        padding: 4px;
        border-radius: 3px;
        background-size: 30px 30px;
        background-position: 4px 4px;
        background-repeat: no-repeat;
        box-shadow: 0 1px 2px 0 #e4e7ef;
        background-color: #ffffff;
        border: 1px solid #ffffff;
        cursor: pointer;
      }
      .delete {
        width: 90px;
        line-height: 30px;
        font-weight: 700;
        text-align: center;
      }
      .toolItem:hover {
        border-color: #789cff;
      }
      .active {
        border-color: #d5dff2;
        background-color: #d5dff2;
      }
      #marker {
        background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker_editor.png');
      }
      #polygon {
        background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/polygon.png');
      }
      // #delete {
      //   background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/delete.png');
      // }
    }
  }
}
</style>
