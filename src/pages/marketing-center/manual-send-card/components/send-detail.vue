<template>
  <div>
    <div class="detail-container">
      <el-row>
        <el-col :span="16">
          <el-divider content-position="left">赠送卡券信息</el-divider>
          <el-button size="small" type="warning" @click="handleSearchCard">选择卡券</el-button>
          <div class="list-table" style="width:100%;margin:15px 0;">
            <el-table size="small" :data="sendCardList" border tooltip-effect="dark">
              <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" prop="title" label="卡券标题" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="count" label="赠送数量" align="center" width="160">
                <template slot-scope="scope">
                  <el-input-number placeholder="赠送数量" size="mini" controls-position="right" :min="1" v-model="scope.row.count"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="库存" align="center" width="80"></el-table-column>
              <el-table-column prop="useLimit" label="使用上限" align="center" min-width="90" show-overflow-tooltip></el-table-column>
              <el-table-column prop="getLimit" label="领取上限" align="center" min-width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="领取时间" align="center" width="200">
                <template slot-scope="scope">
                  <div>{{ scope.row.startTime.split(' ')[0] }} - {{ scope.row.endTime.split(' ')[0] }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="160" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="removeCard(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-divider content-position="left">赠送对象信息</el-divider>
          <el-button size="small" type="warning" @click="handleSearchVip">选择赠送对象</el-button>
          <div class="list-table" style="width:100%;margin:15px 0;">
            <el-table size="small" :data="sendVipList" border tooltip-effect="dark">
              <el-table-column label="编号" align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" prop="userName" label="昵称" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="phone" label="手机号" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="identityName" label="会员类型" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" label="操作" width="160" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="removeVip(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <!-- 赠送确定按钮 -->
      <div class="send-btn"><el-button type="primary" @click="handleSendSubmit">确 定</el-button></div>
    </div>

    <!-- 卡券弹框 -->
    <el-dialog :visible.sync="isCardShow" title="卡券列表" width="900px" @closed="isCardShow = false" :close-on-click-modal="false">
      <el-form size="small" ref="cardSearchFormRef" :model="cardSearchForm" :inline="true">
        <el-form-item label="卡券类型" prop="cardType">
          <el-select v-model="cardSearchForm.type" placeholder="请选择卡券类型" style="width: 200px;" clearable>
            <el-option v-for="item in panCardTypes" :key="item.value" :value="item.value" :label="item.label">{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券名称" prop="title"> <el-input v-model.trim="cardSearchForm.title" width="160" placeholder="请输入卡券名称" clearable></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="getAllCardList">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveCardSelected">保存</el-button> </el-form-item>
      </el-form>
      <el-table size="small" ref="cardListTable" :data="cardList" border @selection-change="selectCardTableRow" :row-key="getRowKey" v-loading="listLoading" style="margin-bottom:10px;">
        <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
        <el-table-column align="center" label="编号" width="59" type="index"></el-table-column>
        <el-table-column align="center" prop="title" label="卡券名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="quantity" label="库存" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="useLimit" label="使用上限" width="120"></el-table-column>
        <el-table-column align="center" prop="getLimit" label="领取上限" width="120"></el-table-column>
        <el-table-column align="center" label="领取时间" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.startTime.split(' ')[0] }} - {{ scope.row.endTime.split(' ')[0] }}</div>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cardPageIndex"
          :page-size="cardPageSize"
          :total="cardTotal"
          layout="total, prev, pager, next"
          background
          small
          style="float:right;margin-top:15px;"
        >
        </el-pagination>
      </el-col>
      <div slot="footer"></div>
    </el-dialog>

    <!-- 会员信息弹框 -->
    <el-dialog :visible.sync="isVipShow" title="会员列表" width="900px" @closed="isVipShow = false" :close-on-click-modal="false">
      <el-form size="small" ref="vipSearchFormRef" :model="vipSearchForm" :inline="true">
        <el-form-item prop="nickName"> <el-input v-model.trim="vipSearchForm.nickName" width="160" placeholder="请输入昵称检索" clearable></el-input> </el-form-item>
        <el-form-item prop="phone"> <el-input v-model.trim="vipSearchForm.phone" width="160" placeholder="请输入手机号检索" clearable></el-input> </el-form-item>
        <el-form-item prop="identityid">
          <el-select v-model="vipSearchForm.identityid" placeholder="请选择会员类型" style="width: 200px;">
            <el-option v-for="item in isvipList" :key="item._id" :value="item._id" :label="item.identityName">{{ item.identityName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="getVipListByPage">搜索</el-button> </el-form-item>
        <el-form-item> <el-button type="warning" @click="saveVipSelected">保存</el-button> </el-form-item>
      </el-form>
      <el-table size="small" ref="vipListTable" :data="vipList" border @selection-change="selectVipTableRow" :row-key="getRowKey" v-loading="listLoading" style="margin-bottom:10px;">
        <el-table-column align="center" type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column align="center" label="编号" width="55" type="index"></el-table-column>
        <el-table-column align="center" prop="nickName" label="昵称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="vipCard.identityName" label="会员类型" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="vipPageIndex"
          :page-size="vipPageSize"
          :total="vipTotal"
          layout="total, prev, pager, next"
          background
          small
          style="float:right;margin-top: 15px;"
        >
        </el-pagination>
      </el-col>
      <div slot="footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import Filters from '@/components/js/Filters'
import { getAllCards, GetUserIdentityByPage, UserCRMList, getGiveCards } from '@/api/system'
export default {
  mixins: [Filters],
  data() {
    return {
      // 卡券信息
      sendCardList: [],
      selectedSendCardList: [],
      cardTypeList: [{ value: 0, label: '兑换券' }, { value: 1, label: '代金券' }, { value: 2, label: '折扣券' }, { value: 3, label: '大小券' }],
      cardSearchForm: {
        type: null,
        title: ''
      },
      cardList: [],
      isCardShow: false,
      // 会员信息
      sendVipList: [],
      selectedVipList: [],
      vipSearchForm: {
        nickName: '',
        phone: '',
        identityid: ''
      },
      isvipList: [],
      vipList: [],
      isVipShow: false,
      // 查询参数
      cardPageIndex: 1,
      cardPageSize: 10,
      cardTotal: 0,
      vipPageIndex: 1,
      vipPageSize: 10,
      vipTotal: 0,
      queryInfo: {
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      },
      listLoading: false
    }
  },
  watch: {
    isCardShow(val) {
      if (!val) {
        this.cardPageIndex = 1
        this.$refs.cardSearchFormRef.resetFields()
        this.$refs.cardListTable.clearSelection()
      }
    },
    isVipShow(val) {
      if (!val) {
        this.vipPageIndex = 1
        this.$refs.vipSearchFormRef.resetFields()
        this.$refs.vipListTable.clearSelection()
      }
    }
  },
  created() {
    this.GetIdentityListByPage()
  },
  methods: {
    // 选择卡券
    handleSearchCard() {
      this.isCardShow = true
      this.getAllCardList()
    },
    // 获取所有卡券信息
    getAllCardList() {
      let params = {
        ...this.cardSearchForm,
        ...this.queryInfo,
        pageIndex: this.cardPageIndex,
        pageSize: this.cardPageSize
      }
      this.listLoading = true
      getAllCards(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.cardList = res.data
            this.cardTotal = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    getRowKey(row) {
      return row._id
    },
    // 获取选中的卡券
    selectCardTableRow(row) {
      this.selectedSendCardList = row.map(card => {
        return {
          cardType: card.type,
          title: card.title,
          cardId: card._id,
          quantity: card.quantity,
          startTime: card.startTime,
          endTime: card.endTime,
          getLimit: card.getLimit,
          useLimit: card.useLimit,
          count: 1
        }
      })
    },
    // 保存选中的卡券
    saveCardSelected() {
      if (this.selectedSendCardList.length > 0) {
        let norepeatSelect = this.selectedSendCardList.filter(item => {
          return this.sendCardList.every(v => v.cardId !== item.cardId)
        })
        this.sendCardList.push(...norepeatSelect)
        this.isCardShow = false
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 删除卡券
    removeCard(row) {
      let index = this.sendCardList.findIndex(item => item.cardId === row.cardId)
      this.sendCardList.splice(index, 1)
    },

    handleSearchVip() {
      this.isVipShow = true
      this.getVipListByPage()
    },
    // 获取会员类型
    GetIdentityListByPage() {
      let params = {
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
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
            this.isvipList = res.data
            this.isvipList.unshift({
              _id: '',
              identityName: '所有会员类型'
            })
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },

    // 获取会员列表
    getVipListByPage() {
      let parmas = {
        status: 0,
        ...this.vipSearchForm,
        ...this.queryInfo,
        pageIndex: this.vipPageIndex,
        pageSize: this.vipPageSize
      }
      this.loading = true
      UserCRMList(parmas).then(
        res => {
          this.loading = false
          if (res.success) {
            this.vipList = res.data
            this.vipTotal = res.total
          } else this.$message.error(res.msg)
        },
        err => {
          this.$message.error(err.msg)
        }
      )
    },

    // 获取选中的会员
    selectVipTableRow(row) {
      this.selectedVipList = row.map(vip => {
        return {
          userId: vip._id,
          userName: vip.nickName,
          phone: vip.phone,
          identityName: vip.vipCard.identityName
        }
      })
    },
    // 保存选中的会员
    saveVipSelected() {
      if (this.selectedVipList.length > 0) {
        let norepeatSelect = this.selectedVipList.filter(item => {
          return this.sendVipList.every(v => v.userId !== item.userId)
        })
        this.sendVipList.push(...norepeatSelect)
        this.isVipShow = false
      } else {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
      }
    },
    // 删除赠送对象
    removeVip(row) {
      let index = this.sendVipList.findIndex(item => item.userId === row.userId)
      this.sendVipList.splice(index, 1)
    },

    // 赠送卡券提交
    handleSendSubmit() {
      if (this.sendCardList.length <= 0) {
        this.$message.warning('请选择要赠送的卡券！')
      } else if (this.sendVipList.length <= 0) {
        this.$message.warning('请选择要赠送的会员！')
      } else {
        this.$confirm('确认提交数据吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            let params = {
              cards: this.sendCardList,
              customer: this.sendVipList,
              creater: localStorage.getItem('creater'),
              roleId: localStorage.getItem('roleId'),
              cid: localStorage.getItem('cid')
            }
            getGiveCards(params)
              .then(res => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this.sendCardList = []
                  this.sendVipList = []
                }
              })
              .catch(err => {
                console.log(err.msg)
              })
          })
          .catch(() => {})
      }
    },

    handleSizeChange(val) {
      if (this.isCardShow) {
        this.cardPageSize = val
        this.getAllCardList()
      } else if (this.isVipShow) {
        this.vipPageSize = val
        this.getVipListByPage()
      }
    },
    handleCurrentChange(val) {
      if (this.isCardShow) {
        this.cardPageIndex = val
        this.getAllCardList()
      } else if (this.isVipShow) {
        this.vipPageIndex = val
        this.getVipListByPage()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
