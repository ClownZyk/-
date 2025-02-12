import axios from '@/config/httpConfigForV8'

// 获取V8的产品分类
export function getCategoryForV6(param) {
    return axios.post('api/PurchaseOrder/GetCategoryForV6', param)
}
// 根据参数查询V8的商品列表
export function getProductInfoListByPage(param) {
    return axios.post('api/PurchaseOrder/GetProductInfoListByPage', param)
}
// 新增采购单
export function createPurchaseOrder(param) {
    return axios.post('api/PurchaseOrder/CreatePurchaseOrder', param)
}
// 更改采购单状态
export function updatePurchaseOrder(param) {
    return axios.post('api/PurchaseOrder/UpdatePurchaseOrderStatus', param)
}
// V6端查询采购单列表
export function getPhurchaseOrderList(param) {
    return axios.post('api/PurchaseOrder/GetPhurchaseOrderList', param)
}
// 根据采购订单号查询订单详情
export function getGoodsForV6ByOrderNum(param) {
    return axios.post('api/PurchaseOrder/GetGoodsForV6ByOrderNum', param)
}
// 获取仓库
export function getGoodsWarehouse(param) {
  return axios.post('api/CompanyInforPurchase/GetV8Warehouse', param)
}