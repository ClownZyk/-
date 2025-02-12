import { getPermission } from '@/api/permission'
import router, { DynamicRoutes } from '@/router/index'
import { recursionRouter } from '@/utils/recursion-router' // setDefaultRoute
import dynamicRouter from '@/router/dynamic-router'
import store from '@/store/index.js'
import { Message } from 'element-ui'

export default {
  namespaced: true,
  state: {
    permissionList: null /** 所有路由 */,
    sidebarMenu: [] /** 导航菜单 */,
    currentMenu: '', /** 当前active导航菜单 */
    defaultMenus: []
  },
  getters: {},
  mutations: {
    SET_PERMISSION(state, routes) {
      state.permissionList = routes
    },
    CLEAR_PERMISSION(state) {
      state.permissionList = null
    },
    SET_MENU(state, menu) {
      state.sidebarMenu = menu
    },
    CLEAR_MENU(state) {
      state.sidebarMenu = []
    },
    SET_CURRENT_MENU(state, currentMenu) {
      state.currentMenu = currentMenu
    },
    setDefaultMenus(state, menus) {
      state.defaultMenus = menus
    }
  },
  actions: {
    async FETCH_PERMISSION({ commit, state }) {
      let param = {
        Creater: store.state.UserID,
        RoleId: store.state.UserRole,
        Cid: store.state._cid,
        Id: store.state.UserRole
      }
      // 获取当前角色的所有菜单
      let permissionList = []
      await getPermission(param).then(res => {
        if (res.data) {
          permissionList = res.data.children
          let result = res.data ? res.data.children : []
          commit('setDefaultMenus', result)
          // console.log(permissionList)
        } else {
          Message.warning({
            message: '授权失败，请重新登录'
          })
          store.commit('LOGIN_OUT')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }, err => {
        console.log(err)
      })
      // await getPermission1().then(res => {
      //     permissionList = res.data
      // }, err => {
      //     console.log(err)
      // })
      /*  根据权限筛选出我们设置好的路由并加入到path=''的children */
      let routes = recursionRouter(permissionList, dynamicRouter)
      // console.log(permissionList)
      // console.log(dynamicRouter)
      let MainContainer = DynamicRoutes.find(v => v.path === '')
      let children = MainContainer.children
      children.push(...routes)
      // console.log(children)
      /* 生成左侧导航菜单 */
      commit('SET_MENU', children)

      /*
          为所有有children的菜单路由设置第一个children为默认路由
          主要是供面包屑用，防止点击面包屑后进入某个路由下的 '' 路由,比如/manage/
          而我们的路由是
          [
              /manage/menu1,
              /manage/menu2
          ]
      */
      // setDefaultRoute([MainContainer])

      /*  初始路由 */
      let initialRoutes = router.options.routes
      /*  动态添加路由 */
      router.addRoutes(DynamicRoutes)

      /* 完整的路由表 */
      commit('SET_PERMISSION', [...initialRoutes, ...DynamicRoutes])
    }
  }
}
