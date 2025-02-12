<template>
  <div class="list-container">
    <el-form :model="identyDetail" :rules="rules" ref="identyDetail" label-width="100px" class="demo-ruleForm">
      <el-form-item label="身份类型" prop="identityid">
        <el-select v-model="identyDetail.identityid" placeholder="请选择" @change="selectType"> <el-option v-for="item in identtypeList" :key="item._id" :label="item.identityName" :value="item._id"></el-option> </el-select>
      </el-form-item>
      <el-form-item label="永久账号"> <el-switch v-model="identyDetail.isForever" active-color="#13ce66" inactive-color="#ff4949"></el-switch> </el-form-item>
      <el-form-item label="有限期时间" v-if="!identyDetail.isForever">
        <el-date-picker v-model="identyDetail.timeRange" type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item> <el-button type="primary" @click="_editEdient">确定</el-button> </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { GetUserIdentityByPage, GetIdentityBind, GetUserDetail } from '@/api/system'
import { formatDate } from '@/components/js/data'
export default {
  data() {
    return {
      identtypeList: [],
      identyDetail: {
        identityid: '',
        identityName: '',
        isForever: true,
        timeRange: [formatDate(new Date(), 'yyyy/MM/dd'), formatDate(new Date(), 'yyyy/MM/dd')]
      },
      rules: {}
    }
  },
  mounted() {
    this.GetListByPage()
    this._getDetail()
  },
  methods: {
    selectType(val) {
      this.identyDetail.identityName = this.identtypeList.filter(item => item._id === val)[0].identityName
    },
    _editEdient() {
      let params = {
        userid: this.$route.query.id,
        identityName: this.identyDetail.identityName,
        identityid: this.identyDetail.identityid,
        isForever: this.identyDetail.isForever,
        beginTime: this.identyDetail.timeRange[0],
        endTime: this.identyDetail.timeRange[1],
        creater: this.$store.state.UserID,
        roleId: this.$store.state.UserRole,
        cid: this.$store.state._cid
      }
      GetIdentityBind(params).then(
        res => {
          if (res.success) {
            this.$message.success(res.msg)
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    },
    _getDetail() {
      if (this.$route.query.id !== undefined) {
        let parmas = {
          _id: this.$route.query.id
        }
        GetUserDetail(parmas).then(
          res => {
            if (res.success) {
              this.identyDetail = {
                identityName: res.data.vipCard.identityName,
                identityid: res.data.vipCard.identityid,
                isForever: res.data.vipCard.isForever,
                timeRange: [res.data.vipCard.beginTime.split(' ')[0], res.data.vipCard.endTime.split(' ')[0]]
              }
            } else this.$message.error(res.msg)
          },
          err => {
            this.$message.error(err.msg)
          }
        )
      }
    },
    GetListByPage() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isPage: false,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('createrVip'),
        roleId: localStorage.getItem('roleIdVip'),
        cid: localStorage.getItem('cidVip')
      }
      this.listLoading = true
      GetUserIdentityByPage(params).then(
        res => {
          this.listLoading = false
          if (res.success) {
            this.identtypeList = res.data
          } else this.$message.error(res.msg)
        },
        err => {
          console.log(err)
        }
      )
    }
  }
}
</script>

<style scoped lang="scss"></style>
