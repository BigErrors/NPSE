//  引入http.js
import { post } from '@/http.js'
// 基本路径
const baseUrl = '/System'

// 新闻言论提取数据
export const getNPSEData = (params) => post(`${baseUrl}/speechExtract`, params)
// 关键词提取数据
export const getKEData = (params) => post(`${baseUrl}/keywordExtract`, params)
// export const getKEData = () => get('kw.json')
// 语义联想数据
export const getSAData = (params) => post(`${baseUrl}/semanticSimilarity`, params)
// 词云数据
export const getWCData = (params) => post(`${baseUrl}/wordCloud`, params)
// 自动摘要数据
export const getAbstractData = (params) => post(`${baseUrl}/wordCloud`, params)
