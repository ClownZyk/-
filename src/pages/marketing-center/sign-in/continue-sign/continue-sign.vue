<template>
  <div class="page-contain">
    <!--表单-->
    <el-form ref="form" :model="form" label-width="80px" :rules="rules"
             label-position="top"  class="form-contain">
      <el-form-item prop="first">
        <div class="form-item-title">第1天<span class="border"></span> <span class="EnName">first</span></div>
        <el-input type="number" placeholder="请输入第1天获取的积分" v-model="form.first"></el-input>
      </el-form-item>
      <el-form-item prop="second">
        <div class="form-item-title">第2天<span class="border"></span> <span class="EnName">second</span></div>
        <el-input type="number" placeholder="请输入第2天获取的积分" v-model="form.second"></el-input>
      </el-form-item>
      <el-form-item prop="third">
        <div class="form-item-title">第3天<span class="border"></span> <span class="EnName">third</span></div>
        <el-input type="number" placeholder="请输入第3天获取的积分"  v-model="form.third"></el-input>
      </el-form-item>
      <el-form-item prop="fourth">
        <div class="form-item-title">第4天<span class="border"></span> <span class="EnName">fourth</span></div>
        <el-input type="number" placeholder="请输入第4天获取的积分" v-model="form.fourth"></el-input>
      </el-form-item>
      <el-form-item prop="fifth">
        <div class="form-item-title">第5天<span class="border"></span> <span class="EnName">fifth</span></div>
        <el-input type="number" placeholder="请输入第5天获取的积分" v-model="form.fifth"></el-input>
      </el-form-item>
      <el-form-item prop="sixth">
        <div class="form-item-title">第6天<span class="border"></span> <span class="EnName">sixth</span></div>
        <el-input type="number" placeholder="请输入第6天获取的积分"  v-model="form.sixth"></el-input>
      </el-form-item>
      <el-form-item prop="seventh">
        <div class="form-item-title">第7天<span class="border"></span> <span class="EnName">seventh</span></div>
        <el-input type="number" placeholder="请输入第7天获取的积分"  v-model="form.seventh"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="btn" @click="_conform('form')">提交</el-button>
  </div>
</template>
<script>
  import {SignInDayQuery, SignInDayOperation} from '@/api/system'
  export default {
    data() {
      return {
        form: {},
        rules: {
          first: [
            {required: true, message: '请输入第1天获取的积分', trigger: 'blur'}
          ],
          second: [
            {required: true, message: '请输入第2天获取的积分', trigger: 'blur'}
          ],
          third: [
            {required: true, message: '请输入第3天获取的积分', trigger: 'blur'}
          ],
          fourth: [
            {required: true, message: '请输入第4天获取的积分', trigger: 'blur'}
          ],
          fifth: [
            {required: true, message: '请输入第5天获取的积分', trigger: 'blur'}
          ],
          sixth: [
            {required: true, message: '请输入第6天获取的积分', trigger: 'blur'}
          ],
          seventh: [
            {required: true, message: '请输入第7天获取的积分', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      // 获取本机构商城设置信息
      init () {
        let parmas = {
          creater: this.$store.state.UserID,
          roleid: this.$store.state.UserRole,
          cid: this.$store.state._cid
        }
        SignInDayQuery(parmas).then(res => {
          if (res.success) {
            this.form = res.data
          } else this.$message.error(res.msg)
        }, err => {
          this.$message.error(err.msg)
        })
      },
      // 提交
      _conform(form) {
        // 000000000000000000000000
        this.$refs[form].validate((valid) => {
          if (valid) {
            let dto = {
              ...this.form,
              creater: this.$store.state.UserID,
              roleid: this.$store.state.UserRole,
              cid: this.$store.state._cid
            }
            let parmas = {
              dto: dto,
              action: this.form._id === '000000000000000000000000' ? 0 : 1
            }
            // console.log(parmas)
            this.$confirm('是否提交修改?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              SignInDayOperation(parmas).then(res => {
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
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-contain{
    /*display: flex;*/
    /*display: -webkit-flex;*/
    .form-contain{
      padding: 0 120px 20px 20px;
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        flex: 0 0 50%;
        .el-input{
          width: 80%;
        }
        .el-form-item__content{
          .form-item-title{
            font-weight: bolder;
            font-size: 16px;
            position: relative;
            .border{
              width: 1px;
              height: 16px;
              position: absolute;
              background-color: #000000;
              display: inline-block;
              top: 10px;
              margin-left: 8px;
            }
            .EnName{
              font-weight: normal;
              font-size: 14px;
              position: absolute;
              bottom: 0;
              margin-left: 17px;
              text-transform: uppercase;
            }
          }
        }
      }
    }
  }
  .btn{
    margin-left: 20px;
  }
  .row-line{
    display: flex;
    display: -webkit-flex;
    .el-form-item{
      flex: 1;
      padding-right: 5%;
      &:last-child{
        padding-right: 0;
      }
    }
  }
</style>
