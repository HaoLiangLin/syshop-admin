import request from '@/utils/request.js'

// 查询角色标签
export function queryRoleLabel() {
  return request.get('/roles/label')
}

// 根据角色标签查询角色名称
export function queryRoleNameByLabel(label) {
  return request.get(`/roles/name/${label}`)
}

// 查询角色
export function findRoleForPage(page, size, id, name, perms, status, label) {
  return request.post(
    `/roles/find/${page}/${size}`,
    { id, name, perms, status, label }
  )
}

// 修改角色
export function updateRole(id, name, perms, label, remark) {
  return request.put(
    '/roles/update',
    { id, name, perms, label, remark }
  )
}

// 新增角色
export function saveRole(name, perms, label, remark) {
  return request.post(
    '/roles/save',
    { name, perms, label, remark }
  )
}

// 删除角色
export function deleteRole(id) {
  return request.delete(`/roles/delete/${id}`)
}

// 查看回收站
export function selectRecycleBin() {
  return request.get('/roles/recycleBin')
}

// 根据名称搜索回收站
export function selectRecycleBinByName(name) {
  return request.get(`/roles/recycleBin/${name}`)
}

// 根据名称从回收站恢复资源
export function regainRecycleBinByName(name) {
  return request.post(`/roles/recycleBin/regain/${name}`)
}

// 根据名称删除回收站资源
export function removeRecycleBinByName(name) {
  return request.delete(`/roles/recycleBin/remove/${name}`)
}

export default {
  queryRoleLabel,
  queryRoleNameByLabel,
  findRoleForPage,
  updateRole,
  saveRole,
  deleteRole,
  selectRecycleBin,
  selectRecycleBinByName,
  regainRecycleBinByName,
  removeRecycleBinByName
}
