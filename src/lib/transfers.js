import api from './api'

export async function fetchIntlTransfers({
  accountNumber,
  page = 1,
  perPage = 10,
  search = '',
} = {}) {
  const res = await api.get('/transaction/all-history/intl', {
    params: {
      accountNumber,
      page,
      perPage,
      search,
    },
  })
  return res.data
}
