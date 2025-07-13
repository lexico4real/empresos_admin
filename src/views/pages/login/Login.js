import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestLoginOtp, loginWithOtp } from '../../../lib/auth'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [secret, setSecret] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const secret = await requestLoginOtp(email, password)
      setSecret(secret)
      setStep(2)
    } catch (err) {
      setError('Failed to request OTP. Please check your credentials.')
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginWithOtp(email, password, otp, secret)
      navigate('/dashboard')
    } catch (err) {
      console.log({ err })
      setError('Login failed. Please check your OTP and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 shadow-sm border-danger">
                <CCardBody>
                  <CForm onSubmit={step === 1 ? handleRequestOtp : handleLogin}>
                    <h1 className="text-danger">Empresos Admin</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-danger text-white">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-danger text-white">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    {step === 2 && (
                      <CInputGroup className="mb-4">
                        <CInputGroupText className="bg-danger text-white">OTP</CInputGroupText>
                        <CFormInput
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </CInputGroup>
                    )}

                    {error && <p className="text-danger">{error}</p>}

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          color="danger"
                          className="px-4 text-white"
                          disabled={loading}
                        >
                          {loading ? 'Please wait...' : step === 1 ? 'Send OTP' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0 text-danger">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
