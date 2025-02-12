// 导出excel文件
const download = (data, filename) => {
  const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export default download
