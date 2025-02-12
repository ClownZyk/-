<template>
  <div class="category-container">
    <div v-if="containerIsShow">
      <!-- 搜索添加区域 -->
      <el-form :model="search" :inline="true" class="filter-search">
        <div class="filter-left">
          <el-form-item> <el-input v-model="search.categoryName" placeholder="请输入分类名称"></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="_searchCondition">搜索</el-button> </el-form-item>
        </div>
        <div class="filter-right">
          <el-form-item> <el-button type="primary" @click="_addCategory">添加零售分类</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click="_addMealsCategory">添加餐食分类</el-button> </el-form-item>
          <el-form-item> <el-button type="success" @click="_addDrinkCategory">添加饮品分类</el-button> </el-form-item>
        </div>
      </el-form>

      <!-- 列表区域 -->
      <el-table class="table-main" ref="listTable" :data="categoryRuleList" border tooltip-effect="dark">
        <el-table-column align="center" label="编号" width="80" type="index"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="分类" min-width="250" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="discount" label="折扣比" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.discountRatio" controls-position="right" :min="0" :max="100" size="small" @blur="_operateRow(scope.row, 1)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" min-width="250" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="操作" min-width="230" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="_operateRow(scope.row, 2)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      >
      </el-pagination>

      <!-- 零售商品分类弹框区域 -->
      <el-dialog title="零售分类选择器" :visible.sync="isCategroyDialogVisible" width="50%" @closed="handleCateDialog" :close-on-click-modal="false">
        <el-form :model="categoryForm" inline>
          <el-form-item prop="categoryName"> <el-input v-model="categoryForm.categoryName" placeholder="请输入一级分类名称" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="GetAllCategory">搜索</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click.native="_saveSelectData">保存</el-button> </el-form-item>
          <el-form-item><span style="color:#F56C6C">注：以勾选二级分类为准</span></el-form-item>
        </el-form>
        <el-table ref="treeTable" :data="categoryList" style="width: 100%;" row-key="_id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :default-expand-all="false" @select="selectFun" @select-all="selectAllFun">
          <el-table-column type="selection" align="center" width="55"> </el-table-column>
          <el-table-column prop="categoryName" label="分类名称" min-width="250"> </el-table-column>
          <el-table-column prop="sortNo" align="center" label="排序号" min-width="200"> </el-table-column>
        </el-table>
        <div slot="footer"></div>
      </el-dialog>

      <!-- 餐食商品分类弹框 -->
      <el-dialog title="餐食分类选择器" :visible.sync="isMealsCategroyShow" width="50%" @closed="mealsDialogClosed" :close-on-click-modal="false">
        <el-form :model="mealsCateForm" inline>
          <el-form-item prop="categoryName"> <el-input v-model="mealsCateForm.categoryName" placeholder="请输入一级分类名称" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getMealsCate">搜索</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click="saveMealsCate">保存</el-button> </el-form-item>
        </el-form>
        <el-table ref="treeTable" :data="mealsCateList" style="width: 100%;" border @selection-change="mealsSelectionChange">
          <el-table-column type="selection" align="center" width="55"> </el-table-column>
          <el-table-column prop="categoryName" align="center" label="分类名称" min-width="250" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="sortNo" align="center" label="排序号" min-width="200"> </el-table-column>
        </el-table>
        <div slot="footer"></div>
      </el-dialog>
      <!-- 饮品商品分类弹框 -->
      <el-dialog title="饮品分类选择器" :visible.sync="isDrinkCategroyShow" width="50%" @closed="drinkDialogClosed" :close-on-click-modal="false">
        <el-form :model="drinkCateForm" inline>
          <el-form-item prop="categoryName"> <el-input v-model="drinkCateForm.categoryName" placeholder="请输入一级分类名称" clearable></el-input> </el-form-item>
          <el-form-item> <el-button type="primary" @click="getDrinkCate">搜索</el-button> </el-form-item>
          <el-form-item> <el-button type="warning" @click="saveDrinkCate">保存</el-button> </el-form-item>
        </el-form>
        <el-table ref="treeTable" :data="drinkCateList" style="width: 100%;" border @selection-change="drinkSelectionChange">
          <el-table-column type="selection" align="center" width="55"> </el-table-column>
          <el-table-column prop="categoryName" align="center" label="分类名称" min-width="250" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="sortNo" align="center" label="排序号" min-width="200"> </el-table-column>
        </el-table>
        <div slot="footer"></div>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { GetListByPage, GetSpecialCategory, ManyCategoryRule, SprodCategoryOperation } from '@/api/system'
export default {
  watch: {
    $route(to, from) {
      if (to.name === 'identity-rule-category') {
        this._getCategoryRuleList()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    }
  },
  data() {
    return {
      search: {
        categoryName: ''
      },
      categoryForm: {
        categoryName: ''
      },
      mealsCateForm: {
        categoryName: ''
      },
      drinkCateForm: {
        categoryName: ''
      },
      categoryList: [],
      mealsCateList: [],
      drinkCateList: [],
      categoryRuleList: [],
      selectedData: [],
      selectedMealsCate: [],
      selectedDrinkCate: [],
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      containerIsShow: true,
      isCategroyDialogVisible: false,
      isMealsCategroyShow: false,
      isDrinkCategroyShow: false
    }
  },
  created() {
    this._initData()
  },
  methods: {
    _initData() {
      this._getCategoryRuleList()
    },
    _addCategory() {
      this.isCategroyDialogVisible = true
      this.GetAllCategory()
    },
    _addMealsCategory() {
      this.isMealsCategroyShow = true
      this.getMealsCate()
    },
    _addDrinkCategory() {
      this.isDrinkCategroyShow = true
      this.getDrinkCate()
    },
    // 加载商品分类
    GetAllCategory() {
      let params = {
        belongMenu: '/product-category',
        categoryName: this.categoryForm.categoryName,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(
        res => {
          if (res.success) {
            this.categoryList = res.data
            this.categoryList.forEach(item => {
              item.isSelect = false
            })
          } else {
            this.$message.error(res.msg)
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 获取餐食商品分类
    getMealsCate() {
      let params = {
        belongMenu: '/homemade-product-category',
        categoryName: this.mealsCateForm.categoryName,
        isPage: false,
        isOrder: true,
        isAsc: true,
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(
        res => {
          if (res.success) {
            this.mealsCateList = res.data
          }
        },
        err => {
          console.log(err)
        }
      )
    },
    // 获取饮品商品分类
    getDrinkCate() {
      let params = {
        belongMenu: '/drink-product-category',
        categoryName: this.drinkCateForm.categoryName,
        isPage: false,
        isOrder: true,
        isAsc: true,
        // creater: localStorage.getItem('creater'),
        // roleId: localStorage.getItem('roleId'),
        // cid: localStorage.getItem('cid')
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetListByPage(params).then(
        res => {
          if (res.success) {
            this.drinkCateList = res.data
          }
        },
        err => {
          console.log(err)
        }
      )
    },

    // 获取特殊分类列表
    _getCategoryRuleList() {
      let params = {
        identityRoleid: this.$route.query.ruleId,
        categoryName: this.search.categoryName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetSpecialCategory(params)
        .then(res => {
          if (res.success) {
            this.categoryRuleList = res.data
            this.total = res.total
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 点击修改或删除按钮操作
    _operateRow(row, action) {
      // console.log(row)
      this.$confirm('是否确定此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: row,
            action: action
          }
          SprodCategoryOperation(params)
            .then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this._getCategoryRuleList()
              }
            })
            .catch(err => {
              console.log(err.msg)
            })
        })
        .catch(() => {})
    },

    // 勾选复选框事件
    selectFun(selection, row) {
      // 选择行存在isSelect属性值,则切换选择状态
      row.isSelect = !row.isSelect
      this.handleChild(row)
      this.handleFather(this.categoryList, row)
      this.handleSelectChange()
    },
    // 选中父节点，处理子节点
    handleChild(row) {
      if (row.children && row.children.length > 0) {
        // 选中行存在子节点，说明当前选中的是其父节点，选中父节点，子节点也全被选中
        row.children.forEach(item => {
          item.isSelect = row.isSelect
          this.$refs.treeTable.toggleRowSelection(item, row.isSelect)
          this.handleChild(item)
        })
      }
    },
    // 选中子节点，处理父节点
    handleFather(data, row) {
      data.forEach(item => {
        let isAllSelect = []
        if (item._id === row.belong) {
          // 遍历出列表里选中子节点的父节点
          item.children.forEach(childrenItem => {
            isAllSelect.push(childrenItem.isSelect)
          })
          // 检查当前父节点下的子节点是否全部是选中状态
          let flag1 = isAllSelect.every(selectItem => {
            return selectItem === true
          })
          if (flag1) {
            item.isSelect = true
            this.$refs.treeTable.toggleRowSelection(item, true)
          } else {
            item.isSelect = false
            this.$refs.treeTable.toggleRowSelection(item, false)
          }
        } else {
          this.handleFather(item.children, row)
        }
      })
    },
    // 检测表格是否全选
    checkIsAllSelect() {
      this.oneCategoryIsSelect = []
      this.categoryList.forEach(item => {
        this.oneCategoryIsSelect.push(item.isSelect)
      })
      // 判断一级分类是否全选
      let isAllSelect = this.oneCategoryIsSelect.every(v => {
        return v === true
      })
      return isAllSelect
    },
    // 表格全选事件
    selectAllFun(selection) {
      let isAllSelect = this.checkIsAllSelect()
      this.categoryList.forEach(item => {
        item.isSelect = isAllSelect
        this.$refs.treeTable.toggleRowSelection(item, !isAllSelect)
        this.selectFun(selection, item)
      })
    },
    // 选择分类操作
    handleSelectChange() {
      let _arr = this.categoryList.slice()
      let selectedData = treeForeach(_arr)
        .filter(item => {
          return item.isSelect === true
        })
        .filter(category => {
          return category.belong !== '000000000000000000000000'
        })
      this.selectedData = selectedData.map(item => {
        return {
          identityRoleid: '',
          categoryId: item._id,
          categoryName: item.categoryName,
          discountRatio: 100
        }
      })
    },

    // 保存选中数据
    _saveSelectData() {
      if (this.selectedData.length > 0) {
        this.$confirm('是否保存选择的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = {
              identityRoleid: this.$route.query.ruleId,
              specialCategory: this.selectedData,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            ManyCategoryRule(params)
              .then(res => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this._getCategoryRuleList()
                }
              })
              .catch(err => {
                console.log(err.msg)
              })
            this.isCategroyDialogVisible = false
          })
          .catch(() => {})
      } else {
        this.$message.warning('请选择特殊分类！')
      }
    },
    handleCateDialog() {
      this.isCategroyDialogVisible = false
      this.selectedData = []
    },
    // 餐食分类选择事件
    mealsSelectionChange(val) {
      this.selectedMealsCate = val.map(item => {
        return {
          identityRoleid: '',
          categoryId: item._id,
          categoryName: item.categoryName,
          discountRatio: 100
        }
      })
    },
    saveMealsCate() {
      if (this.selectedMealsCate.length <= 0) {
        return this.$message.warning('请选择餐食分类！')
      }
      this.$confirm('是否保存选择的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            identityRoleid: this.$route.query.ruleId,
            specialCategory: this.selectedMealsCate,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          ManyCategoryRule(params)
            .then(res => {
              if (res.success) {
                this.isMealsCategroyShow = false
                this.$message.success(res.msg)
                this._getCategoryRuleList()
              }
            })
            .catch(err => {
              console.log(err.msg)
            })
        })
        .catch(() => {})
    },
    mealsDialogClosed() {
      this.isMealsCategroyShow = false
      this.selectedMealsCate = []
    },
    // 饮品分类选择事件
    drinkSelectionChange(val) {
      this.selectedDrinkCate = val.map(item => {
        return {
          identityRoleid: '',
          categoryId: item._id,
          categoryName: item.categoryName,
          discountRatio: 100
        }
      })
    },
    saveDrinkCate() {
      if (this.selectedDrinkCate.length <= 0) {
        return this.$message.warning('请选择饮品分类！')
      }
      this.$confirm('是否保存选择的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            identityRoleid: this.$route.query.ruleId,
            specialCategory: this.selectedDrinkCate,
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          ManyCategoryRule(params)
            .then(res => {
              if (res.success) {
                this.isDrinkCategroyShow = false
                this.$message.success(res.msg)
                this._getCategoryRuleList()
              }
            })
            .catch(err => {
              console.log(err.msg)
            })
        })
        .catch(() => {})
    },
    drinkDialogClosed() {
      this.isDrinkCategroyShow = false
      this.selectedDrinkCate = []
    },
    // 搜索
    _searchCondition() {
      this.pageIndex = 1
      this._getCategoryRuleList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this._getCategoryRuleList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this._getCategoryRuleList()
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
.category-container {
  .filter-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pagination {
    text-align: right;
    margin-top: 20px;
  }
}
/deep/.el-table [class*='el-table__row--level'] .el-table__expand-icon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
}
</style>
