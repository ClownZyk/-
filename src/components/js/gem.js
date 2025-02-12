import baseURL from '@/config/baseUrl.js'
const index = baseURL.indexOf('.')
const DOMAINNAME = baseURL.substring(index + 1, baseURL.length)
const FILINGNUM = DOMAINNAME === 'wxbos.cn' ? '苏ICP备09017806号-2' : DOMAINNAME === 'yunjixiaochao.cn' ? '陕ICP备19022630号-2' : ''
const dIndex = baseURL.indexOf('/')
const FULLDOMAINNAME = baseURL.substring(dIndex + 2, baseURL.length)
export default {
  DOMAINNAME,
  FILINGNUM,
  FULLDOMAINNAME
}