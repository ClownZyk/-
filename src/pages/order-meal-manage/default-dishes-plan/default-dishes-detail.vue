<template>
  <div>
    <div class="gem-back-header"><el-page-header @back="$router.back()" :content="$route.meta.name"> </el-page-header></div>
    <div v-loading="detailLoading">
      <el-form ref="planFormRef" :model="planForm" :rules="planFormRules" label-position="top">
        <el-row>
          <el-col :span="16">
            <el-form-item label="方案名称：" prop="title"> <el-input type="text" v-model.trim="planForm.title" placeholder="请输入方案名称"></el-input></el-form-item>
            <el-form-item label="桌台区域：" prop="selectedArea">
              <el-select v-model="planForm.selectedArea" multiple placeholder="请选择包含的桌台区域" @change="areaChange" style="width:100%">
                <el-option v-for="item in areaList" :key="item.areaId" :label="item.areaName" :value="item.areaId"> </el-option>
              </el-select>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="必点类型：">
                  <el-radio-group v-model="planForm.type">
                    <el-radio :label="1"
                      >每人必点一份 <el-popover placement="top" width="280" trigger="hover" content="适合餐具、茶位费、蘸料等每人必点的场景"> <i slot="reference" class="el-icon-info remark"></i> </el-popover
                    ></el-radio>
                    <el-radio :label="2"
                      >每笔订单必点1份 <el-popover placement="top" width="280" trigger="hover" content="适合纸巾、火锅锅底等每单或每桌必点，不按人数算的场景"> <i slot="reference" class="el-icon-info remark"></i> </el-popover
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="必点规则：">
                  <el-radio-group v-model="planForm.rule">
                    <el-radio :label="1">固定菜品</el-radio>
                    <el-radio :label="2">可选菜品</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="必点菜品：" prop="ruleProduct">
              <div><el-button size="small" type="warning" @click="handleRuleProductAdd">添加必点菜品</el-button></div>
              <el-table size="small" :data="planForm.ruleProduct" border>
                <el-table-column type="index" width="60" align="center"></el-table-column>
                <el-table-column label="菜品名称" prop="productName" min-width="200"></el-table-column>
                <el-table-column label="菜品规格" prop="title" min-width="160" align="center"></el-table-column>
                <el-table-column label="菜品条码" prop="barCode" min-width="160" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleRuleProductRemove(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="生效时间：">
              <div>
                <el-radio-group v-model="planForm.isForeverDate" @input="dateChange">
                  <el-radio :label="true">永久有效</el-radio>
                  <el-radio :label="false">自定义日期</el-radio>
                </el-radio-group>
              </div>
              <el-row>
                <el-col :span="12">
                  <el-date-picker
                    v-show="!planForm.isForeverDate"
                    v-model="planForm.sTime"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    style="width:100%"
                  >
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="启用状态："> <el-switch v-model="planForm.isOpen"></el-switch> </el-form-item>
            <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitPlanFormInfo">提交</el-button> </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <meal-product-select ref="mealRef" :isMealProductShow="isMealProductShow" @savedMealData="saveMealData" @closedMealDialog="handleMealDialog"></meal-product-select>
    </div>
  </div>
</template>

<script>
import { getDiningAreaList, getDefaultDishesDetail, defaultDishesOperation } from '@/api/system'
import MealProductSelect from '@/components/meal-product-select.vue'

export default {
  components: {
    MealProductSelect
  },
  data() {
    return {
      planForm: {
        title: '',
        source: 1,
        selectedArea: [],
        type: 1,
        rule: 1,
        ruleProduct: [],
        isForeverDate: true,
        sTime: [],
        isOpen: true
      },
      areaList: [],
      submitLoading: false,
      detailLoading: false,
      isMealProductShow: false,
      planFormRules: {
        title: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
        selectedArea: [{ required: true, message: '请选择包含的桌台区域', trigger: 'change' }]
      }
    }
  },
  computed: {
    formState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getTableAreaList()
    if (this.$route.query.id) {
      this.getDefaultDishesDetail()
    }
  },
  methods: {
    getTableAreaList() {
      let params = {
        title: '',
        isPage: false,
        isOrder: true,
        isAsc: false,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      getDiningAreaList(params).then(res => {
        this.areaList = res.data.map(item => {
          return {
            areaId: item._id,
            areaName: item.title
          }
        })
      })
    },
    getDefaultDishesDetail() {
      let params = {
        _id: this.$route.query.id
      }
      this.detailLoading = true
      getDefaultDishesDetail(params)
        .then(res => {
          this.detailLoading = false
          this.planForm = {
            ...res.data,
            selectedArea: res.data.includeArea.map(item => item.areaId),
            sTime: !res.data.isForeverDate && res.data.dateRange ? [res.data.dateRange.split('-')[0], res.data.dateRange.split('-')[1]] : []
          }
        })
        .catch(() => {
          this.detailLoading = false
        })
    },
    areaChange(val) {
      this.planForm.includeArea = this.areaList.filter(item => {
        return val.find(v => v === item.areaId)
      })
    },
    dateChange(val) {
      if (val) {
        this.planForm.sTime = []
      }
    },
    handleRuleProductAdd() {
      this.handleMealDialog(true)
      this.$nextTick(() => {
        this.$refs['mealRef'].initData()
      })
    },
    handleRuleProductRemove(index) {
      this.planForm.ruleProduct.splice(index, 1)
    },
    handleMealDialog(flag) {
      this.isMealProductShow = flag
    },
    saveMealData(newSelectedList) {
      let norepeatSelect = newSelectedList
        .filter(item => {
          return this.planForm.ruleProduct.every(v => v.uniqueCode !== item.uniqueCode)
        })
        .map(item => {
          return {
            uniqueCode: item.uniqueCode,
            productName: item.productName,
            title: item.title,
            barCode: item.barCode,
            sortNo: item.sortNo
          }
        })
      this.planForm.ruleProduct.push(...norepeatSelect)
    },
    submitPlanFormInfo() {
      this.$refs['planFormRef'].validate(valid => {
        if (valid) {
          if (this.planForm.ruleProduct.length <= 0) {
            return this.$message.warning('请添加必点菜品！')
          }
          if (!this.planForm.isForeverDate && (!this.planForm.sTime || this.planForm.sTime.length <= 0)) {
            return this.$message.warning('请选择生效自定义日期！')
          }
          if (this.planForm.sTime && this.planForm.sTime.length > 0) {
            this.planForm.dateRange = this.planForm.sTime.join('-')
          }
          let params = {
            dto: {
              ...this.planForm,
              dateRange: this.planForm.sTime && this.planForm.sTime.length > 0 ? this.planForm.sTime.join('-') : '',
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.formState
          }
          this.submitLoading = true
          defaultDishesOperation(params)
            .then(res => {
              this.submitLoading = false
              this.$message.success(res.msg)
              this.$router.back()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.remark {
  color: #606266;
}
</style>
