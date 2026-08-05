import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/plus-jakarta-sans';

import './index.css';

import App from './App';

import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
