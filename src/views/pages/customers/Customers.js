import React, { useEffect, useState } from 'react'
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
  CSpinner,
  CButton,
  CTooltip,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CForm,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilZoom, cilPlus } from '@coreui/icons'
import {
  fetchCustomers,
  createCustomer,
  deleteCustomer,
  activateUser,
  deactivateUser,
} from '../../../lib/customers'

const Customers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await fetchCustomers()
      const formattedUsers = data.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.accountStatus,
        role: user.userRole?.name || 'N/A',
        phoneNumber: user.phoneNumber,
      }))
      setUsers(formattedUsers)
    } catch (err) {
      console.error('Failed to fetch customers', err)
      alert('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (user) => {
    setSelectedUser(user)
    setViewModalVisible(true)
  }

  const handleDelete = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?')
    if (!confirm) return

    try {
      await deleteCustomer(userId)
      alert('User deleted successfully.')
      loadUsers()
    } catch (err) {
      console.error(err)
      alert(
        'Failed to delete user: ' +
          (err?.response?.data?.message || err.message || 'Unknown error'),
      )
    }
  }

  const handleAddCustomer = async () => {
    const { firstName, lastName, email, phoneNumber, password } = newCustomer
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      alert('Please fill all fields')
      return
    }

    try {
      await createCustomer(newCustomer)
      alert('Customer created successfully!')
      setModalVisible(false)
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      })
      loadUsers()
    } catch (err) {
      console.error(err)
      const msg =
        err.response?.data?.message || err.response?.data || err.message || 'Error occurred'
      alert('Failed to create customer: ' + (Array.isArray(msg) ? msg.join(', ') : msg))
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CBadge color="success">{status}</CBadge>
      case 'inactive':
        return <CBadge color="warning">{status}</CBadge>
      case 'locked':
        return <CBadge color="danger">{status}</CBadge>
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Customers</strong>
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                <CIcon icon={cilPlus} className="me-2" />
                New Customer
              </CButton>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.map((user, index) => (
                      <CTableRow key={user.id}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                        <CTableDataCell>{user.role}</CTableDataCell>
                        <CTableDataCell>{getStatusBadge(user.status)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex flex-wrap gap-2">
                            <CButton
                              color="primary"
                              size="sm"
                              variant="outline"
                              title="View"
                              onClick={() => handleView(user)}
                            >
                              <CIcon icon={cilZoom} />
                            </CButton>

                            <CButton
                              color="danger"
                              size="sm"
                              variant="outline"
                              title="Delete"
                              onClick={() => handleDelete(user.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>

                            <CButton
                              color="success"
                              size="sm"
                              variant="outline"
                              disabled={user.status.toLowerCase() === 'active'}
                              onClick={async () => {
                                try {
                                  await activateUser(user.id)
                                  loadUsers()
                                } catch (err) {
                                  alert('Failed to activate user')
                                  console.error(err)
                                }
                              }}
                            >
                              Enable
                            </CButton>

                            <CButton
                              color="warning"
                              size="sm"
                              variant="outline"
                              disabled={user.status.toLowerCase() === 'inactive'}
                              onClick={async () => {
                                try {
                                  await deactivateUser(user.id)
                                  loadUsers()
                                } catch (err) {
                                  alert('Failed to deactivate user')
                                  console.error(err)
                                }
                              }}
                            >
                              Disable
                            </CButton>

                            <CButton
                              color="secondary"
                              size="sm"
                              variant="outline"
                              disabled={user.status.toLowerCase() === 'locked'}
                            >
                              Lock
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Add Customer Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>Add New Customer</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="First Name"
              value={newCustomer.firstName}
              onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Last Name"
              value={newCustomer.lastName}
              onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Phone Number"
              value={newCustomer.phoneNumber}
              onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Password"
              type="password"
              value={newCustomer.password}
              onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddCustomer}>
            Add Customer
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Modal */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>Customer Details</CModalHeader>
        <CModalBody>
          {selectedUser && (
            <>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Customers
