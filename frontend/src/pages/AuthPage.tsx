import { useState } from 'react';

type AuthPageProps = {
  onAuthenticate: (token: string) => Promise<boolean>;
  error: string;
};

export default function AuthPage({ onAuthenticate, error }: AuthPageProps) {
  const [token, setToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onAuthenticate(token);
    if (success) {
      setToken('');
    }
  };

  return (
    <div className="app">
      <img src="/assets/logo.svg" alt="Magic File Logo" className="logo" />
      <div className="auth-container">
        <div className="auth-form">
          <p>Введите код доступа</p>
          <span className="error">{error}</span>
          <div className='input-container'>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="код доступа"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>
          <div
            className='form-button'
            onClick={handleSubmit}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          >
            Войти
          </div>
        </div>
      </div>
    </div>
  );
}