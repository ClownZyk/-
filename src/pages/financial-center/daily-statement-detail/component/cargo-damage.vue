<template>
  <div class="container">
    <el-form class="filter" size="small" :model="searchForm" inline>
      <div class="filter-left">
        <el-form-item label="原料名称"> <el-input type="text" v-model.trim="searchForm.name" placeholder="请输入原料名称检索"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
      </div>
      <div class="filter-right">
        <el-form-item>
          <el-button type="warning" @click="handleFoodRawSelect(true)">餐食原料添加</el-button>
          <el-button type="success" @click="handleDrinkRawSelect(true)">饮品原料添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <el-table size="mini" :data="damageList" border>
        <el-table-column label="报损日期" prop="date" width="180" align="center"></el-table-column>
        <el-table-column label="产品名称" prop="name" min-width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品类别" prop="name" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">餐食</div>
            <div v-else-if="scope.row.type === 2">饮品</div>
          </template>
        </el-table-column>
        <el-table-column label="报损数量" prop="count" min-width="160" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.count }}{{ scope.row.unitName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="报损总成本" prop="cost" min-width="160" align="center"></el-table-column>
        <el-table-column label="报损备注" prop="cost" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.remark || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="editRaw(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteRaw(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="total-tip">
        <div class="total-tip-item">餐食原料货损总值：{{ foodDamageTotal }}</div>
        <div class="total-tip-item">饮品原料货损总值：{{ drinkDamageTotal }}</div>
      </div>
      <!--
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[15, 25, 35, 45]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
          style="margin-top:15px;text-align:right"
        >
        </el-pagination>
      -->
    </div>
    <!-- 原料修改弹框 -->
    <el-dialog title="原料报损修改" :visible.sync="isRawShow" width="500px" @close="isRawShow = false" :close-on-click-modal="false">
      <el-form :model="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称"> <el-input type="text" v-model.trim="addForm.name" placeholder="产品名称" disabled></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="成本价"> <el-input-number v-model="addForm.singalCost" :controls="false" :step="0.01" step-strictly :min="0" disabled style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`货损数量（${addForm.unitName}）`"> <el-input-number v-model="addForm.count" :controls="false" :step="0.01" step-strictly :min="0" style="width:100%"></el-input-number> </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总成本价"> <el-input-number v-model="addForm.cost" :controls="false" :step="0.01" step-strictly :min="0" disabled style="width:100%"></el-input-number> </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注"> <el-input type="textarea" v-model="addForm.remark" :rows="2" placeholder="请输入原料报损备注"></el-input> </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="rawInfoSubmit">确 定</el-button> </span>
    </el-dialog>

    <!-- 餐食原料弹框 -->
    <food-raw-select-radio :dateTime="dateTime" :isShowFoodRawSelect="isShowFoodRawSelect" @handleFoodRawSelect="handleFoodRawSelect" @saveFoodSelected="saveFoodSelected"></food-raw-select-radio>
    <!-- 饮品原料弹框 -->
    <drink-raw-select-radio :dateTime="dateTime" :isShowDrinkRawSelect="isShowDrinkRawSelect" @handleDrinkRawSelect="handleDrinkRawSelect" @saveDrinkSelected="saveDrinkSelected"></drink-raw-select-radio>
  </div>
</template>

<script type="text/ecmascript-6">
import { getFoodDrinkDamageList, damageOperation, getFoodDrinkCost } from '@/api/system'
import FoodRawSelectRadio from '@/components/food-raw-select-radio'
import DrinkRawSelectRadio from '@/components/drink-raw-select-radio'

export default {
  name: 'vote-list',
  components: {
    FoodRawSelectRadio,
    DrinkRawSelectRadio
  },
   props: {
    dateTime: {
      type: String,
      default: ''
    },
    foodDamage: {
      type: Number,
      default: 0
    },
    drinkDamage: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      searchForm: {
        uniqueCode: '',
        name: ''
      },
      addForm: {},
      damageList: [],
      addFormState: 0,
      isRawShow: false,
      tableLoading: false,
      isShowFoodRawSelect: false,
      isShowDrinkRawSelect: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    isRawShow(val) {
      if (!val) {
        this.addForm = {}
      }
    },
    'addForm.count'(val) {
      this.addForm.cost = Math.round(val * this.addForm.singalCost * 100) / 100
    }
  },
  computed: {
    foodDamageTotal() {
      let foodDamageList = this.damageList.filter(item => item.type === 1)
      let total = 0
      foodDamageList.forEach(item => {
        total = Math.round((total + item.cost) * 100) / 100
      })
      return total
    },
    drinkDamageTotal() {
      let drinkDamageList = this.damageList.filter(item => item.type === 2)
      let total = 0
      drinkDamageList.forEach(item => {
        total = Math.round((total + item.cost) * 100) / 100
      })
      return total
    }
  },
  mounted() {
    this.getFoodDrinkDamage()
  },
  methods: {
    getFoodDrinkDamage() {
      let params = {
        date: this.$route.query.action === 1 ? this.dateTime.replace(/\//g, '') : this.$route.query.time,
        ...this.searchForm,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getFoodDrinkDamageList(params).then(res => {
        this.tableLoading = false
        this.damageList = res.data
        // this.total = res.total
        this.$emit('update:foodDamage', this.foodDamageTotal)
        this.$emit('update:drinkDamage', this.drinkDamageTotal)
      }).catch(() => {
        this.tableLoading = false
      })
    },
    handleFoodRawSelect(flag) {
      this.isShowFoodRawSelect = flag
    },
    handleDrinkRawSelect(flag) {
      this.isShowDrinkRawSelect = flag
    },
    saveFoodSelected(row) {
      this.addFormState = 0
      this.addForm = JSON.parse(JSON.stringify(row))
      this.$confirm('确定提交该原料报损数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.foodDrinkDamageOperation(this.addForm)
        }).catch(() => {})
    },
    saveDrinkSelected(row) {
      this.addFormState = 0
      this.addForm = JSON.parse(JSON.stringify(row))
       this.$confirm('确定提交该原料报损数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.foodDrinkDamageOperation(this.addForm)
        }).catch(() => {})
    },
    editRaw(row) {
      this.addFormState = 1
      this.isRawShow = true
      this.getRawCost(row)
    },
    getRawCost(row) {
      let params = {
        uniqueCode: row.uniqueCode,
        cid: row.cid
      }
      getFoodDrinkCost(params)
        .then(res => {
          this.addForm = {
            ...row,
            singalCost: res.data,
            cost: res.data * row.count
          }
        })
        .catch(() => {
          this.addForm.singalCost = 0
          this.addForm.cost = 0
        })
    },
    rawInfoSubmit() {
      this.$confirm('确定提交该原料报损数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.foodDrinkDamageOperation(this.addForm)
      }).catch(() => {})
    },
    deleteRaw(row) {
      this.addFormState = 2
       this.$confirm('确定提交该原料报损数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.foodDrinkDamageOperation(row)
        }).catch(() => {})
    },
    foodDrinkDamageOperation(row) {
      let params = {
        dto: {
        ...row,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
        },
        action: this.addFormState
      }
      // console.log(params)
      damageOperation(params).then(res => {
        this.$message.success('如果产品货损相关操作（添加、修改、删除）均已完毕，请提交该条日结单数据！')
        this.getFoodDrinkDamage()
      })
    },
    searchCondition() {
      this.pageIndex = 1
      this.getFoodDrinkDamage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getFoodDrinkDamage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getFoodDrinkDamage()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // padding: 20px;
  .filter {
    display: flex;
    justify-content: space-between;
  }
  .total-tip {
    color: #409eff;
    font-weight: bold;
    .total-tip-item {
      margin-top: 10px;
    }
  }
}
</style>
