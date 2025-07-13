import { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CTooltip,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import api from '../../../lib/api'

const CreditAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }
    fetchAccounts(currentPage)
  }, [currentPage, navigate])

  const fetchAccounts = async (page) => {
    setLoading(true)
    try {
      const res = await api.get(`/account/list?page=${page}&limit=${itemsPerPage}`)
      const formatted = res.data.data.map((acc) => ({
        id: acc.id,
        name: `${acc.user.firstName} ${acc.user.lastName}`,
        balance: parseFloat(acc.balance),
        accountNumber: acc.accountNumber,
      }))
      setAccounts(formatted)

      const pagination = res.data.pagination
      setCurrentPage(pagination.currentPage)
      setTotalPages(pagination.totalPages)
    } catch (err) {
      console.error('Error loading accounts:', err)
      alert('Failed to fetch accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAccount = async () => {
    if (!selectedAccount?.id || selectedAccount.balance === undefined) return

    try {
      await api.patch(`/account/${selectedAccount.id}/balance`, {
        amount: selectedAccount.balance,
      })
      alert('Account balance updated successfully.')
      setEditModalVisible(false)
      setSelectedAccount(null)
      fetchAccounts(currentPage)
    } catch (err) {
      console.error(err)
      alert('Failed to update balance: ' + (err?.response?.data?.message || err.message))
    }
  }

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    return (
      <CPagination align="center" className="mt-3">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </CPaginationItem>
        {pages.map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </CPaginationItem>
        ))}
        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    )
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Accounts List</strong>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <>
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Balance</CTableHeaderCell>
                        <CTableHeaderCell>Account Number</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {accounts.map((account, index) => (
                        <CTableRow key={account.id}>
                          <CTableHeaderCell>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{account.name}</CTableDataCell>
                          <CTableDataCell>${account.balance.toFixed(2)}</CTableDataCell>
                          <CTableDataCell>{account.accountNumber}</CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content="Edit Balance">
                              <CButton
                                color="warning"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAccount({ ...account })
                                  setEditModalVisible(true)
                                }}
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                            </CTooltip>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  {renderPagination()}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Edit Modal */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <CModalHeader>Edit Account Balance</CModalHeader>
        <CModalBody>
          {selectedAccount && (
            <CForm>
              <CFormInput
                label="Account Name"
                value={selectedAccount.name}
                disabled
                className="mb-3"
              />
              <CFormInput
                label="Account Number"
                value={selectedAccount.accountNumber}
                disabled
                className="mb-3"
              />
              <CFormInput
                label="Balance"
                type="number"
                value={selectedAccount.balance}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    balance: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="success" onClick={handleEditAccount}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CreditAccounts
