import request from '@/utils/request.js'

// 根据角色ID查询权限
export function queryAuthByRoleID(roleId) {
  return request.get(`/roleAuths/auth/${roleId}`)
}

// 根据权限ID查询角色
export function queryRoleByAuthID(authId) {
  return request.get(`/roleAuths/role/${authId}`)
}

// 删除角色指定权限
export function deleteRoleAuth(roleId, authId) {
  return request.delete(`/roleAuths/delete/${roleId}/${authId}`)
}

// 根据角色ID删除全部权限
export function deleteAuthByRoleID(roleId) {
  return request.delete(`/roleAuths/auth/${roleId}`)
}

// 根据权限ID删除全部角色
export function deleteRoleByAuthID(authId) {
  return request.delete(`/roleAuths/role/${authId}`)
}

// 新增角色权限
export function saveRoleAuth(roleId, authId) {
  return request.post(`/roleAuths/save/${roleId}/${authId}`)
}

// 批量新增角色权限
export function saveRoleAuths(roleId, authIds) {
  return request.post(
    '/roleAuths/save',
    { roleId, authIds }
  )
}

export default {
  queryAuthByRoleID,
  queryRoleByAuthID,
  deleteRoleAuth,
  deleteAuthByRoleID,
  deleteRoleByAuthID,
  saveRoleAuth,
  saveRoleAuths
}
