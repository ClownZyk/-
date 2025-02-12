import axios from 'axios'
import store from '@/store/index.js'
import { Message } from 'element-ui'
// 网页上方进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import baseURL from './baseUrl'

// const baseURL = process.env.NODE_ENV === 'production' ? 'http://v6demo.wxbos.cn/' : '/abp'
// const baseURL = process.env.NODE_ENV === 'production' ? 'https://v6.yunjixiaochao.cn/' : '/abp'
// const baseURL = process.env.NODE_ENV === 'production' ? 'http://v6.wxbos.com/' : '/abp'
const http = {}
var instance = {}
// 禁用进度环
NProgress.configure({ showSpinner: false })
instance = axios.create({
  timeout: 50000,
  baseURL
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 请求头添加token
    if (store.state.UserToken) {
      config.headers.Authorization = 'Bearer ' + store.state.UserToken
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    if (err && err.response) {
      // console.log(err)
      switch (err.response.status) {
        case 400:
          err.message = '请求出错'
          break
        case 401:
          Message.warning({
            message: '授权失败，请重新登录'
          })
          store.commit('LOGIN_OUT')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
          return
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = '请求错误,未找到该资源'
          break
        case 500:
          err.message = '服务器端出错'
          break
        case 503:
          err.message = '系统正在升级，稍等片刻'
          break
        case 504:
          err.message = '服务器超时或未响应'
          break
      }
    } else {
      err.message = '连接服务器失败'
    }
    Message.error({
      message: err.message,
      showClose: true,
      duration: 3000
    })
    return Promise.reject(err.response)
  }
)

http.get = function (url, options) {
  NProgress.start()
  return new Promise((resolve, reject) => {
    instance
      .get(url, options)
      .then(response => {
        NProgress.done()
        if (response.success) {
          resolve(response)
        } else {
          Message.error({
            message: response.msg || response.Msg,
            showClose: true,
            duration: 3000
          })
          reject(response)
        }
      })
      .catch(e => {
        NProgress.done()
        console.log(e)
      })
  })
}

http.post = function (url, data, options) {
  NProgress.start()
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, options)
      .then(response => {
        NProgress.done()
        if (response.success || response.statu || response.ok) {
          resolve(response)
        } else {
          Message.error({
            message: response.msg || response.Msg,
            showClose: true,
            duration: 3000
          })
          reject(response)
        }
      })
      .catch(e => {
        NProgress.done()
        console.log(e)
      })
  })
}

http.postFile = function (url, data, options) {
  NProgress.start()
  return new Promise((resolve, reject) => {
    instance
      .post(url, data, options)
      .then(response => {
        NProgress.done()
        resolve(response)
      })
      .catch(e => {
        NProgress.done()
        console.log(e)
      })
  })
}

export default http
