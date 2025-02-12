<template>
  <div class="detail">
    <div class="detail-top">
      <!--      <div class="detail-title theme-color">排单产品信息</div>-->
      <div class="">
        <el-button type="primary" size="mini" @click="_select(dialog)" style="margin-top: 10px;">选择产品</el-button>
      </div>
    </div>
    <!--    商品列表-->
    <div class="list-table">
      <el-table class="table-main" ref="skuList"
                v-show="skuList.length !== 0"
                :data="skuList" border tooltip-effect="dark"
                style="margin-top: 10px;">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column align="center" prop="productName" label="产品名称" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="sizeDimension" label="产品规格" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].title}} <span v-if="scope.row.d_sku.length > 1"><span style="color: red;">|</span> {{scope.row.d_sku[1].title}}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="barCode" label="产品条码" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].barcode}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="现价" min-width="70" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].price}} <span v-if="scope.row.d_sku.length > 1"><span style="color: red;">|</span> {{scope.row.d_sku[1].price}}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vipPrice" label="会员价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].vipPrice}} <span v-if="scope.row.d_sku.length > 1"><span style="color: red;">|</span> {{scope.row.d_sku[1].vipPrice}}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vipPrice" label="库存" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].dayCount}} <span  v-if="scope.row.d_sku.length > 1"><span style="color: red;">|</span> {{scope.row.d_sku[1].dayCount}}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sales" label="销量" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.d_sku[0].sales}} <span  v-if="scope.row.d_sku.length > 1"><span style="color: red;">|</span> {{scope.row.d_sku[1].sales}}</span></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="_option(1, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delectRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageIndex"
                       :page-size="pageSize"
                       :page-sizes="[10, 15, 20, 25]"
                       :total="total"
                       v-show="total !== 0"
                       layout="total, sizes, prev, pager, next"
                       background
                       style="float:right;">
        </el-pagination>
      </el-col>
    </div>
    <!--商品选择-->
    <el-dialog  title="产品信息" :visible.sync="productShow" width="800px">
      <el-form :model="dialog" label-width="100px" class="form">
        <div class="form-row" v-show="isEdit">
          <el-form-item  prop="name">
            <div class="form-item-title">产品条形码<span class="border"></span> <span class="EnName">code</span></div>
            <div>
              <el-input class="form-input" placeholder="请输入产品条形码" v-model="productCode"></el-input>
              <el-button type="primary" @click="_searchCode(productCode, null)">检索</el-button>
            </div>
          </el-form-item>
        </div>
        <div>
          <div class="form-row">
            <el-form-item  prop="name">
              <div class="form-item-title">产品名称<span class="border"></span> <span class="EnName">title</span></div>
              <el-input class="form-input" placeholder="请输入产品名称" v-model="dialog.title"></el-input>
            </el-form-item>
            <el-form-item  prop="name">
              <div class="form-item-title">产品简介<span class="border"></span> <span class="EnName">summary</span></div>
              <el-input class="form-input" type="textarea" :rows="3" placeholder="请输入产品简介" v-model="dialog.remark"></el-input>
            </el-form-item>
          </div>
          <el-table class="table-main" ref="skuList"
                    v-show="List.length !== 0"
                    :data="List" border tooltip-effect="dark"
                    style="margin-top: 10px;">
            <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
            <el-table-column align="center" prop="title" label="名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="price" label="现价" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="vipPrice" label="会员价" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="vipPrice" label="库存" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.dayCount"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="vipPrice" label="使用状态" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productShow = false">取 消</el-button>
        <el-button type="primary" @click="operation">编 辑</el-button>
      </div>
    </el-dialog>
    <!--产品编辑-->
    <el-dialog  title="产品编辑" :visible.sync="editShow" width="800px">
      <el-form :model="product" class="form">
        <div class="form-row" >
          <el-form-item  prop="name">
            <div class="form-item-title">产品名称<span class="border"></span> <span class="EnName">title</span></div>
            <el-input class="form-input" type='text' placeholder="请输入产品名称" v-model="product.productName"></el-input>
          </el-form-item>
          <el-form-item  prop="name">
            <div class="form-item-title">产品简介<span class="border"></span> <span class="EnName">summary</span></div>
            <el-input class="form-input" type="textarea" :rows="3" placeholder="请输入产品简介" v-model="product.remark"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-table class="table-main" ref="productList"
                v-show="productList.length !== 0"
                :data="productList" border tooltip-effect="dark"
                style="margin-top: 10px;">
        <el-table-column label="编号" align="center" type="index" width="80"></el-table-column>
        <el-table-column align="center" prop="price" label="现价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column align="center" prop="vipPrice" label="会员价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.vipPrice}}</template>
        </el-table-column>
        <el-table-column align="center" prop="vipPrice" label="库存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.dayCount"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="_edit(detail)">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {ProductSearch, DailyProdOperation, Getdailyproduct, DailyproductId} from '@/api/system'
  export default {
    data() {
      return {
        isEdit: true,
        editShow: false, // 编辑弹框
        productShow: false, // 产品弹框
        searchproductShow: false,
        productList: [], // 编辑产品列表
        productCode: '', // 产品条码
        dialog: {
          skuCount: 1,
          sortNo: 99,
          id: '',
          title: '',
          remark: ''
        },
        Act: 0,
        product: {}, // 产品修改
        List: [],
        skuList: [],
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        id: ''
      }
    },
    mounted() {
      if (this.$route.query.id !== undefined) {
        this.init()
      }
    },
    methods: {
      init() {
        this._detail()
      },
      // 详情
      _detail() {
        let params = {
          arrangeid: this.$route.query.id,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        Getdailyproduct(params).then(res => {
          if (res.success) {
            this.skuList = res.data
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 产品详情
      _productDetail(id) {
        let params = {
          _id: id
        }
        DailyproductId(params).then(res => {
          if (res.success) {
            console.log(res.data)
            this.dialog.id = res.data._id
            this.dialog.remark = res.data.remark
            this.dialog.productid = res.data.productid
            this.dialog.title = res.data.productName
            this.List = []
            res.data.d_sku.forEach(item => {
              let array = {
                barcode: item.barcode,
                dayCount: item.dayCount,
                price: item.price,
                sales: item.sales,
                sid: item.sid,
                title: item.title,
                vipPrice: item.vipPrice,
                state: item.dayCount !== 0
              }
              this.List.push(array)
            })
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      _select(dialog) {
        this.isEdit = true
        this.productShow = true
        this.dialog = dialog
        this.Act = 0
      },
      _edit(detail) {
        // this.product._id = detail._id
        this.$confirm('是否编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = {
            action: 1,
            dto: this.product
          }
          DailyProdOperation(arr).then(res => {
            if (res.success) {
              this.editShow = false
              this.$message.success(res.msg)
              this.product = {}
              this._detail()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      // 产品编辑
      _option(action, list) {
        this.productShow = true
        this.isEdit = false
        this.Act = 1
        this.id = list._id
        console.log(list)
        this._productDetail(list._id)
      },
      // 检索产品
      _searchCode(code, action) {
        let params = {
          name: '',
          barCode: code,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        ProductSearch(params).then(res => {
          if (res.success) {
            this.searchproductShow = true
            this.dialog.id = res.data._id
            this.dialog.remark = res.data.desc
            this.dialog.title = res.data.prodName
            this.List = res.data.objs
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      operation() {
        this.List = this.List.filter(k => k.state === true)
        console.log(this.dialog)
        let params = {
          arrangeid: this.$route.query.id,
          productid: this.isEdit ? this.dialog.id : this.dialog.productid,
          productName: this.dialog.title,
          remark: this.dialog.remark,
          d_sku: this.List,
          sortNo: this.dialog.sortNo,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid,
          _id: this.id
        }
        let arr = {
          action: this.Act,
          dto: params
        }
        this.$confirm('是否' + this.Act === 0 ? '新增' : '修改' + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(arr)
          DailyProdOperation(arr).then(res => {
            if (res.success) {
              this.productShow = false
              this.$message.success(res.msg)
              this._detail()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        })
      },
      delectRow (dto) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            action: 2,
            dto: dto
          }
          DailyProdOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this._detail()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        })
      },
      // pageSize 改变
      handleSizeChange (val) {
        this.pageSize = val
        this.GetListByPage()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.GetListByPage()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .vote-list-container{
    .detail{
      // width: calc(100% - 240px);
      // background-color: #ffffff;
      // position: fixed;
      // z-index: 998;
      // overflow-y: scroll;
      // height: 100%;
      // padding-bottom: 120px;
    }
  }
  .vote-list-container {
    padding: 20px;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filters-left {
      .filters-search {
        display: inline-block;
        width: 200px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
  /*弹框*/
  /deep/.form{
    .form-row{
      display: flex;
      display: -webkit-flex;
      .el-form-item{
        flex: 0 0 50%;
        .el-form-item__content{
          margin-left: 0 !important;
        }
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
          }
        }
        .form-input {
          width: 70%;
        }
      }
      .form-flex-all{
        flex: 0 0 100%;
        .form-input{
          width: 100%;
        }
      }
    }
  }
</style>
