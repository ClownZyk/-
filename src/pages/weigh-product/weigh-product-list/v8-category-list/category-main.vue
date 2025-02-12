<template>
  <div class="list-container">
    <!--搜索部分-->
    <el-form class="filters">
      <el-form-item>
        <el-input v-model="search" placeholder="请输入检索内容" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
        <el-button type="primary" @click="GetListByPage">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAsyncProduct">提交</el-button>
        <!-- <el-button type="primary" @click="operateForm('', '添加', 'Add')">新增</el-button> -->
        <!-- <el-button type="danger" @click="operateDeleteMany(datas)">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 树形表格部分 -->
    <div class="tree-table" v-loading="listLoading">
      <ul class="tree-table-ul">
        <!-- 表头 -->
        <li class="header table-tr">
          <div class="select"></div>
          <div class="number">编号</div>
          <div class="category-name">类别名称</div>
          <div class="order-num">排序号</div>
          <div class="permission">权限</div>
          <!-- <div class="operate">操作</div> -->
        </li>
        <!-- 一级分类 -->
        <li v-for="(item, index) in datas" :key="index">
          <div class="table-tr">
            <div class="select">
              <el-checkbox @change="clickCheck(null, item)" v-cloak :indeterminate="item.isIndeterminate" v-model="item.checked"></el-checkbox>
            </div>
            <div class="number">{{ item.serialNumber }}</div>
            <div class="category-name" :class="{ active: item.isActive, hasChild: item.children && item.children.length }" @click="fold(item, datas)">
              <i class="iconfont icon-lanmuliebie" style="margin-right: 5px;"></i>
              {{ item.categoryName }}
            </div>
            <div class="order-num">{{ item.sortNo }}</div>
            <div class="permission">
              <el-switch v-model="item.isShow" @change="updateIsShow($event, item)" :disabled="true"></el-switch>
            </div>
            <!-- <div class="operate"> -->
            <!-- <el-button type="warning" size="mini" @click="operateForm(item, '编辑', 'Update')">编辑</el-button> -->
            <!-- <el-button type="primary" size="mini" @click="operateForm(item._id, '添加', 'AddSon')">添加子类</el-button> -->
            <!-- <el-button type="danger" size="mini" @click="operateDelete(item)">删除</el-button> -->
            <!-- </div> -->
          </div>
          <!-- 多级子分类 -->
          <category-tree-table :item="item" :datas="datas" @refreshData="refreshData" :belongMenu="belongMenu"></category-tree-table>
        </li>
        <li v-if="datas.length <= 0" style="text-align:center;padding: 15px 0;border-bottom: 1px solid #e0e0e0;font-size: 14px;">暂无数据</li>
      </ul>
    </div>
    <!-- form -->
    <category-form :formVisible="formVisible" :operateTitle="operateTitle" :operateAction="operateAction" :oldForm="oldForm" :belongList="datas" :belongMenu="belongMenu" @closeForm="closeForm" @refreshData="refreshData"></category-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {GetV8CategoryInfo, Operation, batchAddWeighProduct, SynchronismCategory} from '@/api/system'
import categoryTreeTable from './category-tree-table.vue'
import categoryForm from './category-form.vue'
export default {
  name: 'category-main',
  components: {
    categoryTreeTable,
    categoryForm
  },
  data() {
    return {
      belongMenu: '/supply-product-category',
      // 控制form是否显示
      formVisible: false,
      // 控制loading是否显示
      listLoading: false,
      // 查询条件
      search: '',
      // 列表内容
      datas: [],
      // 操作名称
      operateTitle: '',
      // 操作标识(增0/改1/删2)
      operateAction: 0,
      // 老数据
      oldForm: {},
      // 父类列表
      belongList: [],
      // 被选中的数据
      checkedDatas: []
    }
  },
  methods: {
    // 同步产品
    handleAsyncProduct () {
      this.checkedDatas = []
      this.obtainDeleteDatas2(this.datas)
      // console.log(this.checkedDatas)
      if (this.checkedDatas.length > 0) {
        this.$confirm('确认同步已选中的数据吗？', '提示', {
          type: 'warning'
        }).then(() => {
          let params = {
            categories: Object.assign([], this.checkedDatas),
            belongMenu: '/weigh-product-category',
            creater: this.$store.state.UserID,
            roleId: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          // console.log(params)
          batchAddWeighProduct(params).then(res => {
            if (res.success) {
              SynchronismCategory(params).then(res2 => {
                this.$message({
                  message: res2.msg,
                  type: res2.success ? 'success' : 'error'
                })
                if (res2.success) this.$router.go(-1)
              })
            } else {
              this.$message({
                message: res.msg,
                type: res.success ? 'success' : 'error'
              })
            }
          })
        })
      } else {
        this.$message({
          message: '请选中要同步的数据',
          type: 'warning'
        })
      }
    },
    // 展开或者收起子分类
    fold: function (item, datas) {
      if (typeof item.folded === 'undefined') {
        this.$set(item, 'folded', true)
      } else {
        item.folded = !item.folded
      }
      // 处理类别名称是否高亮
      datas.forEach(v => {
        this.$set(v, 'isActive', false)
      })
      item.isActive = true
    },
    // 点击复选框
    clickCheck: function (flag, item) {
      if (item.checked === 'undefined') {
        this.$set(item, 'checked', true)
      }
      if (flag !== null) {
        this.$set(item, 'checked', flag)
        this.$set(item, 'isIndeterminate', false)
      }
      if (item.children && item.children.length > 0) {
        for (let a = 0; a < item.children.length; a++) {
          this.clickCheck(item.checked, item.children[a])
        }
      }
    },
    // 修改显示或者不显示
    updateIsShow: function (newValue, item) {
      this.operateAction = 1
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      Operation(params).then(res => {
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 新增、修改
    operateForm: function (data, operateTitle, operate) {
      this.formVisible = true
      this.operateTitle = operateTitle
      if (operate === 'Add') {
        this.oldForm = {}
        this.operateAction = 0
      } else if (operate === 'Update') {
        if (data.belong === '000000000000000000000000') {
          data.belong = ''
        }
        this.oldForm = data
        this.operateAction = 1
      } else if (operate === 'AddSon') {
        this.oldForm = {'belong': data}
        this.operateAction = 0
      }
    },
    // 按钮删除数据
    operateDelete: function (item) {
      this.operateAction = 2
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.deleteFunction(item)
      })
    },
    // 删除操作
    deleteFunction: function (item) {
      let params = {
        Dto: Object.assign({}, item),
        Action: this.operateAction
      }
      Operation(params).then(res => {
        // console.log(res)
        this.$message({
          message: res.msg,
          type: res.success ? 'success' : 'error'
        })
        this.GetListByPage()
      })
    },
    // 多选删除
    operateDeleteMany: function (items) {
      let that = this
      that.checkedDatas = []
      that.operateAction = 2
      that.obtainDeleteDatas(items)
      // console.log(that.checkedDatas)
      if (that.checkedDatas.length > 0) {
        that.$confirm('确认删除已选中的数据吗？', '提示', {}).then(() => {
          that.checkedDatas.forEach(v => {
            that.deleteFunction(v)
          })
        })
      } else {
        that.$message({
          message: '请选中要删除的数据',
          type: 'warning'
        })
      }
    },
    // 获取已经被选中的数据
    obtainDeleteDatas: function (items) {
      let that = this
      items.forEach(v => {
        if (v.checked && v.checked === true) {
          that.checkedDatas.push(v)
        }
        if (v.children && v.children.length > 0) {
          that.obtainDeleteDatas(v.children)
        }
      })
    },
    // 获取已经被选中,及不确定的数据
    obtainDeleteDatas2: function (items) {
      let that = this
      items.forEach(v => {
        if (v.checked || v.isIndeterminate) {
          that.checkedDatas.push(v)
        }
        if (v.children && v.children.length > 0) {
          that.obtainDeleteDatas(v.children)
        }
      })
    },
    // 关闭form
    closeForm: function () {
      this.formVisible = false
      this.oldForm = {}
    },
    // 刷新列表
    refreshData: function () {
      this.GetListByPage()
    },
    // 加载数据
    async GetListByPage () {
      let params = {
        belongMenu: this.belongMenu,
        categoryName: this.search,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleid: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.listLoading = true
      await GetV8CategoryInfo(params).then(res => {
        this.listLoading = false
        let data = res.data
        // 遍历数组，添加paddingLeft属性，控制树形结构
        data.forEach((v, i) => {
          this.addPaddingAndSerial(v, i, 30)
        })
        this.datas = data
        // console.log(data)
      }, err => {
        console.log(err)
        this.listLoading = false
      })
    },
    // 添加内边距和编号;  num是paddingLeft的值，每一层是递增的
    addPaddingAndSerial: function (obj, index, num) {
      // 编号
      if (!obj.serialNumber) obj.serialNumber = index + 1
      // 将已上传图片，存到一个新数组放在该条数据内
      obj.imgs = []
      if (obj.img !== null && obj.img.url !== '') {
        obj.imgs.push({url: obj.img.url})
      }
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach((v, childIndex) => {
          v.serialNumber = (obj.serialNumber || index + 1) + '.' + (childIndex + 1)
          v.paddingLeft = num + 'px'
          // 将已上传图片，存到一个新数组放在该条数据内
          v.imgs = []
          if (v.img !== null && v.img.url !== '') {
            v.imgs.push({url: v.img.url})
          }
          if (v.children && v.children.length > 0) {
            this.addPaddingAndSerial(v, childIndex, num + 30)
          }
        })
      }
    }
  },
  mounted() {
    this.GetListByPage()
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  position: relative;
}
.filters {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-form-item {
    margin-bottom: 0;
  }
  .filters-search {
    display: inline-block;
    width: 200px;
  }
}
.tree-table {
  color: #666666;
  .tree-table-ul {
    border: 1px solid #e0e0e0;
    border-bottom: 0;
    $border: 1px solid #e0e0e0;
    .table-tr {
      display: flex;
      text-align: center;
      border-bottom: $border;
      line-height: 2.5;
      font-size: 16px;
      .select {
        width: 50px;
        border-right: $border;
      }
      .number {
        width: 100px;
        border-right: $border;
      }
      .category-name {
        flex: 1;
        border-right: $border;
        text-align: left;
        cursor: pointer;
        margin-left: 70px;
      }
      .order-num {
        width: 200px;
        border-right: $border;
      }
      .permission {
        width: 120px;
        border-right: $border;
      }
      .operate {
        width: 250px;
      }
      .hasChild {
        color: #e6563c;
      }
      .active {
        color: #409eff;
      }
    }
    .header {
      background-color: #f5f7fa;
      font-size: 16px;
      font-weight: bolder;
      .category-name {
        text-align: center;
      }
    }
  }
}
</style>
