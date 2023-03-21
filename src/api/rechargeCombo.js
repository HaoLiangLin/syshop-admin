import request from '@/utils/request.js'

// 根据套餐ID查询充值套餐
export function queryRechargeComboByID(rechargeComboId) {
  return request.get(`/rechargeCombo/query/${rechargeComboId}`)
}

// 修改充值套餐
export function updateRechargeCombo(rechargeComboId, name, price, points, discount) {
  return request.put(
    `/rechargeCombo/update/${rechargeComboId}`,
    { name, price, points, discount }
  )
}

// 删除充值套餐
export function deleteRecharCombo(rechargeComboId) {
  return request.delete(`/rechargeCombo/delete/${rechargeComboId}`)
}

// 查看回收站
export function selectRecycleBin() {
  return request.get('/rechargeCombo/recycleBin')
}

// 根据名称搜索回收站
export function selectRecycleBinByName(name) {
  return request.get(`/rechargeCombo/recycleBin/${name}`)
}

// 根据名称从回收站恢复资源
export function regainRecycleBinByName(name) {
  return request.post(`/rechargeCombo/recycleBin/regain/${name}`)
}

// 根据名称删除回收站资源
export function removeRecycleBinByName(name) {
  return request.delete(`/rechargeCombo/recycleBin/remove/${name}`)
}

export default {
  queryRechargeComboByID,
  updateRechargeCombo,
  deleteRecharCombo,
  selectRecycleBin,
  selectRecycleBinByName,
  regainRecycleBinByName,
  removeRecycleBinByName
}
