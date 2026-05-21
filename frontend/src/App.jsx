import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import PredictionPage from './pages/PredictionPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import { authService } from './lib/api';

function App() {
  useEffect(() => {
    // Authenticate demo user silently on mount
    authService.ensureAuthenticated();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="np-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'bg-card text-card-foreground border border-border shadow-lg',
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }} 
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
