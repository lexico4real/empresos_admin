import api from './api'

export async function createConfiguration({ name, value }) {
  const response = await api.post('/configuration', { name, value })
  return response.data
}

export async function fetchConfigurations(name) {
  const response = await api.get('/configuration', {
    params: name ? { name } : {},
  })
  return response.data
}

export async function fetchConfigurationById(id) {
  const response = await api.get(`/configuration/${id}`)
  return response.data
}

export async function deleteConfiguration(id) {
  const response = await api.delete(`/configuration/${id}`)
  return response.data
}
