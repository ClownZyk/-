/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

export function recursionRouter(userRouter = [], allRouter = []) {
    let realRoutes = []
    // allRouter.forEach((v, i) => {
    //     userRouter.forEach((item, index) => {
    //         if (item.name === v.meta.name) {
    //             if (item.children && item.children.length > 0) {
    //                 v.children = recursionRouter(item.children, v.children)
    //             }
    //             realRoutes.push(v)
    //         }
    //     })
    // })

  // console.log(userRouter)
  // console.log(allRouter)
    allRouter.forEach((v, i) => {
        let is = userRouter.filter(k => k.menuPath === v.path)
      // console.log(is)
        if (is.length > 0) {
            if (is[0].children && is[0].children.length > 0) {
                v.children = recursionRouter(is[0].children, v.children)
            }
            // console.log(v)
            realRoutes.push(v)
        }
        userRouter.forEach((item, index) => {
            if (item.name === v.meta.name) {
                if (item.children && item.children.length > 0) {
                    v.children = recursionRouter(item.children, v.children)
                }
                realRoutes.push(v)
            }
        })
    })
    // console.log('realRoutes', realRoutes)
    // allRouter.filter(k => k.name === userRouter.filter(n => n.meta.name))
    // 这特么的是什么鬼
    // console.log('realRoutes', userRouter.filter(k => k.name === allRouter.filter(n => n.meta.name)))
    return realRoutes
}

/**
 *
 * @param {Array} routes 用户过滤后的路由
 *
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */
export function setDefaultRoute(routes) {
    routes.forEach((v, i) => {
        if (v.children && v.children.length > 0) {
            v.redirect = { name: v.children[0].name }
            setDefaultRoute(v.children)
        }
    })
}
