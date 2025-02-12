<template>
  <div>
    <el-dialog title="打印机" :visible.sync="isShow" width="600px" @closed="closePrint" :close-on-click-modal="false">
      <div v-if="yilianyun.length > 0 || xinye.length > 0 || feie.length > 0" v-loading="printLoading">
        <el-form ref="printFormRef" :model="printForm" label-width="80px" label-position="top">
          <el-form-item label="易联云打印机" v-if="yilianyun.length > 0">
            <el-radio-group
              v-model="printForm.clientId"
              @change="
                label => {
                  printChange(label, 1)
                }
              "
            >
              <el-radio v-for="item in yilianyun" :key="item.sn" :label="item.sn" border>{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="芯烨云打印机" v-if="xinye.length > 0">
            <el-radio-group
              v-model="printForm.clientId"
              @change="
                label => {
                  printChange(label, 2)
                }
              "
            >
              <el-radio v-for="item in xinye" :key="item.sn" :label="item.sn" border>{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="飞鹅打印机" v-if="feie.length > 0">
            <el-radio-group
              v-model="printForm.clientId"
              @change="
                label => {
                  printChange(label, 3)
                }
              "
            >
              <el-radio v-for="item in feie" :key="item.sn" :label="item.sn" border>{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="!printForm.clientId" @click="comfirmPrint">确 定</el-button>
        </span>
      </div>
      <div v-else>
        <el-empty description="暂无可用打印机，请确认设备是否配置或在线"></el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAvailablePrint, allOrderPrint } from '@/api/system.js'

export default {
  props: {
    printShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    printShow(val) {
      this.isShow = val
      if (!val) {
        this.printForm = {
          orderType: null,
          _id: '',
          printBrand: null,
          clientId: ''
        }
      }
    }
  },
  data() {
    return {
      printForm: {
        orderType: null,
        _id: '',
        printBrand: null,
        clientId: ''
      },
      yilianyun: [],
      xinye: [],
      feie: [],
      isShow: false,
      printLoading: false
    }
  },
  methods: {
    // 获取打印机信息
    getPrintList(type, row) {
      this.printForm.orderType = type
      this.printForm._id = row._id
      let params = {
        orderType: type,
        cid: this.$store.state._cid
      }
      getAvailablePrint(params).then(
        res => {
          this.yilianyun = res.data.yilianyun
          this.xinye = res.data.xinye
          this.feie = res.data.feie
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    // 打印机选择
    printChange(label, val) {
      this.printForm.printBrand = val
    },
    comfirmPrint() {
      let params = {
        ...this.printForm
      }
      // console.log(params)
      allOrderPrint(params).then(
        res => {
          this.$message.success(res.msg)
          this.closePrint()
        },
        err => {
          console.log(err.msg)
        }
      )
    },
    closePrint() {
      this.$emit('closePrint', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
