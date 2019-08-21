//  引入http.js
import { get, post } from '@/http.js'
// 基本路径
const baseUrl = '/System'

// 新闻言论提取数据
// export const getNPSEData = (params) => post(`${baseUrl}/speechExtract`, params)
export const getNPSEData = () => get('npse.json')
// 关键词提取数据
// export const getKEData = (params) => post(`${baseUrl}/keywordExtract`, params)
export const getKEData = () => get('kw.json')
