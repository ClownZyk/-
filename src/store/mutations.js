import { getTokenByRefresh } from '@/api/permission'

function _getTokenTimer(state, time) {
  state.tokenTimer = null
  console.log('定时器开启')
  state.tokenTimer = setTimeout(() => {
    console.log('发起请求')
    let param = {
      refreshToken: state.UserRToken
    }
    getTokenByRefresh(param).then(res => {
      console.log(res)
      state.UserToken = res.data.token.tokenContent
      state.UserTokenExpires = res.data.token.expires
      state.UserRToken = res.data.refreshToken.tokenContent
      // state.UserRTokenExpires = res.refreshToken.expires
      let time = new Date(state.UserTokenExpires).getTime() - (3 * 60 * 1000) - new Date().getTime()
      _getTokenTimer(state, time)
    }, err => {
      console.log('err', err)
    })
  }, time)
}

export default {
  _getTokenTimer,
  // 清空产品的值
  clearVShopProduct(state) {
    state.vShopProduct = {}
  },
  // 设置产品的sku
  setVShopProductSKU(state, data) {
    if (state.vShopProduct.sku === undefined) {
      state.vShopProduct.sku = []
    }
    state.vShopProduct.sku = data
  },
  // 设置产品的基本信息
  setVShopProductBaseInfo(state, data) {
    state.vShopProduct = Object.assign(state.vShopProduct, data)
  },
  // 设置产品的富文本内容
  setVShopProductContent(state, data) {
    if (state.vShopProduct.content === undefined) {
      state.vShopProduct.content = []
    }
    state.vShopProduct.content = data
  },
  LOGIN_IN(state, data) {
    state.loginData = data
    // state.UserToken = data.token
    state.UserToken = data.token.tokenContent
    state.UserTokenExpires = data.token.expires
    state.UserRToken = data.refreshToken.tokenContent
    state.organizationName = data.organizationName
    // state.UserRTokenExpires = data.refreshToken.expires
    state.UserRole = data.roleID
    state.UserID = data._id
    state.UserName = data.userName
    state._cid = data.cid
    if (data.token.expires) {
      let time = new Date(state.UserTokenExpires).getTime() - (3 * 60 * 1000) - new Date().getTime()
      _getTokenTimer(state, time)
    }
  },
  LOGIN_OUT(state) {
    state.UserToken = ''
    state.UserTokenExpires = ''
    state.UserRToken = ''
    // state.UserRTokenExpires = ''
    state.UserRole = ''
    state.UserID = ''
    state.UserName = ''
    state._cid = ''
    state.tokenTimer = null
  },
  toggleNavCollapse(state) {
    state.isSidebarNavCollapse = !state.isSidebarNavCollapse
  },
  setCrumbList(state, list) {
    state.crumbList = list
  },
  setStoreCid(state, item) {
    state.storeCid = item
  },
  setEnterpriseInfo(state, item) {
    state.enterpriseInfo = item
  },
  setEnterpriseOrderDetail(state, item) {
    state.enterpriseOrderDetail = item
  },
  setMonitorToken(state, token) {
    state.monitorToken = token
  },
  setPageRefreshState(state, val) {
    state.isAutoRefresh = val
  }
}