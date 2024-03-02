import request from '@/utils/request.js'

export function getCheckoutInfoAPI() {
  return request('/member/order/pre', 'get')
}

export function addAddressAPI(form) {
  return request('/member/address', 'post', form)
}

export function editAddressAPI(form) {
  return request(`/member/address/${form.id}`, 'put', form)
}

export function submitOrderAPI(orderInfo) {
  return request('/member/order', 'post', orderInfo)
}

export function getOrderAPI(orderId) {
  return request(`/member/order/${orderId}`, 'get')
}

// d
export function getAllOrderAPI({ page, pageSize, orderState }) {
  return request('/member/order', 'get', { page, pageSize, orderState })
}

export function deleteOrderAPI(ids) {
  return request('/member/order', 'delete', { ids })
}

export function cancelOrderAPI(id, cancelReason) {
  return request(`/member/order/${id}/cancel`, 'put', { cancelReason })
}

export function changeOrderStateToShippedAPI(orderId) {
  return request(`http://pcapi-xiaotuxian-front-devtest.itheima.net/member/order/consignment/${orderId}`, 'get')
}
export function confirmShippedAPI(orderId) {
  return request(`/member/order/${orderId}/receipt`, 'put')
}
export function getOrderLogisticsAPI(orderId) {
  return request(`/member/order/${orderId}/logistics`, 'get')
}

export function rePurchaseOrderAPI(orderId) {
  return request(`/member/order/repurchase/${orderId}`, 'get')
}
