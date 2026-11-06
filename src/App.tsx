import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DirectorModal } from './components/DirectorModal';
import { HomePage } from './pages/HomePage';
import { StudioPage } from './pages/StudioPage';
import { GuiForgePage } from './pages/GuiForgePage';
import { McpBridgePage } from './pages/McpBridgePage';
import { ShowcasePage } from './pages/ShowcasePage';
import { DocsPage } from './pages/DocsPage';
import { PricingPage } from './pages/PricingPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#090C13] text-[#F4F7FF]">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/gui-forge" element={<GuiForgePage />} />
              <Route path="/mcp" element={<McpBridgePage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <DirectorModal />
        </div>
      </BrowserRouter>
    </StudioProvider>
  );
};

export default App;
