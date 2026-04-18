import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import MainNavigation from '../modules/MainNavigation';
import { ErrorBoundary } from '../shared/components';

const RootLayout: React.FC = () => {
  return (
    <>
      <MainNavigation />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme='light'
      />
    </>
  );
};

export default RootLayout;
