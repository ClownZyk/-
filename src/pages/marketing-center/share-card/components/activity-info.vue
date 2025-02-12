<template>
  <el-row>
    <el-col :span="12">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item prop="title">
          <div class="title">卡券分享活动名称</div>
          <el-input type="text" v-model="addForm.title" placeholder="请输入卡券分享活动名称" clearable> </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>
              <div class="title">活动开始时间</div>
              <el-date-picker v-model="addForm.startTime" type="datetime" placeholder="选择活动开始日期时间" default-time="00:00" format="yyyy/MM/dd HH:mm" value-format="yyyy/MM/dd HH:mm" :clearable="false" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <div class="title">活动截止时间</div>
              <el-date-picker v-model="addForm.endTime" type="datetime" placeholder="选择活动截止日期时间" default-time="23:59" format="yyyy/MM/dd HH:mm" value-format="yyyy/MM/dd HH:mm" :clearable="false" style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <div class="title">
            <span style="margin-right:15px;">包含卡券</span>
            <el-button size="mini" type="warning" @click="getCard">添加卡券</el-button>
          </div>
          <el-table size="mini" :data="addForm.cardBag" border>
            <el-table-column type="index" width="55" align="center"></el-table-column>
            <el-table-column label="卡券名称" prop="title" min-width="220" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="卡券类别" min-width="140" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ scope.row.cardType | panCardTypes2Str }}</div>
              </template>
            </el-table-column>
            <el-table-column label="卡券数量" min-width="160" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.count" :min="1" :controls="false" :step="1" step-strictly></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="removeCard(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <div class="title">活动介绍</div>
          <el-input type="textarea" v-model="addForm.intro" :rows="4" placeholder="请输入卡券分享活动介绍"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="title">活动状态</div>
          <el-switch v-model="addForm.isOpen"> </el-switch>
        </el-form-item>
        <el-form-item v-show="addForm.shareUrl">
          <div class="title">活动分享地址</div>
          <el-input v-model="addForm.shareUrl" disabled> </el-input>
          <el-button size="mini" type="warning" v-copy="addForm.shareUrl">复制链接</el-button>
        </el-form-item>
        <el-form-item v-show="linkUrl && addFormState === 1">
          <div class="title">小程序跳转地址</div>
          <el-input v-model="linkUrl" disabled> </el-input>
          <el-button size="mini" type="warning" v-copy="linkUrl">复制地址</el-button>
        </el-form-item>
        <el-form-item>
          <div class="title">活动图片</div>
          <my-upload :imgs="addForm.coverImge" :limitUploadImgs="5" @handleRemoveImg="handleRemoveImg('coverImge', 5, $event)" @handleUploadImg="handleUploadImg('coverImge', 5, $event)"> </my-upload>
        </el-form-item>
        <el-form-item> <el-button type="primary" @click="submitActivityInfo">确定并提交</el-button> </el-form-item>
      </el-form>
      <cards-select ref="cardRef" :isShowCardSelect="isShowCardSelect" @savedCard="savedCard" @handleDialog="closedDialog"></cards-select>
    </el-col>
  </el-row>
</template>

<script>
import { getShareCardActivityDetail, shareCardActivityOpertaion } from '@/api/system'
import { getDataString } from '@/filters/filters'
import CardsSelect from '@/components/cards-select.vue'
import myUpload from '@/components/my-upload'
import Filters from '@/components/js/Filters.js'

export default {
  mixins: [Filters],
  components: {
    CardsSelect,
    myUpload
  },
  data() {
    return {
      addForm: {
        title: '',
        intro:
          '红包仅限有效期内，通过云极小超小程序内使用；红包仅限在线支付使用，每个订单只能使用一张券，不能与其他全叠加使用，且不找零；红包仅限关联了此手机号的云极小超账户使用；在法律法规允许的范围内，云极小超对本活动拥有解释权，如有疑问，请联系活动群客服。',
        cardBag: [],
        startTime: getDataString(new Date(), 'yyyy/MM/dd 00:00'),
        endTime: getDataString(new Date(), 'yyyy/MM/dd 23:59'),
        isOpen: true,
        shareUrl: '',
        coverImge: []
      },
      linkUrl: '',
      isShowCardSelect: false,
      addFormRules: {
        title: [{ required: true, message: '请输入卡券分享活动名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getActivityDetail()
      this.linkUrl = `/pages-market/pages/share-coupon/share-coupon?shareCardId=${this.$route.query.id}`
    }
  },
  methods: {
    getActivityDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getShareCardActivityDetail(params).then(res => {
        this.addForm = res.data
      })
    },
    getCard() {
      this.isShowCardSelect = true
      this.$nextTick(() => {
        this.$refs['cardRef'].getAllCardList()
      })
    },
    savedCard(card) {
      let norepeatSelect = card
        .filter(item => {
          return this.addForm.cardBag.every(v => v.cardId !== item._id)
        })
        .map(val => {
          return {
            cardType: val.type,
            title: val.title,
            cardId: val._id,
            count: 1,
            isReceive: false,
            reason: ''
          }
        })
      this.addForm.cardBag.push(...norepeatSelect)
    },
    closedDialog(val) {
      this.isShowCardSelect = val
    },
    removeCard(row) {
      let index = this.addForm.cardBag.findIndex(item => item.cardId === row.cardId)
      this.addForm.cardBag.splice(index, 1)
    },
    submitActivityInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.cardBag.length <= 0) {
            return this.$message.warning('请选择活动包含的卡券！')
          }
          if (this.addForm.coverImge.length <= 0) {
            return this.$message.warning('请选择活动图片！')
          }
          this.$confirm('确定提交数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              let params = {
                dto: {
                  ...this.addForm,
                  creater: this.$store.state.UserID,
                  roleId: this.$store.state.UserRole,
                  cid: this.$store.state._cid
                },
                action: this.addFormState
              }
              shareCardActivityOpertaion(params).then(res => {
                this.$message.success(res.msg)
                this.$router.back()
              })
            })
            .catch(() => {})
        }
      })
    },
    // 删除图片
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      this.addForm[txt] = fileList
    },
    // 图片上传成功回调
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (!this.addForm[txt]) {
        this.$set(this.addForm, txt, [])
      }
      this.addForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 700;
}
</style>
