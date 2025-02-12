export function $debounce(fn, delay = 1000) {
  let timer = null
  return function() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}