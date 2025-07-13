import api from './api'

export async function createAdmin({ firstName, lastName, email, role, password, phoneNumber }) {
  const res = await api.post('/users/register', {
    firstName,
    lastName,
    email,
    role,
    password,
    phoneNumber,
  })
  return res.data
}

export async function fetchAdmins() {
  const response = await api.get('/users/admins')
  return response.data
}

export async function deleteAdmin(id) {
  const res = await api.delete(`/users/delete`, { params: { id } })
  return res.data
}

export async function activateAdmin(id) {
  const res = await api.patch(`/users/${id}/activate`)
  return res.data
}

export async function deactivateAdmin(id) {
  const res = await api.patch(`/users/${id}/deactivate`)
  return res.data
}

export async function updateAdminRole(id, role) {
  const res = await api.patch(`/users/${id}/role`, { role })
  return res.data
}
