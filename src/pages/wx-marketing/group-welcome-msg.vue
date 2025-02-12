<template>
  <div>
    <el-form class="filters" :model="filterParam" inline>
      <div class="filters-left">
        <el-form-item label="欢迎语模板标题"> <el-input type="text" v-model.trim="filterParam.title" placeholder="请输入欢迎语模板标题检索" clearable></el-input> </el-form-item>
        <el-form-item><el-button type="primary" @click="getWelcomeMsgList('refresh')">搜索</el-button></el-form-item>
      </div>
      <div class="filters-right">
        <el-form-item><el-button type="primary" @click="handleGroupWelcomeMsgAdd()">添加入群欢迎语</el-button></el-form-item>
      </div>
    </el-form>
    <div class="table-list">
      <div v-if="welcomeMsgList.length > 0">
        <div class="card-main">
          <el-card v-for="(item, index) in welcomeMsgList" :key="index" class="box-card">
            <div slot="header" class="clearfix">
              <div class="template-title">{{ item.title }}</div>
              <div style="float: right">
                <el-button type="text" @click="handleGroupWelcomeMsgEdit(item)">修改</el-button>
                <el-button type="text" @click="handleGroupWelcomeMsgDetele(item)">删除</el-button>
              </div>
            </div>
            <div class="template-info">
              <div class="text-content"><strong>欢迎语：</strong>{{ item.textMessage.content }}</div>
              <div class="text-app-content">
                <div><strong>小程序信息：</strong></div>
                <div class="wx-app">
                  <img class="wx-app-img" :src="item.webUrl" alt="封面图片" />
                  <div class="wx-app-content">
                    <div class="wx-app-title">{{ item.miniProgramMessage.title }}</div>
                    <div class="wx-app-url">{{ item.miniProgramMessage.pagePath }}</div>
                  </div>
                </div>
              </div>
              <div><strong>应用类型：</strong>{{ item.from === 1 ? '云极咖啡' : item.from === 2 ? '云极小超' : '--' }}</div>
            </div>
          </el-card>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total"
          background
          style="text-align:right"
        >
        </el-pagination>
      </div>
      <el-empty v-else description="暂无入群欢迎语模板，请先添加！"></el-empty>
    </div>

    <!-- 欢迎语信息弹框 -->
    <el-dialog title="入群欢迎语" :visible.sync="isGroupWelcomeMsgShow" width="800px" @close="isGroupWelcomeMsgShow = false" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="欢迎语模板标题：" prop="title">
              <div>
                <el-input type="text" v-model.trim="addForm.title" placeholder="请输入欢迎语模板标题"></el-input>
                <div class="tip right-tip">用于区分模板的标题</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入群欢迎语应用类型:">
              <el-radio-group v-model="addForm.from">
                <el-radio-button :label="1">云极咖啡</el-radio-button>
                <el-radio-button :label="2">云极小超</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="欢迎语文本内容：" prop="textMessage.content">
          <div>
            <el-input type="textarea" v-model.trim="addForm.textMessage.content" :rows="4" placeholder="请输入欢迎语文本内容，不多于1500个字"></el-input>
            <span class="tip">字数限制1500，%NICKNAME%为欢迎语占位符（必须大写），发送给客户时会自动替换为客户的昵称</span>
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="小程序消息标题：" prop="miniProgramMessage.title">
              <el-input type="text" v-model.trim="addForm.miniProgramMessage.title" placeholder="请输入小程序消息标题，不多于32个字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小程序跳转链接：" prop="miniProgramMessage.pagePath">
              <div>
                <el-input type="text" v-model.trim="addForm.miniProgramMessage.pagePath" placeholder="请输入小程序跳转链接"></el-input>
                <div class="tip right-tip">营销中心-卡券分享活动模块复制链接即可</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="小程序消息封面：" prop="webUrl">
          <material-upload ref="materialUploadRef" :imgs="imgs" :limitUploadImgs="limitUploadImgs" @handleUploadImg="handleUploadImg" @handleRemoveImg="handleRemoveImg"></material-upload>
        </el-form-item>
      </el-form>
      <span slot="footer"> <el-button :loading="submitLoading" type="primary" @click="submitGroupWelcomeMsgInfo">确 定</el-button> </span>
    </el-dialog>
  </div>
</template>

<script>
import { groupWelcomeMsgOperation, getGroupWelcomeMsg } from '@/api/system'
import MaterialUpload from './components/material-upload.vue'

export default {
  components: {
    MaterialUpload
  },
  data() {
    return {
      filterParam: {
        title: ''
      },
      welcomeMsgList: [],
      addForm: {
        title: '',
        textMessage: {
          content: '亲爱的%NICKNAME%用户，你好！'
        },
        miniProgramMessage: {
          appId: 'wxc1cbce069269c8e3',
          pagePath: '',
          title: '',
          pictureMediaId: ''
        },
        template_id: '',
        absoluteUrl: '',
        webUrl: '',
        from: 1
      },
      imgs: [],
      addFormState: 0,
      limitUploadImgs: 1,
      isGroupWelcomeMsgShow: false,
      submitLoading: false,
      tableLoading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      addFormRules: {
        title: [{ required: true, message: '请输入欢迎语模板标题', trigger: 'blur' }],
        'textMessage.content': [{ required: true, message: '请输入欢迎语文本内容', trigger: 'blur' }, { min: 1, max: 1500, message: '字数在1-1500之间', trigger: 'blur' }],
        'miniProgramMessage.title': [{ required: true, message: '请输入小程序消息标题', trigger: 'blur' }, { min: 1, max: 32, message: '字数在1-32之间', trigger: 'blur' }],
        'miniProgramMessage.pagePath': [{ required: true, message: '请输入小程序跳转链接', trigger: 'blur' }],
        webUrl: [{ required: true, message: '请上传小程序封面', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isGroupWelcomeMsgShow(val) {
      if (!val) {
        this.clear()
      }
    }
  },
  mounted() {
    this.getWelcomeMsgList()
  },
  methods: {
    getWelcomeMsgList(refresh) {
      if (refresh === '') {
        this.pageIndex = 1
      }
      let params = {
        ...this.filterParam,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      this.tableLoading = true
      getGroupWelcomeMsg(params)
        .then(res => {
          if (res.success) {
            this.tableLoading = false
            this.welcomeMsgList = res.data
            this.total = res.total
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleGroupWelcomeMsgAdd() {
      this.addFormState = 0
      this.isGroupWelcomeMsgShow = true
    },
    handleGroupWelcomeMsgEdit(row) {
      this.addFormState = 1
      this.isGroupWelcomeMsgShow = true
      this.$nextTick(() => {
        // eslint-disable-next-line camelcase
        let { title, textMessage, miniProgramMessage, template_id, absoluteUrl, webUrl, from, _id } = row
        this.addForm = {
          title,
          textMessage,
          miniProgramMessage,
          template_id,
          absoluteUrl,
          webUrl,
          from,
          _id
        }
        this.imgs = [{ url: webUrl, name: '小程序封面图片' }]
      })
    },
    handleGroupWelcomeMsgDetele(row) {
      this.addFormState = 2
      this.$confirm('此操作将永久删除该入群欢迎语模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.groupWelcomeMsgOperation(row)
        })
        .catch(() => {})
    },
    submitGroupWelcomeMsgInfo() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          if (!this.addForm.webUrl || !this.addForm.absoluteUrl || !this.addForm.miniProgramMessage.pictureMediaId) {
            return this.$message.warning('请上传小程序封面图片！')
          }
          this.groupWelcomeMsgOperation()
        }
      })
    },
    groupWelcomeMsgOperation(row) {
      const publicParam = row ? { ...row } : { ...this.addForm }
      let params = {
        dto: {
          ...publicParam,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        },
        action: this.addFormState
      }
      // console.log(params)
      this.submitLoading = true
      groupWelcomeMsgOperation(params)
        .then(res => {
          this.isGroupWelcomeMsgShow = false
          this.submitLoading = false
          this.$message.success(res.msg)
          this.getWelcomeMsgList()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleUploadImg(ret) {
      if (ret) {
        this.addForm.webUrl = ret.webUrl
        this.addForm.absoluteUrl = ret.absoluteUrl
        this.addForm.miniProgramMessage.pictureMediaId = ret.media ? ret.media.media_id : ''
      }
    },
    handleRemoveImg() {
      this.addForm.webUrl = ''
      this.addForm.absoluteUrl = ''
      this.addForm.miniProgramMessage.pictureMediaId = ''
      this.imgs = []
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getWelcomeMsgList()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getWelcomeMsgList()
    },
    clear() {
      this.$refs['materialUploadRef'].clearFiles()
      this.addForm = {
        title: '',
        textMessage: {
          content: '亲爱的%NICKNAME%用户，你好！'
        },
        miniProgramMessage: {
          appId: 'wxc1cbce069269c8e3',
          pagePath: '',
          title: '',
          pictureMediaId: ''
        },
        template_id: '',
        absoluteUrl: '',
        webUrl: '',
        from: 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_mixin.scss';

.filters {
  display: flex;
  justify-content: space-between;
}
.content-info {
  display: flex;
  align-items: center;
  .right-tip {
    width: 285px;
    margin-left: 10px;
  }
}
.tip {
  font-size: 12px;
  color: #e6a23c;
}
.card-main {
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  .box-card {
    width: 318px;
    height: 350px;
    overflow-y: scroll;
    margin-left: 15px;
    margin-bottom: 15px;
    .clearfix {
      display: flex;
      align-items: center;
      .template-title {
        width: 70%;
        margin-right: 5px;
        @include no-wrap();
      }
    }
    .template-info {
      font-size: 14px;
      .text-content {
        margin-bottom: 15px;
        @include no-wrap-two-line();
      }
      .text-app-content {
        margin-bottom: 15px;
      }
      .wx-app {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-top: 8px;
        background: #f5f5f5;
        .wx-app-img {
          width: 50px;
          height: 50px;
        }
        .wx-app-content {
          padding-left: 8px;
          .wx-app-title {
            width: 200px;
            @include no-wrap();
          }
          .wx-app-url {
            width: 200px;
            margin-top: 5px;
            font-size: 12px;
            color: #909399;
            @include no-wrap();
          }
        }
      }
    }
  }
}

/deep/.el-form {
  .el-form-item__content {
    line-height: unset;
  }
}
//浏览器隐藏滚动条
::-webkit-scrollbar {
  width: 2px;
  height: 12px;
  background-color: #fff;
}
</style>
