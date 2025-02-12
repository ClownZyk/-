<template>
  <div class="editor-container" style="height: 700px">
    <!-- 图片上传 -->
    <el-upload class="avatar-uploader" :action="serverUrl" name="img" :headers="header" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload"> </el-upload>
    <!-- 文件上传 -->
    <el-upload class="file-uploader" :action="serverUrlFile" name="file" :headers="header" :show-file-list="false" :on-success="uploadSuccessFile" :on-error="uploadErrorFile" :before-upload="beforeUploadFile"> </el-upload>

    <quill-editor class="editor" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"> </quill-editor>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
let fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
let Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

let Link = Quill.import('formats/link')
class FileBlot extends Link {
  // 继承Link Blot
  static create(value) {
    let node = null
    if (value && !value.href) {
      // 适应原本的Link Blot
      node = super.create(value)
    } else {
      // 自定义Link Blot
      node = super.create(value.href)
      // node.setAttribute('download', true) // 左键点击即下载
      node.innerText = value.innerText
      // node.download = value.innerText
    }
    return node
  }
}
FileBlot.blotName = 'link'
FileBlot.tagName = 'A'
Quill.register(FileBlot)

// 工具栏配置
const toolbarOptions = [
  [{ font: fonts }], // 字体种类
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ direction: 'rtl' }], // 文本方向
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  // ['link', 'image', 'video'] // 链接、图片、视频
  ['image', 'upload'] // 图片、附件
]
export default {
  watch: {
    value(newVal, oldVal) {
      this.content = newVal
    }
  },
  props: {
    value: {
      type: String
    },
    maxSize: {
      type: Number,
      default: 4000
    }
  },
  components: {
    quillEditor
  },
  data() {
    return {
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      quillUpdateFile: false, // 根据附件上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              // 'link': function(value) {
              //   if (value) {
              //     // var href = prompt('请输入url')
              //     // this.quill.format('link', href)
              //     document.querySelector('.file-uploader input').click()
              //   } else {
              //     this.quill.format('link', false)
              //   }
              // },
              upload: function(value) {
                if (value) {
                  document.querySelector('.file-uploader input').click()
                } else {
                  this.quill.format('upload', false)
                }
              }
            }
          }
        }
      },
      serverUrl: '/api/Base/UploadImg1', // 图片上传服务器地址
      serverUrlFile: '/api/Base/UploadImg2', // 文件上传服务器地址
      header: {
        Authorization: 'Bearer ' + this.$store.state.UserToken
        // token: sessionStorage.token
      }
    }
  },
  methods: {
    onEditorBlur() {
      this.$emit('blur', this.content)
    },
    onEditorFocus() {},
    onEditorChange() {
      this.$emit('input', this.content)
    },
    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // if (res.code === 200) {
      if (res.success) {
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.data[0])
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败.')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    // -----------------------------下面为附件上传的方法
    // 附件上传前
    beforeUploadFile() {
      // 显示loading动画
      this.quillUpdateFile = true
    },
    uploadSuccessFile(res, file) {
      // res为附件服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      if (res.success) {
        let fileNameLength = file.name.length
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入链接  res.url为服务器返回的图片地址
        // quill.insertEmbed(length, 'image', res.data[0])
        quill.insertEmbed(length, 'link', { href: res.data[0], innerText: file.name }, 'api')
        // 调整光标到最后
        quill.setSelection(length + fileNameLength)
      } else {
        this.$message.error('附件上传失败.')
      }
      // loading动画消失
      this.quillUpdateFile = false
    },
    // 富文本图片上传失败
    uploadErrorFile() {
      // loading动画消失
      this.quillUpdateFile = false
      this.$message.error('附件上传失败')
    }
  }
}
</script>

<style>
.avatar-uploader {
  display: none;
}
.editor-container {
  height: 100%;
}
strong {
  font-weight: bold;
}
.editor {
  line-height: normal !important;
  position: relative;
  height: 100%;
}
.ql-toolbar.ql-snow {
  width: 100%;
  position: absolute;
  z-index: 99;
  top: -15px;
}
.ql-container.ql-snow {
  padding-top: 40px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
  content: '宋体';
  font-family: 'SimSun';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
  content: '黑体';
  font-family: 'SimHei';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Microsoft-YaHei']::before {
  content: '微软雅黑';
  font-family: 'Microsoft YaHei';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
  content: '楷体';
  font-family: 'KaiTi';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
  content: '仿宋';
  font-family: 'FangSong';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Arial']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Arial']::before {
  content: 'Arial';
  font-family: 'Arial';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='Times-New-Roman']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='Times-New-Roman']::before {
  content: 'Times New Roman';
  font-family: 'Times New Roman';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='sans-serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='sans-serif']::before {
  content: 'sans-serif';
  font-family: 'sans-serif';
}

.ql-font-SimSun {
  font-family: 'SimSun';
}
.ql-font-SimHei {
  font-family: 'SimHei';
}
.ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}
.ql-font-KaiTi {
  font-family: 'KaiTi';
}
.ql-font-FangSong {
  font-family: 'FangSong';
}
.ql-font-Arial {
  font-family: 'Arial';
}
.ql-font-Times-New-Roman {
  font-family: 'Times New Roman';
}
.ql-font-sans-serif {
  font-family: 'sans-serif';
}
.ql-snow.ql-toolbar .ql-upload {
  background: url('../assets/image/upload.png');
  background-size: 16px 16px;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
