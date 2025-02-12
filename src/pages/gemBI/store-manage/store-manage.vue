<template>
  <div class="page-container">
    <div v-loading="listLoading" class="store-container" v-if="containerIsShow">
      <el-form class="filters" :model="searchForm" :inline="true">
        <!-- 搜索筛选区域 -->
        <div class="filter-left">
          <el-form-item label="门店名称"> <el-input placeholder="请输入门店名称" v-model="searchForm.companyName" clearable></el-input> </el-form-item>
          <el-form-item label="门店地址"> <el-input placeholder="请输入门店地址" v-model="searchForm.companyAddress" clearable></el-input> </el-form-item>
          <el-form-item label="门店属性">
            <el-select v-model="searchForm.attribute" placeholder="全部属性" clearable> <el-option v-for="item in attribute" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          </el-form-item>
          <el-form-item> <el-button type="primary" @click="getAllShop('refresh')">搜索</el-button> </el-form-item>
        </div>
        <!-- 数据统计跳转 -->
        <div class="filter-right">
          <el-form-item> <el-button type="primary" @click="$router.push('/data-count')">数据统计</el-button> </el-form-item>
          <el-form-item> <el-button type="primary" @click="$router.push('/store-monitor')">门店监控</el-button> </el-form-item>
        </div>
      </el-form>
      <div class="alert">
        <el-alert
          title="若要开启门店拼团管理人员设置权限，需登录门店账号，在菜单‘商城—>商城设置’下的‘门店经营范围’中勾选‘云极小超团购’或者在中台账号下‘系统管理—>用户管理—>门店修改’进行‘门店经营范围’修改"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <!-- 各门店信息区域 -->
      <div class="store-information">
        <div class="store-item" v-for="item in allStoreList" :key="item._id" @click="getShopDetail(item)">
          <div class="info-title">
            <span>{{ item.companyName }}</span> <span>{{ item.markCode }}</span>
          </div>
          <div class="info-content">
            <div class="info-item info-flex">
              <div>
                <span>店长：</span><span>{{ item.manager }}</span>
              </div>
              <div>
                <span>{{ item.attribute | attributeFilter }}</span>
              </div>
            </div>
            <div class="info-item">
              <span>门店类型：</span><span>{{ item.shopType | shopTypeFilter }}</span>
            </div>
            <div class="info-item info-address-flex">
              <span style="white-space: nowrap;">地址：</span> <span>{{ item.companyAddress }}</span>
            </div>
            <div class="info-item">
              <span>营业时间：</span><span>{{ item.time }}</span>
            </div>
            <div class="card-shop-setting">
              <el-button size="mini" type="warning" @click.stop="goCardShopSetting(item)">云点卡面门店限制配置</el-button>
              <el-button size="mini" type="warning" @click.stop="handleGrouponManage(item)" :disabled="!item.range || !item.range.includes(4)">拼团管理人员设置</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[25, 35, 45, 55]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
          style="text-align:right"
        >
        </el-pagination>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { getAllStore } from '@/api/system'
import Filters from '@/components/js/Filters'
import { formatDate } from '@/filters/filters'
export default {
  mixins: [Filters],
  watch: {
    $route(to, from) {
      if (to.name === 'store-manage') {
        this.getAllShop()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      searchForm: {
        companyAddress: '',
        attribute: 0,
        companyName: ''
      },
      allStoreList: [],
      listLoading: false,
      pageIndex: 1,
      pageSize: 25,
      total: 0,
      containerIsShow: true
    }
  },
  mounted() {
    this.getAllShop()
  },
  methods: {
    // 获取所有店铺信息
    getAllShop(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getAllStore(params)
        .then(res => {
          this.listLoading = false
          this.allStoreList = res.data.map(item => {
            return {
              ...item,
              time: formatDate(item.fromTime) + ' - ' + formatDate(item.toTime)
            }
          })
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getShopDetail(item) {
      this.$router.push({
        path: '/store-detail',
        query: { cid: item.cid }
      })
      this.$store.commit('setStoreCid', item.cid)
    },
    goCardShopSetting(item) {
      this.$router.push({
        path: '/card-shop-setting',
        query: { cid: item.cid, creater: item.creater, roleId: item.roleId }
      })
    },
    handleGrouponManage(row) {
      this.$router.push({ path: '/shop-groupon-manage', query: { shopName: row.companyName, shopCid: row.cid } })
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllShop()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllShop()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button--primary {
  background-color: #3664b7;
  border-color: #3664b7;
}
.el-button.is-disabled {
  background-color: #a0cfff;
  border-color: #a0cfff;
}
/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #3664b7;
}
.page-container {
  background: #f7f7f7;
  .store-container {
    .filters {
      display: flex;
      justify-content: space-between;
    }

    .store-information {
      display: flex;
      flex-wrap: wrap;
      margin-left: -15px;
      .store-item {
        position: relative;
        width: 317px;
        height: 230px;
        margin: 0 0 20px 20px;
        padding: 17px 17px 10px;
        background: #3664b7;
        color: #ffffff;
        font-family: 'MicrosoftYaHei';
        box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        cursor: pointer;
        .card-shop-setting {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
        .info-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
        }
        .info-content {
          font-size: 14px;
          line-height: 19px;
          .info-item {
            margin-bottom: 10px;
          }
          .info-flex {
            display: flex;
            justify-content: space-between;
          }
          .info-address-flex {
            display: flex;
            justify-content: flex-start;
          }
        }
        &:hover {
          background: #fff;
          color: #3664b7;
          transition: all 0.5s;
        }
      }
    }
  }
}
</style>
