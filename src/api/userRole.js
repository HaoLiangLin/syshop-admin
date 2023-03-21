import request from '@/utils/request.js'

// 根据角色Id查询用户
export function queryUserByRoleID(roleId) {
  return request.get(`/userRoles/user/${roleId}`)
}

// 根据角色Id查询角色
export function queryRoleByUserID(userId) {
  return request.get(`/userRoles/role/${userId}`)
}

// 删除用户角色
export function deleteUserRole(userId) {
  return request.delete(`/userRoles/role/${userId}`)
}

// 修改用户角色
export function updateUserRole(userId, roleId) {
  return request.put(`/userRoles/update/${userId}/${roleId}`)
}

// 新增用户角色
export function saveUserRole(userId, roleId) {
  return request.post(`/userRoles/save/${userId}/${roleId}`)
}

export default {
  queryUserByRoleID,
  queryRoleByUserID,
  deleteUserRole,
  updateUserRole,
  saveUserRole
}
