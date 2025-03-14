import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import '@/styles/components/layout/mainContent.css';

const MainContent = React.forwardRef(({
  children,
  className = '',
  showSearchBar = true,
  ...props
}, ref) => {
  return (
    <main className={`main-content ${className}`} ref={ref} {...props}>
      <div className="content-container">
        {showSearchBar && (
          <div className="search-container">
            <SearchBar />
          </div>
        )}
        {children}
      </div>
    </main>
  );
});

MainContent.displayName = 'MainContent';

export { MainContent };