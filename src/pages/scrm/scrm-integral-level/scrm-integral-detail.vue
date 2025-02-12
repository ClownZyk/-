<template>
  <div class="container">
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="积分等级详情"> </el-page-header></div>
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="积分等级名称" prop="levelName"> <el-input type="text" v-model.trim="addForm.levelName" placeholder="请输入积分等级名称"></el-input> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="积分满足额" prop="integrals"> <el-input-number v-model="addForm.integrals" :controls="false" :min="0" :step="1" step-strictly label="积分满足额" style="width:100%"></el-input-number> </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="零售折扣(%)" prop="retailRatio">
                <el-input-number v-model="addForm.retailRatio" :controls="false" :min="0" :max="100" :step="0.1" step-strictly label="零售折扣" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="餐食折扣(%)" prop="makeRatio">
                <el-input-number v-model="addForm.makeRatio" :controls="false" :min="0" :max="100" :step="0.1" step-strictly label="餐食折扣" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="饮品折扣(%)" prop="drinkRatio">
                <el-input-number v-model="addForm.drinkRatio" :controls="false" :min="0" :max="100" :step="0.1" step-strictly label="饮品折扣" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="零售兑换积分倍数" prop="retailMultiple">
                <el-input-number v-model="addForm.retailMultiple" :controls="false" :min="1" :step="1" step-strictly label="零售兑换积分倍数" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="餐食兑换积分倍数" prop="makeMultiple">
                <el-input-number v-model="addForm.makeMultiple" :controls="false" :min="1" :step="1" step-strictly label="餐食兑换积分倍数" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="饮品兑换积分倍数" prop="drinkMultiple">
                <el-input-number v-model="addForm.drinkMultiple" :controls="false" :min="1" :step="1" step-strictly label="饮品兑换积分倍数" style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="卡券福利">
              <el-button size="mini" type="warning" @click="handleDialog(true, 1)">添加卡券</el-button>
              <el-table size="small" :data="addForm.cardWelfare" border>
                <el-table-column label="卡券名称" prop="cardName" min-width="160"></el-table-column>
                <el-table-column label="卡券数量" width="160" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.count" :controls="false" :min="1" :step="1" step-strictly label="卡券数量"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="卡券标签" width="200" align="center">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model.trim="scope.row.title" placeholder="卡券标签"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="卡券标签图片" width="220" align="center">
                  <template slot-scope="scope">
                    <my-upload
                      class="sku-img"
                      :imgs="scope.row.imgs"
                      :limitUploadImgs="1"
                      @handleRemoveImg="handleRemoveCardImg('cardWelfare', scope.$index, $event)"
                      @handleUploadImg="handleUploadCardImg('cardWelfare', scope.$index, $event)"
                    >
                    </my-upload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="removeCard(scope.row, 1)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="月推送卡券福利">
              <el-button size="mini" type="warning" @click="handleDialog(true, 2)">添加卡券</el-button>
              <el-table size="small" :data="addForm.monthCardWelfare" border>
                <el-table-column label="卡券名称" prop="cardName" min-width="160"></el-table-column>
                <el-table-column label="卡券数量" width="160" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="mini" v-model="scope.row.count" :controls="false" :min="1" :step="1" step-strictly label="卡券数量"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="卡券标签" width="200" align="center">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model.trim="scope.row.title" placeholder="卡券标签"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="卡券标签图片" width="220" align="center">
                  <template slot-scope="scope">
                    <my-upload
                      class="sku-img"
                      :imgs="scope.row.imgs"
                      :limitUploadImgs="1"
                      @handleRemoveImg="handleRemoveCardImg('monthCardWelfare', scope.$index, $event)"
                      @handleUploadImg="handleUploadCardImg('monthCardWelfare', scope.$index, $event)"
                    >
                    </my-upload>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="removeCard(scope.row, 2)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="积分等级备注"> <el-input type="textarea" v-model="addForm.remark" placeholder="请输入积分等级备注"></el-input> </el-form-item>
          </el-row>
          <el-row>
            <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitLevelInfo">确定并提交</el-button> </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <!-- 卡券弹框 -->
    <cards-select :isShowCardSelect="isShowCardSelect" :type="cardState" @handleDialog="handleDialog" @savedCard="savedCard"></cards-select>
  </div>
</template>

<script>
import { getUserIntegralLevelDetail, userIntegralLevelOperation } from '@/api/system'
import CardsSelect from '@/components/cards-select'
import myUpload from '@/components/my-upload'

export default {
  components: {
    CardsSelect,
    myUpload
  },
  data() {
    return {
      addForm: {
        levelName: '',
        integrals: 0,
        cardWelfare: [],
        monthCardWelfare: [],
        retailRatio: 100,
        makeRatio: 100,
        drinkRatio: 100,
        retailMultiple: 1,
        makeMultiple: 1,
        drinkMultiple: 1,
        remark: ''
      },
      cardState: 1,
      cardFileList: [],
      monthCardFileList: [],
      isShowCardSelect: false,
      submitLoading: false,
      addFormRules: {
        levelName: [{ required: true, message: '请输入积分等级名称', trigger: 'blur' }],
        integrals: [{ required: true, message: '请输入积分满足额', trigger: 'change' }],
        retailRatio: [{ required: true, message: '请输入零售折扣', trigger: 'change' }],
        makeRatio: [{ required: true, message: '请输入餐食折扣', trigger: 'change' }],
        drinkRatio: [{ required: true, message: '请输入饮品折扣', trigger: 'change' }],
        retailMultiple: [{ required: true, message: '请输入零售兑换积分倍数', trigger: 'change' }],
        makeMultiple: [{ required: true, message: '请输入餐食兑换积分倍数', trigger: 'change' }],
        drinkMultiple: [{ required: true, message: '请输入饮品兑换积分倍数', trigger: 'change' }]
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.levelId) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.levelId) {
      this.getUserIntegralDetail()
    }
  },
  methods: {
    getUserIntegralDetail() {
      getUserIntegralLevelDetail({ _id: this.$route.query.levelId }).then(res => {
        this.addForm = {
          ...res.data,
          cardWelfare: res.data.cardWelfare.map(item => {
            return {
              ...item,
              imgs: item.images && item.images.url ? [{ url: item.images.url }] : []
            }
          }),
          monthCardWelfare: res.data.monthCardWelfare.map(item => {
            return {
              ...item,
              imgs: item.images && item.images.url ? [{ url: item.images.url }] : []
            }
          })
        }
      })
    },
    removeCard(row, type) {
      if (type === 1) {
        let index = this.addForm.cardWelfare.findIndex(item => item.cardId === row.cardId)
        this.addForm.cardWelfare.splice(index, 1)
      } else if (type === 2) {
        let index = this.addForm.monthCardWelfare.findIndex(item => item.cardId === row.cardId)
        this.addForm.monthCardWelfare.splice(index, 1)
      }
    },
    submitLevelInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          let params = {
            dto: {
              ...this.addForm,
              creater: localStorage.getItem('creater'),
              roleId: localStorage.getItem('roleId'),
              cid: localStorage.getItem('cid')
            },
            action: this.addFormState
          }
          this.submitLoading = true
          // console.log(params)
          userIntegralLevelOperation(params)
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
    },
    handleDialog(flag, type) {
      this.cardState = type
      this.isShowCardSelect = flag
    },
    savedCard(val, type) {
      if (type === 1) {
        let noRepeatList = val
          .filter(item => {
            return this.addForm.cardWelfare.every(v => v.cardId !== item._id)
          })
          .map(item => {
            return {
              cardName: item.title,
              cardType: item.type,
              cardId: item._id,
              count: 1,
              title: '',
              images: null
            }
          })
        this.addForm.cardWelfare.push(...noRepeatList)
      } else if (type === 2) {
        let noRepeatList = val
          .filter(item => {
            return this.addForm.monthCardWelfare.every(v => v.cardId !== item._id)
          })
          .map(item => {
            return {
              cardName: item.title,
              cardType: item.type,
              cardId: item._id,
              count: 1,
              title: '',
              images: null
            }
          })
        this.addForm.monthCardWelfare.push(...noRepeatList)
      }
    },
    // handleCardUploadChange(ret, index) {
    //   this.addForm.cardWelfare[index].images = ret[0]
    // },
    handleRemoveCardImg(type, index, fileList) {
      this.addForm[type][index].images = { url: '', thumUrl: '', absoluteUrl: '' }
    },
    handleUploadCardImg(type, index, imgObj) {
      this.addForm[type][index].images = JSON.parse(JSON.stringify(imgObj))
    }
    // handleMonthCardUploadChange(ret, index) {
    //   this.addForm.monthCardWelfare[index].images = ret[0]
    // }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .gem-back-header {
    margin-bottom: 10px;
  }
  /deep/ .sku-img {
    div {
      .el-upload-list--picture-card {
        .el-upload-list__item {
          width: 60px;
          height: 60px;
          margin: 0 5px 0;
        }
      }
    }
  }
  /deep/ .sku-img {
    div {
      .el-upload--picture-card {
        width: 60px;
        height: 60px;
        i {
          font-size: 20px;
          display: block;
          line-height: 60px;
        }
      }
    }
  }
}
</style>
