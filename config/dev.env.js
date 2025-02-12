'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/abp"',
  BASE_HOST: '"https://v6.wxbos.cn"',
  BASE_API_V8: '"/apply"',
  BASE_HOST_V8: '"https://v8.wxbos.cn"',
  BASE_API_V8_XA: '"/abi"',
  BASE_HOST_V8_XA: '"https://V8.yunjixiaochao.cn"',
})
