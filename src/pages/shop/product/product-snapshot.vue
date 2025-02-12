<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <el-form :model="filterParam" inline>
      <el-form-item> <el-cascader v-model="filterParam.categoryId" :options="categoryList" :props="cateProps" clearable placeholder="请选择产品分类"></el-cascader> </el-form-item>
      <el-form-item> <el-input v-model="filterParam.productName" placeholder="请输入商品名检索" clearable @keyup.enter.native="getProductSnapshot('refresh')"></el-input> </el-form-item>
      <el-form-item> <el-input v-model="filterParam.barCode" placeholder="请输入商品条码" clearable @keyup.enter.native="getProductSnapshot('refresh')"></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="getProductSnapshot('refresh')">搜索</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="snapshotList" border>
      <el-table-column align="center" label="编号" width="60" type="index"></el-table-column>
      <el-table-column align="center" prop="productName" label="商品名称" min-width="280" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: #67C23A;" v-show="scope.row.mainImg !== null && scope.row.mainImg.url" class="iconfont icon-tupian"></span> {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="categoryName" label="商品分类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="barCode" label="商品条码" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.barCode + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.title + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="stock" label="库存" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.stock <= 5" style="color: red;">{{ scope.row.stock }}</span> <span v-else>{{ scope.row.stock }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="价格" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.price + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="vipPrice" label="会员价" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-for="(item, index) of scope.row.sku" :key="index">{{ item.vipPrice + '元' + (index + 1 !== scope.row.sku.length ? ';' : '') }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isShow" label="上下架" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isShow" style="color:#67C23A">上架</span> <span v-else style="color:#F56C6C">下架</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sellWell" label="是否热销" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.sellWell" style="color:#67C23A">是</span> <span v-else style="color:#F56C6C">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isTop" label="店长推荐" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isTop" style="color:#67C23A">是</span> <span v-else style="color:#F56C6C">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="快照时间" width="180" show-overflow-tooltip> </el-table-column>
      <el-table-column align="center" label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleProductSnapshotView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 25]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        background
        style="float:right;margin-top:15px"
      ></el-pagination>
    </el-col>

    <!-- 快照详情弹框显示 -->
    <el-dialog title="产品快照详情" :visible.sync="isProdSnapshotShow" width="1000px" @close="isProdSnapshotShow = false" :close-on-click-modal="false">
      <el-descriptions v-loading="detailLoading" :column="3" border>
        <el-descriptions-item label="商品名称"> {{ snapshotDetail.productName }} </el-descriptions-item>
        <el-descriptions-item label="商品分类"> {{ snapshotDetail.categoryName }} </el-descriptions-item>
        <el-descriptions-item label="商品单位"> {{ snapshotDetail.unitName }} </el-descriptions-item>
        <el-descriptions-item label="上下架"> <span v-if="snapshotDetail.isShow" style="color:#67C23A">上架</span> <span v-else style="color:#F56C6C">下架</span> </el-descriptions-item>
        <el-descriptions-item label="是否热销"> <span v-if="snapshotDetail.sellWell" style="color:#67C23A">是</span> <span v-else style="color:#F56C6C">否</span> </el-descriptions-item>
        <el-descriptions-item label="店长推荐"> <span v-if="snapshotDetail.isTop" style="color:#67C23A">是</span> <span v-else style="color:#F56C6C">否</span> </el-descriptions-item>
        <el-descriptions-item label="商品库存"> {{ snapshotDetail.stock }} </el-descriptions-item>
        <el-descriptions-item label="商品主图">
          <el-image v-if="snapshotDetail.mainImg && snapshotDetail.mainImg.url" style="width: 60px; height: 60px" :src="snapshotDetail.mainImg.url" fit="cover" :preview-src-list="[snapshotDetail.mainImg.url]"></el-image>
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item label="快照时间"> {{ snapshotDetail.createTime }} </el-descriptions-item>
        <el-descriptions-item label="商品sku" :span="2">
          <el-table :data="snapshotDetail.sku" border>
            <el-table-column align="center" prop="id" label="id" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="title" label="型号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="barCode" label="商品条码" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="单位换算" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                1{{ scope.row.unitName }} = {{ scope.row.convertCount }}{{ snapshotDetail.unitName }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price" label="价格" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="img" label="图片" width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <img v-if="scope.row.img && scope.row.img.url" :src="scope.row.img.url" style="max-width: 100%; max-height: 60px;" /> <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetAllCategory, getProductSnapshotList, getProductSnapshotDetail } from '@/api/system'

export default {
  data() {
    return {
      filterParam: {
        userId: '',
        stockOrShow: 0,
        queryStock: '',
        categoryId: '',
        productName: '',
        barCode: ''
      },
      snapshotList: [],
      categoryList: [],
      snapshotDetail: {
        sku: []
      },
      listLoading: false,
      detailLoading: false,
      isProdSnapshotShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      cateProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      },
      stockOrShowList: [{ value: 0, label: '全部' }, { value: 1, label: '有库存' }, { value: 2, label: '无库存' }, { value: 3, label: '已上架' }, { value: 4, label: '未上架' }, { value: 5, label: '热销' }, { value: 6, label: '店长推荐' }]
    }
  },
  watch: {
    isProdSnapshotShow(val) {
      if (!val) {
        this.snapshotDetail = {
          sku: []
        }
      }
    }
  },
  mounted() {
    this.GetAllCategory()
    this.getProductSnapshot()
  },
  methods: {
    // 加载商品分类
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
        this.categoryList = res.data
      })
    },
    getProductSnapshot(refresh) {
      if (refresh === 'refresh') {
        this.pageIndex = 1
      }
      let params = {
        userId: this.filterParam.userId,
        isStock: this.filterParam.stockOrShow === 1 || this.filterParam.stockOrShow === 2 ? this.filterParam.stockOrShow : 0,
        isShow: this.filterParam.stockOrShow === 3 ? 1 : this.filterParam.stockOrShow === 4 ? 2 : 0,
        queryStock: this.filterParam.queryStock,
        categoryId: this.filterParam.categoryId,
        productName: this.filterParam.productName,
        barCode: this.filterParam.barCode,
        sellWell: !!(this.filterParam.stockOrShow === 5),
        isTop: !!(this.filterParam.stockOrShow === 6),
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      getProductSnapshotList(params)
        .then(res => {
          this.listLoading = false
          this.snapshotList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleProductSnapshotView(row) {
      this.isProdSnapshotShow = true
      this.getProductSnapshotDetail(row)
    },
    getProductSnapshotDetail(row) {
      this.detailLoading = true
      getProductSnapshotDetail({ _id: row._id })
        .then(res => {
          this.detailLoading = false
          this.snapshotDetail = res.data
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getProductSnapshot()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getProductSnapshot()
    }
  }
}
</script>

<style lang="scss" scoped></style>
