<template>
  <div class="page-contain">
    <!--表单-->
    <el-form ref="form" :model="form" label-width="80px" label-position="top"  class="form-contain" :rules="rules">
      <!-- <el-form-item prop="consumption">
        <div class="form-item-title"><span class="item-tips">*</span>消费金额满足条件<span class="border"></span> <span class="EnName">consumption</span></div>
        <el-input-number controls-position="right" placeholder="请输入消费金额" :precision="2" v-model="form.consumption"></el-input-number>
      </el-form-item> -->
      <el-form-item prop="time">
        <div class="form-item-title"><span class="item-tips">*</span>活动时间<span class="border"></span> <span class="EnName">time</span></div>
        <el-form-item>
          <el-date-picker
            v-model="form.time"
            type="daterange"
            @change="dataSelect"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <div class="form-item-title">
          启用状态
          <el-switch v-model="form.display"></el-switch>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="form-item-title"><span class="item-tips">*
          </span>卡劵信息<span class="border"></span> <span class="EnName">cards</span>
          <el-button class="card-add" type="primary" size="mini" @click="isShowCardSelect=true">新增</el-button>
        </div>
        <el-table class="product-list" :data="form.voucher" border tooltip-effect="dark">
              <el-table-column align="center" type="index" label="序号" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="title" label="名称" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="getLimit" label="总库存" min-width="140" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="getLimit" label="领取上限" min-width="140" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column align="center" prop="getLimit" label="领取上限" width="165" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input-number  controls-position="right" size="mini" :precision="0" :max="scope.row.getLimit" v-model="scope.row.getLimit"></el-input-number>
                </template>
              </el-table-column> -->
              <el-table-column align="center" label="操作" min-width="100">
                <template slot-scope="scope">
                  <el-button type="danger"
                            size="mini"
                            @click="delectProduct(scope.$index, 1)">删除
                  </el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="margin-top: 20px;">
        <el-button type="primary" @click="_sumbit(text)">{{text}}</el-button>
      </el-form-item>
    </el-form>
    <!-- 兑换券选择器 -->
      <exchange-card-select :isShowCardSelect="isShowCardSelect"
                            :selectedList="selectedList"
                            :searchCondition="searchCondition"
                            @handleCardSelect="handleCardSelect"
                            @saveSelected="saveSelectedVirtual">
      </exchange-card-select>
  </div>
</template>
<script>
  import {RegisterOperation, GetRegisterDetailById, SingleOperation, GetSingleDetailId} from '@/api/system'
  import {formatDate} from '@/components/js/data'
  import exchangeCardSelect from '@/components/exchange-card-select.vue'
  export default {
    data() {
      return {
        isShowCardSelect: false,
        selectedList: [],
        dialogVisible: false,
        dialogImageUrl: '',
        searchCondition: {
          startTime: formatDate(new Date(), 'yyyy/MM/dd'),
          endTime: formatDate(new Date(), 'yyyy/MM/dd')
        },
        text: parseInt(this.$route.query.action) === 0 ? '新增' : '修改',
        id: this.$route.query.id,
        pageSize: 10,
        pageIndex: 1,
        form: {
          display: true,
          time: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')],
          voucher: [],
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        rules: {
          // consumption: [
          //   { required: true, message: '请输入消费金额', trigger: 'blur' },
          //   { min: 0, message: '金额不得低于0', trigger: 'blur' }
          // ],
          time: [
            { required: true, message: '请输入消费金额', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init () {
        let parmas = {
          _id: this.id
        }
        let _baseUrl = this.$route.query.type === 'register' ? GetRegisterDetailById : GetSingleDetailId
        _baseUrl(parmas).then(res => {
          if (res.success) {
            let time = [res.data.startTime.split(' ')[0], res.data.endTime.split(' ')[0]]
            this.form = res.data
            this.form.time = time
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      dataSelect(val) {
        this.searchCondition = {
          startTime: val[0],
          endTime: val[1]
        }
      },
      handleCardSelect(flag) {
        if (flag) {
            this.selectedList = this.detail.voucher
          } else {
            // 关闭产品选择器，初始化数据
            this.selectedList = []
          }
          this.isShowCardSelect = flag
      },
      saveSelectedVirtual(newSelectedList) {
        newSelectedList = newSelectedList.map(cardItem => {
          return {
            coupon: cardItem._id,
            title: cardItem.title,
            receiveStatus: false,
            // useLimit: cardItem.useLimit,
            quantity: cardItem.quantity,
            getLimit: cardItem.getLimit,
            consumption: null
          }
        })
          this.form.voucher = this.form.voucher.concat(newSelectedList)
          this.handleCardSelect(false)
      },
      delectProduct(index) {
         this.form.voucher.splice(index, 1)
      },
      // 提交
      _sumbit() {
        if (this.form.voucher.length === 0) {
          this.$message.warning('请选择卡劵')
          return false
        }
        this.form = {
          ...this.form,
          startTime: this.form.time[0],
          endTime: `${this.form.time[1]} 23:59:59`
        }
        let parmas = {
          dto: this.form,
          action: parseInt(this.$route.query.action)
        }
        this.$confirm('是否' + this.text + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _urlName = this.$route.query.type === 'register' ? RegisterOperation : SingleOperation
          _urlName(parmas).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      }
    },
    mounted() {
    if (this.$route.query.action) {
        this.init()
      }
    },
    components: {exchangeCardSelect}
  }
</script>
<style lang="scss" scoped>
  .page-contain{
    display: flex;
    display: -webkit-flex;
    .form-contain{
      flex: 0 0 50%;
      padding: 0 120px 20px 20px;
      .el-form-item{
        .el-form-item__content{
          .form-item-title{
            font-weight: bolder;
            font-size: 16px;
            position: relative;
            .card-add{
              margin-left: 80px;
            }
            .item-tips{
              color: #D80000;
            }
            .border{
              width: 1px;
              height: 16px;
              position: absolute;
              background-color: #000000;
              display: inline-block;
              top: 10px;
              margin-left: 8px;
            }
            .EnName{
              font-weight: normal;
              font-size: 14px;
              position: absolute;
              bottom: 0;
              margin-left: 17px;
              text-transform: uppercase;
            }
          }
        }
      }
    }
  }
  .row-line{
    display: flex;
    display: -webkit-flex;
    .el-form-item{
      flex: 1;
      padding-right: 5%;
      &:last-child{
        padding-right: 0;
      }
    }
  }
</style>
