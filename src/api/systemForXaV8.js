import axios from '@/config/httpConfigForXaV8'

// 获取V8的产品分类
export function getXaCategoryForV6(param) {
    return axios.post('api/PurchaseOrder/GetCategoryForV6', param)
}
// 根据参数查询V8的商品列表
export function getXaProductInfoListByPage(param) {
    return axios.post('api/PurchaseOrder/GetProductInfoListByPage', param)
}