// 提供复用逻辑的函数(钩子
import { useIntersectionObserver } from '@vueuse/core'
import { ref, onMounted, onBeforeMount } from 'vue'
/**
 * 数据懒加载函数
 * @param {Element} target -DOM对象
 * @param {Function} APIFN -获取数据的API函数
 * @returns
 */
export const useLazyData = (httpAPI, ...args) => {
  // 最终返回的数据
  const data = ref(null)
  // 检测目标
  const target = ref(null)
  // stop停止观察
  const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
    // 进入可视区
    if (isIntersecting) {
      // 停止观察
      stop()
      // 获取数据
      httpAPI(...args).then(res => {
        console.log(res)
        data.value = res.result
      })
    }
  })
  return {
    data,
    target
  }
}

// 获取鼠标相对于某个元素的位置
export const useMouseXY = () => {
  const target = ref({})
  const x = ref(0)
  const y = ref(0)
  const updateMouseXY = (e) => {
    // 获取target元素的相对于浏览器窗口的左侧和上侧距离
    console.log(target.value)
    const rect = target.value.getBoundingClientRect()
    x.value = e.clientX - rect.left
    y.value = e.clientY - rect.top
    // console.log(x.value, y.value)
  }
  // 元素创建完成后立即添加mousemove事件
  onMounted(() => {
    target.value.onmousemove = updateMouseXY
  })
  onBeforeMount(() => {
    target.value.onmousemove = null
  })
  return { target, x, y }
}

// 判断鼠标是否在元素外点击
export const useIsClickOutside = () => {
  const target = ref(null)
  const isClickOutside = ref(false)
  onMounted(() => {
    // 如果target以及内部元素已经绑定了click事件,那么这里也用click事件就会冲突,换用mousedown事件
    window.addEventListener('mousedown', (e) => {
      if (target.value) {
        // 判断点击的元素是否为目标元素的后代元素
        if (target.value.contains(e.target)) {
          isClickOutside.value = false
        } else {
          isClickOutside.value = true
        }
      }
    })
  })

  return {
    target,
    isClickOutside
  }
}

// 倒计时函数
export function useCountdown() {
  function format() {
    const minute = `${Math.floor(time.value / 60)}`
    const second = `${time.value % 60}`
    timeStr.value = `${minute.padStart(2, '0')}分${second.padStart(
      2,
      '0'
    )}秒`
  }
  const timeStr = ref('')
  const time = ref(0)
  let timer = null
  const start = (countdown) => {
    if (countdown <= 0) {
      timeStr.value = '00分00秒'
      return
    }
    time.value = countdown
    format()
    timer = setInterval(() => {
      time.value--
      format()
      if (time.value <= 0) {
        timeStr.value = '00分00秒'
        clearInterval(timer)
      }
    }, 1000)
  }
  const stop = () => {
    clearInterval(timer)
  }
  return {
    start,
    stop,
    timeStr
  }
}

// 取消订单的方法
export function useCancelOrder() {
  const orderCancelRef = ref(null)
  function cancelOrder(order) {
    orderCancelRef.value.open(order)
  }
  return {
    orderCancelRef,
    cancelOrder
  }
}
// 查看物流的方法
export function useOrderLogistics() {
  const orderLogisticsRef = ref(null)
  function openOrderLogistics(order) {
    orderLogisticsRef.value.open(order)
  }
  return {
    openOrderLogistics,
    orderLogisticsRef
  }
}
// 编辑地址的方法

export function useEditAddress() {
  const editAddressRef = ref(null)
  function editAddress(address) {
    const form = {}
    for (const key in address) {
      if (!form[key]) {
        form[key] = address[key]
      }
    }
    editAddressRef.value.open(form)
  }
  return {
    editAddress,
    editAddressRef
  }
}
// 添加地址的方法

export function useAddAddress() {
  const addAddressRef = ref(null)
  function addAddress() {
    addAddressRef.value.open()
  }
  return {
    addAddress,
    addAddressRef
  }
}
