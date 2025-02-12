import axios from '@/config/httpConfig'
// 南京
localStorage.setItem('creater', '5bf8c51c2f74c8157868e97d')
localStorage.setItem('roleId', '5c19b36d0acd7115b04ecd50')
localStorage.setItem('cid', '5bf8c51c2f74c8157868e97d')
// 西安
// localStorage.setItem('creater', '5d399637721e8407c06fafe1')
// localStorage.setItem('roleId', '5c19b36d0acd7115b04ecd50')
// localStorage.setItem('cid', '5d399637721e8407c06fafe1')

// 会员规则
window.localStorage.setItem('createrVip', '5bf8c51c2f74c8157868e97d')
window.localStorage.setItem('roleIdVip', '5c19b36d0acd7115b04ecd50')
window.localStorage.setItem('cidVip', '5bf8c51c2f74c8157868e97d')

// 登录授权
export function login(params) {
  return axios.post('api/Authorize/Token', params)
}

// 获取当前用户的权限列表
export function getPermission1() {
  return axios.post('api/Permission/getPermission')
}

// 获取当前角色的权限列表
export function getPermission(params) {
  return axios.post('api/Permission/GetUserPermissionByRoleID', params)
}

// 根据refreshtoken获取token
export function getTokenByRefresh(params) {
  return axios.post('api/Authorize/GetToken', params)
}