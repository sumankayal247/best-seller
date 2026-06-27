import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { UserDataProvider } from '@/context/UserDataContext';
import { CountryProvider } from '@/context/CountryContext';
import '@/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename keeps client routing correct when served from a sub-path (GitHub Pages). */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <CountryProvider>
          <UserDataProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </UserDataProvider>
        </CountryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
