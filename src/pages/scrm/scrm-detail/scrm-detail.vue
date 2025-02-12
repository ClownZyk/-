<template>
  <div class="detail">
    <div class="detail-top">
      <div class="detail-base detail-base-msg">
        <img class="detail-bg-img" src="../../../assets/scrm/bg1.png" /> <img class="detail-headImg" :src="userDetail.headImg || defaultImg" />
        <div class="detail-name name-weight">{{ userDetail.nickName || '--' }}</div>
        <div class="detail-name">会员ID: {{ userDetail.memberCard.cardId || '--' }}</div>
        <div class="detail-btn">
          <div class="btn-send">
            <el-button type="primary" size="mini" @click="vipSendShow = true">会员赠送</el-button>
            <el-button v-if="isManage" type="primary" size="mini" @click="rechangeShow = true">余额修改</el-button>
          </div>
          <div class="info-edit"><el-button type="primary" size="mini" @click="memberEditShow = true">修改资料</el-button></div>
        </div>
      </div>
      <div class="detail-base detail-more-msg">
        <img class="detail-bg-img" src="../../../assets/scrm/bg2.png" />
        <div class="more-main">
          <div class="more-msg">
            <div class="more-msg-line">
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-rechange.png" />
                <div class="more-item-title">余额：{{ userDetail.memberCard.accountMoney }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-sex.png" />
                <div class="more-item-title">性别：{{ userDetail.sex | sexType }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-mail.png" />
                <div class="more-item-title">邮箱：{{ userDetail.email || '--' }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-code.png" />
                <div class="more-item-title">邀请码：{{ userDetail.qrcode || '--' }}</div>
              </div>
            </div>
            <div class="more-msg-line">
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-integral.png" />
                <div class="more-item-title">积分：{{ userDetail.memberCard.integral }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-tel.png" />
                <div class="more-item-title">电话：{{ userDetail.phone || '--' }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-birth.png" />
                <div class="more-item-title">生日：{{ userDetail.birthday || '--' }}</div>
              </div>
              <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-time.png" />
                <div class="more-item-title">注册时间：{{ userDetail.createTime }}</div>
              </div>
            </div>
            <div class="more-msg-line">
              <div class="more-msg-item" v-if="!memberVipState">
                <img src="../../../assets/scrm/icon-vip.png" />
                <div class="more-item-title">会员状态：{{ userDetail.vipCard.isVip ? '是' : '否' }}</div>
                <span class="iconfont icon-huiyuanxinxi" @click="vipSendShow = true"></span>
              </div>
              <div class="more-msg-item" v-if="memberVipState">
                <img src="../../../assets/scrm/icon-vip.png" />
                <div class="more-item-title">会员开始时间：{{ userDetail.vipCard.beginTime | formatTime }}</div>
              </div>
              <div class="more-msg-item" v-if="memberVipState">
                <img src="../../../assets/scrm/icon-vip.png" />
                <div class="more-item-title">会员结束时间：{{ userDetail.vipCard.endTime | formatTime }}</div>
              </div>
               <div class="more-msg-item">
                <img src="../../../assets/scrm/icon-vip.png" />
                <div class="more-item-title">管理员状态：{{ userDetail.operator ? '是' : '否' }}</div>
              </div>
            </div>
          </div>
          <div class="detail-tags">
            <el-tag :key="tag" v-for="tag in dynamicTags" effect="dark" :disable-transitions="false" @close="handleClose(tag)" size="small">{{ tag }}</el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" v-if="vipSendShow" @click="vipSendShow = false"></div>
    <!-- 会员赠送 时间段 -->
    <div class="modal-box" v-if="vipSendShow">
      <div class="block">
        <span class="demonstration">请选择时间：</span>
        <el-date-picker v-model="VipTime" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="chooseTimeRange"></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vipSendShow = false">取 消</el-button>
        <el-button type="primary" @click="_vip">确 定</el-button>
      </span>
    </div>
    <!-- 修改余额 -->
    <div class="modal" v-if="rechangeShow" @click="rechangeShow = false"></div>
    <div class="modal-box" v-if="rechangeShow">
      <el-form :model="accountMoneyForm" label-width="120px" label-position="right">
        <el-form-item label="修改余额："> <el-input-number controls-position="right" :min="0" :precision="2" v-model="accountMoneyForm.accountMoney" placeholder="请输入金额" style="width: 180px"></el-input-number> 元 </el-form-item>
        <el-form-item label="修改密码："> <el-input type="passWord" v-model="accountMoneyForm.key" placeholder="请输入余额修改密码" :show-password="true" style="width: 200px"></el-input> </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rechangeShow = false">取 消</el-button>
        <el-button type="primary" @click="Amendqueding">确 定</el-button>
      </span>
    </div>
    <!-- 会员赠送 天数 -->
    <div class="modal" v-if="vipSendShow" @click="vipSendShow = false"></div>
    <div class="modal-box" v-if="vipSendShow">
      <span>请输入会员赠送天数:</span>
      <el-form :model="vip" ref="vip" class="msg-dialog" :rules="viprules">
        <div class="mag-dialog-row">
          <el-form-item prop="changeDays">
            <div class="form-item-title">赠送天数 <span class="border"></span> <span class="EnName">changeDays</span></div>
            <el-input-number v-model="vip.changeDays" controls-position="right" :precision="0" placeholder="请输入赠送天数"></el-input-number>
          </el-form-item>
          <el-form-item prop="remark">
            <div class="form-item-title">备注 <span class="border"></span> <span class="EnName">remark</span></div>
            <el-input v-model="vip.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="vipSendShow = false">取 消</el-button>
        <el-button type="primary" @click="vipDaysSend('vip')">确 定</el-button>
      </span>
    </div>
    <!-- 编辑弹框 -->
    <div class="modal" v-if="memberEditShow" @click="memberEditShow = false"></div>
    <div title="编辑" class="modal-box" v-if="memberEditShow" width="700px">
      <el-form :model="dialog" class="msg-dialog" :rules="memberEditRules" ref="dialog">
        <div class="mag-dialog-row">
          <el-form-item>
            <div class="form-item-title">真实姓名 <span class="border"></span> <span class="EnName">REALNAME</span></div>
            <el-input v-model="dialog.realName" clearable></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <div class="form-item-title">手机号 <span class="border"></span> <span class="EnName">TEL</span></div>
            <el-input v-model="dialog.phone" clearable></el-input>
          </el-form-item>
          <el-form-item prop="birthday">
            <div class="form-item-title">生日 <span class="border"></span> <span class="EnName">BIRTH</span></div>
            <el-date-picker style="width: 100%;" v-model="dialog.birthday" format="yyyy/MM/dd" value-format="yyyy/MM/dd" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item prop="sex">
            <div class="form-item-title">性别 <span class="border"></span> <span class="EnName">SEX</span></div>
            <el-select style="width: 100%;" v-model="dialog.sex" placeholder="请选择性别">
              <el-option v-for="item in sexList" :key="item.index" :value="item.index" :label="item.value">{{ item.value }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="padding-right: 0;">
            <div class="form-item-title">电子邮箱 <span class="border"></span> <span class="EnName">E-MAIL</span></div>
            <el-input v-model="dialog.email" placeholder="请输入电子邮箱" style="width: 390px;" clearable></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item prop="headImg">
            <div class="form-item-title">会员头像 <span class="border"></span> <span class="EnName">HEADIMG</span></div>
            <my-upload :imgs="dialog.logoImgs" :limitUploadImgs="1" ref="uploadImg" @handleRemoveImg="handleRemoveImg('logoImgs', 1, $event)" @handleUploadImg="handleUploadImg('logoImgs', 1, $event)"></my-upload>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="memberEditShow = false">取 消</el-button>
        <el-button type="primary" @click="optionMsg(dialog, 1, '编辑')">确 定</el-button>
      </div>
    </div>
    <!-- tab切换 -->
    <el-tabs v-model="activeName" class="tabs-list" background-color="#ffffff">
      <el-tab-pane label="会员信息" name="first"> <detail></detail> </el-tab-pane>
      <el-tab-pane label="会员订单" name="second"> <order-shopping></order-shopping> </el-tab-pane>
      <el-tab-pane label="身份类型绑定" name="third"> <identy-bind></identy-bind> </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import detail from './components/detail'
import orderShopping from './components/order-shopping'
import identyBind from './components/identy-bind'
import { formatDate } from '@/components/js/data'
import myUpload from '@/components/my-upload'
import { GetUserDetail, updataUserVipTime, updataUserAvailableBalance, UserCRMOperation, GetVipUser } from '@/api/system'
export default {
  name: 'scrm-detail',
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      memberVipState: false,
      memberEditShow: false, // 会员信息修改
      accountMoneyForm: {
        accountMoney: 0,
        key: null
      },
      rechangeShow: false,
      vipSendShow: false, // 会员赠送弹框显示状态
      dynamicTags: ['90后', '下午茶', '碳酸饮料', '关东煮', '00后', '门店消费', '任务达人', '运动达人', '午餐', '加班', '送货上门', '连续消费', '云极会员', '奶茶', '小零食', '潮', '儿童玩具', '素食主义'],
      inputVisible: false,
      inputValue: '',
      sexList: [{ index: 1, value: '男' }, { index: 2, value: '女' }],
      defaultImg: 'http://v6.wxbos.cn/Files/Pictures/2020/10/21/8c9547db-5952-433d-99db-bec7c0584047.png',
      dialog: {
        realName: '',
        phone: '',
        birthday: '',
        sex: 1,
        email: '',
        isVip: false,
        logoImgs: [],
        headImg: ''
      },
      userDetail: {
        memberCard: {},
        vipCard: {}
      },
      VipTime: [formatDate(new Date(), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')],
      vip: {
        changeDays: null,
        remark: '',
        id: this.$route.query.id,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      },
      viprules: {
        changeDays: [{ required: true, message: '请输入赠送天数', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写赠送备注', trigger: 'blur' }]
      },
      memberEditRules: {
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'change' }]
      },
      activeName: 'first'
    }
  },
  watch: {
    rechangeShow(val) {
      if (!val) {
        this.accountMoneyForm = {
          accountMoney: 0,
          key: null
        }
      }
    }
  },
  mounted() {
    this.dynamicTags = this.getRandomArr(this.dynamicTags, Math.floor(Math.random() * 5 + 1))
    this._getDetail()
  },
  filters: {
    formatTime(time) {
      return time && time.split(' ')[0]
    },
    sexType(val) {
      switch (val) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return '--'
      }
    }
  },
  methods: {
    getRandomArr(arr, count) {
      // 随机抽取
      var shuffled = arr.slice(0)
      var i = arr.length
      var min = i - count
      var temp = null
      var index = null
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random())
        temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    chooseTimeRange(t) {
      this.arrTime = t
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    optionMsg(dto, action, txt) {
      this.$refs['dialog'].validate(valid => {
        if (valid) {
          this.operation(dto, action, txt)
        } else return false
      })
    },
    // 会员信息修改
    operation(dto, action, txt) {
      this.$confirm('确定' + txt + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            dto: dto,
            action: action
          }
          if (this.dialog.phone === '') {
            this.$message.error('请输入手机号')
          } else {
            UserCRMOperation(params).then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.$router.push('/scrm-list')
              } else this.$message.error(res.msg)
            })
          }
        })
        .catch(() => {})
    },
    // 赠送会员
    _vip() {
      if (this.VipTime.length < 2) {
        this.$message.warning('请选择正确的时间')
        return false
      }
      let parmas = {
        _id: this.$route.query.id,
        beginTime: this.VipTime[0],
        endTime: this.VipTime[1],
        creater: this.userDetail.creater,
        roleId: this.userDetail.roleId,
        cid: this.userDetail.cid
      }
      updataUserVipTime(parmas).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.vipSendShow = false
          this._getDetail()
        } else this.$message.error(res.msg)
      })
    },
    // 修改确定
    Amendqueding() {
      if (!this.accountMoneyForm.key) {
        return this.$message.warning('请输入余额修改密码！')
      }
      // if (!this.accountMoneyForm.accountMoney) {
      //   return this.$message.warning('请输入修改的余额！')
      // }
      this.$confirm('确定修改此用户的余额信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let parmas = {
            _id: this.$route.query.id,
            key: parseInt(this.accountMoneyForm.key),
            accountMoney: this.accountMoneyForm.accountMoney,
            // creater: this.$store.state.UserID,
            // roleId: this.$store.state.UserRole,
            // cid: this.$store.state._cid
            creater: localStorage.getItem('creater'),
            roleId: localStorage.getItem('roleId'),
            cid: localStorage.getItem('cid')
          }
          // console.log(parmas)
          updataUserAvailableBalance(parmas).then(res => {
            if (res.success) {
              this.$message.success('余额修改成功')
              this._getDetail()
            } else this.$message.error(res.msg)
          })
          this.rechangeShow = false
        })
        .catch(() => {})
    },
    // 会员赠送天数
    vipDaysSend(formName) {
      this.$confirm('是否赠送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$refs[formName].validate(valid => {
            if (valid) {
              GetVipUser(this.vip).then(res => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this.vipSendShow = false
                  this.$router.go(-1)
                } else this.$message.error(res.msg)
              })
            } else {
              return false
            }
          })
        })
        .catch(() => {})
    },
    _getDetail() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        GetUserDetail(parmas).then(
          res => {
            if (res.success) {
              this.userDetail = res.data
              this.dialog = res.data
              this.dialog.logoImgs = []
              this.dialog.logoImgs.push({ url: this.userDetail.headImg })
              this.memberVipState = this.userDetail.vipCard && this.userDetail.vipCard.isVip && new Date(this.userDetail.vipCard.endTime).getTime() > new Date().getTime()
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      }
    },
    // 移除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.dialog[txt] = fileList
      } else {
        this.dialog.headImg = ''
      }
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.dialog[txt]) {
          this.$set(this.dialog, txt, [])
        }
        this.form[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.dialog.headImg = imgObj.url
        // console.log(this.dialog.headImg)
      }
    }
  },
  components: { detail, orderShopping, myUpload, identyBind }
}
</script>

<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  height: 100vh;
  overflow-y: scroll;
}
.detail {
  position: fixed;
  width: calc(100% - 200px);
  // width: 100%;
  background-color: #ffffff;
  height: 100vh;
  overflow-y: scroll;
  top: 0;
  right: 0;
  z-index: 99;
  padding: 60px 10px 20px;
  .detail-top {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    width: 100%;
    .detail-base-msg {
      width: 12.1%;
      padding: 20px 0;
      .detail-headImg {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: block;
        margin: 0 auto;
      }
      .detail-name {
        text-align: center;
        margin-top: 15rpx;
        font-size: 14px;
      }
      .name-weight {
        font-weight: 700;
      }
      .detail-btn {
        margin: 0 auto;
        margin-top: 10px;
        // display: flex;
        // justify-content: center;
        .btn-send {
          display: flex;
          justify-content: center;
        }
        .info-edit {
          margin-top: 10px;
          text-align: center;
        }
      }
    }
    .detail-more-msg {
      width: 87%;
      .more-main {
        padding: 20px 40px;
        .more-msg {
          .more-msg-line {
            display: flex;
            display: -webkit-flex;
            margin-bottom: 15px;
            .more-msg-item {
              display: flex;
              display: -webkit-flex;
              align-items: center;
              width: 240px;
              img {
                width: 20px;
                height: 20px;
              }
              .more-item-title {
                font-size: 14px;
                margin-left: 10px;
              }
              span {
                color: #0481ff;
                margin-left: 5px;
                cursor: pointer;
              }
            }
          }
        }
        .detail-tags {
          margin-top: 5px;
        }
      }
    }
    .detail-base {
      position: relative;
      .detail-bg-img {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        z-index: -1;
      }
    }
  }
  .tabs-list {
    margin-top: 50px;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
}
.modal-box {
  width: 800px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 101;
  padding: 30px 40px 40px;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
