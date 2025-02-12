<template>
  <div class="detail">
    <div class="detail-top">
      <!--      <div class="detail-title theme-color">排单信息</div>-->
      <el-form :model="detail">
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item" prop="name">
            <div class="form-item-title">排单时间<span class="border"></span> <span class="EnName">time</span></div>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="detail.singleTime"
              class="form-item-placehoder"></el-date-picker>
          </el-form-item>
          <el-form-item class="el-form-item" prop="name" style="width: 180px;">
            <div class="form-item-title">美食类别<span class="border"></span> <span class="EnName">category</span></div>
            <el-select v-model="detail.typeid" placeholder="请选择美食类别" @change="_select">
              <el-option
                class="form-input"
                v-for="item in categoryList"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" prop="name">
            <div class="form-item-title">排单人<span class="border"></span> <span class="EnName">name</span></div>
            <el-input class="form-input" placeholder="请输入排单人" v-model="detail.singleName"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" prop="name">
            <div class="form-item-title">排序号<span class="border"></span> <span class="EnName">sortNo</span></div>
            <el-input-number placeholder="最小值为99"
                             class="long-short-input"
                             onkeyup="this.value=this.value.replace(/\D/g,'')"
                             onafterpaste="this.value=this.value.replace(/\D/g,'')"
                             v-model="detail.sortNo" controls-position="right" :min="99">
            </el-input-number>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item el-form-row" prop="name">
            <div class="form-item-title">备注<span class="border"></span> <span class="EnName">remark</span></div>
            <el-input type="textarea" :rows="3" class="form-input" placeholder="请输入备注" v-model="detail.remark"></el-input>
          </el-form-item>
        </div>
        <div class="mag-dialog-row">
          <el-form-item class="el-form-item el-form-row">
            <div class="form-item-title">列表主图<span class="border"></span> <span class="EnName">mainimg</span></div>
            <my-upload :imgs="detail.img"
                       :limitUploadImgs="1"
                       ref="uploadImg"
                       @handleRemoveImg="handleRemoveImg('orderimage', 1, $event)"
                       @handleUploadImg="handleUploadImg('orderimage', 1, $event)">
            </my-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-button type="primary" style="margin-top: 20px;" @click="_mealOption">保存</el-button>
  </div>
</template>

<script>
  import myUpload from '@/components/my-upload'
  import {formatDate} from '@/components/js/data'
  import {GetMealsType, DailyAryOperation, DailyArrangeId} from '@/api/system'
  export default {
    data() {
      return {
        productShow: false,
        categoryList: [], // 分类列表
        detail: { // 详情
          Creater: this.$store.state.UserID,
          RoleId: this.$store.state.UserRole,
          Cid: this.$store.state._cid,
          sortNo: 99,
          singleTime: formatDate(new Date(), 'yyyy-MM-dd'),
          orderimage: {},
          d_sku: [
            {title: 'yuhua', price: '365', vipPrice: '6'}
          ]
        },
        text: ''
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this._GetListByPage()
        this._detail()
      },
      _detail() {
        if (this.$route.query.action === 0 || this.$route.query.action === undefined) {
        } else {
          let params = {
            _id: this.$route.query.id
          }
          DailyArrangeId(params).then(res => {
            if (res.success) {
              this.detail = res.data
              this.detail.img = []
              this.detail.img.push(JSON.parse(JSON.stringify(this.detail.orderimage)))
            } else this.$message.error(res.msg)
          }, err => {
            console.log(err)
            this.listLoading = false
          })
        }
      },
      _select(vid) {
        let obj = {}
        obj = this.categoryList.find((item) => { // 这里的userRoleList就是上面遍历的数据源
          console.log(item._id === vid)
          return item._id === vid // 筛选出匹配数据
        })
        this.detail.typeName = obj.name
      },
      // (餐食菜单)添加、更新、删除
      _mealOption() {
        let id = this.$route.query.id
        id === undefined || id === '' ? this.text = '新增' : this.text = '编辑'
        this.$confirm('是否' + this.text + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            dto: this.detail,
            action: this.$route.query.action
          }
          // console.log(params)
          console.log(params)
          DailyAryOperation(params).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.$router.go(-1)
            } else this.$message.error(res.msg)
          }, err => {
            console.log(err)
            this.listLoading = false
          })
        })
      },
      // 分类接口
      _GetListByPage () {
        let params = {
          name: '',
          pageSize: 20,
          pageIndex: 1,
          isPage: false,
          isOrder: true,
          isAsc: true,
          creater: this.$store.state.UserID,
          roleId: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        GetMealsType(params).then(res => {
          if (res.success) {
            this.categoryList = res.data
          } else this.$message.error(res.msg)
        }, err => {
          console.log(err)
          this.listLoading = false
        })
      },
      // 移除图片
      handleRemoveImg (txt, limitUploadImgs, fileList) {
        if (limitUploadImgs > 1) {
          this.detail[txt] = fileList
        } else {
          this.detail[txt] = {url: '', thumUrl: '', absoluteUrl: ''}
        }
      },
      // 图片上传成功回调
      handleUploadImg (txt, limitUploadImgs, imgObj) {
        console.log(imgObj)
        if (limitUploadImgs > 1) {
          if (!this.detail[txt]) {
            this.$set(this.detail, txt, [])
          }
          this.detail[txt].push(JSON.parse(JSON.stringify(imgObj)))
        } else {
          console.log(JSON.parse(JSON.stringify(imgObj)))
          this.detail[txt] = JSON.parse(JSON.stringify(imgObj))
        }
      }
    },
    components: {
      myUpload
    }
  }
</script>

<style scoped lang="scss">
  .vote-list-container{
    .detail{
      width: calc(100% - 240px);
      background-color: #ffffff;
      position: fixed;
      z-index: 998;
      overflow-y: scroll;
      height: 100%;
      padding-bottom: 120px;
    }
  }
  .detail-top{
    .detail-title{
      font-size: 18px;
      font-weight: bold;
    }
  }
</style>
