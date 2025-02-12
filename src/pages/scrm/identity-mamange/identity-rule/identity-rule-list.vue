<template>
  <div class="vote-list-container">
    <div class="vote-list" v-if="containerIsShow">
      <!-- 搜索部分 -->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <el-form-item></el-form-item>
        <el-form-item> <el-button type="primary" @click="_ruleManage(null, 0, '新增')">新增</el-button> </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" ref="listTable" :data="identRuleList" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column prop="ratioName" label="规则名称" min-width="170" align="center"></el-table-column>
          <el-table-column prop="discountRatio" label="折扣比" min-width="140" align="center"></el-table-column>
          <el-table-column prop="getPointsTimes" label="消费获取积分倍数" min-width="170" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" min-width="200">
            <template slot-scope="scope">{{ scope.row.remark || '--' }}</template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="400" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="_ruleManage(scope.row, 1, '修改')">编辑</el-button>
              <el-button type="primary" size="mini" @click="_toDetail(scope.row, 1, '修改')">特殊商品</el-button>
              <el-button type="primary" size="mini" @click="_toCategoryDetail(scope.row, 1, '修改')">特殊分类</el-button>
              <el-button type="danger" size="mini" @click="_ruleManage(scope.row, 2, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-bottom">
          <div><span style="color:#F56C6C;fontSize:14px">注：特殊产品价格优先级 > 特殊分类优先级 > 会员折扣优先级 / 积分等级折扣</span></div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-size="pageSize"
              :page-sizes="[10, 15, 20, 25]"
              :total="total"
              v-show="total !== 0"
              layout="total, sizes, prev, pager, next"
              background
            ></el-pagination>
          </div>
        </div>

        <!-- 规则说明 -->
        <el-row class="illustrate">
          <el-col class="illustrate-item">
            <div><strong>规则说明：</strong></div>
            <div class="rule-item">
              <div>1、会员<i>无积分等级</i>，则产品折扣<i>以会员折扣为主</i>，消费后所得积分计算：实付金额 x 会员折扣对应设置的消费积分倍数（零售，餐食，饮品统一设置）；</div>
              <div class="eg">例如： plus会员93折，消费积分倍数设置为2倍，购买产品原价10元，实际支付了9.3元，所得积分为9x2个积分</div>
            </div>
            <div class="rule-item">
              <div>2、会员<i>有积分等级</i>(每个等级有相对应的权益)，则产品折扣为 <i>会员折扣和积分等级对应折扣两者中折扣较低的</i>，消费后所得积分计算：</div>
              <div>(零售实付金额 x 会员折扣对应积分倍数 x 积分等级对应零售积分倍数)+(餐食实付金额 x 会员折扣对应积分倍数 x 积分等级对应餐食积分倍数)+(饮品实付金额 x 会员折扣对应积分倍数 x 积分等级对应饮品积分倍数)</div>
              <div class="eg">
                <div>例如：</div>
                <div>plus会员93折，消费获取积分倍数设置为2倍；</div>
                <div>Lv3—积分累计达到2000，享受零售，餐食无折扣，饮品9折，零售，餐食兑换积分倍数1倍，饮品兑换积分倍数2倍，赠送饮品半价券，买一送一券，餐食八折券；</div>
                <div>一个用户是plus会员，积分等级为Lv3，购买了零售产品5元，餐食15元，饮品20元，实际支付价格为零售5x0.93元，餐食15x0.93元，饮品20x0.9元(积分等级饮品9折较小)实际所得积分为 (4x2x1)+(13x2x1)+(18x2x2) 个积分</div>
              </div>
            </div>
            <div class="rule-item">
              <div>3、会员折扣<i>设置了特殊产品或分类</i>，会员购买产品中包含被选中的特殊产品或分类下的产品，则该产品不会按照会员折扣或积分等级折扣售卖，<i>该产品价格为设置的特殊价；</i></div>
              <div class="eg">
                <div>例如：</div>
                <div>plus会员93折，特殊产品——燕麦拿铁原价18元，特殊价15元；</div>
                <div>一个用户是plus会员，积分等级为Lv3(权益如上)，购买了零售产品5元，燕麦拿铁，美式咖啡(12元)各一杯，实际支付价格为(5x0.93)+15+(12x0.9)元</div>
              </div>
            </div>
          </el-col>
          <el-col class="tips">
            <div>积分等级的添加修改：中台账号—>SCRM管理—>用户积分等级 模块</div>
            <div>会员身份规则特殊产品和分类的添加修改：各门店账号—>SCRM管理—>用户身份管理—>规则管理 模块</div>
          </el-col>
        </el-row>
      </div>
      <!-- 规则管理 -->
      <el-dialog title="规则管理" :visible.sync="identDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="identForm" :model="identForm" :rules="identFormRules" label-width="130px">
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="规则名称" prop="ratioName"> <el-input placeholder="请输入规则名称" v-model="identForm.ratioName"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="折扣比" prop="discountRatio"> <el-input-number size="mini" v-model="identForm.discountRatio" controls-position="right"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="消费获取积分倍数" prop="getPointsTimes" label-width="120"> <el-input-number size="mini" v-model="identForm.getPointsTimes" controls-position="right"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col>
              <el-form-item label="备注" prop="remark"> <el-input placeholder="请输入备注" v-model="identForm.remark"></el-input> </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item> <el-button type="primary" @click="_identEdit">确 定</el-button> </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { GetUserIdentityByPage, GetIdentityRuleByPage, RuleOperation, IdentityOperation } from '@/api/system'
export default {
  name: 'vote-list',
  data() {
    return {
      canEdit: Boolean(localStorage.getItem('cid') === this.$store.state._cid),
      containerIsShow: true,
      isFormShow: false, // 弹框显示状态
      identDialog: false, // 用户身份角色
      identFormRules: {
        ratioName: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        discountRatio: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        getPointsTimes: [{ required: true, message: '该值不能为空', trigger: 'blur' }]
      },
      identForm: {
        ratioName: '',
        getPointsTimes: null,
        discountRatio: null,
        remark: '',
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      dialog: {
        // 弹框数据
        identityName: '',
        identityRoleid: '',
        remark: '',
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      identAction: 0, // 编辑
      identList: [], // 会员身份管理
      Txt: '',
      formRules: {
        identityName: [{ required: true, message: '该值不能为空', trigger: 'blur' }],
        identityRoleid: [{ required: true, message: '请选择规则', trigger: 'change' }]
      },
      search: {
        // 活动名称
        activityName: ''
      },
      // 列表
      identRuleList: [],
      identtypeList: [],
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this._getRuleList()
    this.GetListByPage()
  },
  methods: {
    _toDetail(row, action) {
      this.$router.push({
        path: '/identity-rule-detail',
        query: { ruleId: row._id, action: action }
      })
    },
    _toCategoryDetail(row, action) {
      this.$router.push({
        path: '/identity-rule-category',
        query: { ruleId: row._id, action: action }
      })
    },
    // 用户身份
    GetListByPage() {
      let params = {
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
      GetUserIdentityByPage(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.identList = res.data
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    // 用户身份修改
    _addUserDiscountRule() {
      this.$refs.identForm.validate(valid => {
        if (valid) {
          let param = {
            dto: this.identForm,
            action: 0
          }
          IdentityOperation(param).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this._getDiscountRuleList()
            this.$refs.identForm.resetFields()
          })
        }
      })
    },
    _identEdit() {
      this.$refs.identForm.validate(valid => {
        if (valid) {
          let param = {
            dto: this.identForm,
            action: this.identAction
          }
          RuleOperation(param).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this._getRuleList()
            this.identDialog = false
            this.$refs.identForm.resetFields()
          })
        }
      })
    },
    identOperate(dto, action) {
      let actionTxt = action === 1 ? '修改' : '删除'
      this.$confirm(`是否${actionTxt}该条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            dto: dto,
            action: action
          }
          RuleOperation(param).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this._getRuleList()
            this.$refs.identForm.resetFields()
          })
        })
        .catch(() => {})
    },
    opreation(dto, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.Action === 0 ? (this.Txt = '新增') : (this.Txt = '编辑')
          this.edit(dto, this.Action, this.Txt)
        } else {
          return false
        }
      })
    },
    // 编辑
    edit(dto, action, txt) {
      this.$confirm('是否' + txt + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: dto,
            action: action
          }
          RuleOperation(params).then(
            res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.isFormShow = false
                this.GetListByPage()
              } else this.$message.error(res.msg)
            },
            err => {
              this.$message.error(err.msg)
            }
          )
        })
        .catch(() => {})
    },
    // pageSize 改变
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    // currentPage 改变
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    },
    _ruleManage(dialog, action, txt) {
      this.identAction = action
      switch (action) {
        case 0:
          this.identDialog = true
          break
        case 1:
          this.identDialog = true
          this.identForm = dialog
          break
        case 2:
          this.edit(dialog, action, txt)
      }
    },
    // 套餐列表
    async _getRuleList() {
      let params = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      this.listLoading = true
      await GetIdentityRuleByPage(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.identRuleList = res.data
            this.identtypeList = res.data.map(item => {
              return {
                value: item._id,
                label: item.ratioName
              }
            })
            this.total = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === 'identity-rule') {
        this.GetListByPage()
        this.containerIsShow = true
      } else {
        this.containerIsShow = false
      }
    },
    isFormShow: {
      handler(newName, oldName) {
        if (newName) {
          this.dialog = {
            buyDays: 0,
            giveDays: 0
          }
          this.GetListByPage()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
/deep/.form {
  .form-row {
    display: flex;
    display: -webkit-flex;
    .el-form-item {
      flex: 0 0 50%;
      .el-form-item__content {
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
    .form-flex-all {
      flex: 0 0 100%;
      .form-input {
        width: 100%;
      }
    }
  }
}
.recharge-label {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 16px;
}
.text-bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.illustrate {
  color: #303133;
  .illustrate-item {
    margin-bottom: 15px;
    .rule-item {
      margin-top: 15px;
      i {
        font-size: 14px;
        font-style: italic;
        color: #409eff;
      }
      .eg {
        font-size: 14px;
        color: #e6a23c;
        margin-top: 5px;
      }
    }
  }
  .tips {
    margin-top: 15px;
    div{
      margin-top: 5px;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
