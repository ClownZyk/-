<template>
  <div>
    <el-form ref="form"
             class="form"
             :model="form"
             label-width="80px">
      <el-form-item label="模板名称">
        <el-input v-model="form.templateName" :style="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="宝贝地址">
        <area-select   v-model="form.productAddress"
                       @choseProvince="choseProvince"
                       @choseCity="choseCity"
                       @choseBlock="choseBlock"
        ></area-select>
      </el-form-item>
      <el-form-item label="发货时间">
        <el-select v-model="form.deliverTime" clearable placeholder="请选择">
          <el-option
            v-for="item in dateList"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="time-desic">如实设定宝贝的发货时间,不仅可避免发货咨询和纠纷，还能促进成交！（按小时计算）</span>
      </el-form-item>
      <el-form-item label="运送方式" class="name">
        <div>
          除指定地区外，其余地区的运费采用‘默认运费’
          <el-button type="primary" size="mini" style="margin-left: 20px;" @click="operation">新增</el-button>
        </div>
        <div class="default-freight">
          默认运费<el-input class="input" v-model="form.baseDeliveryFee.firstPiece"></el-input>件内
          <el-input class="input" v-model="form.baseDeliveryFee.firstFee"></el-input>元，每增加
          <el-input class="input" v-model="form.baseDeliveryFee.nextPiece"></el-input>件，增加运费
          <el-input class="input" v-model="form.baseDeliveryFee.nextFee"></el-input>元
        </div>
        <el-table :data="form.deliveryFee">
          <div style="width: 100%;">默认运费</div>
          <el-table-column
            label="运送到"
            width="300">
            <template slot-scope="scope">
              {{scope.row.provinces[0].citys[0]}}<span style="color: #409EFF;margin-left: 80px;">编辑</span>
            </template>
          </el-table-column>
          <el-table-column
            label="首件数(件)"
            width="300">
            <template slot-scope="scope"><el-input v-model="scope.row.firstPiece" :style="postInput"></el-input></template>
          </el-table-column>
          <el-table-column
            label="首费(元)"
            width="300">
            <template slot-scope="scope"><el-input v-model="scope.row.firstFee" :style="postInput"></el-input></template>
          </el-table-column>
          <el-table-column
            label="续件数(件)"
            width="300">
            <template slot-scope="scope"><el-input v-model="scope.row.nextPiece" :style="postInput"></el-input></template>
          </el-table-column>
          <el-table-column
            label="续费(元)"
            width="300">
            <template slot-scope="scope"><el-input v-model="scope.row.nextFee" :style="postInput"></el-input></template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="CMSContent(scope.row, '删除', 2)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="save">提交保存</el-button>
    <el-dialog
      title="新建"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <el-form ref="dialog" :model="dialog">
        <el-form-item label="运送地区">
          <area-select   v-model="dialog.productAddress"
                         @choseProvince="choseProvince"
                         @choseCity="choseCity"
                         @choseBlock="choseBlock"
          ></area-select>
        </el-form-item>
        <el-form inline ref="dialog" :model="dialog">
          <el-form-item label="首件数（件）">
            <el-input v-model="dialog.firstPiece" :style="dialogInput"></el-input>
          </el-form-item>
          <el-form-item label="首费（元）">
            <el-input v-model="dialog.firstPiece" :style="dialogInput"></el-input>
          </el-form-item>
          <el-form-item label="续件数（件）">
            <el-input v-model="dialog.firstPiece" :style="dialogInput"></el-input>
          </el-form-item>
          <el-form-item label="续费（元）">
            <el-input v-model="dialog.firstPiece" :style="dialogInput"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
  import AreaSelect from '../../../components/area-select'
  import {PostTempOperation} from '@/api/system'
  export default {
    name: 'edit',
    data() {
      return {
        inputWidth: 'width: 300px',
        postInput: 'width: 120px',
        dialogInput: 'width: 120px',
        dialogVisible: false, // 弹框显示状态
        dateList: [{value: '24'}, {value: '48'}],
        carryList: [{value: '快递'}, {value: 'EMS'}, {value: '平邮'}],
        form: {},
        dialog: {},
        tableData: []
      }
    },
    methods: {
      handleClose: function(done) {
        this.$confirm('确认关闭？').then(_ => {
          done()
        }).catch(_ => {})
      },
      operation: function() {
        this.dialogVisible = true
      },
      save: function() {
        // let parmas = {
        //   action: this.form.action,
        //   dto: this.from
        // }
        // PostTempOperation(parmas).then(res => {
        //   if (res.success) {
        //     this.$message({
        //       message: res.msg,
        //       type: 'success'
        //     })
        //     this.$router.go(-1)
        //   }
        // })
      },
      // 选择省
      choseProvince: function(e) { this.shen = e },
      // 选择市
      choseCity: function(e) { this.shi = e },
      // 选择区
      choseBlock: function(e) { this.qu = e }
    },
    mounted() {
     this.form = JSON.parse(localStorage.getItem('parmas')).dto
      console.log(this.form.deliveryFee[0].provinces[0].citys[0])
    },
    components: {
      AreaSelect
    }
  }
</script>

<style scoped lang="scss">
  .form{
    padding: 20px 0;
    .el-form-item{
      .el-form-item__content{
        .time-desic{
          margin-left: 5px;
        }
        .default-freight{
          display: flex;
          display: -webkit-flex;
          padding: 5px 0;
          .input{
            width: 100px;
            margin: 0 10px;
          }
        }
      }
    }
    .baoyou{
      .el-form-item__content{
        .el-radio-group{
          margin-right: 15px;
        }
      }
    }
  }
</style>
