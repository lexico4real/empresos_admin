import api from './api'

export async function createCustomer({ firstName, lastName, email, phoneNumber, password }) {
  const res = await api.post('/users/customer', {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  })
  return res.data
}

export async function fetchCustomers() {
  const response = await api.get('/users')
  return response.data
}

export async function deleteCustomer(id) {
  const res = await api.delete(`/users/delete`, { params: { id } })
  return res.data
}

export async function activateUser(id) {
  const res = await api.patch(`/users/${id}/activate`)
  return res.data
}

export async function deactivateUser(id) {
  const res = await api.patch(`/users/${id}/deactivate`)
  return res.data
}
