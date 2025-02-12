<template>
  <div class="container" v-if="containerIsShow">
    <div>
      <el-divider>用户积分累计分类排除信息</el-divider>
      <el-alert title="提示" type="warning" description="该分类排除信息需选择 二级分类 进行设置，选中分类下的产品将不进行用户购买后的积分累计计算，该设置针对于全局" show-icon :closable="false"> </el-alert>
      <el-form class="filters" :model="cateForm" label-position="top">
        <el-row>
          <el-col :span="12">
            <el-form-item label="积分累计分类排除：">
              <el-cascader v-model="cateForm.excludeCategory" :options="retailCategoryList" :props="categoryProps" placeholder="请选择积分累计排除的分类" @change="handleCategoryChange" clearable style="width: 80%"></el-cascader>
            </el-form-item>
            <el-form-item> <el-button type="warning" @click="saveExcludeCate">保 存</el-button> </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-divider>积分等级信息</el-divider>
      <el-form>
        <el-form-item> <el-button type="primary" @click="handleLevelAdd">积分等级添加</el-button> </el-form-item>
      </el-form>
      <el-table v-loading="tableLoading" :data="levelList" border>
        <el-table-column type="index" width="55" align="center"></el-table-column>
        <el-table-column label="积分等级名称" prop="levelName" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="积分满足额" prop="integrals" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="零售折扣(%)" prop="retailRatio" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="餐食折扣(%)" prop="makeRatio" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="饮品折扣(%)" prop="drinkRatio" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="零售兑换积分倍数" prop="retailMultiple" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="餐食兑换积分倍数" prop="makeMultiple" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="饮品兑换积分倍数" prop="drinkMultiple" min-width="140" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="卡券福利" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.cardWelfare && scope.row.cardWelfare.length > 0">
              <div v-for="(item, index) in scope.row.cardWelfare" :key="index">{{ item.cardName }} x {{ item.count + (index + 1 === scope.row.cardWelfare.length ? '' : ';') }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="月推送卡券福利" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.monthCardWelfare && scope.row.monthCardWelfare.length > 0">
              <div v-for="(item, index) in scope.row.monthCardWelfare" :key="index">{{ item.cardName }} x {{ item.count + (index + 1 === scope.row.monthCardWelfare.length ? '' : ';') }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleLevelUpdate(scope.row)">修改</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleLevelDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        background
        style="margin-top: 15px;text-align:right"
      >
      </el-pagination>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getIntegralCategoryExclude, integralCategoryExcludeOperation, getUserIntegralLevel, userIntegralLevelOperation } from '@/api/system'
import { getCategoryForV6 } from '@/api/systemForV8'

export default {
  watch: {
    $route(to, from) {
      if (to.name === 'scrm-integral-level') {
        this.getUserIntegralLevel()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      levelList: [],
      retailCategoryList: [],
      cateForm: {
        ruleType: 1,
        excludeCategory: []
      },
      cateFormState: 0,
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      containerIsShow: true,
      categoryProps: {
        value: 'unionCode',
        label: 'name',
        multiple: true,
        checkStrictly: false,
        emitPath: false
      }
    }
  },
  mounted() {
    this.GetAllCategory()
    this.getUserIntegralLevel()
  },
  methods: {
    GetAllCategory() {
      let params = {
        belongMenu: '',
        categoryName: '',
        belong: '',
        cid: this.$store.state.retailWarehouseId,
        whCid: this.$store.state.retailWarehouseId
      }
      getCategoryForV6(params).then(res => {
        if (res.success) {
          this.retailCategoryList = res.data.map(item => {
            return {
              name: item.categoryName,
              unionCode: item.unionCode,
              children: item.children.map(child => {
                return {
                  name: child.categoryName,
                  unionCode: child.unionCode
                }
              })
            }
          })
          // 选择的分类数据回显
          this.getExcluedCate()
        }
      })
    },
    getExcluedCate() {
      let params = {
        isPage: false,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getIntegralCategoryExclude(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.cateFormState = 1
          let { ruleType, excludeCategory, _id } = res.data[0]
          this.cateForm = { ruleType, excludeCategory, _id }
        } else {
          this.cateFormState = 0
        }
      })
    },
    getUserIntegralLevel() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: false,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.tableLoading = true
      getUserIntegralLevel(params)
        .then(res => {
          this.tableLoading = false
          this.levelList = res.data
          this.total = res.total
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleLevelAdd() {
      this.$router.push({ path: '/scrm-integral-detail' })
    },
    handleLevelUpdate(row) {
      this.$router.push({ path: '/scrm-integral-detail', query: { levelId: row._id } })
    },
    handleLevelDelete(row) {
      this.$confirm('此操作将永久删除该积分等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: 2
          }
          userIntegralLevelOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getUserIntegralLevel()
          })
        })
        .catch(() => {})
    },
    saveExcludeCate() {
      this.$confirm('确定排除已选择的分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: {
              ...this.cateForm,
              creater: localStorage.getItem('creater'),
              roleId: localStorage.getItem('roleId'),
              cid: localStorage.getItem('cid')
            },
            action: this.cateFormState
          }
          // console.log(params)
          integralCategoryExcludeOperation(params).then(res => {
            this.$message.success(res.msg)
            this.getExcluedCate()
          })
        })
        .catch(() => {})
    },
    handleCategoryChange(val) {
      this.cateForm.excludeCategory = treeForeach(this.retailCategoryList)
        .filter(item => {
          return val.some(cate => cate === item.unionCode)
        })
        .map(item => item.unionCode)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserIntegralLevel()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getUserIntegralLevel()
    }
  }
}

let treeForeach = function(categoryList) {
  let result = []
  let node = [...categoryList]
  let list = [...categoryList]
  while ((node = list.shift())) {
    result.push({
      ...node
    })
    node.children && list.push(...node.children)
  }
  return result
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .filters {
    margin-top: 10px;
  }
}
</style>
