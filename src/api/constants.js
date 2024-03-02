// 小兔鲜常量数据

// 默认9个顶级分类
export const topCategory = [
  '居家',
  '美食',
  '服饰',
  '母婴',
  '个护',
  '严选',
  '数码',
  '运动',
  '杂项'
]

// 订单状态常亮数据 全部 已付款 已发货...
export const orderStatus = [
  { name: 'all', label: '全部订单', orderState: 0 },
  { name: 'unpay', label: '待付款', orderState: 1 },
  { name: 'deliver', label: '待发货', orderState: 2 },
  { name: 'receive', label: '待收货', orderState: 3 },
  { name: 'comment', label: '待评价', orderState: 4 },
  { name: 'complete', label: '已完成', orderState: 5 },
  { name: 'cancel', label: '已取消', orderState: 6 }
]

export const cancelReason = [
  '配送信息有误',
  '商品买错了',
  '重复下单/误下单',
  '忘记使用优惠券、兔币等',
  '其他渠道价格更低',
  '不想买了'
]
export const deliverType = [
  { type: 1, name: '不限送货时间：周一至周日' },
  { type: 2, name: '工作日送货：周一至周五' },
  { type: 3, name: '双休日、假日送货：周六至周日' }
]

export const payType = [
  { type: 1, name: '在线支付' },
  { type: 2, name: '货到付款' }
]

export const myAccount =
  [
    { name: '个人中心', url: '/member' },
    { name: '消息通知', url: '/member/notification' },
    { name: '个人信息', url: '/member/user' },
    { name: '安全设置', url: '/member/security' },
    { name: '地址管理', url: '/member/address' },
    { name: '我的积分', url: '/member/points' },
    { name: '我的足迹', url: '/member/history' },
    { name: '邀请有礼', url: '/member/invite' },
    { name: '幸运抽奖', url: '/member/lottery' }
  ]

export const transactionManagement = [
  { name: '我的订单', url: '/member/order' },
  { name: '优惠券', url: '/member/coupon' },
  { name: '礼品卡', url: '/member/giftcard' },
  { name: '评价晒单', url: '/member/review' },
  { name: '售后服务', url: '/member/service' }
]

export const myCollection = [
  { name: '收藏的商品', url: '/member/favorite' },
  { name: '收藏的专题', url: '/member/topic' },
  { name: '关注的品牌', url: '/member/brand' }
]

export const helpCenter = [
  { name: '帮助中心', url: '/member/helpcenter' },
  { name: '在线客服', url: '/member/onlinecustomerservice' }
]
