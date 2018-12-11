import httpService from '../provider/intercept'

// 登陆
export function loginAction(params) {
  return httpService.post('/api/signin', params)
}

// 获取用户信息
export function queryUserInfo() {
  return httpService.get('/api/manage/account')
}

//获取数据看板数据
export function queryRecordBoard(params) {
  return httpService.get('/api/v1/gates/board', params)
}

// 获取产品代号列表
export function queryProductCode(params) {
  return httpService.get('/api/v1/all/pnames', params)
}

// 获取功能列表
export function queryFeatures(params) {
  return httpService.get('/api/v1/pnames/functions', params)
}

// 获取通道列表
export function queryPassage(params) {
  return httpService.get('/api/v1/all/gates', params)
}

// 获取短信通道列表
export function querySmsChannel(params) {
  return httpService.get('/api/v1/all/types', params)
}

// 获取产品代号搜索结果
export function queryProductCodeRecord(params) {
  return httpService.post('/api/v1/pnames', params)
}

// 获取通道搜索结果
export function queryPassageRecord(params) {
  return httpService.get('/api/v1/gates', params)
}

// 获取短信搜索结果
export function querySmsChannelRecord(params) {
  return httpService.get('/api/v1/types', params)
}

// 获取手机搜索回执结果
export function queryReceiptRecord(params) {
  return httpService.get('/api/v1/reports/tel', params)
}

//发送短信信息
export function sendPlatform(params) {
  return httpService.post('/api/v1/sms/gate', params)
}



//发送短信信息
export function queryMarketing(params) {
  return httpService.get('/api/v1/market', params)
}
