function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatTime2(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [year, month, day].map(formatNumber).join('-')

  return `${t1}`
}

export function formatDate(n) {
  if (!n) {
    return ''
  }
  const str = n.toString()
  return str[1] ? `${str}:00` : `0${str}:00`
}

export function getWeekStartDateAndEndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000
  let now = new Date()
  let mondayTime = now.getTime() - (now.getDay() - 1) * oneDayLong
  let sundayTime = now.getTime() + (7 - now.getDay()) * oneDayLong
  let monday = new Date(mondayTime)
  let sunday = new Date(sundayTime)
  let weekRange = [getDataString(monday), getDataString(sunday)]
  return weekRange
}

export function getMonthStartDateAndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000
  let now = new Date()
  let year = now.getFullYear()
  let monthStartDate = new Date(year, now.getMonth(), 1) // 当前月1号
  let nextMonthStartDate = new Date(year, now.getMonth() + 1, 1) // 下个月1号
  let days = (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong // 计算当前月份的天数
  let monthEndDate = new Date(year, now.getMonth(), days)
  let monthRange = [getDataString(monthStartDate), getDataString(monthEndDate)]
  return monthRange
}

export function getDataString(date, fmt = 'yyyy-MM-dd') {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function toDecimal(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return;
  }
  f = Math.round(x * 100) / 100;
  return f;
}

export function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}