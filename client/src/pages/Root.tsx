import { Outlet } from 'react-router-dom';
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
    </>
  );
};

export default RootLayout;
