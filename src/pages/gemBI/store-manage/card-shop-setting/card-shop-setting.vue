<template>
  <div class="container">
    <div class="gem-back-header"><el-page-header @back="$router.back()" content="云点卡门店限制配置"> </el-page-header></div>
    <div class="alert"><el-alert title="配置说明" type="warning" description="选中列表对应需要添加数据的第一列符号，在弹框中选择需要配置的门店信息，点击确定即可完成该门店的数据配置" show-icon :closable="false"> </el-alert></div>
    <el-table size="mini" v-loading="listLoading" ref="multipleTable" :data="faceTypeList" border>
      <el-table-column align="center" width="60">
        <template slot-scope="scope">
          <div class="el-icon"><i :class="[scope.row.isSelected ? 'el-icon-success' : 'el-icon-circle-check']" @click="handleShopSetting(scope.row)"></i></div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="title" label="卡面名称" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="卡面编码" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div>{{ scope.row.code || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="卡面图片" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image v-if="scope.row.images" :src="scope.row.images.url" fit="cover" :preview-src-list="[scope.row.images.url]" style="width:60px;height:40px">
            <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
          </el-image>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="适用门店" width="400px">
        <template slot-scope="scope">
          <div v-if="scope.row.isSelected">
            <div v-if="scope.row.selectedLimitCid.length > 0">
              <span v-for="(item, index) in scope.row.selectedLimitCid" :key="index">{{ item.shopName + (index + 1 === scope.row.selectedLimitCid.length ? '' : '，') }}</span>
            </div>
            <div v-else>适用所有门店</div>
          </div>
          <div v-else>暂未配置</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.isSelected">
            <el-button size="mini" type="warning" @click="handleCardShopSettingEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleCardShopSettingRemove(scope.row)">删除</el-button>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 门店信息弹框 -->
    <el-dialog title="适用门店配置信息" :visible.sync="isShopSettingShow" width="900px" @close="isShopSettingShow = false" :close-on-click-modal="false">
      <div class="alert"><el-alert title="门店配置说明" type="warning" description="若不勾选门店，则表示建立的云点卡所有门店通用；若勾选了门店，则表示建立的云点卡只能在被勾选的门店使用" show-icon :closable="false"> </el-alert></div>
      <el-form>
        <el-form-item>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group size="small" v-model="checkedShops" @change="handleCheckedShopsChange">
            <el-checkbox v-for="item in shopList" :key="item.cid" :label="item.cid" border>{{ item.shopName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitCardShopSettingInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getValueCardFaceType, getAllStore, getValueCardSetUp, valueCardSetOperation } from '@/api/system'

export default {
  data() {
    return {
      faceTypeList: [],
      shopList: [],
      cardShopConfig: [],
      checkedShops: [],
      addForm: {
        cardFaceId: '',
        limitCid: []
      },
      addFormState: 0,
      isShopSettingShow: false,
      listLoading: false,
      submitLoading: false
    }
  },
  computed: {
    checkAll: {
      get() {
        if (this.shopList.length <= 0) {
          return false
        }
        return this.checkedShops.length === this.shopList.length
      },
      set() {}
    },
    isIndeterminate() {
      return this.checkedShops.length > 0 && this.checkedShops.length < this.shopList.length
    }
  },
  watch: {
    checkedShops(val) {
      this.addForm.limitCid = this.shopList.filter(item => {
        return val.find(shopCid => shopCid === item.cid)
      })
    },
    isShopSettingShow(val) {
      if (!val) {
        delete this.addForm._id
        if (this.addFormState === 0) {
          let index = this.faceTypeList.findIndex(item => item._id === this.addForm.cardFaceId)
          this.faceTypeList[index].isSelected = false
        }
        this.checkedShops = []
      }
    }
  },
  mounted() {
    this.getCardFaceType()
  },
  methods: {
    // 获取所有卡面信息
    getCardFaceType() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getValueCardFaceType(params)
        .then(res => {
          this.faceTypeList = res.data.map(item => {
            return {
              ...item,
              isSelected: false,
              selectedLimitCid: []
            }
          })
          this.getAllShop()
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 获取门店配置信息
    getCardShopSetUp() {
      let params = {
        isPage: false,
        isOrder: true,
        isAsc: true,
        cid: this.$route.query.cid,
        creater: this.$route.query.creater,
        roleId: this.$route.query.roleId
      }
      getValueCardSetUp(params)
        .then(res => {
          this.listLoading = false
          this.cardShopConfig = res.data
          this.faceTypeList.forEach(item => {
            res.data.forEach(val => {
              if (val.cardFaceId === item._id) {
                item.isSelected = true
                item.selectedLimitCid = val.limitCid
              }
            })
          })
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        pageIndex: 1,
        pageSize: 10,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params)
        .then(res => {
          if (res.success) {
            this.shopList = res.data.map(item => {
              return {
                shopName: item.companyName,
                cid: item.cid
              }
            })
            // 获取门店配置信息
            this.getCardShopSetUp()
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 门店限制配置
    handleShopSetting(row) {
      this.addFormState = 0
      if (!row.isSelected) {
        row.isSelected = true
        this.isShopSettingShow = true
        this.$nextTick(() => {
          this.addForm.cardFaceId = row._id
          this.addForm.limitCid = row.selectedLimitCid
          this.checkedShops = row.selectedLimitCid && row.selectedLimitCid.length > 0 ? row.selectedLimitCid.map(item => item.cid) : []
        })
      } else {
        this.$message.warning('该卡面类型对应门店限制已配置，如有改动请点击列表‘修改’按钮进行改动！')
      }
    },
    handleCheckAllChange(val) {
      this.checkedShops = val ? this.shopList.map(item => item.cid) : []
    },
    handleCheckedShopsChange(val) {
      this.checkedShops = val
    },
    handleCardShopSettingEdit(row) {
      this.addFormState = 1
      this.isShopSettingShow = true
      this.$nextTick(() => {
        let data = this.cardShopConfig.find(item => item.cardFaceId === row._id)
        this.addForm = {
          cardFaceId: data.cardFaceId,
          limitCid: data.limitCid,
          _id: data._id
        }
        this.checkedShops = data.limitCid && data.limitCid.length > 0 ? data.limitCid.map(item => item.cid) : []
      })
    },
    handleCardShopSettingRemove(row) {
      this.addFormState = 2
      this.$confirm('确定删除该卡面类型配置数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = this.cardShopConfig.find(item => item.cardFaceId === row._id)
          this.cardShopSettingOperation({ cardFaceId: data.cardFaceId, limitCid: data.limitCid, _id: data._id })
        })
        .catch(() => {})
    },
    // 提交门店限制配置信息
    submitCardShopSettingInfo() {
      if (!this.addForm.cardFaceId) {
        return this.$message.warning('请选择卡面类型！')
      }
      this.cardShopSettingOperation()
    },
    cardShopSettingOperation(row) {
      let publicParam = row ? { ...row } : { ...this.addForm }
      let params = {
        dto: {
          ...publicParam,
          creater: this.$route.query.creater,
          roleId: this.$route.query.roleId,
          cid: this.$route.query.cid
        },
        action: this.addFormState
      }
      // console.log(params)
      this.submitLoading = true
      valueCardSetOperation(params)
        .then(res => {
          this.submitLoading = false
          this.isShopSettingShow = false
          this.$message.success(res.msg)
          this.getCardFaceType()
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .alert {
    margin-bottom: 15px;
  }
}
.el-checkbox {
  width: 260px;
}
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: unset !important;
  margin-bottom: 15px;
}
.el-icon {
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: #909399;
}
.el-icon-success {
  color: #409eff;
}
</style>
