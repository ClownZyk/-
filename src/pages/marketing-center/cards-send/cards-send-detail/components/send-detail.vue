<template>
  <div class="detail-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="detailRef" :model="detailForm" :rules="detailFormRules" label-position="top">
          <!-- 活动名称、时间 -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="活动名称" prop="activityName"> <el-input v-model="detailForm.activityName"></el-input> </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动时间" prop="date">
                <el-date-picker
                  v-model="detailForm.date"
                  type="datetimerange"
                  format="yyyy/MM/dd HH:mm:ss"
                  value-format="yyyy/MM/dd HH:mm:ss"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 赠送方式、消费金额 -->
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="赠送方式" prop="welfareType">
                <el-select v-model="detailForm.welfareType" placeholder="请选择赠送方式" :disabled="addFormState === 1" style="width:100%">
                  <el-option v-for="item in isManage ? sendModeAdminForm : sendModeStoreForm" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="赠送类型" prop="giveType">
                <el-select v-model="detailForm.giveType" placeholder="请选择赠送类型" @change="sendTypeChanged" :disabled="addFormState === 1" style="width:100%">
                  <el-option v-for="item in sendTypeForm" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 赠送类型 -->
          <el-row :gutter="20">
            <el-col :span="8" v-if="detailForm.welfareType === 2">
              <el-form-item label="满足金额" prop="amount"> <el-input-number v-model="detailForm.amount" :controls="false" :min="1" :step="0.01" step-strictly style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8" v-if="detailForm.welfareType === 4">
              <el-form-item label="满足数量" prop="number"> <el-input-number v-model="detailForm.number" :controls="false" :min="1" :step="1" step-strictly style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
            <el-col :span="8" v-if="detailForm.giveType == 2">
              <el-form-item label="会员天数" prop="vipDays"> <el-input-number v-model="detailForm.vipDays" :controls="false" :min="0" :step="1" step-strictly style="width: 100%"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detailForm.welfareType === 4">
            <el-col :span="24">
              <el-form-item label="饮品产品信息">
                <el-button type="warning" size="small" @click="addCateDialog">添加分类</el-button>
                <div style="color:#F56C6C;">注：若只选择分类，不选产品，则默认该分类下的全部产品</div>
                <div class="cate-list">
                  <el-table :data="detailForm.includeCategory" border size="small">
                    <el-table-column type="expand" width="55" align="center">
                      <template slot-scope="props">
                        <div class="prod-contain" v-if="props.row.includeProduct.length > 0">
                          <div class="prod-item" v-for="(item, index) in props.row.includeProduct" :key="index">
                            <div class="productName">{{ item.productName }}</div>
                            <div><i class="el-icon-circle-close" @click="removeCateProd(props.row.categoryId, item)" style="color:#F56C6C"></i></div>
                            <span>{{ index + 1 === props.row.includeProduct.length ? '' : '、' }}</span>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="categoryName" label="分类名称" min-width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="操作" width="180" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="prodSelect(scope.row)">产品选择</el-button>
                        <el-button size="mini" type="danger" @click="removeCate(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 卡券信息 -->
          <el-row v-if="detailForm.giveType === 1">
            <el-form-item label="卡券信息">
              <el-button type="warning" size="small" @click="cardDialogVisible = true">添加卡券</el-button>
              <!-- 卡券类型 -->
              <div class="form-item">
                <div class="tips" style="line-height:2;color: #E6A23C" v-if="detailForm.welfareType === 3">
                  <strong>购买VIP赠送卡券规则：</strong>用户购买几个月的云极会员即可获得 月数x所选卡券总赠送数量 张卡券。比如购买云极季度会员（3个月），卡券赠送总数量为4张，即可获得3x4张卡券
                </div>
                <el-table size="small" :data="cardInfo" tooltip-effect="dark" style="width: 100%;margin-top:10px;" border>
                  <el-table-column align="center" prop="cardName" label="卡券标题" min-width="160" show-overflow-tooltip> </el-table-column>
                  <el-table-column align="center" label="赠送数量" width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.count" :min="1" size="mini" controls-position="right"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="卡券标签" width="200">
                    <template slot-scope="scope">
                      <el-input size="mini" type="index" v-model.trim="scope.row.label" style="width:100%"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="danger" size="mini" @click="removeCard(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-row>
          <!-- 启用状态 -->
          <el-row>
            <el-form-item label="启用状态" prop="display"> <el-switch v-model="detailForm.display"></el-switch> </el-form-item>
          </el-row>
          <!-- 分享地址 -->
          <el-row>
            <el-form-item v-if="addFormState == 1 && detailForm.welfareType == 1 && detailForm.giveType == 1">
              <div class="form-item">
                <el-button type="warning" size="small" @click="onHandleSharePath">生成分享地址</el-button>
                <span style="margin:0 20px;">{{ detailForm.sharePath }}</span>
                <el-button type="primary" size="small" v-show="detailForm.sharePath" v-copy="detailForm.sharePath">复制链接</el-button>
              </div>
            </el-form-item>
          </el-row>
          <!-- 提交按钮 -->
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="addBenefits">{{ addFormState === 0 ? '新增' : '修改' }}</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <!-- 分类弹框 -->
    <el-dialog title="分类选择" :visible.sync="cateDialogVisible" width="35%" @close="cateDialogVisible = false" :close-on-click-modal="false">
      <el-form :model="filterForm" :inline="true">
        <el-form-item> <el-input v-model="filterForm.categoryName" placeholder="请输入分类名称"></el-input> </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCondition">搜索</el-button>
          <el-button type="warning" @click="saveSelectedCate">保存</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="tableLoading" :data="categoryList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
        <el-table-column prop="label" label="分类名称" align="center"></el-table-column>
      </el-table>
      <span slot="footer"> </span>
    </el-dialog>

    <!-- 饮品产品弹框 -->
    <drink-product-select ref="drinkRef" :isDrinkProductShow="isDrinkProductShow" @savedDrinkData="saveProdData" @closedDrinkDialog="closedDrinkDialog"></drink-product-select>

    <!-- 卡券选择器弹框 -->
    <el-dialog title="卡券选择器" :visible.sync="cardDialogVisible" width="900px" :close-on-click-modal="false">
      <!-- 搜索部分 -->
      <el-form size="small" ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item>
          <el-select v-model="searchForm.type" placeholder="请选择卡券类型" clearable> <el-option v-for="item in panCardTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
        </el-form-item>
        <el-form-item> <el-input v-model="searchForm.title" placeholder="请输入卡券名称" class="filters-item" @keyup.enter.native="getAllCards" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getAllCards">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveSelected">保存</el-button> </el-form-item>
      </el-form>

      <!-- 列表部分 -->
      <el-table size="small" ref="multipleTable" v-loading="listLoading" :data="cardInfoList" border @selection-change="selectTableRow" row-key="_id">
        <el-table-column align="center" type="selection" :reserve-selection="true" width="55"> </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
        <el-table-column align="center" prop="title" label="卡券标题" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="typeName" label="类型" width="120"> </el-table-column>
        <el-table-column align="center" prop="quantity" label="库存" width="110"></el-table-column>
        <el-table-column align="center" prop="getLimit" label="领取上限" width="110"></el-table-column>
        <el-table-column align="center" label="领取时间" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope"
            >{{ scope.row.startTime.split(' ')[0] }} - {{ scope.row.endTime.split(' ')[0] }}</template
          >
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
          small
          style="float:right;margin:10px 0;"
        >
        </el-pagination>
      </el-col>
      <span slot="footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllCards, GetWelfarOperation, GetActivityWelfarDetail, getSharePathGenerate, GetAllCategory } from '@/api/system'
import DrinkProductSelect from '@/components/drink-product-select'
import { formatDate } from '@/components/js/data'
import Filters from '@/components/js/Filters.js'
export default {
  name: 'sendDetail',
  mixins: [Filters],
  components: {
    DrinkProductSelect
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      detailForm: {
        activityName: '',
        date: [formatDate(new Date(), 'yyyy/MM/dd 00:00:00'), formatDate(new Date(), 'yyyy/MM/dd 23:59:59')],
        display: true, // 是否启用
        vipDays: 0, // 会员天数
        amount: 1, // 满足金额
        number: 1, // 满足数量
        welfareType: 1, // 赠送方式
        giveType: 1, // 赠送类型
        sharePath: '',
        includeCategory: []
      },
      searchForm: {
        type: null,
        title: ''
      },
      cardInfoList: [], // 卡券列表信息
      cardInfo: [], // 选中展示的卡券列表信息
      selectedCardList: [], // 选择的卡券
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      cardDialogVisible: false,
      listLoading: false,
      filterForm: {
        categoryName: ''
      },
      categoryList: [],
      tableLoading: false,
      isDrinkProductShow: false,
      cateDialogVisible: false,
      detailFormRules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        date: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
        welfareType: [{ required: true, message: '请选择赠送方式', trigger: 'blur' }],
        giveType: [{ required: true, message: '请选择赠送类型', trigger: 'blur' }]
      },
      // 赠送方式数据
      sendModeAdminForm: [
        {
          value: 1,
          label: '注册赠送'
        },
        {
          value: 3,
          label: '购买VIP赠送'
        }
      ],
      sendModeStoreForm: [
        {
          value: 2,
          label: '零售产品消费满足金额赠送'
        },
        {
          value: 4,
          label: '饮品产品消费满足数量赠送'
        }
      ],
      // 赠送类型数据
      sendTypeForm: [
        { value: 1, label: '卡券' }
        // { value: 2, label: 'VIP会员卡' }
      ]
    }
  },
  computed: {
    addFormState() {
      if (!this.$route.query.id) {
        return 0
      } else {
        return 1
      }
    }
  },
  mounted() {
    this.getAllCards()
    if (this.$route.query.id) {
      this.getCardData()
    } else {
      this.detailForm.welfareType = this.isManage ? 1 : 2
    }
  },
  methods: {
    // 获取所有卡券列表
    getAllCards() {
      let params = {
        ...this.searchForm,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isAsc: true,
        isOrder: true,
        isPage: true,
        cid: this.$store.state._cid,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole
      }
      this.listLoading = true
      getAllCards(params)
        .then(res => {
          this.cardInfoList = res.data
          this.total = res.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 获取活动详情
    getCardData() {
      GetActivityWelfarDetail({ _id: this.$route.query.id })
        .then(res => {
          if (res.success) {
            this.detailForm = {
              ...res.data,
              date: [res.data.startTime, res.data.endTime]
            }
            this.cardInfo = res.data.giveCard.map(item => {
              return {
                cardName: item.title,
                cardId: item.cardId,
                cardType: item.cardType,
                count: item.count,
                label: item.label
              }
            })
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    // 赠送类型改变
    sendTypeChanged() {
      if (this.detailForm.giveType === 1) {
        this.detailForm.vipDays = 0
      } else if (this.detailForm.giveType === 2) {
        this.cardInfo = []
      }
    },
    // 选择的卡券信息
    selectTableRow(row) {
      this.selectedCardList = row.map(item => {
        return {
          cardName: item.title,
          cardId: item._id,
          cardType: item.type,
          count: 1,
          label: ''
        }
      })
    },
    // 保存选中的卡券
    saveSelected() {
      if (this.selectedCardList.length > 0) {
        let norepeatSelect = this.selectedCardList.filter(item => {
          return this.cardInfo.every(v => v.cardId !== item.cardId)
        })
        this.cardInfo.push(...norepeatSelect)
        this.cardDialogVisible = false
        this.$refs.multipleTable.clearSelection()
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 删除已选择的卡券
    removeCard(row) {
      let removeCardIndex = this.cardInfo.findIndex(v => v.cardId === row.cardId)
      this.cardInfo.splice(removeCardIndex, 1)
    },
    addCateDialog() {
      this.cateDialogVisible = true
      // 获取分类数据
      this.getCategory()
    },
    getCategory() {
      let params = {
        belongMenu: '/drink-product-category',
        categoryName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      GetAllCategory(params).then(
        res => {
          this.tableLoading = false
          this.categoryList = res.data
        },
        () => {
          this.tableLoading = false
        }
      )
    },
    // 分类选择数据处理
    handleSelectionChange(val) {
      this.selectedCate = val.map(item => {
        return {
          categoryId: item.value,
          categoryName: item.label,
          includeProduct: []
        }
      })
    },
    // 保存选中的分类数据
    saveSelectedCate() {
      let norepeatSelect = this.selectedCate.filter(item => {
        return this.detailForm.includeCategory.every(v => v.categoryId !== item.categoryId)
      })
      this.detailForm.includeCategory.push(...norepeatSelect)
      this.cateDialogVisible = false
    },
    // 删除已选择的分类数据
    removeCate(row) {
      this.$confirm('确认删除此数据吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let cateIndex = this.detailForm.includeCategory.findIndex(v => v.categoryId === row.categoryId)
          this.detailForm.includeCategory.splice(cateIndex, 1)
        })
        .catch(() => {})
    },
    // 选择分类下的产品
    prodSelect(row) {
      this.isDrinkProductShow = true
      this.$nextTick(() => {
        this.$refs['drinkRef'].initData(row.categoryId, 'cate')
      })
    },
    closedDrinkDialog(val) {
      this.isDrinkProductShow = val
    },
    saveProdData(newSelectedList, cateId, type) {
      if (type === 'cate') {
        let index = this.detailForm.includeCategory.findIndex(item => item.categoryId === cateId)
        let norepeatSelect = newSelectedList
          .filter(item => {
            return this.detailForm.includeCategory[index].includeProduct.every(v => v.productId !== item._id)
          })
          .map(item => {
            return {
              productName: item.productName,
              productId: item._id
            }
          })
        this.detailForm.includeCategory[index].includeProduct.push(...norepeatSelect)
      }
    },
    // 删除分类下包含的产品
    removeCateProd(cateId, prodItem) {
      let cateIndex = this.detailForm.includeCategory.findIndex(item => item.categoryId === cateId)
      let prodIndex = this.detailForm.includeCategory[cateIndex].includeProduct.findIndex(val => val.productId === prodItem.productId)
      this.detailForm.includeCategory[cateIndex].includeProduct.splice(prodIndex, 1)
    },
    // 新增或修改卡券
    addBenefits() {
      this.$refs['detailRef'].validate(valid => {
        if (valid) {
          if (this.detailForm.giveType === 1 && this.cardInfo.length <= 0) {
            return this.$message.warning('请选择赠送卡券信息！')
          }
          if (this.detailForm.giveType === 2 && this.detailForm.vipDays === 0) {
            return this.$message.warning('请设置赠送会员天数！')
          }
          this.$confirm('确定提交该数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                dto: {
                  ...this.detailForm,
                  startTime: this.detailForm.date[0],
                  endTime: this.detailForm.date[1],
                  giveCard: this.cardInfo,
                  cid: this.$store.state._cid,
                  creater: this.$store.state.UserID,
                  roleId: this.$store.state.UserRole
                },
                action: this.addFormState
              }
              GetWelfarOperation(params)
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.msg)
                    this.$router.go(-1)
                  }
                })
                .catch(err => {
                  console.log(err.msg)
                })
            })
            .catch(() => {})
        }
      })
    },

    // 生成分享地址
    onHandleSharePath() {
      getSharePathGenerate({ _id: this.$route.query.id })
        .then(res => {
          if (res.success) {
            this.detailForm.sharePath = res.data
            this.$message.success(res.msg)
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },
    searchCondition() {
      this.getCategory()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllCards()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getAllCards()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';
.prod-contain {
  display: flex;
  margin-left: 15px;
  .prod-item {
    display: flex;
    div {
      margin-right: 8px;
    }
    .productName {
      @include no-wrap();
    }
  }
}
</style>
