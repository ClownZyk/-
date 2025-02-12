<template>
  <div>
    <el-form :model="filterParam" inline>
      <el-form-item label="团购名称"> <el-input v-model="filterParam.activityName" placeholder="输入团购名称检索" clearable></el-input> </el-form-item>
      <el-form-item> <el-button type="primary" @click="searchCondition">搜索</el-button> </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="grouponList" border>
      <el-table-column align="center" width="80" type="index"></el-table-column>
      <el-table-column align="center" prop="activityName" label="团购名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="productName" label="团购商品" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleGrouponSelected(scope.row)">选择此模板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[10, 15, 20, 25]" :total="total" layout="total, sizes, prev, pager, next" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getGrouponTemplateList } from '@/api/system'
export default {
  props: {
    isGrouponTemplateShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterParam: {
        activityName: ''
      },
      grouponList: [],
      listLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.GetListByPage()
  },
  methods: {
    GetListByPage() {
      let params = {
        activityName: this.filterParam.activityName,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        isPage: true,
        isOrder: true,
        isAsc: true,
        creater: localStorage.getItem('creater'),
        roleId: localStorage.getItem('roleId'),
        cid: localStorage.getItem('cid')
      }
      this.listLoading = true
      getGrouponTemplateList(params).then(
        res => {
          this.listLoading = false
          this.grouponList = res.data
          this.total = res.total
        },
        () => {
          this.listLoading = false
        }
      )
    },
    handleGrouponSelected(row) {
      let grouponInfo = {
        productId: row.productId,
        productName: row.productName,
        activityName: row.activityName,
        peopleNum: row.peopleNum,
        isLimit: row.isLimit,
        limitNum: row.limitNum,
        content: row.content,
        contentList: row.contentList.map(item => {
          return {
            ...item,
            bigImgs: item.bigImg ? [{ url: item.bigImg }] : [],
            smallImgs:
              item.smallImg && item.smallImg.length > 0
                ? item.smallImg.map(val => {
                    return { url: val }
                  })
                : []
          }
        }),
        images: row.images,
        videoUrl: row.videoUrl,
        sku: row.sku.map(item => {
          return {
            ...item,
            imgs: item.img && item.img.url ? [{ url: item.img.url, name: '商品图片' }] : []
          }
        })
      }
      this.$emit('saveGrouponInfo', JSON.parse(JSON.stringify(grouponInfo)))
      this.$emit('update:isGrouponTemplateShow', false)
    },
    searchCondition() {
      this.pageIndex = 1
      this.GetListByPage()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.GetListByPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.GetListByPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
