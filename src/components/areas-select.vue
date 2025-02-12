<template>
  <!--@check-change="handleCheckChange"-->
  <el-tree
    class="address-delivery-tree"
    :props="mapJson"
    :load="loadNode"
    lazy
    show-checkbox
    >
  </el-tree>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        mapJson: '../static/json/map.json',
        count: 1
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      // handleCheckChange(data, checked, indeterminate) {
      //   console.log(data, checked, indeterminate)
      // },
      // handleNodeClick(data) {
      //   console.log(data)
      // },
      init() {
        axios.get(this.mapJson).then(function(response) {
          if (response.status === 200) {
            var data = response.data
            console.log(data)
          }
        })
      },
      loadNode(node, resolve) {
        console.log(node)
        console.log(node)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.area-input{
  .el-form-item{
    margin-right: 50px;
  }
}
  .address-delivery-tree{

  }
</style>
