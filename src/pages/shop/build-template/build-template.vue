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
        <el-form :inline="true" class="area-input">
          <el-form-item label="省">
            <el-select v-model="Shen"  style="width: 160px;" @change="choseProvince" placeholder="省级地区">
              <el-option v-for="item in province" :key="item.value" :label="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市">
            <el-select v-model="Shi" style="width: 160px;" @change="choseCity"  placeholder="市级地区">
              <el-option v-for="item in shi1"  :key="item.value" :label="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区/县">
            <el-select v-model="Qu"  style="width: 160px;" @change="choseBlock" placeholder="区级地区">
              <el-option v-for="item in qu1" :key="item.value" :label="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="发货时间">
        <el-select v-model="form.deliverTime" clearable placeholder="请选择">
          <el-option v-for="item in dateList" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
        <span class="time-desic">如实设定宝贝的发货时间,不仅可避免发货咨询和纠纷，还能促进成交！（按小时计算）</span>
      </el-form-item>
      <el-form-item label="运送方式" class="name">
        <div>
          除指定地区外，其余地区的运费采用‘默认运费’
          <el-button type="primary" size="mini" style="margin-left: 20px;" @click="operation">新增</el-button>
        </div>
        <div class="default-freight">
          默认运费<el-input-number class="input" v-model="form.baseDeliveryFee.firstPiece" controls-position="right" :min="0" :max="100"></el-input-number>件内
          <el-input-number class="input" v-model="form.baseDeliveryFee.firstFee" controls-position="right" :min="0" :max="100"></el-input-number>元，每增加
          <el-input-number class="input" v-model="form.baseDeliveryFee.nextPiece" controls-position="right" :min="0" :max="100"></el-input-number>件，增加运费
          <el-input-number class="input" v-model="form.baseDeliveryFee.nextFee" controls-position="right" :min="0" :max="100"></el-input-number>元
        </div>
        <el-table :data="form.deliveryFee"  :header-cell-style="{background:'#F5F7FA'}" style="width: 80%;" border>
          <div style="width: 100%;">默认运费</div>
          <el-table-column label="运送到">
            <template slot-scope="scope">
              {{scope.row.provinces[0].proName}}
            </template>
          </el-table-column>
          <el-table-column label="首件数(件)"  prop="firstPiece"></el-table-column>
          <el-table-column label="首费(元)" prop="firstFee"></el-table-column>
          <el-table-column label="续件数(件)" prop="nextPiece"></el-table-column>
          <el-table-column label="续费(元)" prop="nextFee"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--<el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>-->
              <el-button size="mini" type="danger" @click="delect(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button type="primary" @click="option">提交保存</el-button>
    </el-form>
    <el-dialog
      title="新建"
      width="960px"
      :visible.sync="dialogVisible">
      <el-form ref="dialog" :model="dialog">
        <el-form-item label="运送地区">
          <areas-select @choseProvince="choseProvince1"
                         @choseCity="choseCity1"
                         @choseBlock="choseBlock1"
          ></areas-select>
        </el-form-item>
        <el-form inline ref="dialog" :model="dialog">
          <el-form-item label="首件数（件）">
            <el-input-number
              v-model="dialog.firstPiece" :style="dialogInput"
              controls-position="right" :min="0" :max="100">
            </el-input-number>
          </el-form-item>
          <el-form-item label="首费（元）">
            <el-input-number v-model="dialog.firstFee" :style="dialogInput" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="续件数（件）">
            <el-input-number v-model="dialog.nextPiece" :style="dialogInput" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="续费（元）">
            <el-input-number v-model="dialog.nextFee" :style="dialogInput" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-form>
      </el-form>
      <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="waySure">确 定</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
  import AreasSelect from '../../../components/areas-select'
  import axios from 'axios'
  import {PostTempOperation, GetPostTemplateDetail} from '@/api/system'
  export default {
    name: 'edit',
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        Shen: '',
        Shi: '',
        Qu: '',
        mapJson: '../static/json/map.json',
        province: '',
        shi1: [],
        qu1: [],
        sheng: '',
        shi: '',
        qu: '',
        block: '',
        txt: '编辑',
        inputWidth: 'width: 300px',
        postInput: 'width: 120px',
        dialogInput: 'width: 120px',
        dialogVisible: false, // 弹框显示状态
        dateList: [{value: '12'}, {value: '24'}, {value: '48'}],
        carryList: [{value: '快递'}, {value: 'EMS'}, {value: '平邮'}],
        form: { // 详情
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid,
          baseDeliveryFee: {},
          deliveryFee: []
        },
        dialog: {provinces: []},
        tableData: []
      }
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
      },
      handleNodeClick(data) {
        console.log(data)
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }])
        }
        if (node.level > 3) return resolve([])
        var hasChild
        if (node.data.name === 'region1') {
          hasChild = true
        } else if (node.data.name === 'region2') {
          hasChild = false
        } else {
          hasChild = Math.random() > 0.5
        }

        setTimeout(() => {
          var data
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }]
          } else {
            data = []
          }

          resolve(data)
        }, 500)
      },
      init() {
        // console.log(this.$route.query.templateId)
        if (this.$route.query.templateId !== undefined) {
          let parmas = {
            _id: this.$route.query.templateId
          }
          GetPostTemplateDetail(parmas).then(res => {
            if (res.success) {
              this.form = res.data
              this.Shen = this.form.productAddress.split('-')[0]
              this.Shi = this.form.productAddress.split('-')[1]
              this.Qu = this.form.productAddress.split('-')[2]
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }
      },
      operation() {
        this.dialogVisible = true
      },
      delect(index) {
        console.log(index)
        this.form.deliveryFee.splice(index, 1)
      },
      edit(dto) {
        this.dialogVisible = true
        this.dialog = dto
      },
      option() {
        this.$route.query.templateId !== undefined ? this.txt = '编辑' : this.txt = '新增'
        this.$confirm('是否' + this.txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // ? action = 1 : action = 0
          this.form.productAddress = this.Shen + '-' + this.Shi + '-' + this.Qu
          console.log(this.form)
          let params = {
            dto: this.form,
            action: this.$route.query.templateId !== undefined ? 1 : 0
          }
          PostTempOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.$router.push('/shop-setting')
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      waySure() {
        this.dialogVisible = false
        this.form.deliveryFee.push({
          provinces: [{citys: [this.shi], proName: this.sheng}],
          firstPiece: this.dialog.firstPiece,
          firstFee: this.dialog.firstFee,
          nextPiece: this.dialog.nextPiece,
          nextFee: this.dialog.nextFee
        })
      },
      getCityData: function() {
        var that = this
        axios.get(this.mapJson).then(function(response) {
          if (response.status === 200) {
            var data = response.data
            that.province = []
            that.city = []
            that.block = []
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) { // 省
                that.province.push({id: item, value: data[item], children: []})
              } else if (item.match(/00$/)) { // 市
                that.city.push({id: item, value: data[item], children: []})
              } else { // 区
                that.block.push({id: item, value: data[item]})
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                  that.province[index].children.push(that.city[index1])
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                  that.city[item1].children.push(that.block[item2])
                }
              }
            }
          } else {
            console.log(response.status)
          }
        }).catch()
      },
      // 选省
      choseProvince: function (e) {
        for (var index2 in this.province) {
          if (e === this.province[index2].value) {
            this.Shi1 = this.province[index2].children
            this.Shi = this.province[index2].children[0].value
            this.qu1 = this.province[index2].children[0].children
            this.Qu = this.province[index2].children[0].children[0].value
            this.E = this.qu1[0].id
          }
        }
        this.$emit('choseProvince', e)
      },
      // 选市
      choseCity: function (e) {
        for (var index3 in this.city) {
          if (e === this.city[index3].id) {
            this.qu1 = this.city[index3].children
            this.Qu = this.city[index3].children[0].value
            this.E = this.qu1[0].id
          }
        }
        this.$emit('choseCity', e)
      },
      // 选区
      choseBlock: function (e) {
        this.E = e
        this.$emit('choseBlock', e)
      },
      choseProvince1: function(e) { this.sheng = e },
      // 选择市
      choseCity1: function(e) { this.shi = e },
      // 选择区
      choseBlock1: function(e) { this.qu = e }
    },
    created() {
      this.getCityData()
    },
    mounted() {
      this.init()
    },
    components: {
      AreasSelect
    }
  }
</script>

<style scoped lang="scss">
  .form{
    padding: 20px 0;
    width: 100%;
    height: 100vh;
    position: fixed;
    /*overflow-y: scroll;*/
    background-color: #ffffff;
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
