import request from '@/utils/request.js'
/**
 * 获取省-市-区/县数据
 * @returns Promise
 */
export const getCityDataAPI = () => {
    const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
    return request(url, 'get')
}
