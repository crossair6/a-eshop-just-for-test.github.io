// 定义校验规则提供给vee-validate组件使用
import dayjs from 'dayjs'
export const genderList = ['男', '女', '未知']
export default {
  // 校验account
  account(value) {
    // value是将来使用该规则的表单元素的值
    // 1. 必填
    // 2. 6-20个字符，需要以字母开头
    // 如何反馈校验成功还是失败，返回true才是成功，其他情况失败，返回失败原因。
    if (!value) return '请输入用户名'
    if (!/^[a-zA-Z]\w{3,19}$/.test(value)) return '字母开头且6-20个字符'
    return true
  },
  password(value) {
    if (!value) return '请输入密码'
    if (!/^.{6,24}$/.test(value)) return '密码是6-24个字符'
    return true
  },
  mobile(value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code(value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },
  isAgree(value) {
    if (!value) return '请勾选同意用户协议'
    return true
  },
  receiver(value) {
    if (!value) return '请输入收货人姓名'
    return true
  },
  contact(value) {
    const regex = /^1[3456789]\d{9}$/
    if (!value) return '请输入手机号'
    if (!regex.test(value)) return '手机号格式错误'
    return true
  },
  address(value) {
    if (!value) return '请输入收货人姓名'
    return true
  },
  postalCode(value) {
    const regex = /^[1-9]\d{5}$/
    console.log(value)
    if (!value) return '请输入邮政编码'
    if (!regex.test(value)) return '邮政编码格式错误'
    return true
  },
  addressTags(value) {
    if (!value) return '请输入地址标签'
    return true
  },
  nickname(value) {
    if (value.length >= 10 || value.length <= 4) return '昵称长度为4-10位'
    return true
  },
  birthday(value) {
    const timeStamp = dayjs(value).valueOf()
    if (timeStamp >= Date.now()) return '出生日期不能晚于当前日期'
    return true
  },
  gender(value) {
    if (!genderList.includes(value)) return '性别只能为男、女、未知'
    return true
  }
}
// const profileSchema = ref({
//   nickname: schema.nickname,
//   birthday: schema.birthday,
//   gender: schema.gender,
//   provinceCode: schema.provinceCode,
//   cityCode: schema.cityCode,
//   countyCode: schema.countyCode,
//   profession: schema.profession
// })
