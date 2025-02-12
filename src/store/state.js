export default {
  // token 定时器
  tokenTimer: null,
  // 商城-产品详情
  vShopProduct: {},
  get UserTokenExpires() {
    return localStorage.getItem('tokenExpires')
  },
  set UserTokenExpires(value) {
    localStorage.setItem('tokenExpires', value)
  },
  get UserRToken() {
    return localStorage.getItem('rtoken')
  },
  set UserRToken(value) {
    localStorage.setItem('rtoken', value)
  },
  get UserToken() {
    return localStorage.getItem('token')
  },
  set UserToken(value) {
    localStorage.setItem('token', value)
  },
  get UserRole() {
    return localStorage.getItem('role')
  },
  set UserRole(value) {
    localStorage.setItem('role', value)
  },
  get UserID() {
    return localStorage.getItem('userId')
  },
  set UserID(value) {
    localStorage.setItem('userId', value)
  },
  get UserName() {
    return localStorage.getItem('userName')
  },
  set UserName(value) {
    localStorage.setItem('userName', value)
  },
  get _cid() {
    return localStorage.getItem('_cid')
  },
  set _cid(value) {
    localStorage.setItem('_cid', value)
  },
  get loginData() {
    return JSON.parse(localStorage.getItem('loginData'))
  },
  set loginData(value) {
    localStorage.setItem('loginData', JSON.stringify(value))
  },
  /* 导航菜单是否折叠 */
  isSidebarNavCollapse: false,
  /* 面包屑导航列表 */
  crumbList: [],
  storeCid: null,
  enterpriseInfo: null,
  enterpriseOrderDetail: {},
  monitorToken: null,
  retailWarehouseId: '5d399637721e8407c06fafe1',
  refreshDuration: 60 * 1000,
  isAutoRefresh: false
}
