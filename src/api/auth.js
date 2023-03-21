import request from '@/utils/request.js'

// 查询权限标签
export function queryAuthLabel() {
  return request.get('/auths/label')
}

// 根据权限标签查询权限名称
export function queryAuthNameByLabel(label) {
  return request.get(`/auths/name/${label}`)
}

// 查询权限
export function findAuthForPage(page, size, id, name, perms, status, type, label) {
  return request.post(
    `/auths/find/${page}/${size}`,
    { id, name, perms, status, type, label }
  )
}

// 修改权限
export function updateAuth(id, name, perms, type, label, remark) {
  return request.put(
    '/auths/update',
    { id, name, perms, type, label, remark }
  )
}

// 新增权限
export function saveAuth(name, perms, type, label, remark) {
  return request.post(
    '/auths/save',
    { name, perms, type, label, remark }
  )
}

// 删除权限
export function deleteAuth(id) {
  return request.delete(`/auths/delete/${id}`)
}

// 查看回收站
export function selectRecycleBin() {
  return request.get('/auths/recycleBin')
}

// 根据名称搜索回收站
export function selectRecycleBinByName(name) {
  return request.get(`/auths/recycleBin/${name}`)
}

// 根据名称从回收站恢复资源
export function regainRecycleBinByName(name) {
  return request.post(`/auths/recycleBin/regain/${name}`)
}

// 根据名称删除回收站资源
export function removeRecycleBinByName(name) {
  return request.delete(`/auths/recycleBin/remove/${name}`)
}

export default {
  queryAuthLabel,
  queryAuthNameByLabel,
  findAuthForPage,
  updateAuth,
  saveAuth,
  deleteAuth,
  selectRecycleBin,
  selectRecycleBinByName,
  regainRecycleBinByName,
  removeRecycleBinByName
}
