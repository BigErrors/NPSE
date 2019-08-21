/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:19:23
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-07-16 09:06:16
 */
//  引入httpUtil
import { get, post } from '@/utils/httpUtil'
// 基本路径
const baseUrl = '/SearchCase'

// 首页最新动态数据
export const latestNews = () => get(`${baseUrl}/HomePages`)
// 列表页搜索结果数据
export const getListData = (params) => post(`${baseUrl}/SearchResults`, params)
