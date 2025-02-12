<template>
  <div>
    <ul v-show="item.children && item.folded">
      <li v-for="(child, childIndex) in item.children" :key="childIndex">
        <div class="table-tr">
          <div class="select">
            <el-checkbox :indeterminate="child.isIndeterminate" v-model="child.checked" @change="clickCheck(null, item, child)"></el-checkbox>
          </div>
          <div class="number">{{child.serialNumber}}</div>
          <div class="category-name" :class="{'hasChild': (child.children && child.children.length)}" @click="fold(child)" :style="{'padding-left': child.paddingLeft}">
            <i class="iconfont icon-lanmuliebie" style="margin-right: 5px;"></i>
            {{child.categoryName}}
          </div>
          <div class="order-num">{{child.sortNo}}</div>
          <div class="permission">
            <el-switch v-model="child.isShow" @change="updateIsShow($event, child)" :disabled="true"></el-switch>
          </div>
          <!-- <div class="operate"> -->
            <!-- <el-button type="warning" size="mini" @click="operateForm(child, '编辑', 'Update')">编辑</el-button> -->
            <!-- <el-button type="primary" size="mini" @click="operateForm(child._id, '添加', 'AddSon')">添加子类</el-button> -->
            <!-- <el-button type="danger" size="mini" @click="operateDelete(child)">删除</el-button> -->
          <!-- </div> -->
        </div>
        <category-tree-table :item="child" :datas="datas" @refreshData="refreshData" :belongMenu="belongMenu"></category-tree-table>
      </li>
    </ul>
    <!-- form -->
    <category-form :formVisible="formVisible" :operateTitle="operateTitle" :operateAction="operateAction" :oldForm="oldForm" :belongList="datas" :belongMenu="belongMenu"
                   @closeForm="closeForm" @refreshData="refreshData"></category-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Operation} from '@/api/system'
  import categoryForm from './category-form.vue'
  export default {
    name: 'categoryTreeTable',
    components: {
      categoryForm
    },
    props: {
      item: Object,
      datas: Array,
      belongMenu: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // 控制form是否显示
        formVisible: false,
        // 操作名称
        operateTitle: '',
        // 操作标识(增0/改1/删2)
        operateAction: 0,
        // 老数据
        oldForm: {}
      }
    },
    methods: {
      fold: function (item) {
        if (typeof item.folded === 'undefined') {
          this.$set(item, 'folded', true)
        } else {
          item.folded = !item.folded
        }
      },
      // 点击复选框
      clickCheck: function (flag, item, child) {
        // 处理子分类
        this.handleChild(flag, child)
        // 处理上级是否选中或者不确定
        this.handelFather(item)
      },
      // 处理上级分类
      handelFather: function (item) {
        let n = 0
        for (let a = 0; a < item.children.length; a++) {
          if ((item.children[a].checked !== 'undefined' && item.children[a].checked) || (item.children[a].isIndeterminate !== 'undefined' && item.children[a].isIndeterminate)) {
            n++
          }
        }
        if (n === item.children.length) {
          this.$set(item, 'isIndeterminate', false)
          this.$set(item, 'checked', true)
        } else if (n < item.children.length && n > 0) {
          this.$set(item, 'isIndeterminate', true)
          this.$set(item, 'checked', false)
        } else if (n <= 0) {
          this.$set(item, 'isIndeterminate', false)
          this.$set(item, 'checked', false)
        }
        // 如果父级还有父级
        if (item.belong && item.belong !== '000000000000000000000000') {
          let father = this.datas.find(v => {
            return v._id === item.belong
          })
          this.handelFather(father)
        }
      },
      // 处理子分类
      handleChild: function (flag, child) {
        if (child.checked === 'undefined') {
          this.$set(child, 'checked', true)
        }
        if (flag !== null) {
          this.$set(child, 'checked', flag)
          this.$set(child, 'isIndeterminate', false)
        }
        if (child.children && child.children.length > 0) {
          for (let a = 0; a < child.children.length; a++) {
            this.handleChild(child.checked, child.children[a])
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
      // 删除数据
      operateDelete: function (item) {
        this.operateAction = 2
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          let params = {
            Dto: Object.assign({}, item),
            Action: this.operateAction
          }
          Operation(params).then(res => {
            this.$message({
              message: res.msg,
              type: res.success ? 'success' : 'error'
            })
            this.refreshData()
          })
        })
      },
      // 关闭form
      closeForm: function () {
        this.formVisible = false
        this.oldForm = {}
      },
      // 刷新列表
      refreshData: function () {
        this.$emit('refreshData')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tree-table {
    padding: 0 20px;
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
      }
    }
  }
</style>
