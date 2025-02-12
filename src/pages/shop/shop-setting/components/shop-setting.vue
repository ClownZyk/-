<template>
  <div class="page-contain">
    <!-- 表单 -->
    <el-form size="small" ref="shopDetail" :model="shopDetail" label-width="80px" label-position="top" class="form-contain" :rules="shopDetailRules">
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 门店名称 -->
          <el-row>
            <el-form-item prop="companyName">
              <div class="form-item-title">门店名称 <span class="border"></span> <span class="EnName">NAME</span></div>
              <el-input placeholder="请输入门店名称" v-model.trim="shopDetail.companyName"></el-input>
            </el-form-item>
          </el-row>
          <!-- 门店地址，经纬度 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="companyAddress">
                <div class="form-item-title">门店地址 <span class="border"></span> <span class="EnName">ADDRESS</span></div>
                <el-input placeholder="请输入门店地址" v-model.trim="shopDetail.companyAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="longitude">
                <div class="form-item-title">经度(0-180) <span class="border"></span> <span class="EnName"> lng </span></div>
                <el-input placeholder="请输入经度" v-model.trim="shopDetail.coordinate[0]"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="latitude">
                <div class="form-item-title">纬度(0-90) <span class="border"></span> <span class="EnName"> lat </span></div>
                <el-input placeholder="请输入纬度" v-model.trim="shopDetail.coordinate[1]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 店长，店长手机号，店铺编码 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="manager">
                <div class="form-item-title">店长 <span class="border"></span> <span class="EnName"> manager </span></div>
                <el-input placeholder="请输入店长名" v-model.trim="shopDetail.manager"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="managerPhone">
                <div class="form-item-title">店长手机号 <span class="border"></span> <span class="EnName"> phone </span></div>
                <el-input placeholder="请输入店长手机号" v-model.trim="shopDetail.managerPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="markCode">
                <div class="form-item-title">店铺编码 <span class="border"></span> <span class="EnName"> markCode </span></div>
                <el-input placeholder="请输入店铺编码" v-model.trim="shopDetail.markCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 门店属性，类型，状态 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item prop="attribute">
                <div class="form-item-title">门店属性 <span class="border"></span> <span class="EnName"> attribute </span></div>
                <el-select v-model="shopDetail.attribute" placeholder="请选择门店属性" style="width: 100%"> <el-option v-for="item in attribute.slice(1)" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="attribute">
                <div class="form-item-title">门店类型 <span class="border"></span> <span class="EnName"> shopType </span></div>
                <el-select v-model="shopDetail.shopType" placeholder="请选择门店类型" style="width: 100%"> <el-option v-for="item in shopType" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="attribute">
                <div class="form-item-title">门店状态 <span class="border"></span> <span class="EnName"> shopState </span></div>
                <el-select v-model="shopDetail.shopState" placeholder="请选择门店状态" style="width: 100%"> <el-option v-for="item in shopState" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 营业时间，客服电话，配送范围 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">营业时间 <span class="border"></span> <span class="EnName">TIME</span></div>
                <el-time-select
                  placeholder="开店时间"
                  v-model="startTime"
                  :picker-options="{
                    start: '06:00',
                    step: '01:00',
                    end: '23:00'
                  }"
                  style="width: 45%"
                >
                </el-time-select>
                <el-time-select
                  placeholder="闭店时间"
                  v-model="endTime"
                  :picker-options="{
                    start: '06:00',
                    step: '01:00',
                    end: '23:00',
                    minTime: startTime
                  }"
                  style="width: 45%"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="servicePhone">
                <div class="form-item-title">客服电话 <span class="border"></span> <span class="EnName">TEL</span></div>
                <el-input placeholder="请输入客服电话" v-model.trim="shopDetail.servicePhone"></el-input>
              </el-form-item>
              <!--
                <el-form-item prop="leastBuyTotal">
                  <div class="form-item-title">可配送消费最低金额/元<span class="border"></span> <span class="EnName"> money </span></div>
                  <el-input-number v-model="shopDetail.leastBuyTotal" :min="0" :controls="false" style="width: 100%"></el-input-number>
                </el-form-item>
              -->
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <!-- 31.985122 -->
                <div class="form-item-title">配送范围/m <span class="border"></span> <span class="EnName">distance</span></div>
                <el-input placeholder="请输入配送范围" v-model.trim="shopDetail.distance"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 门店简介 -->
          <el-row>
            <el-form-item>
              <div class="form-item-title">门店简介 <span class="border"></span> <span class="EnName">SUMMARY</span></div>
              <el-input type="textarea" :rows="2" placeholder="请输入门店简介" v-model="shopDetail.companyIntroduce"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <div class="form-item-title">是否为咖啡店 <span class="border"></span> <span class="EnName">ISDRINK</span></div>
              <el-switch v-model="shopDetail.isDrink"> </el-switch>
            </el-form-item>
          </el-row>
          <!-- 经营范围 -->
          <el-row>
            <el-form-item>
              <div class="form-item-title">经营范围 <span class="border"></span> <span class="EnName">RANGE</span></div>
              <el-checkbox-group v-model="shopDetail.range">
                <el-checkbox v-for="item in shopManageRange" :key="item.value" :label="item.value" border :disabled="shopDetail.isDrink && item.value === 3">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <!-- 门店各部分费用配置 -->
          <el-row>
            <el-col>
              <div class="form-item-title"><strong>零售费用配置</strong><span class="border"></span> <span class="EnName">SHOP</span></div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="最低消费金额">
                    <el-input-number v-model="shopDetail.shopFees.shop.leastBuyTotal" :min="0" label="最低消费金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="打包金额">
                    <el-input-number v-model="shopDetail.shopFees.shop.packingFee" :min="0" label="打包金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="配送金额">
                    <el-input-number v-model="shopDetail.shopFees.shop.deliverFee" :min="0" label="配送金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col>
              <div class="form-item-title"><strong>餐食费用配置</strong><span class="border"></span> <span class="EnName">FOOD</span></div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="最低消费金额">
                    <el-input-number v-model="shopDetail.shopFees.food.leastBuyTotal" :min="0" label="最低消费金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="打包金额">
                    <el-input-number v-model="shopDetail.shopFees.food.packingFee" :min="0" label="打包金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="配送金额">
                    <el-input-number v-model="shopDetail.shopFees.food.deliverFee" :min="0" label="配送金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col>
              <div class="form-item-title"><strong>饮品费用配置</strong><span class="border"></span> <span class="EnName">DRINK</span></div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="最低消费金额">
                    <el-input-number v-model="shopDetail.shopFees.drink.leastBuyTotal" :min="0" label="最低消费金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="打包金额">
                    <el-input-number v-model="shopDetail.shopFees.drink.packingFee" :min="0" label="打包金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="配送金额">
                    <el-input-number v-model="shopDetail.shopFees.drink.deliverFee" :min="0" label="配送金额" :step="0.01" step-strictly controls-position="right" style="width:100%"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- 小程序在线购买，门店是否启用 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">是否启用门店 <span class="border"></span> <span class="EnName">isOpen</span></div>
                <el-switch v-model="shopDetail.isOpen"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">小程序在线购买 <span class="border"></span> <span class="EnName">onlineOrder</span></div>
                <el-switch v-model="shopDetail.onlineOrder"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 门店logo，店长头像，店长企业邀请码 -->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">门店图片 <span class="border"></span> <span class="EnName">IMG</span></div>
                <my-upload :imgs="shopDetail.logoImgs" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('logoImg', 1, $event)" @handleUploadImg="handleUploadImg('logoImg', 1, $event)"></my-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">店长头像 <span class="border"></span> <span class="EnName">HEADIMAGE</span></div>
                <my-upload :imgs="shopDetail.headImgs" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('managerHeadImage', 1, $event)" @handleUploadImg="handleUploadImg('managerHeadImage', 1, $event)"></my-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div class="form-item-title">店长企业邀请码 <span class="border"></span> <span class="EnName">QRCODE</span></div>
                <my-upload :imgs="shopDetail.qrCodeImgs" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('managerQRCode', 1, $event)" @handleUploadImg="handleUploadImg('managerQRCode', 1, $event)"></my-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">店铺地址标记和配送区域绘制</el-divider>

          <el-form-item>
            <div class="description-content">
              <div class="describle-item"><strong>标记点操作：</strong></div>
              <div class="describle-item"><strong>添加/修改：</strong><span>1.自动标记：直接进行搜索选择地址自动标记；2.手动标记：若是地图上已有标记点，需先删除再手动点击标记；若地图上无标记点，则直接手动点击标记即可</span></div>
              <div class="describle-item"><strong>区域操作：</strong></div>
              <div class="describle-item"><strong>绘制：</strong><span>鼠标左键点击及移动即可绘制图形，鼠标左键双击即可结束绘制多边形</span></div>
              <div class="describle-item"><strong>编辑：</strong><span>选中图形后出现编辑点，拖动编辑点可移动顶点位置，双击实心编辑点可删除顶点</span></div>
              <div class="describle-item"><strong>删除：</strong><span>选中图形后按下delete键或点击删除按钮可删除图形</span></div>
              <div class="describle-item"><strong>中断：</strong><span>绘制或编辑过程中按下esc键可中断该过程</span></div>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="map-container">
              <div class="map-wap" ref="mapContainer">
                <div id="toolControl">
                  <div :class="['toolItem', activeType === 'marker' ? 'active' : '']" id="marker" title="店铺位置标记" @click.stop="handleActiveType"></div>
                  <div class="toolItem delete" id="delete" title="标记点删除" @click.stop="markerDelete">标记点删除</div>
                  <div :class="['toolItem', activeType === 'polygon' ? 'active' : '']" id="polygon" title="配送区域绘制" @click.stop="handleActiveType"></div>
                  <div class="toolItem delete" id="delete" title="区域删除" @click.stop="deleteLayer">区域删除</div>
                </div>
              </div>
              <div class="search">
                <el-input placeholder="请输入区域地址" clearable v-model.trim="searchAddress" @input="handleSearchAddress"> <el-button slot="append" icon="el-icon-search" @click="handleSearchAddress"></el-button> </el-input>
                <ul class="search-box" v-if="searchAddressList.length > 0">
                  <li v-for="item in searchAddressList" :key="item.id" @click.stop="onSearchAppointAddress(item, 'selectAddress')">
                    <div>{{ item.title }}</div>
                    <div class="search-text">{{ item.address }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 提交按钮 -->
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="conform(text)">{{ text }}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { VShopSetUpOperation, GetSetUpObj, tMapSuggestion } from '@/api/system'
import myUpload from '@/components/my-upload'
import Filters from '@/components/js/Filters'
import { formatDate } from '@/filters/filters'
import { $debounce } from '@/components/js/debounce'

export default {
  mixins: [Filters],
  data() {
    return {
      deliverMap: null,
      mapEditor: null,
      marker: null,
      polygon: null,
      activeType: 'marker',
      searchAddress: '',
      searchAddressList: [],
      dialogVisible: false,
      text: '提交',
      shopDetail: {
        distance: null,
        companyName: '',
        latitude: '',
        longitude: '',
        companyAddress: '',
        companyIntroduce: '',
        servicePhone: '',
        coordinate: ['', ''],
        onlineOrder: true,
        leastBuyTotal: 0,
        manager: '',
        managerPhone: '',
        markCode: '',
        attribute: 1,
        shopType: 1,
        isOpen: true,
        fromTime: null,
        toTime: null,
        range: [1, 3],
        isDrink: false,
        shopFees: {
          shop: {
            leastBuyTotal: 0,
            packingFee: 0,
            deliverFee: 0
          },
          food: {
            leastBuyTotal: 0,
            packingFee: 0,
            deliverFee: 0
          },
          drink: {
            leastBuyTotal: 0,
            packingFee: 0,
            deliverFee: 0
          }
        },
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      startTime: '',
      endTime: '',
      shopDetailRules: {
        companyName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
        companyAddress: [{ required: true, message: '请输入门店地址', trigger: 'blur' }],
        servicePhone: [{ required: true, message: '请输入客服电话', trigger: 'blur' }]
      }
    }
  },
  watch: {
    searchAddress(val) {
      if (!val) {
        this.searchAddressList = []
      }
    },
    'shopDetail.isDrink'(val) {
      if (val) {
        if (!this.shopDetail.range.includes(3)) {
          this.shopDetail.range.push(3)
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleActiveType(e) {
      this.activeType = e.target.id
      this.mapEditor.setActiveOverlay(this.activeType)
      if (this.activeType === 'marker') {
        if (this.shopDetail.coordinate.length > 0 && this.shopDetail.coordinate[0]) {
          this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
          this.mapEditor.setSelectable(true)
        } else {
          this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
        }
      } else if (this.activeType === 'polygon') {
        if (this.shopDetail.location.length > 0) {
          this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
          this.mapEditor.setSelectable(true)
          this.mapEditor.on('adjust_complete', geometry => {
            this.$set(this.shopDetail, 'location', geometry.paths)
          })
        } else {
          this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
        }
      }
    },
    initMap(coordinate, location) {
      this.deliverMap = new window.TMap.Map(this.$refs.mapContainer, {
        center: new window.TMap.LatLng(location[0] ? location[0].lat : coordinate[1] ? coordinate[1] : 39.90736606309809, location[0] ? location[0].lng : coordinate[0] ? coordinate[0] : 116.39825820922852),
        zoom: 16,
        viewMode: '2D',
        baseMap: 'vector'
      })
      this.initEditor(coordinate, location)
    },
    initEditor(coordinate, location) {
      this.marker = new window.TMap.MultiMarker({
        map: this.deliverMap,
        geometries: coordinate.length > 0 && coordinate[0] ? [{ position: new window.TMap.LatLng(coordinate[1], coordinate[0]) }] : []
      })
      this.polygon = new window.TMap.MultiPolygon({
        map: this.deliverMap,
        styles: {
          highlight: new window.TMap.PolygonStyle({
            color: 'rgba(255, 255, 0, 0.6)'
          })
        },
        geometries:
          location.length > 0
            ? [
                {
                  paths: location.map(item => {
                    return new window.TMap.LatLng(item.lat, item.lng)
                  })
                }
              ]
            : []
      })
      this.mapEditor = new window.TMap.tools.GeometryEditor({
        map: this.deliverMap, // 编辑器绑定的地图对象
        overlayList: [
          {
            overlay: this.marker,
            id: 'marker'
          },
          {
            overlay: this.polygon,
            id: 'polygon',
            selectedStyleId: 'highlight'
          }
        ],
        actionMode: window.TMap.tools.constants.EDITOR_ACTION.DRAW, // 编辑器的工作模式
        activeOverlayId: 'polygon', // 激活图层
        snappable: true // 开启吸附
      })
      if (this.shopDetail._id !== '000000000000000000000000') {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
        this.mapEditor.setSelectable(true)
      }
      this.mapEditor.on('draw_complete', geometry => {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.INTERACT)
        this.mapEditor.setSelectable(true)
        if (geometry.position) {
          this.$set(this.shopDetail, 'coordinate', [geometry.position.lng, geometry.position.lat])
        } else if (geometry.paths.length > 0) {
          this.$set(this.shopDetail, 'location', geometry.paths)
        }
      })
      this.mapEditor.on('adjust_complete', geometry => {
        this.$set(this.shopDetail, 'location', geometry.paths)
      })
      this.mapEditor.on('delete_complete', geometry => {
        this.$set(this.shopDetail, 'location', [])
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
      })
    },
    deleteLayer() {
      this.activeType = 'polygon'
      this.mapEditor.setActiveOverlay(this.activeType)
      this.mapEditor.delete()
      this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
    },
    markerDelete(type) {
      this.activeType = 'marker'
      this.mapEditor.setActiveOverlay(this.activeType)
      if (this.marker) {
        this.marker.setGeometries([])
        this.shopDetail.coordinate = []
      }
      if (type !== 'selectAddress') {
        this.mapEditor.setActionMode(window.TMap.tools.constants.EDITOR_ACTION.DRAW)
      }
    },
    handleSearchAddress: $debounce(function() {
      if (!this.searchAddress) {
        return false
      }
      tMapSuggestion({
        url: `https://apis.map.qq.com/ws/place/v1/suggestion?key=IGFBZ-NIQLX-Z3O4T-ZHBA3-CFHNE-MMFWG&keyword=${this.searchAddress}`
      }).then(ret => {
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
      this.marker.updateGeometries([{ position: new window.TMap.LatLng(item.location.lat, item.location.lng) }])
      this.$set(this.shopDetail, 'coordinate', [item.location.lng, item.location.lat])
      this.searchAddress = item.title
      this.searchAddressList = []
    },
    // 获取本机构商城设置信息
    init(refresh) {
      let parmas = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetSetUpObj(parmas).then(
        res => {
          if (res.success) {
            this.shopDetail = res.data
            this.startTime = formatDate(res.data.fromTime)
            this.endTime = formatDate(res.data.toTime)
            this.shopDetail.logoImgs = []
            this.shopDetail.headImgs = []
            this.shopDetail.qrCodeImgs = []
            if (res.data.logoImg !== null && res.data.logoImg.url !== '') {
              this.shopDetail.logoImgs.push({ url: res.data.logoImg.url })
            }
            if (res.data.managerHeadImage !== null && res.data.managerHeadImage.url !== '') {
              this.shopDetail.headImgs.push({ url: res.data.managerHeadImage.url })
            }
            if (res.data.managerQRCode !== null && res.data.managerQRCode.url !== '') {
              this.shopDetail.qrCodeImgs.push({ url: res.data.managerQRCode.url })
            }
            if (refresh !== 'refresh') {
              this.initMap(res.data.coordinate, res.data.location)
            }

            this.text = res.data._id === '000000000000000000000000' ? '新增' : '提交'
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },
    // 提交
    conform(action) {
      this.$refs.shopDetail.validate(valid => {
        if (valid) {
          if (!this.startTime || !this.endTime) {
            return this.$message.warning('请选择门店营业时间段！')
          }
          if (this.shopDetail.onlineOrder && this.shopDetail.range.length <= 0) {
            return this.$message.warning('请选择门店营业范围！')
          }
          if (!this.shopDetail.servicePhone) {
            return this.$message.warning('请填写客服电话！')
          }
          if (!this.shopDetail.coordinate[0] || !this.shopDetail.coordinate[1]) {
            return this.$message.warning('请在地图上设置门店地址经纬度信息！')
          }
          this.shopDetail = {
            ...this.shopDetail,
            fromTime: parseInt(this.startTime.split(':')[0]),
            toTime: parseInt(this.endTime.split(':')[0]),
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          let parmas = {
            dto: this.shopDetail,
            action: action === '提交' ? 1 : 0
          }
          this.$confirm('是否' + this.text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              VShopSetUpOperation(parmas).then(
                res => {
                  if (res.success) {
                    this.$message.success(res.msg)
                    this.init('refresh')
                  }
                },
                err => {
                  this.$message.error(err.msg)
                }
              )
            })
            .catch(() => {})
        }
      })
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (txt === 'logoImg') {
        this.shopDetail['logoImg'] = { url: '', thumUrl: '', absoluteUrl: '' }
      } else if (txt === 'managerHeadImage') {
        this.shopDetail['managerHeadImage'] = { url: '', thumUrl: '', absoluteUrl: '' }
      } else if (txt === 'managerQRCode') {
        this.shopDetail['managerQRCode'] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (txt === 'logoImg') {
        this.shopDetail['logoImg'] = JSON.parse(JSON.stringify(imgObj))
      } else if (txt === 'managerHeadImage') {
        this.shopDetail['managerHeadImage'] = JSON.parse(JSON.stringify(imgObj))
      } else if (txt === 'managerQRCode') {
        this.shopDetail['managerQRCode'] = JSON.parse(JSON.stringify(imgObj))
      }
    }
  },
  components: { myUpload }
}
</script>
<style lang="scss" scoped>
.page-contain {
  .form-contain {
    .el-form-item {
      .el-form-item__content {
        .form-item-title {
          font-weight: bolder;
          font-size: 16px;
          position: relative;
          .border {
            width: 1px;
            height: 16px;
            position: absolute;
            background-color: #000000;
            display: inline-block;
            top: 10px;
            margin-left: 8px;
          }
          .EnName {
            font-weight: normal;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            margin-left: 17px;
            text-transform: uppercase;
            span {
              font-size: #f2f2f2;
            }
          }
        }
      }
    }
  }
  .form-item-title {
    .border {
      width: 1px;
      height: 16px;
      background-color: #000000;
      display: inline-block;
      margin-left: 8px;
    }
  }
  .map-container {
    height: calc(100vh - 100px);
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
        height: 450px;
        overflow: hidden;
        overflow-y: scroll;
        padding: 0 10px;
        font-size: 14px;
        background: #fff;
        li {
          // padding: 5px 0;
          cursor: default;
          .search-text {
            margin-top: -15px;
            font-size: 12px;
            color: #989898;
          }
        }
      }
    }
    #toolControl {
      position: absolute;
      top: 10px;
      left: 430px;
      // width: 120px;
      z-index: 9999;
      .toolItem {
        width: 40px;
        height: 40px;
        float: left;
        margin: 1px;
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
        width: 80px;
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
