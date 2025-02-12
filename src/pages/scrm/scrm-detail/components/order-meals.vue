<template>
  <div class="order">
    <router-view></router-view>
    <el-button type="primary" @click="openDialog({}, 0, '新增')">新增</el-button>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="787px">
      <el-form :model="dialog" class="dialog" inline :rules="rules" ref="dialog">
        <div class="dialog-row">
          <el-form-item label="收货地址">
            <area-select @choseProvince="choseProvince"
                         @choseCity="choseCity"
                         @choseBlock="choseBlock"
            ></area-select>
          </el-form-item>
        </div>
        <div class="dialog-row">
          <el-form-item label="详细地址" prop="address">
            <el-input class="dialog-input" v-model="dialog.address" style="width: 658px;"></el-input>
          </el-form-item>
        </div>
        <div class="dialog-row">
          <el-form-item label="收货人" prop="receiveName">
            <el-input class="dialog-input" v-model="dialog.receiveName"></el-input>
          </el-form-item>
          <el-form-item label="收货人手机号" prop="receivePhone">
            <el-input class="dialog-input" v-model="dialog.receivePhone"></el-input>
          </el-form-item>
          <el-form-item label="收货类型" prop="receiveType">
            <el-select  class="dialog-input" v-model="dialog.receiveType">
              <el-option v-for="(item, index) in typeList" :key="index" :label="item.value" :value="item.id">{{item.value}}</el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dialog-row">
          <el-form-item label="默认地址">
            <!--<el-switch v-model="dialog.isDefault"></el-switch>-->
            <el-switch v-model="dialog.isDefault"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="conform(dialog, 'dialog')">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" border class="address-list">
      <el-table-column label="收货人" prop="receiveName" align="center" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="省" prop="province" align="center" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="市" prop="city" align="center" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="区" prop="area" align="center" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="电话" prop="receivePhone" align="center" min-width="140"></el-table-column>
      <el-table-column label="地址" width="300" prop="address" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="默认地址" prop="receiveName" align="center" min-width="120">
        <template  slot-scope="scope">
          <el-switch v-model="scope.row.isDefault" @change="isDefalt(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="收货地址类型" align="center" min-width="120">
        <template  slot-scope="scope">
          <div>{{scope.row.receiveType === 1 ? '快递' : '同城配送'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center" fixed="right">
        <template  slot-scope="scope">
          <el-button type="primary" size="mini" @click="openDialog(scope.row, 1, '修改')">修改</el-button>
          <el-button type="danger" size="mini" @click="delect(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {AddrList, AddrOperation} from '@/api/system'
  import AreaSelect from '../../../../components/area-select'
  import {isvalidPhone} from '@/filters/validate'
  var validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }
  export default {
    data() {
      return {
        rules: {
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { min: 0, message: '地址不能为空', trigger: 'blur' }
          ],
          receiveName: [
            { required: true, message: '请输入收货人姓名', trigger: 'blur' },
            { min: 0, message: '收货人姓名不能为空', trigger: 'blur' }
          ],
          receivePhone: [
            { required: true, validator: validPhone, trigger: 'blur' }
          ],
          receiveType: [
            { required: true, message: '请选择收货类型', trigger: 'change' }
          ]
        },
        Action: 0,
        Text: '',
        dialog: {},
        dialogFormVisible: false,
        typeList: [{id: 1, value: '快递'}, {id: 2, value: '同城配送'}],
        tableData: [], // 列表
        pageIndex: 1,
        pageSize: 10,
        total: 2
      }
    },
    methods: {
      // 获取选择用户的地址
      isDefalt(row) {
        let params = {
          dto: row,
          action: 1
        }
        AddrOperation(params).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.init()
          } else this.$message.err(res.msg)
        }, err => { this.$message.err(err.msg) })
      },
      // 信息修改打开弹框
      openDialog(row, action, txt) {
        this.dialogFormVisible = true
        this.dialog = row
        this.Action = action
        this.Text = txt
      },
      // 提交
      conform(dto, formName) {
        this.dialog = dto
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.operation(this.dialog, this.Action, this.Text)
          } else {
            return false
          }
        })
      },
      // 编辑操作
      operation(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dto.customerId = this.$route.query.id
          dto.creater = this.$store.state.UserID
          dto.roleid = this.$store.state.UserRole
          dto.cid = this.$store.state._cid
          dto.createTime = new Date()
          let params = {
            dto: dto,
            action: action
          }
          AddrOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.init()
            } else this.$message.err(res.msg)
          }, err => { this.$message.err(err.msg) })
        }).catch(() => {})
      },
      init: function() {
        if (this.$route.query.id !== undefined) {
          let parmas = {
            receiveType: 0,
            customerId: this.$route.query.id,
            isPage: true,
            isOrder: true,
            isAsc: true,
            creater: this.$store.state.UserID,
            roleid: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          AddrList(parmas).then(res => {
            if (res.success) {
              this.tableData = res.data
            } else this.$message.err(res.msg)
          }, err => { this.$message.err(err.msg) })
        }
      },
      delect(dto) {
        this.operation(dto, 2, '删除')
      },
      // 选择省
      choseProvince: function(e, shi, qu) {
        this.dialog.province = e
        this.dialog.city = shi
        this.dialog.area = qu
      },
      // 选择市
      choseCity: function(e, qu) {
        this.dialog.city = e
        this.dialog.area = qu
      },
      // 选择区
      choseBlock: function(e) { this.dialog.area = e }
    },
    mounted() {
      this.init()
    },
    watch: {
      dialog: {
        handler(newName, oldName) {
          if (newName !== oldName) {
            this.init()
            // this.dialog = {}
          }
        }
      },
      dialogFormVisible: {
        handler(newName, oldName) {
          if (newName === false) {
            this.dialog = {}
          }
        }
      }
    },
    components: {
      AreaSelect
    }
  }
</script>
<style lang="scss" scoped>
  .address-list{
    margin-top: 10px;
  }
  .dialog{
    .dialog-row{
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      .dialog-input{
        width: 155px;
      }
    }
  }
</style>
