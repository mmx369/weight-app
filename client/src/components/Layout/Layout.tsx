import Header from '../Header'
import './Layout.scss'

export interface ILayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className='Layout-Container'>{children}</div>
    </>
  )
}
