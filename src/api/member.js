import request from '@/utils/request.js'

export function getCollectAPI(queryObject) {
  return request('/member/collect', 'get', queryObject)
}
export function getFootPrintAPI(queryObject) {
  return request('/member/browseHistory', 'get', queryObject)
}
export function getMemberAddressAPI() {
  return request('/member/address', 'get')
}
export function deleteMemberAddressAPI(id) {
  return request(`/member/address/${id}`, 'delete')
}
export function getMemberProfileAPI() {
  return request('/member/profile', 'get')
}

export function updateMemberProfileAPI(profile) {
  return request('/member/profile', 'put', profile)
}
export function uploadAvatarAPI(file) {
  console.log(file)
  return request('/member/profile/avatar', 'post', file)
}
