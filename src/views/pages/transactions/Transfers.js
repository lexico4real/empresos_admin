import { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CFormInput,
  CSpinner,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
} from '@coreui/react'
import { cilSearch, cilZoom } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { fetchIntlTransfers } from '../../../lib/transfers'

const Transfers = () => {
  const [transfers, setTransfers] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [accountNumber, setAccountNumber] = useState('')
  const [visible, setVisible] = useState(false)
  const [selectedTx, setSelectedTx] = useState(null)

  const loadTransfers = async () => {
    setLoading(true)
    try {
      const res = await fetchIntlTransfers({ page, accountNumber })
      setTransfers(res.data)
      setPagination(res.pagination)
    } catch (err) {
      console.error('Failed to fetch transfers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransfers()
  }, [page, accountNumber])

  const openDetails = (tx) => {
    setSelectedTx(tx)
    setVisible(true)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>International Transfers</CCardHeader>
      <CCardBody>
        <CFormInput
          type="search"
          placeholder="Search with Account Number..."
          className="mb-3"
          value={accountNumber}
          onChange={(e) => {
            setPage(1)
            setAccountNumber(e.target.value)
          }}
        />

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CTable align="middle" responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Sender</CTableHeaderCell>
                  <CTableHeaderCell>Receiver</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transfers.map((tx, idx) => (
                  <CTableRow key={idx}>
                    <CTableHeaderCell>
                      {(pagination.currentPage - 1) * pagination.itemsPerPage + idx + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {tx.senderName} ({tx.senderAccount})
                    </CTableDataCell>
                    <CTableDataCell>
                      {tx.receiverName} ({tx.receiverAccount})
                    </CTableDataCell>
                    <CTableDataCell>${tx.amount}</CTableDataCell>
                    <CTableDataCell>{new Date(tx.createdAt).toLocaleString()}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => openDetails(tx)}
                        title="View full details"
                      >
                        <CIcon icon={cilZoom} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <CPagination align="end" className="mt-3">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <CPaginationItem
                    key={i}
                    active={pagination.currentPage === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            )}
          </>
        )}

        {/* Modal for Viewing Details */}
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Transfer Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {selectedTx && (
              <div>
                <p>
                  <strong>Sender:</strong> {selectedTx.senderName} ({selectedTx.senderAccount})
                </p>
                <p>
                  <strong>Receiver:</strong> {selectedTx.receiverName} ({selectedTx.receiverAccount}
                  )
                </p>
                <p>
                  <strong>Bank:</strong> {selectedTx.receiverBankName}
                </p>
                <p>
                  <strong>SWIFT:</strong> {selectedTx.receiverBankSwiftCode}
                </p>
                <p>
                  <strong>Country:</strong> {selectedTx.receiverCountry}
                </p>
                <p>
                  <strong>Amount:</strong> ${selectedTx.amount}
                </p>
                <p>
                  <strong>Narration:</strong> {selectedTx.narration}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(selectedTx.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default Transfers
