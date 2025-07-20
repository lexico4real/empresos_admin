import CIcon from '@coreui/icons-react'
import { cilUser, cilShieldAlt, cilSpeedometer, cilGroup, cilCog } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Users Area',
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/users/customers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Admins',
    to: '/users/admins',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Accounts',
    to: '/settings/accounts',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Configurations',
    to: '/settings/configurations',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
  },
]

export default _nav
