import React from 'react'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))
const Customers = React.lazy(() => import('./views/pages/customers/Customers'))
const Admins = React.lazy(() => import('./views/pages/admins/Admins'))
const CreditAccount = React.lazy(() => import('./views/pages/accounts/Accounts'))
const Configurations = React.lazy(() => import('./views/pages/configurations/Configurations'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/login', name: 'Login', element: Login },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Customers, exact: true },
  { path: '/users/customers', name: 'Customers', element: Customers },
  { path: '/users/admins', name: 'Admins', element: Admins },
  { path: '/settings', name: 'Settings', element: CreditAccount, exact: true },
  { path: '/settings/accounts', name: 'Accounts', element: CreditAccount },
  { path: '/settings/configurations', name: 'Configurations', element: Configurations },
]

export default routes
