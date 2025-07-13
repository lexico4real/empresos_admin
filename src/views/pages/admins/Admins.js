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
  CFormSelect,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilZoom, cilTrash, cilPlus, cilPencil } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import {
  fetchAdmins,
  createAdmin,
  deleteAdmin,
  activateAdmin,
  deactivateAdmin,
  updateAdminRole,
} from '../../../lib/admins'

const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [roleUpdateModalVisible, setRoleUpdateModalVisible] = useState(false)
  const [roleToUpdate, setRoleToUpdate] = useState('')
  const [adminIdToUpdate, setAdminIdToUpdate] = useState(null)

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    phoneNumber: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login')
      return
    }
    loadAdmins()
  }, [navigate])

  const loadAdmins = async () => {
    setLoading(true)
    try {
      const { data } = await fetchAdmins()
      const formatted = data.map((admin) => ({
        id: admin.id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        role: admin.userRole?.name || 'N/A',
        status: admin.accountStatus,
        phoneNumber: admin.phoneNumber,
      }))
      setAdmins(formatted)
    } catch (err) {
      console.error('Failed to fetch admins', err)
      alert('Failed to load admins.')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (admin) => {
    setSelectedAdmin(admin)
    setViewModalVisible(true)
  }

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return
    try {
      await deleteAdmin(adminId)
      alert('Admin deleted successfully.')
      loadAdmins()
    } catch (err) {
      console.error(err)
      alert('Failed to delete admin: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleAddAdmin = async () => {
    const { firstName, lastName, email, role, password, phoneNumber } = newAdmin
    if (!firstName || !lastName || !email || !role || !password || !phoneNumber) {
      alert('Please fill all required fields')
      return
    }

    try {
      await createAdmin(newAdmin)
      alert('Admin created successfully!')
      setModalVisible(false)
      setNewAdmin({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        phoneNumber: '',
      })
      loadAdmins()
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || err.message || 'Error occurred'
      alert('Failed to create admin: ' + (Array.isArray(msg) ? msg.join(', ') : msg))
    }
  }

  const handleToggleStatus = async (admin) => {
    try {
      if (admin.status === 'active') {
        await deactivateAdmin(admin.id)
        alert('Admin deactivated')
      } else {
        await activateAdmin(admin.id)
        alert('Admin activated')
      }
      loadAdmins()
    } catch (err) {
      console.error(err)
      alert('Failed to update status: ' + (err?.response?.data?.message || err.message))
    }
  }

  const openRoleUpdateModal = (adminId, currentRole) => {
    setRoleToUpdate(currentRole)
    setAdminIdToUpdate(adminId)
    setRoleUpdateModalVisible(true)
  }

  const handleRoleUpdate = async () => {
    if (!roleToUpdate || !adminIdToUpdate) return
    try {
      await updateAdminRole(adminIdToUpdate, roleToUpdate)
      alert('Role updated successfully')
      setRoleUpdateModalVisible(false)
      loadAdmins()
    } catch (err) {
      console.error(err)
      alert('Failed to update role: ' + (err?.response?.data?.message || err.message))
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CBadge color="success">Active</CBadge>
      case 'inactive':
        return <CBadge color="warning">Inactive</CBadge>
      case 'locked':
        return <CBadge color="danger">Locked</CBadge>
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
              <strong>Admins</strong>
              <CButton color="primary" onClick={() => setModalVisible(true)}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Admin
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
                    {admins.map((admin, index) => (
                      <CTableRow key={admin.id}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{admin.name}</CTableDataCell>
                        <CTableDataCell>{admin.email}</CTableDataCell>
                        <CTableDataCell>{admin.phoneNumber}</CTableDataCell>
                        <CTableDataCell>
                          {admin.role?.toUpperCase().replace('_', ' ')}
                        </CTableDataCell>
                        <CTableDataCell>{getStatusBadge(admin.status)}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2 flex-wrap">
                            <CTooltip content="View">
                              <CButton
                                color="info"
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(admin)}
                              >
                                <CIcon icon={cilZoom} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Delete">
                              <CButton
                                color="danger"
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(admin.id)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Enable/Disable">
                              <CButton
                                color={admin.status === 'active' ? 'warning' : 'success'}
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleStatus(admin)}
                              >
                                {admin.status === 'active' ? 'Disable' : 'Enable'}
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Update Role">
                              <CButton
                                color="secondary"
                                size="sm"
                                variant="outline"
                                onClick={() => openRoleUpdateModal(admin.id, admin.role)}
                              >
                                <CIcon icon={cilPencil} className="me-1" />
                                Role
                              </CButton>
                            </CTooltip>
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

      {/* Add Admin Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>Add New Admin</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="First Name"
              value={newAdmin.firstName}
              onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Last Name"
              value={newAdmin.lastName}
              onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="mb-3"
            />
            <CFormInput
              label="Phone Number"
              value={newAdmin.phoneNumber}
              onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })}
              className="mb-3"
            />
            <CFormSelect
              label="Role"
              value={newAdmin.role}
              onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
              className="mb-3"
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </CFormSelect>
            <CFormInput
              label="Password"
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="mb-3"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddAdmin}>
            Add Admin
          </CButton>
        </CModalFooter>
      </CModal>

      {/* View Admin Modal */}
      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>Admin Details</CModalHeader>
        <CModalBody>
          {selectedAdmin && (
            <>
              <p>
                <strong>Name:</strong> {selectedAdmin.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedAdmin.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedAdmin.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedAdmin.status}
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

      {/* Update Role Modal */}
      <CModal visible={roleUpdateModalVisible} onClose={() => setRoleUpdateModalVisible(false)}>
        <CModalHeader>Update Admin Role</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Role"
              value={roleToUpdate}
              onChange={(e) => setRoleToUpdate(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </CFormSelect>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRoleUpdateModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleRoleUpdate}>
            Update Role
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Admins
