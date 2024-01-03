import { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'

import ErrorPage from './pages/Errorpage'
import RootLayout from './pages/Root'
import Store from './store/store'
import './styles/index.css'

import AuthPage from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Ptofile'
import { ROUTES } from './routes'

interface State {
  store: Store
}

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <App />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.AUTH,
        element: <AuthPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
    ],
  },
])

const store = new Store()

export const Context = createContext<State>({
  store,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Context.Provider value={{ store }}>
    <RouterProvider router={router} />
  </Context.Provider>
)
