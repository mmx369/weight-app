import { Outlet } from 'react-router-dom'
import { MainNavigation } from '../components/Layout/MainNavigation'

export default function Layout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  )
}
