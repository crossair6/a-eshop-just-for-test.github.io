import Mock from 'mockjs'
import qs from 'qs'

// 基本配置
Mock.setup({
    // 生成随机延迟
    timeout: '500-1000'
})

// 拦截接口 /my/test
// 1.接口地址路径规则,需要匹配到他
// 2.请求方式
// 3.返回数据(函数返回数据)
Mock.mock(/\/my\/test/, 'get', () => {
    const arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({
            id: Mock.mock('@id'),
            name: Mock.mock('@cname'),
            image: Mock.mock('@image(200x400,#ff0000)')
        })
    }
    return {
        msg: '获取数据成功',
        result: arr
    }
})

// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
    const queryString = config.url.split('?')[1]
    const queryObject = qs.parse(queryString)
    const arr = []
    const counts = 35
    const pages = Math.ceil(counts / Number(queryObject.pageSize))
    for (let i = 0; i < queryObject.pageSize; i++) {
        arr.push(Mock.mock({
            id: '@id',
            name: '@name(10,20)',
            description: '@title(4,10)',
            price: '@float(100,200,2,2)',
            // 这个网址是随机生成图片的网站
            picture: `https://source.unsplash.com/random/${Math.random()}x600`
        }))
    }

    return {
        msg: '获取数据成功',
        result: {
            counts,
            pages,
            page: Number(queryObject.page),
            pageSize: Number(queryObject.pageSize),
            items: arr
        }
    }
})
