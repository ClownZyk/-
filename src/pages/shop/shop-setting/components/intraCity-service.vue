<template>
    <div class="contain">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="同城配送">
          <el-switch v-model="isDelivery" @change="deliveryClick"></el-switch>
        </el-form-item>
      </el-form>
      <div class="delivery-main" v-show="mainShow">
        <div class="area-title">
          <div class="area-add">
            <area-select @choseProvince="choseProvince"
                         @choseCity="choseCity"
                         @choseBlock="choseBlock"
                        ></area-select>
            <el-button type="primary" @click="operationArea('', 0, '新增')" class="add-area" :disabled="this.shen === ''">新增</el-button>
          </div>
          <!--<el-button type="danger" @click="deleteMany" :disabled = "this.selectTableList.length === 0" class="delects">批量删除</el-button>-->
        </div>
        <el-table :data="areaList" border style="width: 100%" v-loading="loading" @selection-change="selectTableRow">
          <el-table-column type="selection" width="55" :align="align"></el-table-column>
          <el-table-column type="index" label="编号" :align="align" width="80">
          </el-table-column>
          <el-table-column prop="province" label="省" :align="align" width="180"></el-table-column>
          <el-table-column prop="city" label="市" :align="align"></el-table-column>
          <el-table-column prop="area" label="区" :align="align"></el-table-column>
          <el-table-column label="操作"  :align="align">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="operationArea(scope.row, 2, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="pageShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  import AreaSelect from '../../../../components/area-select'
  import {DeliveryList, DeliveryOperation} from '@/api/system'
  import {formatDate} from '../../../../components/js/data'
    export default {
      name: 'intraCity-service',
      data () {
        return {
          pageSize: 10,
          pageIndex: 1,
          loading: false, // 加载
          isDelivery: true, // 配送按钮
          mainShow: false, // 配送设置的显示
          align: 'center', // 表格位置
          areaList: [], // 派送区域列表
          selectTableList: [], // 被选中的table列表
          total: null,
          pageShow: false,
          shen: '',
          shi: '',
          qu: ''
        }
      },
      methods: {
        // 获取派送区域列表
        init: function() {
          let parmas = {
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            isPage: true,
            isOrder: true,
            isAsc: true,
            creater: this.$store.state.UserID,
            roleid: this.$store.state.UserRole,
            cid: this.$store.state._cid
          }
          this.loading = true
          DeliveryList(parmas).then(res => {
            if (res.success) {
              this.loading = false
              this.areaList = res.data
              this.total = res.total
              this.total === 0 ? this.pageShow = false : this.pageShow = true
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        },
        handleSizeChange (val) {
          this.pageSize = val
          this.init()
        },
        // currentPage 改变
        handleCurrentChange (val) {
          this.pageIndex = val
          this.init()
        },
        // 同城配送事件触发
        deliveryClick: function () {
          this.isDelivery === true ? this.mainShow = true : this.mainShow = false
        },
        // 选择省
        choseProvince: function(e, shi, qu) {
          this.shen = e
          this.shi = shi
          // console.log(shi)
          this.qu = qu
        },
        // 选择市
        choseCity: function(e, qu) {
          this.shi = e
          this.qu = qu
          // console.log(qu)
        },
        // 选择区
        choseBlock: function(e) { this.qu = e },
        // 批量选中的表格列表
        selectTableRow: function(val) {
          this.selectTableList = val
        },
        deleteMany: function () {
        },
        operationArea: function (list, action, text) {
            let dto = {
              province: this.shen,
              city: this.shi,
              area: this.qu,
              creater: this.$store.state.UserID,
              roleid: this.$store.state.UserRole,
              cid: this.$store.state._cid,
              _id: '',
              createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
              deleteTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
              isValid: true
            }
          console.log(list)
          let parmas = {
            dto: action === 0 ? dto : list,
            action: action
          }
          this.$confirm('是否' + text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            DeliveryOperation(parmas).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.init()
              } else this.$message.error(res.msg)
            }, err => {
              this.$message.error(err.msg)
            })
          }).catch(() => {})
        }
      },
      mounted() {
        this.isDelivery === true ? this.mainShow = true : this.mainShow = false
        this.init()
      },
      watch: {
        shi: {
          handler(newName, oldName) {
            console.log(newName)
          }
        }
      },
      components: {
        AreaSelect
      }
    }
</script>

<style lang="scss" scoped>
  .contain{
    .delivery-main{
    .area-title {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      .area-add{
        display: flex;
        display: -webkit-flex;
        .add-area {
          height: 62%;
        }
      }
      .delects{height: 62%;}
      }
    }
  }
  .pagination{
    margin-top: 10px;
    float: right;
  }
</style>
