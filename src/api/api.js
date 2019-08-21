//  引入http.js
import { post } from '@/http.js'
// 基本路径
const baseUrl = '/System'

// 新闻言论提取数据
export const getNPSEData = (params) => post(`${baseUrl}/speechExtract`, params)
// 关键词提取数据
export const getKEData = (params) => post(`${baseUrl}/keywordExtract`, params)
