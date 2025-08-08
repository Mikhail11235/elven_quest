import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'user' | 'admin' | 'unauthenticated'>('loading');
  const [error, setError] = useState('');

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': token
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', token);        
        if (data.isAdmin) {
          setAuthStatus('admin');
        } else {
          setAuthStatus('user');
        }
        
        setError('');
        return true;
      }
      throw new Error('Неверный токен');
    } catch (err) {
      localStorage.removeItem('token');
      setAuthStatus('unauthenticated');
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const savedToken = localStorage.getItem('token');

      if (urlToken) {
        window.history.replaceState({}, document.title, window.location.pathname);
        await verifyToken(urlToken);
      } else if (savedToken) {
        await verifyToken(savedToken);
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  if (authStatus === 'loading') {
    return (
      <div className="app">
        <div className="app-loading">
          <img src="/assets/fire_ring.gif" alt="Loading" className="loader-gif"/>
        </div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {authStatus === 'unauthenticated' && (
          <Route path="/*" element={<AuthPage onAuthenticate={verifyToken} error={error} />}/>
        )}
        {(authStatus === 'user' || authStatus === 'admin') && (
          <>
            <Route path="/" element={<MainPage />} />
            {authStatus === 'admin' && (
              <Route path="/admin" element={<AdminPage />} />
            )}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}