<template>
  <div class="vote-list-container">
    <div class="vote-list" >
      <!--搜索部分-->
      <el-form class="filters" ref="searchForm" :model="search" :inline="true">
        <div class="filters-left">
          <el-form-item  label="">
            <el-input v-model="search.activityName" placeholder="请输入套餐名称" class="filters-search" @keyup.enter.native="GetListByPage"></el-input>
            <el-button type="primary" @click="GetListByPage">搜索</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="opneEdilog(dialog, 0)">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表部分 -->
      <div class="list-table">
        <el-table class="table-main" :data="list" border tooltip-effect="dark" v-loading="listLoading">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="serial" label="编号" width="80" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="分类名称" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="pointTime" label="订餐截止时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="qcTime" label="取餐时间段" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="显示状态" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.display"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <!--<el-button type="warning" size="mini" @click="operateFunc(scope.row, '查看', 4)" style="background: #FFC835;border-color: #FFC835;">查看</el-button>-->
              <el-button type="primary" size="mini" @click="opneEdilog(scope.row, 1)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delectRow(scope.row, 2, '删除')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pageIndex"
                         :page-size="pageSize"
                         :page-sizes="[10, 15, 20, 25]"
                         :total="total"
                         v-show="list.length !== 0"
                         layout="total, sizes, prev, pager, next"
                         background
                         style="float:right;">
          </el-pagination>
        </el-col>
      </div>
      <!--弹框-->
      <el-dialog :visible.sync="isFormShow" width="600px" custom-class="form-dialog" title="详情">
        <el-form :model="dialog" label-width="100px" :rules="formRules" ref="ruleForm" class="form">
          <div class="form-row">
            <el-form-item  prop="name">
              <div class="form-item-title">分类名称<span class="border"></span> <span class="EnName">title</span></div>
              <el-input class="form-input" placeholder="请输入分类名称" v-model="dialog.name"></el-input>
            </el-form-item>
            <el-form-item  prop="days">
              <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">sortNo</span></div>
              <el-input-number class="form-input" :min="99" controls-position="right" v-model="dialog.sortNo"></el-input-number>
            </el-form-item>
            <el-form-item  prop="days">
              <div class="form-item-title">显示状态<span class="border"></span> <span class="EnName">sate</span></div>
              <el-switch
                v-model="dialog.display"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item  prop="pointTime">
              <div class="form-item-title">订餐截止时间<span class="border"></span> <span class="EnName">endtime</span></div>
              <el-time-select v-model="dialog.pointTime" class="form-input"
                              value-format="HH:mm"
                              :picker-options="{
                                start: '00:00',
                                step: '00:05',
                                end: '23:59'
                              }"
                placeholder="请选择截止时间">
              </el-time-select>
            </el-form-item>
               <el-form-item  prop="startTime">
              <div class="form-item-title">取餐开始时间<span class="border"></span> <span class="EnName">STSART</span></div>
            <el-time-select v-model="dialog.startTime" class="form-input"
                              value-format="HH:mm"
                              :picker-options="{
                                start: '00:00',
                                step: '00:05',
                                end: '23:59'
                              }"
                placeholder="请选择取餐开始时间段">
              </el-time-select>
            </el-form-item>
               <el-form-item  prop="endTime">
              <div class="form-item-title">取餐结束时间<span class="border"></span> <span class="EnName">END</span></div>
                 <el-time-select v-model="dialog.endTime" class="form-input"
                              value-format="HH:mm"
                              :picker-options="{
                                start: '00:00',
                                step: '00:05',
                                end: '23:59'
                              }"
                placeholder="请选择取餐结束时间">
              </el-time-select>
            </el-form-item>
            <!-- <el-form-item  prop="timeRange">
              <div class="form-item-title">取餐时间段<span class="border"></span> <span class="EnName">oriprice</span></div>
              <el-time-picker
                is-range
                value-format="HH:mm"
                v-model="dialog.timeRange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="请选择取餐时间段">
              </el-time-picker>
            </el-form-item> -->
          </div>
          <div class="form-row">
            <el-form-item>
              <div class="form-item-title">图片<span class="border"></span> <span class="EnName">image</span></div>
              <my-upload :imgs="dialog.Headimgs"
                         :limitUploadImgs="1"
                         @handleRemoveImg="handleRemoveImg('imge', 1, $event)"
                         @handleUploadImg="handleUploadImg('imge', 1, $event)">
              </my-upload>
            </el-form-item>
            <el-form-item style="flex: 0 0 66.66%;">
              <div class="form-item-title">备注<span class="border"></span> <span class="EnName">title</span></div>
              <el-input placeholder="请输入内容" type="textarea" class="form-input" style="width: 95%;" :rows="5"  v-model="dialog.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="info" @click="isFormShow = false">返回</el-button>
          <el-button type="primary" @click="opreation(dialog, 'ruleForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import myUpload from '@/components/my-upload'
  import {GetMealsType, TypeOperation} from '@/api/system'
  export default {
    name: 'vote-list',
    data () {
      return {
        isFormShow: false, // 弹框显示状态
        dialog: { // 弹框数据
          name: '',
          sortNo: 99,
          timeRange: [],
          pointTime: '',
          startTime: '',
          endTime: '',
          remark: '',
          imge: {url: ''},
          display: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        Action: 0, // 编辑
        Dto: {},
        Txt: '',
        formRules: {
          name: [
            { required: true, message: '请填写分类名称', trigger: 'blur' }
          ],
          pointTime: [
            { required: true, message: '请选择订餐截止时间', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择取餐开始时间段', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择取餐结束时间', trigger: 'blur' }
          ]
        },
        // 查询条件
        search: {
          // 活动名称
          activityName: ''
        },
        // 列表
        list: [],
        // 控制loading是否显示
        listLoading: false,
        // 分页相关
        total: 0,
        pageIndex: 1,
        pageSize: 10
      }
    },
    methods: {
      // 新增
      opneEdilog(dto, action) {
        this.isFormShow = true
        this.Action = action
        this.dialog = dto
        console.log(dto)
      },
      handleRemoveImg (txt, limitUploadImgs, fileList) {
        if (limitUploadImgs > 1) {
          this.dialog[txt] = fileList
        } else {
          this.dialog[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
        }
      },
      // 图片上传成功回调
      handleUploadImg (txt, limitUploadImgs, imgObj) {
        if (limitUploadImgs > 1) {
          if (!this.dialog[txt]) {
            this.$set(this.dialog, txt, [])
          }
          this.dialog[txt].push(JSON.parse(JSON.stringify(imgObj)))
        } else {
          this.dialog[txt] = JSON.parse(JSON.stringify(imgObj))
        }
      },
      opreation(dto, formName) {
        if (this.dialog.startTime >= this.dialog.endTime) {
          this.$message.warning('取餐结束时间不得晚于开始时间！')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            dto.qcTime = `${dto.startTime}-${dto.endTime}`
            this.Action === 0 ? this.Txt = '新增' : this.Txt = '编辑'
            this.edit(dto, this.Action, this.Txt)
          } else {
            return false
          }
        })
      },
      // 删除
      delectRow(dto, action, txt) {
        this.edit(dto, action, txt)
      },
      // 编辑
      edit(dto, action, txt) {
        this.$confirm('是否' + txt + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            dto: dto,
            action: action
          }
          TypeOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.isFormShow = false
              this.GetListByPage()
            } else this.$message.error(res.msg)
          }, err => {
            this.$message.error(err.msg)
          })
        }).catch(() => {})
      },
      // pageSize 改变
      handleSizeChange (val) {
        this.pageSize = val
        this.GetListByPage()
      },
      // currentPage 改变
      handleCurrentChange (val) {
        this.pageIndex = val
        this.GetListByPage()
      },
      // 套餐列表
      async GetListByPage () {
        let params = {
          name: '',
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          isPage: true,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        this.listLoading = true
        await GetMealsType(params).then(res => {
          this.listLoading = false
          this.list = res.data.map(item => {
            return {
            ...item,
            startTime: item.qcTime.split('-')[0],
            endTime: item.qcTime.split('-')[1]
            }
          })
          this.total = res.total
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      }
    },
    watch: {
      isFormShow: {
        handler(newName, oldName) {
          if (newName === false) {
            this.GetListByPage()
            this.$refs['ruleForm'].resetFields()
          }
        }
      }
    },
    components: {
      myUpload
    },
    mounted() {
      this.GetListByPage()
    }
  }
</script>

<style lang="scss" scoped>
  .vote-list-container {
    padding: 20px;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .filters-left {
      .filters-search {
        display: inline-block;
        width: 200px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .list-table {
    color: #666666;
    padding: 20px 0;
    .table-main {
      text-align: center;
      margin-bottom: 15px;
    }
  }
  /*弹框*/
  /deep/.form{
    .form-row{
      display: flex;
      display: -webkit-flex;
      .el-form-item{
        flex: 0 0 33.33%;
        .el-form-item__content{
          margin-left: 0 !important;
        }
        .form-item-title {
          font-weight: bolder;
          font-size: 16px;
          position: relative;
          .border {
            width: 1px;
            height: 16px;
            position: absolute;
            background-color: #000000;
            display: inline-block;
            top: 10px;
            margin-left: 8px;
          }
          .EnName {
            font-weight: normal;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            margin-left: 17px;
            text-transform: uppercase;
          }
        }
        .form-input {
          width: 70%;
        }
      }
      .form-flex-all{
        flex: 0 0 100%;
        .form-input{
          width: 100%;
        }
      }
    }
  }
</style>
