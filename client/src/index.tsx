import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { Settings } from './pages/Settings'
import { ROUTES } from './routes'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.HOME} element={<App />} />
      <Route path={ROUTES.SETTINGS} element={<Settings />}></Route>
    </Routes>
  </BrowserRouter>
)
