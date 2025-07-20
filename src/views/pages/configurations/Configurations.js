import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'

import {
  createConfiguration,
  fetchConfigurations,
  deleteConfiguration,
} from '../../../lib/configurations'

const Configurations = () => {
  const [configurations, setConfigurations] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', value: '' })
  const [filterName, setFilterName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const loadConfigurations = async (name = '', page = 1) => {
    setLoading(true)
    try {
      const response = await fetchConfigurations(name, page)
      setConfigurations(response.data || [])
      setPagination(response.pagination || null)
    } catch (err) {
      console.error('Failed to fetch configurations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfigurations(filterName, currentPage)
  }, [currentPage, filterName])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFilterChange = (e) => {
    setFilterName(e.target.value)
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadConfigurations(filterName, 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createConfiguration(formData)
      setFormData({ name: '', value: '' })
      loadConfigurations(filterName, currentPage)
    } catch (err) {
      console.error('Failed to create configuration:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await deleteConfiguration(id)
        loadConfigurations(filterName, currentPage)
      } catch (err) {
        console.error('Failed to delete configuration:', err)
      }
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>Configuration Management</CCardHeader>
      <CCardBody>
        {/* Filter Form */}
        <CForm className="mb-4 d-flex gap-2" onSubmit={handleFilterSubmit}>
          <CFormInput
            type="text"
            placeholder="Filter by name"
            value={filterName}
            onChange={handleFilterChange}
          />
          <CButton type="submit" color="primary">
            Filter
          </CButton>
        </CForm>

        {/* Create Form */}
        <CForm className="mb-4" onSubmit={handleSubmit}>
          <div className="d-flex gap-2">
            <CFormInput
              type="text"
              placeholder="Configuration Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <CFormInput
              type="text"
              placeholder="Value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              required
            />
            <CButton type="submit" color="success">
              Add Configuration
            </CButton>
          </div>
        </CForm>

        {/* Table */}
        {loading ? (
          <CSpinner />
        ) : (
          <>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Value</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {configurations.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center">
                      No configurations found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  configurations.map((config) => (
                    <CTableRow key={config.id}>
                      <CTableDataCell>{config.name}</CTableDataCell>
                      <CTableDataCell>{config.value}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(config.id)}>
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <CPagination className="mt-3">
                {Array.from({ length: pagination.totalPages }, (_, idx) => (
                  <CPaginationItem
                    key={idx + 1}
                    active={pagination.currentPage === idx + 1}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Configurations
