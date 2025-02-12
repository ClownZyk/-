export default {
  currentRoleAllRights(state) {
    let result = []
    let node = []
    let list = [...state.permission.defaultMenus]
    while ((node = list.shift())) {
      result.push(node)
      node.children && list.push(...node.children)
    }
    return [
      ...new Set(
        result.reduce((preRet, item) => {
          return [
            ...preRet,
            ...item.operations.map(opt => {
              return `${item.menuPath}:${opt}`
            })
          ]
        }, [])
      )
    ]
  },
  mergeTreeMenusToFlat(state) {
    let result = []
    let list = state.permission.permissionList ? [...state.permission.permissionList] : []
    function treeForeach(tree) {
      tree.forEach(data => {
        data.children && treeForeach(data.children) // 遍历子树
        result.push(data)
      })
    }
    treeForeach(list)
    return result
  }
}
