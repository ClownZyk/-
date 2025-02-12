<template>
  <div class="task-detail">
    <el-divider content-position="left">{{ $route.query.taskType === 1 ? '开闭店' : $route.query.taskType === 2 ? '日清' : $route.query.taskType === 3 ? '周清' : $route.query.taskType === 4 ? '月清' : '开店协同' }}任务</el-divider>
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="title">
            <div class="form-item-title">任务名称</div>
            <el-input type="text" v-model.trim="addForm.title" placeholder="请输入任务名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 任务时间 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item>
            <div class="form-item-title">任务开始时间</div>
            <el-row :gutter="20">
              <div v-if="$route.query.taskType !== 5">
                <el-col :span="12" v-if="$route.query.taskType === 3">
                  <el-select v-model="startWeOrMon" placeholder="请选择开始周期" style="width: 100%" @change="weekChange">
                    <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-col>
                <el-col :span="12" v-if="$route.query.taskType === 4">
                  <el-select v-model="startWeOrMon" placeholder="请选择开始日期" @change="monthChange" style="width: 90%"> <el-option v-for="item in monthList" :key="item" :label="item" :value="item"> </el-option> </el-select>
                  <span>号</span>
                </el-col>
                <el-col :span="12">
                  <el-time-picker
                    v-model="addForm.startTime"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择开始时间"
                    :clearable="false"
                    style="width: 100%"
                  >
                  </el-time-picker>
                </el-col>
              </div>
              <div v-else>
                <el-col :span="12"> <el-date-picker v-model="addForm.startTime" type="date" placeholder="选择任务开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerStartOptions"> </el-date-picker> </el-col>
              </div>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <div class="form-item-title">任务截止时间</div>
            <el-row :gutter="20">
              <div v-if="$route.query.taskType !== 5">
                <el-col :span="12" v-if="$route.query.taskType === 3">
                  <el-select v-model="endWeOrMon" placeholder="请选择截止周期" style="width: 100%"> <el-option v-for="item in weekEndList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
                </el-col>
                <el-col :span="12" v-if="$route.query.taskType === 4">
                  <el-select v-model="endWeOrMon" placeholder="请选择截止日期" style="width: 90%"> <el-option v-for="item in monthEndList" :key="item" :label="item" :value="item"> </el-option> </el-select>
                  <span>号</span>
                </el-col>
                <el-col :span="12">
                  <el-time-picker
                    v-model="addForm.endTime"
                    :picker-options="{
                      selectableRange: `${addForm.startTime + ':00'} - 23:59:59`
                    }"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择截止时间"
                    :clearable="false"
                    style="width: 100%"
                  >
                  </el-time-picker>
                </el-col>
              </div>
              <div v-else>
                <el-col :span="12"> <el-date-picker v-model="addForm.endTime" type="date" placeholder="选择任务截止日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerEndOptions"> </el-date-picker> </el-col>
              </div>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 分配门店 -->
      <el-row v-if="isManage">
        <el-col :span="12">
          <el-form-item>
            <div class="form-item-title">任务分配门店</div>
            <el-select v-model="addForm.cid" placeholder="请选择任务分配门店" style="width: 30%" @change="storeChange">
              <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 分配人员 -->
      <el-row v-if="$route.query.taskType === 5">
        <el-col :span="12">
          <el-form-item>
            <div class="form-item-title"><span>员工分配</span><el-button size="mini" type="warning" style="margin-left: 15px" @click="handleWorkerShow">选择员工</el-button></div>
          </el-form-item>
          <el-form-item size="small">
            <el-table size="small" :data="addForm.join" style="width: 100%" border>
              <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
              <el-table-column prop="name" label="员工姓名" min-width="180" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="phone" label="员工电话" min-width="180" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="workerRemove(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 任务内容 -->
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <div class="form-item-title"><span>任务信息</span><el-button size="mini" type="warning" style="margin-left: 15px" @click="isTaskShow = true">添加</el-button></div>
          </el-form-item>
          <el-form-item>
            <el-table size="small" :data="addForm.taskContent" border>
              <el-table-column type="index" width="55" align="center"></el-table-column>
              <el-table-column label="子任务名称" prop="content" min-width="200" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="子任务图片" prop="content" min-width="200" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.imgs && scope.row.imgs.length > 0"><el-image style="width: 50px; height: 50px;margin-right: 5px" v-for="(img, index) in scope.row.imgs" :key="index" :src="img.url" fit="fill"></el-image></div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="taskRemove(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 是否立即分配 -->
      <el-row>
        <!--
          <el-col :span="6">
            <el-form-item>
              <div class="form-item-title">任务安排类型</div>
              <el-select v-model="addForm.arrangeType" placeholder="请选择任务安排类型"> <el-option v-for="item in taskArrangeType" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
            </el-form-item>
          </el-col>
        -->
        <el-col :span="6" v-show="addFormState === 0 && $route.query.taskType !== 5">
          <el-form-item>
            <div class="form-item-title">是否立即分配</div>
            <el-switch v-model="addForm.isCarryOut"> </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item> <el-button :loading="submitLoading" type="primary" @click="submitTaskTemplate">提交</el-button> </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 员工信息弹框 -->
    <el-dialog title="员工信息" :visible.sync="isWorkerShow" width="900px" @close="isWorkerShow = false" :close-on-click-modal="false">
      <el-form :model="searchForm" inline size="small">
        <el-form-item> <el-input type="text" v-model.trim="searchForm.phone" placeholder="请输入员工电话检索" clearable></el-input> </el-form-item>
        <el-form-item v-show="isManage">
          <el-select v-model="searchForm.belongCid" placeholder="请选择员工所属门店" clearable> <el-option v-for="item in shopList" :key="item.cid" :label="item.companyName" :value="item.cid"> </el-option> </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="getWorkerList">搜索</el-button></el-form-item>
        <el-form-item><el-button type="warning" @click="saveSelectedWorker">保存</el-button></el-form-item>
      </el-form>
      <div class="table-list">
        <el-table size="small" v-loading="listLoading" :data="workerList" style="width: 100%" border @selection-change="workerSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="编号" width="55" align="center"></el-table-column>
          <el-table-column prop="realName" label="员工姓名" min-width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="phone" label="员工电话" min-width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="number" label="工号" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="post" label="职位" min-width="100" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="belongName" label="所属门店" min-width="180" align="center" show-overflow-tooltip> </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px;text-align: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
        >
        </el-pagination>
      </div>
      <span slot="footer"> </span>
    </el-dialog>

    <!-- 任务信息弹框 -->
    <el-dialog title="任务信息" :visible.sync="isTaskShow" width="700px" @close="isTaskShow = false" :close-on-click-modal="false">
      <el-form ref="taskAddFormRef" :model="taskAddForm" :rules="taskAddFormRules">
        <el-form-item prop="content">
          <div class="form-item-title">任务信息</div>
          <el-input type="textarea" v-model.trim="taskAddForm.content" :rows="4" placeholder="请输入任务信息"></el-input>
        </el-form-item>
        <el-form-item prop="imgs">
          <div class="form-item-title">任务图片</div>
          <my-upload :imgs="taskAddForm.imgs" :limitUploadImgs="3" @handleRemoveImg="handleRemoveImg('imgs', 3, $event)" @handleUploadImg="handleUploadImg('imgs', 3, $event)"> </my-upload>
        </el-form-item>
      </el-form>
      <span slot="footer"> <el-button type="primary" @click="handleTaskAdd">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkerList, getAllStore, getTaskTemplateDetail, taskTemplateOperation } from '@/api/system'
import myUpload from '@/components/my-upload'
import Filters from '@/components/js/Filters'

export default {
  mixins: [Filters],
  components: {
    myUpload
  },
  data() {
    return {
      isManage: localStorage.getItem('creater') === this.$store.state._cid,
      addForm: {
        title: '',
        startTime: '',
        endTime: '',
        join: [],
        taskContent: [],
        isCarryOut: this.$route.query.taskType === 5,
        arrangeType: 1,
        cid: this.$store.state._cid
      },
      startWeOrMon: '',
      endWeOrMon: '',
      searchForm: {
        phone: '',
        belongCid: this.$store.state._cid
      },
      taskAddForm: {
        no: 1,
        content: '',
        imgs: []
      },
      shopList: [],
      workerList: [],
      listLoading: false,
      submitLoading: false,
      isWorkerShow: false,
      isTaskShow: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        title: [{ required: true, message: '请输入任务名称', trigger: 'blur' }]
      },
      taskAddFormRules: {
        content: [{ required: true, message: '请输入任务信息', trigger: 'blur' }]
      },
      weekList: [{ value: 0, label: '周日' }, { value: 1, label: '周一' }, { value: 2, label: '周二' }, { value: 3, label: '周三' }, { value: 4, label: '周四' }, { value: 5, label: '周五' }, { value: 6, label: '周六' }],
      weekEndList: [],
      monthList: [],
      monthEndList: [],
      pickerStartOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerEndOptions: {
        disabledDate: time => {
          return time.getTime() < new Date(this.addForm.startTime).getTime()
        }
      }
    }
  },
  watch: {
    isTaskShow(val) {
      if (!val) {
        this.$refs.taskAddFormRef.resetFields()
      }
    }
  },
  computed: {
    addFormState() {
      if (this.$route.query.id) {
        return 1
      } else {
        return 0
      }
    }
  },
  mounted() {
    if (this.$route.query.taskType) {
      this.addForm.taskType = parseInt(this.$route.query.taskType)
      if (this.$route.query.taskType === 4) {
        // 获取一个月的天数
        let monthDay = this.getNowMonthDay(new Date().getFullYear(), new Date().getMonth() + 1)
        for (var i = 0; i < monthDay; i++) {
          this.monthList.push((i + 1).toString())
        }
      }
    }
    if (this.$route.query.id) {
      this.getTaskDetail()
    }
    this.getAllShop()
  },
  methods: {
    getTaskDetail() {
      let params = {
        _id: this.$route.query.id
      }
      getTaskTemplateDetail(params).then(res => {
        if (res.success) {
          this.addForm = res.data
          if (res.data.startTime.indexOf(',') !== -1) {
            this.startWeOrMon = parseInt(res.data.startTime.split(',')[0])
            this.endWeOrMon = parseInt(res.data.endTime.split(',')[0])
            if (res.data.taskType === 3) {
              let index = this.weekList.findIndex(item => item.value === this.startWeOrMon)
              this.weekEndList = this.weekList.slice(index, this.weekList.length)
            } else if (res.data.taskType === 4) {
              let index = this.monthList.findIndex(item => item === this.startWeOrMon)
              this.monthEndList = this.monthList.slice(index, this.monthList.length)
            }
          }
        }
      })
    },
    handleWorkerShow() {
      this.isWorkerShow = true
      this.getWorkerList()
    },
    // 获取所有门店信息
    getAllShop() {
      let params = {
        companyAddress: '',
        attribute: 0,
        companyName: '',
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      getAllStore(params).then(res => {
        if (res.success) {
          this.shopList = res.data.map(item => {
            return {
              cid: item.cid,
              companyName: item.companyName
            }
          })
          this.addForm.cid = this.isManage ? this.shopList[0].cid : this.$store.state._cid
          this.searchForm.belongCid = this.isManage ? this.shopList[0].cid : this.$store.state._cid
          // this.shopList.unshift({
          //   cid: localStorage.getItem('cid'),
          //   companyName: '总控账号'
          // })
        }
      })
    },
    storeChange(val) {
      this.searchForm.belongCid = val
    },
    // 获取员工数据
    getWorkerList() {
      let params = {
        ...this.searchForm,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getWorkerList(params)
        .then(res => {
          if (res.success) {
            this.listLoading = false
            this.workerList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 员工选择事件
    workerSelectionChange(val) {
      this.selectedWorker = val.map(item => {
        return {
          userId: item._id,
          name: item.realName,
          headImage: item.faceImage && item.faceImage.url ? item.faceImage.url : '',
          phone: item.phone
        }
      })
      this.finalSelectedWorker = this.selectedWorker.filter(item => {
        return this.addForm.join.every(val => val.userId !== item.userId)
      })
    },
    // 保存选择的员工数据
    saveSelectedWorker() {
      if (this.selectedWorker.length < 0) {
        return this.$message.warning('至少选中一条数据')
      }
      this.addForm.join.push(...this.finalSelectedWorker)
      this.isWorkerShow = false
    },
    // 删除分配员工
    workerRemove(row) {
      let index = this.addForm.join.findIndex(item => item.userId === row.userId)
      this.addForm.join.splice(index, 1)
    },
    // 保存添加的任务信息
    handleTaskAdd() {
      this.$refs['taskAddFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.taskContent.length <= 0) {
            this.taskAddForm.no = 1
          } else {
            let length = this.addForm.taskContent.length
            let no = this.addForm.taskContent[length - 1].no
            this.taskAddForm.no = no + 1
          }
          this.addForm.taskContent.push(JSON.parse(JSON.stringify(this.taskAddForm)))
          this.isTaskShow = false
        }
      })
    },
    taskRemove(index) {
      this.addForm.taskContent.splice(index, 1)
    },
    // 任务模板信息提交
    submitTaskTemplate() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (this.addForm.taskContent.length <= 0) {
            return this.$message.warning('请添加任务信息！')
          }
          if (!this.addForm.startTime || !this.addForm.endTime) {
            return this.$message.warning('请选择任务时间！')
          }
          if (this.addForm.taskType === 3 || this.addForm.taskType === 4) {
            if (this.startWeOrMon === '' || this.endWeOrMon === '') {
              return this.$message.warning('请选择任务日期！')
            }
            this.addForm.startTime = this.startWeOrMon + ',' + this.addForm.startTime
            this.addForm.endTime = this.endWeOrMon + ',' + this.addForm.endTime
          }
          let params = {
            dto: {
              ...this.addForm,
              creater: this.$store.state.UserID,
              roleId: this.$store.state.UserRole
              // cid: this.$store.state._cid
            },
            action: this.addFormState
          }
          // console.log(params)
          this.submitLoading = true
          taskTemplateOperation(params)
            .then(res => {
              if (res.success) {
                this.submitLoading = false
                this.$message.success(res.msg)
                this.$router.push('/task-arrange')
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 周清任务周期选择改变事件
    weekChange(val) {
      let index = this.weekList.findIndex(item => item.value === val)
      this.weekEndList = this.weekList.slice(index, this.weekList.length)
    },
    // 月清任务周期选择改变事件
    monthChange(val) {
      let index = this.monthList.findIndex(item => item === val)
      this.monthEndList = this.monthList.slice(index, this.monthList.length)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getWorkerList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getWorkerList()
    },
    handleRemoveImg(txt, limitUploadImgs, fileList) {
      if (limitUploadImgs > 1) {
        this.taskAddForm[txt] = fileList.map(item => {
          return {
            url: item.url,
            thumUrl: '',
            absoluteUrl: ''
          }
        })
      } else {
        this.taskAddForm[txt] = { url: '', thumUrl: '', absoluteUrl: '' }
      }
    },
    handleUploadImg(txt, limitUploadImgs, imgObj) {
      if (limitUploadImgs > 1) {
        if (!this.taskAddForm[txt]) {
          this.$set(this.taskAddForm, txt, [])
        }
        this.taskAddForm[txt].push(JSON.parse(JSON.stringify(imgObj)))
      } else {
        this.taskAddForm[txt] = JSON.parse(JSON.stringify(imgObj))
      }
    },
    // 获取当前月份天数
    getNowMonthDay(year, month) {
      var d = new Date(year, month, 0)
      return d.getDate()
    }
  }
}
</script>

<style lang="scss" scoped>
.task-detail {
  .form-item-title {
    font-weight: bolder;
    font-size: 16px;
  }
  .task-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .task-content {
    padding-left: 25px;
  }
}
</style>
