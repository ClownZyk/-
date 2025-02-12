<template>
  <div class="product-label">
    <div class="label-main">
      <el-form ref="labelTypeFormRef" :rules="labelTypeFormRules" :model="labelTypeForm" :inline="true">
        <el-form-item label="标签类别" prop="labelTypeName"> <el-input v-model="labelTypeForm.labelTypeName" placeholder="请输入标签类别名称"></el-input> </el-form-item>
        <el-form-item> <el-button type="primary" @click="addLabelType" :loading="labelTypeLoading">新增标签类别</el-button> </el-form-item>
      </el-form>
    </div>
    <div class="cards">
      <div class="cards-item" v-for="item in drinkLabelList" :key="item._id">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.labelTypeName }}</span> <span style="float: right; padding: 3px 0" @click="_removeAllLabel(item)"><i class="el-icon-delete"></i></span>
          </div>
          <div class="tags">
            <el-tag class="tags-item" v-for="(tag, index) in item.labelName" :key="index" :closable="tag !== '标准'" @close="_removeLabel(item, tag)"> {{ tag }} </el-tag>
            <el-input class="input-new-tag" v-if="item.inputVisible" v-model="item.labelInputName" ref="saveTagInput" size="small" @keyup.enter.native="_addLabel(item)" @blur="_addLabel(item)"> </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(item)">+ 新增标签</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { GetDrinkLabelByPage, DrinkLabelOperation } from '@/api/system'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['loginData'])
  },
  data() {
    return {
      labelTypeForm: {
        labelTypeName: '',
        labelName: ['标准']
      },
      drinkLabelList: [],
      action: 0,
      pageIndex: 1,
      pageSize: 15,
      labelTypeFormRules: {
        labelTypeName: [{ required: true, message: '请输入标签类别名称', trigger: 'change' }]
      },
      labelTypeLoading: false
    }
  },
  created() {
    this._getDrinkLabelList()
  },
  methods: {
    // 获取饮品标签列表
    _getDrinkLabelList() {
      // let commonParam =
      //   this.loginData.attribute === 4
      //     ? { creater: this.$store.state.UserID, roleId: this.$store.state.UserRole, cid: this.$store.state._cid }
      //     : { creater: localStorage.getItem('creater'), roleId: localStorage.getItem('roleId'), cid: localStorage.getItem('cid') }
      let params = {
        labelTypeName: '',
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      GetDrinkLabelByPage(params)
        .then(res => {
          if (res.success) {
            this.drinkLabelList = res.data.map(item => {
              return {
                ...item,
                inputVisible: false,
                labelInputName: ''
              }
            })
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },

    addLabelType() {
      this.action = 0
      this.$refs['labelTypeFormRef'].validate(valid => {
        if (valid) {
          this.labelTypeLoading = true
          let params = {
            dto: {
              ...this.labelTypeForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole,
              cid: this.$store.state._cid
            },
            action: this.action
          }
          DrinkLabelOperation(params)
            .then(res => {
              if (res.success) {
                this.$message.success(res.msg)
                this.labelTypeLoading = false
                this.$refs['labelTypeFormRef'].resetFields()
                this._getDrinkLabelList()
              }
            })
            .catch(err => {
              this.labelTypeLoading = false
              console.log(err.msg)
            })
        }
      })
    },

    _addLabel(item) {
      this.action = 1
      if (item.labelInputName) {
        item.labelName.push(item.labelInputName)
        this._operateLabel(item)
      }
      item.inputVisible = false
      item.labelInputName = ''
    },

    _removeLabel(item, tag) {
      this.action = 1
      this.$confirm('确认删除此标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          item.labelName.splice(item.labelName.indexOf(tag), 1)
          this._operateLabel(item)
        })
        .catch(() => {})
    },

    _removeAllLabel(item) {
      this.action = 2
      this.$confirm('确认删除此标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this._operateLabel(item)
        })
        .catch(() => {})
    },

    _operateLabel(labelForm) {
      let params = {
        dto: labelForm,
        action: this.action
      }
      // console.log(params)
      DrinkLabelOperation(params)
        .then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this._getDrinkLabelList()
          }
        })
        .catch(err => {
          console.log(err.msg)
        })
    },

    showInput(item) {
      item.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  watch: {
    isFormShow(val) {
      if (!val) {
        delete this.labelForm._id
        this.labelForm.labelType = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-label {
  padding: 20px 20px 0;
}
.cards {
  display: flex;
}
.cards-item {
  width: 20%;
  height: 300px;
  margin-right: 20px;
  .el-card {
    height: 100%;
  }
  .tags-item {
    margin: 0 10px 10px 0;
    cursor: default;
  }
}
/deep/.el-input--small .el-input__inner {
  width: 120px !important;
}
</style>
