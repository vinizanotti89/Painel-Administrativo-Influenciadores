import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import '@/styles/components/layout/Layout.css';

const Layout = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className={`layout ${className}`} ref={ref} {...props}>
          <Header />
          <div className="layout-container">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </div>
      </ErrorBoundary>
    </ToastProvider>
  );
});

Layout.displayName = 'Layout';

export { Layout };