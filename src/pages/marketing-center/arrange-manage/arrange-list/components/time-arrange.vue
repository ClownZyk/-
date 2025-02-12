<template>
<div>
 <div class="arrange-flex">
   <div>
    <el-calendar v-model="datTime" class="arrange-time">
      <template slot="dateCell" slot-scope="{date, data}">
         <div slot="reference" class="div-Calendar" @click="calendarOnClick(data)">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{data.day.split('-')[2]}}
            <!-- <i :class="[data.isSelected ?'el-icon-check':'']"></i> -->
          </p>
        </div>
      </template>
    </el-calendar>
   </div>
   <div class="time-list">
     <div class="time-item" v-for="(item, index) in timeList" :key="index">
      <div class="time-table">
         <div class="time-item-day">{{item.time | formatTime}}</div>
         <div class="time-item-Mon">{{item.week}}</div>
         <!-- <div>
           启用
           <el-switch v-model="item.isShow"> </el-switch>
         </div> -->
      </div>
      <div class="times-list">
        <div class="times-item"  v-for="(p, index) in item.timelist" :key="index" @click="operateFunc(item, '编辑', 1, p)">
          <div class="times-time"><i class="iconfont icon-shijian"></i> {{p.planTime}}</div>
        </div>
        <div class="item-add" @click="operateFunc(item, '添加', 0, {})">
          <i class="el-icon-circle-plus"></i>
          <span>添加</span>
        </div>
      </div>
     </div>
   </div>
 </div>
<!-- 预约详情 -->
<el-dialog
  title="预约详情"
  :visible.sync="dialogShow"
  width="850px">
      <div class="">
          <el-form :model="dialog" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
                 <el-form-item label="预约时间" prop="name" style="width: 460px;">
                    <el-time-picker is-range v-model="dialog.timerange" range-separator="至"
                      value-format="HH:mm"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围">
                  </el-time-picker>
                 </el-form-item>
                 <el-form-item><el-button size="small" type="primary" @click="_addProduct">添加商品</el-button></el-form-item>
          </el-form>
          <el-table :data="detailProductList" border class="table">
            <el-table-column label="编号" align="center" type="index" width="60"></el-table-column>
            <!-- <el-table-column  prop="_id" align="center" label="产品id" min-width="120" show-overflow-tooltip></el-table-column> -->
            <el-table-column  prop="productName" align="center" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" align="center" label="价格" min-width="146" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input-number controls-position="right" v-model="scope.row.price"  :min="0" size="mini"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="vipPrice" align="center" label="会员价" min-width="146"  :min="0" show-overflow-tooltip>
               <template slot-scope="scope">
                <el-input-number controls-position="right" v-model="scope.row.vipPrice" size="mini"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="dayCount" align="center" label="数量" min-width="146" :min="0" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input-number controls-position="right" v-model="scope.row.dayCount" size="mini"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogShow = false">取 消</el-button>
    <el-button type="primary" @click="_opeartion">确 定</el-button>
  </span>
</el-dialog>
<!-- 搜索产品 -->
<el-dialog
  title="产品"
  :visible.sync="searchShow"
  width="800px">
      <div class="">
          <el-form :model="search" label-width="100px" class="demo-ruleForm" :inline="true">
                 <el-form-item label="预约时间" prop="name" style="width: 460px;">
                    <el-input size="small" :value="searchName" placeholder="请输入搜索条件"></el-input>
                 </el-form-item>
                 <el-form-item><el-button size="small" type="primary" @click="searchproduct">搜索</el-button></el-form-item>
          </el-form>
          <el-table :data="shopList" border class="table" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="50"></el-table-column>
            <el-table-column label="编号" align="center" type="index" width="60"></el-table-column>
            <el-table-column  prop="productName" align="center" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" align="center" label="价格" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="vipPrice" align="center" label="会员价" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="searchShow = false">取 消</el-button>
    <el-button type="primary" @click="sureProduct" :disabled="selectList.length==0">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script type="text/ecmascript-6">
import {GetReserveList, GetReserveProduct, PlanOperation} from '@/api/system'
import {formatDate} from '@/components/js/data'
export default {
  name: 'arrange-list',
  data () {
    return {
      datTime: formatDate(new Date(), 'yyyy-MM-dd'), // 日历选择时间
      selectday: null,
      listLoading: false,
      searchName: '',
      search: {name: ''},
      value: new Date(),
      searchShow: false,
      detailProductList: [],
      selectList: [],
      shopList: [],
      dialogShow: false, // 弹框显示
      dialog: {
        timerange: [formatDate(new Date(), 'hh:mm'), formatDate(new Date(), 'hh:mm')]
      },
      rules: {
        timerange: [
           { required: true, message: '请选择预约时间', trigger: 'change' }
        ]
      },
      timeList: [],
      operateAction: null,
      total: null,
      pageSize: 5,
      pageIndex: 1
    }
  },
   filters: {
          formatTime(time) {
            return time && time.split('-')[2]
          }
   },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = val
    },
    sureProduct() {
      this.searchShow = false
      this.dialogShow = true
      if (this.detailProductList.length > 0) {
        this.detailProductList.map(item => {
          this.selectList = this.selectList.filter(p => item.productId !== p.productId)
      })
      }
      this.detailProductList = this.detailProductList.concat(this.selectList)
    },
    operateFunc(item, title, action, row) {
      this.dialog = row
      this.operateAction = action
      this.selectday = item.time
      switch (title) {
        case '添加':
          this.dialogShow = true
          this.detailProductList = []
          break
        case '编辑': // 编辑
          this.dialogShow = true
          this.dialog.timerange = row.planTime.split('~')
          this.detailProductList = row.product
          break
        case '删除': // 删除
          this.$confirm('确认删除吗？', '提示', {}).then(() => {
            this.operateAxios(row)
          })
          break
        case '编辑开关': // 更新开关
          this.operateAxios(row)
          break
        default:
          return false
      }
    },
    // 添加商品
    _addProduct() {
      this.searchShow = true
      this.searchproduct()
    },
    // 修改排单
    _opeartion() {
      let timeRange = this.dialog.timerange
      let dto = {
          reserveItemId: this.$route.query.id,
          singleTime: this.selectday,
          qcTime: `${timeRange[0]}~${timeRange[1]}`,
          product: this.detailProductList,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid,
          _id: this.operateAction !== 0 ? this.dialog._id : ''
        }
      let params = {
          dto: dto,
          action: this.operateAction
      }
      this.listLoading = true
      PlanOperation(params).then(res => {
          this.listLoading = false
          if (res.success) {
            this.GetListByPage()
            this.dialogShow = false
            this.$message.success(res.msg)
          }
        },
        err => {
          console.log(err)
          this.listLoading = false
        })
    },
    // 搜索产品
    searchproduct() {
      let params = {
        reserveItemId: this.$route.query.id, // 预约项目
        productName: this.searchName,
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
      GetReserveProduct(params).then(res => {
          this.listLoading = false
         if (res.success) {
           this.shopList = res.data.map(item => {
             return {
               reservePackId: '',
               reserveTypeName: '',
               productIds: [],
               productId: item._id,
               productName: item.productName,
               price: item.price,
               vipPrice: item.vipPrice,
               dayCount: item.dayCount
             }
           })
            this.total = res.total
         } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    // 日历点击查看项目
    calendarOnClick(e) {
      this.datTime = e.day
      this.GetListByPage()
    },
    // 获取项目数据
    GetListByPage () {
            let params = {
              ReserveItemId: this.$route.query.id,
              planTime: this.datTime,
              creater: this.$store.state.UserID,
              roleid: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            this.listLoading = true
          GetReserveList(params).then(res => {
              this.listLoading = false
            if (res.success) {
              this.timeList = res.data
            } else this.$message.error(res.msg)
            }, err => {
              console.log(err)
              this.listLoading = false
            })
          }
    }
}
</script>

<style lang="scss" scoped>
.arrange-flex{
   display: flex;
  display: -webkit-flex;
}
.time-list{
  margin-left: 20px;
  display: flex;
  display: -webkit-flex;
  .time-item{
    width: 160px;
    text-align: center;
    .time-table{
      padding: 10px 0;
      border-left: 1px solid #dddddd;
      border-top: 1px solid #dddddd;
      .time-item-day{
        font-size: 32px;
        color: #B4B4B4;
    }
    .time-item-Mon{
      color: #B4B4B4;
      margin: 15px 0;
      font-size: 24px;
    }
    }
  }
}
.time-item:last-child .time-table{
  border-right: 1px solid #dddddd;
}

.times-list{
  .times-item{
    border-right: 1px solid #dddddd;
    border-top: 1px solid #dddddd;
    padding: 5px 0;
    cursor: pointer;
    i{
      margin-right: 5px;
    }
    &:first-child{
      border-left: 1px solid #dddddd;
    }
  }
  .item-add{
    border: 1px solid #dddddd;
    color: #038CFF;
    padding: 5px 0;
    cursor: pointer;
  }
}
// 日历
._calendar .el-calendar-table .el-calendar-day {
  height: 46px;
}
.el-calendar{
  width: 340px;
  min-width: 340px;
}

.product-title{
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  margin-bottom: 10px;
  div{
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
