import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/Error'
import HomePage, { loader as WeightsLoader } from './pages/HomePage'
import Layout from './pages/Layout'
import { Settings } from './pages/Settings'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, loader: WeightsLoader },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
