<template>
  <div class="container">
    <el-form :model="addForm">
      <el-form-item label="时间：">
        <el-date-picker v-model="addForm.createTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
      </el-form-item>
      <el-form-item label="用户：">
        <el-button type="primary" @click="selectedUser">选择用户</el-button>
        <el-input v-model="addForm.user.userName" disabled style="width: 300px;margin-top:10px"></el-input>
      </el-form-item>
      <el-form-item label="门店：">
        <el-select v-model="storeInfo.storeId" placeholder="请选择门店" @change="selectShop">
          <el-option v-for="item in shopList" :key="item._id" :value="item._id" :label="item.shopName">{{ item.shopName }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐食：">
        <el-button type="primary" :disabled="!storeInfo.storeId" @click="openFoodSelect">选择餐食商品</el-button>
        <el-table class="table-main" :data="products" border style="width:55%;margin-top:15px">
          <el-table-column align="center" label="编号" width="55" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="美食名称" width="220" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="d_sku.title" label="美食规格" width="140" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" label="价格" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ scope.row.d_sku.price }}元</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.d_sku.dayCount" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" label="总价" width="156" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{ parseFloat((scope.row.d_sku.dayCount * scope.row.d_sku.price).toFixed(2)) }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div>
          合计：<span style="color:#F56C6C;font-size: 18px">{{ totalCount }}</span
          >元
        </div>
      </el-form-item>
      <el-form-item>
        <el-button :loading="submitLoading" type="primary" @click="submitMeal">提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="isUserShow" title="餐食库" width="1000px" @closed="closed">
      <el-form ref="form" :model="search" label-width="80px" inline>
        <el-form-item> <el-input v-model.trim="search.activityName" width="160" placeholder="请输入餐食名称" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchBtn">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveSelected">保存</el-button> </el-form-item>
      </el-form>
      <el-table class="table-main" ref="listTable" :data="foodList" border tooltip-effect="dark" v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="serial" label="编号" width="55" type="index"></el-table-column>
        <el-table-column align="center" prop="prodName" label="美食名称" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="d_sku.barCode" label="美食条形码" min-width="160" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="d_sku.title" label="美食规格" min-width="160" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="d_sku.costPrice" label="成本价" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="d_sku.price" label="原价" min-width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" prop="d_sku.vipPrice" label="会员价" min-width="100" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-size="pageSize"
          :page-sizes="[15, 20, 30, 40]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          style="float:right;margin-top:15px"
        >
        </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllShop, UserCRMList, GetMealsProduct, foodPayOperation } from '@/api/system'
export default {
  data() {
    return {
      addForm: {
        createTime: '',
        user: {
          userId: '',
          userName: ''
        }
      },
      products: [],
      storeInfo: {
        storeId: ''
      },
      search: {
        activityName: ''
      },
      shopList: [],
      userList: [],
      foodList: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      isUserShow: false,
      listLoading: false,
      submitLoading: false
    }
  },
  created() {
    this.getShopList()
    this.getUserList()
  },
  computed: {
    totalCount() {
      let total = 0
      this.products.forEach(item => {
        total = parseFloat((total + item.d_sku.price * item.d_sku.dayCount).toFixed(2))
      })
      return total
    }
  },
  methods: {
    //  获取所有门店信息
    getShopList() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetAllShop(params).then(res => {
        if (res.success) {
          this.shopList = res.data
        }
      })
    },
    // 获取用户
    getUserList() {
      let parmas = {
        status: 0,
        identityid: '',
        nickName: '',
        phone: '',
        pageSize: 100,
        pageIndex: 1,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      UserCRMList(parmas).then(
        res => {
          if (res.success) {
            this.userList = res.data
          }
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 选择用户
    selectedUser() {
      let arr = this.shuffle(this.userList).map(item => {
        return {
          userId: item._id,
          userName: item.nickName || '--'
        }
      })
      this.addForm.user = arr[0]
    },
    // 门店选择
    selectShop(val) {
      this.queryParam = this.shopList.filter(item => {
        return item._id === val
      })[0]
      this.products = []
    },
    // 餐食
    openFoodSelect() {
      this.isUserShow = true
      this.getFoodList()
    },
    getFoodList() {
      let params = {
        name: this.search.activityName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.queryParam.shopCid
      }
      this.listLoading = true
      GetMealsProduct(params).then(
        res => {
          if (res.success) {
            this.listLoading = false
            this.foodList = this.handleData(res.data)
            this.total = res.total
          }
        },
        () => {
          this.listLoading = false
        }
      )
    },
    // 提交餐食订单
    submitMeal() {
      if (!this.addForm.createTime) {
        this.$message.warning('请选择时间！')
        return false
      }
      if (!this.addForm.user && !this.addForm.user.userId) {
        this.$message.warning('请选择用户！')
        return false
      }
      if (!this.storeInfo && !this.storeInfo.storeId) {
        this.$message.warning('请选择门店！')
        return false
      }
      if (!this.products.length) {
        this.$message.warning('请选择餐食！')
        return false
      }
      let params = {
        createTime: this.addForm.createTime,
        product: [
          {
            products: this.products
          }
        ],
        delivery: {
          sendTyppe: 3,
          storeInfo: this.storeInfo
        },
        user: this.addForm.user,
        pay: {
          payType: 14,
          discount: 100
        },
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.queryParam.shopCid
      }
      this.submitLoading = true
      // console.log(params)
      foodPayOperation(params).then(
        res => {
          if (res.success) {
            this.submitLoading = false
            this.$message.success(res.msg)
            this.clear()
          }
        },
        () => {
          this.submitLoading = false
        }
      )
    },

    // 选择餐食
    handleSelectionChange(val) {
      let arr = JSON.parse(JSON.stringify(val))
      this.productList = arr.map(item => {
        return {
          productId: item._id,
          name: item.prodName,
          d_sku: {
            title: item.d_sku.title,
            sid: item.d_sku.sid,
            price: item.d_sku.price,
            dayCount: 1
          }
        }
      })
    },
    // 保存选中的餐食
    saveSelected() {
      if (!this.productList.length) {
        this.$message.warning('至少选择1条数据！')
      } else {
        this.isUserShow = false
        let norepeatSelect = this.productList.filter(item => {
          return this.products.every(v => v.productId !== item.productId || v.d_sku.sid !== item.d_sku.sid)
        })
        this.products.push(...norepeatSelect)
      }
    },
    // 处理列表数据，拆分sku
    handleData(data) {
      let newList = []
      data.forEach(e => {
        if (e.msku && e.msku.length > 0) {
          e.msku.forEach(sku => {
            let obj = { ...e, d_sku: sku }
            newList.push(obj)
          })
        }
      })
      return newList
    },
    closed() {
      this.isUserShow = false
    },
    searchBtn() {
      this.pageIndex = 1
      this.getFoodList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getFoodList()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getFoodList()
    },
    // 清除数据
    clear() {
      this.addForm = {
        createTime: '',
        user: {
          userId: '',
          userName: ''
        }
      }
      this.products = []
      this.storeInfo = {
        storeId: ''
      }
    },
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    shuffle(arr) {
      const _arr = arr.slice()
      for (let i = 0; i < _arr.length; i++) {
        const j = this.getRandom(0, i)
        const t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
      }
      return _arr
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
